<template>
  <div class="setting c-page">
    <m-header title="设置 "></m-header>
    <div class="information-container">
      <!-- 个人信息栏 -->
      <div class="information">
        <!-- 教师 -->
        <ul class="view-list-group"
          v-if="personalInfo.user_type === '教师'">
          <h2 class="group-title">个人信息</h2>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-id-card"></i>
                姓名
              </p>
              <p class="text">{{ personalInfo.name }}</p>
            </div>
          </li>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-number"></i>
                工号
              </p>
              <p class="text">{{ personalInfo.number }}</p>
            </div>
          </li>
        </ul>
        <!-- 学生 -->
        <ul class="view-list-group"
          v-if="personalInfo.user_type === '学生'">
          <h2 class="group-title">个人信息</h2>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-id-card"></i>
                姓名
              </p>
              <p class="text">{{ personalInfo.name }}</p>
            </div>
          </li>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-class"></i>
                班级
              </p>
              <p class="text" v-if="personalInfo.cls">{{ personalInfo.cls.name }}</p>
            </div>
          </li>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-number"></i>
                学号
              </p>
              <p class="text">{{ personalInfo.number }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="account-opertion-container">
        <!-- 操作栏 -->
        <ul class="view-list-group">
          <h2 class="group-title">操作</h2>
          <router-link tag="li"
           class="item"
           :to="{name: 'changePassword'}">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-unlock"></i>
                修改密码
              </p>
              <p class="text">
                <i class="zhyz-right"></i>
              </p>
            </div>
          </router-link>
          <!-- 退出登陆 -->
          <li class="item" @click="logout">
            <div class="wrap exit">
              <p class="title">退出登陆</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <transition name="slide">
      <router-view @changePasswordSuccessed="changePasswordSuccessed"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import { saveInfo } from 'common/js/cache'
  import { TOKEN_KEY } from 'common/js/config'
  import { openToast } from 'common/js/util'
  import { logout } from 'api/setting'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    data() {
      return {
        isShowConfirm1: false,
        isShowToast1: false
      }
    },
    methods: {
      // 点击退出登录
      logout() {
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-warn',
          title: '退出当前帐号',
          content: '你确定要退出吗？',
          confirmBtn: {
            text: '确定退出',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '我手滑了',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            this._logout()
            this.$createToast({
              type: 'correct',
              time: 1500,
              txt: '退出成功'
            }).show()
            this.onConfirm()
          }
        }).show()
      },
      /**
       * 注销账号
       * 退出当前账号，并清空所有与该账号有关的数据
      */
      onConfirm() {
        this.setToken('')
        this.setPersonalInfo({})
        saveInfo(TOKEN_KEY, '')
        this.$router.push('/login')
      },
      // 修改密码成功后
      changePasswordSuccessed() {
        openToast(this, '修改成功！')
      },
      _logout() {
        logout().then((res) => {
          console.log(res)
        })
      },
      ...mapMutations({
        setToken: 'SET_TOKEN',
        setPersonalInfo: 'SET_CURRENT_PERSONAL_ACCOUNT_INFO'
      })
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      MHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .setting
    z-index: 20
    .exit
      text-align: center
      color: @color-exit
</style>
