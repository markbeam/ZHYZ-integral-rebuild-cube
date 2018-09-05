<template>
  <div class="login">
    <!-- 登陆头部 -->
    <div class="login-header">
      <!-- 学校 logo -->
      <div class="zhyz-logo">
        <div class="icon"></div>
      </div>
      <!-- 登陆文字 -->
      <h2 class="title">一职德育积分系统</h2>
    </div>
    <div class="login-container">
      <!-- 登陆框 -->
      <form class="login-form">
        <!-- 账号 -->
        <div class="form-item">
          <i class="icon zhyz-user-login"></i>
          <input type="text"
            class="user-login"
            @keydown.enter="runLogin"
            v-model="userLogin"
            placeholder="账号">
          <i class="right-icon zhyz-error"
            @click="clearLoginNum"
            v-show="userLogin"></i>
        </div>
        <!-- 密码 -->
        <div class="form-item">
          <i class="icon zhyz-user-password"></i>
          <input type="password"
            class="user-password"
            @keydown.prevent.enter="runLogin"
            v-show="!isShowPwd"
            v-model="userPassword"
            placeholder="密码"
            maxlength="15">
          <input type="text"
            class="user-password"
            v-show="isShowPwd"
            v-model="userPassword"
            placeholder="密码"
            maxlength="15">
          <div class="right-icon">
            <i class="zhyz-error"
              @click="clearLoginPwd"
              v-show="userPassword"></i>
            <i class="zhyz-eye eye"
              @click="toggleshowPwd"
              :class="{'active': isShowPwd}"></i>
          </div>
          <div class="save-password" @click="toggleSavePassword">
            <p class="checkbox" :class="{'active': isSavePwd}"></p>
            <span class="text">记住密码</span>
          </div>
        </div>
      </form>
    </div>
    <!-- submit btn -->
    <div class="btn">
      <button type="primary" class="submit-btn"
              @click.prevent.stop="runLogin">立即登陆</button>
    </div>
    <cube-popup type="my-popup" ref="fullscreenLoading">
      <cube-loading :size="28"></cube-loading>
      请稍等...
    </cube-popup>
   </div>
</template>

<script>
  import md5 from 'js-md5'
  import { saveInfo, loadInfo } from 'common/js/cache'
  import { TOKEN_KEY, LOGIN_KEY, SAVEPWD_KEY } from 'common/js/config'
  import { openToast } from 'common/js/util'
  import { ERR_OK } from 'api/config'
  import { checkLogin } from 'api/login'
  import { getPersonalInfo } from 'api/index'
  import { mapMutations } from 'vuex'

  export default {
    data() {
      return {
        userLogin: loadInfo(LOGIN_KEY).userLogin,
        userPassword: '',
        encryptPassword: '',
        isShowPwd: false,
        requestQuery: [],
        isSavePwd: loadInfo(SAVEPWD_KEY)
      }
    },
    created() {
      let userPassword = loadInfo(LOGIN_KEY).userPassword
      if(userPassword.length === 32) {
        this.userPassword = '      '
        this.encryptPassword = userPassword
      } else {
        this.userPassword = userPassword
      }
    },
    methods: {
      // 运行登陆
      runLogin() {
        if(!this.userLogin) {
          openToast(this, '请输入账号！', 'error')
          return
        }
        if(!this.userPassword.trim() && !this.encryptPassword) {
          openToast(this, '请输入密码！', 'error')
          return
        }
        this._checkLogin()
      },
      // 是否显示密码
      toggleshowPwd() {
        this.isShowPwd = !this.isShowPwd
      },
      // 是否保存密码
      toggleSavePassword() {
        this.isSavePwd = !this.isSavePwd
      },
      // 清空登陆账号
      clearLoginNum() {
        this.userLogin = ''
      },
      // 清空登录密码
      clearLoginPwd() {
        this.userPassword = ''
      },
      // 验证登陆
      _checkLogin() {
        this.requestQuery = this._initData()
        this.$refs.fullscreenLoading.show()
        checkLogin(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            // 保存 token 到本地存储
            saveInfo(TOKEN_KEY, res.data.token)
            this.setToken(res.data.token)
            this._getPersonalInfo()
            if(this.isSavePwd) {
              // 保存登陆账号到本地存储
              saveInfo(LOGIN_KEY, {
                userLogin: this.userLogin,
                userPassword: this.encryptPassword
              })
              saveInfo(SAVEPWD_KEY, this.isSavePwd)
              // 隐藏密码,不然退出登录后能看到原密码
              this.userPassword = '      '
            } else {
              // 清除本地存储的登陆账号
              saveInfo(LOGIN_KEY, {
                userLogin: this.userLogin,
                userPassword: ''
              })
              // 清空密码
              this.userPassword = ''
            }
          } else {
            openToast(this, res.msg, 'error')
          }
          this.$refs.fullscreenLoading.hide()
        })
      },
      // 用这个请求判断是否正常登陆
      _getPersonalInfo() {
        getPersonalInfo().then((res) => {
          if(res.code === ERR_OK) {
            this.setPersonalInfo(res.data) // 保存个人信息存到 vuex 里
            openToast(this, '登录成功')
            this.$router.push('/index')
          }
        })
      },
      _initData() {
        let arr = []
        // 如果密码框有内容
        if(this.userPassword.trim()) {
          this.encryptPassword = md5(this.userPassword)
        }
        arr.push({
          account: this.userLogin,
          password: this.encryptPassword
        })
        return arr
      },
      ...mapMutations({
        setToken: 'SET_TOKEN',
        setPersonalInfo: 'SET_CURRENT_PERSONAL_ACCOUNT_INFO'
      })
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .login
    display: flex
    width: 100%
    height: 100%
    min-height: 388px
    background: $color-white
    flex-direction: column
    .login-header
      padding: 24px 0
      background: $color-background
      .zhyz-logo
        .icon
          height: 60px
          bg-image('logo')
          background-size: auto 100%
          background-position: center
          background-repeat: no-repeat
      .title
        margin-top: 16px
        text-align: center
        font-size: $font-size-large-x
    .login-container
      padding: 0 30px
      display: flex
      flex: 1
      align-items: center
      .login-form
        width: 100%
        .form-item
          position: relative
          .icon
            position: absolute
            top: 15px
            width: 32px
            text-align: center
            color: #aaaaaa
            font-size: $font-size-large
          .right-icon
            position: absolute
            top: 7px
            right: 7px
            padding: 5px
            color: #555
            font-size: $font-size-large-x
          .zhyz-error
            top: 10px
          .zhyz-eye
            margin-left: 10px
            &.active
              color: $color-sub !important
          input
            display: inline-block
            padding: 1rem 0 1rem 35px
            width: 100%
            font-size: $font-size-medium
            box-sizing: border-box
            border-bottom: 1px solid $color-border
            &:focus
              border-color: #33b4ff
          .save-password
            z-index: 20
            margin-top: 20px
            font-size: 0
            .checkbox
              display: inline-block
              width: 13px
              height: 13px
              vertical-align: top
              margin-right: 4px
              border-radius: 3px
              box-sizing: border-box
              border: 1px solid $color-border
              &.active
                border: none
                background-color: $color-sub
            .text
              font-size: $font-size-medium
    .btn
      .submit-btn
        padding: 1.4rem 0
        width: 100%
        color: $color-white
        text-align: center
        font-size: $font-size-medium-x
        background-color: $color-sub
        &:active
          background-color: #2a97d6
</style>
