<template>
  <div class="login">
    <div class="login-container">
      <!-- 登陆头部 -->
      <div class="login-header">
        <!-- 学校 logo -->
        <div class="zhyz-logo">
          <div class="icon"></div>
        </div>
        <!-- 登陆文字 -->
        <h2 class="title">一职德育积分系统</h2>
      </div>
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
            @keydown.enter="runLogin" 
            v-show="!isShowPwd" 
            v-model="userPassword" 
            placeholder="密码" 
            maxlength="15">
          <input type="text" 
            class="user-password" 
            @keydown.enter="runLogin" 
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
        <!-- submit btn -->
        <div class="form-item btn">
          <button type="primary" class="submit-btn" 
            @click.prevent.stop="runLogin">立即登陆</button>
        </div>
      </form>
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
  import { mapMutations } from 'vuex'

  export default {
    data() {
      return {
        userLogin: loadInfo(LOGIN_KEY).userLogin,
        userPassword: loadInfo(LOGIN_KEY).userPassword,
        isShowPwd: false,
        requestQuery: [],
        isSavePwd: loadInfo(SAVEPWD_KEY)
      }
    },
    methods: {
      // 运行登陆
      runLogin() {
        if(!this.userLogin || !this.userPassword) {
          // 提示请输入账号 or 密码
          openToast(this, '账号或密码不能为空！', 'error')
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
        saveInfo(SAVEPWD_KEY, this.isSavePwd)
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
            if(this.isSavePwd) {
              // 保存登陆账号到本地存储
              saveInfo(LOGIN_KEY, {
                userLogin: this.userLogin,
                userPassword: this.isSavePwd ? this.userPassword : ''
              })
            } else {
              // 清除本地存储的登陆账号
              saveInfo(LOGIN_KEY, {
                userLogin: this.userLogin,
                userPassword: ''
              })
            }
            this.$router.push('/index')
          } else {
            openToast(this, res.msg, 'error')
          }
          this.$refs.fullscreenLoading.hide()
        })
      },
      _initData() {
        let arr = []
        arr.push({
          account: this.userLogin,
          password: md5(this.userPassword)
        })
        return arr
      },
      ...mapMutations({
        setToken: 'SET_TOKEN'
      })
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .login
    width: 100%
    height: 100%
    .login-container
      position: relative
      top: 40%
      margin: 0 auto
      padding: 0 20px
      box-sizing: border-box
      transform: translate3d(0, -50%, 0)
      .login-header
        padding: 60px 0 22px
        .zhyz-logo
          width: 55px
          height: 55px
          margin: 0 auto 22px
          .icon
            width: 70px
            height: 70px
            bg-image('logo')
            background-size: 70px 70px
        .title
          text-align: center
          font-size: $font-size-large-x
      .login-form
        .form-item
          position: relative
          &.btn
            padding: 24px 0 5px
          .icon
            display: inline-block
            width: 8%
            text-align: center
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
            padding: 1rem 0 1rem 10px
            width: 90%
            font-size: $font-size-medium
            box-sizing: border-box
            background: $color-white
            border-bottom: 1px solid rgba(0, 0, 0, 0)
            &.user-login
              border-radius: 14px 14px 0 0
              border-color: $color-border
            &.user-password
              border-radius: 0 0 14px 14px
          .submit-btn
            margin-top: 10px
            padding: .8rem 0
            width: 100%
            border-radius: 100px
            color: $color-white
            text-align: center
            font-size: $font-size-medium-x
            background-color: $color-sub
            &:active
              background-color: #2a97d6
          .save-password
            position: absolute
            left: calc(20px + 4%)
            z-index: 20
            margin-top: 10px
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
</style>
