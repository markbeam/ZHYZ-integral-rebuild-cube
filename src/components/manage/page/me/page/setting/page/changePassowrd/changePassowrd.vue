<template>
  <div class="change-password c-page">
    <m-header title="修改密码" 
      :is-show-close-icon="true"
      back-page="me"></m-header>
    <div class="form-container">
      <div class="item">
        <p class="title">旧密码：</p>
        <!-- 旧密码 -->
        <cube-input
          v-model="oldPassword"
          placeholder="请先输入旧密码"
          @keydown.enter.native="runChange"
          type="password"
          clearable
          :eye="{open: false, reverse: false}"
        ></cube-input>
      </div>
      <div class="item">
        <p class="title">新密码；</p>
        <!-- 新密码 -->
        <cube-input
          v-model="newPassword"
          placeholder="请输入新密码"
          @keydown.enter.native="runChange"
          type="password"
          clearable
          :eye="{open: false, reverse: false}"
        ></cube-input>
      </div>
      <div class="btn-container">
        <cube-button :light="true"
          @click.native="runChange">确认修改</cube-button>
      </div>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5'
  import MHeader from 'base/m-header/m-header'
  import { ERR_OK } from 'api/config'
  import { openToast } from 'common/js/util'
  import { changePassword } from 'api/setting'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        oldPassword: '',
        newPassword: ''
      }
    },
    methods: {
      // 运行修改密码
      runChange() {
        this._changePassword()
      },
      _changePassword() {
        if(!this.oldPassword || !this.newPassword) {
          openToast(this, '账号或密码不能为空！', 'error')
          return
        }
        this._initData()
        changePassword(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            this.$emit('changePasswordSuccessed')
            this.$router.back()
          } else {
            openToast(this, res.msg, 'error')
          }
        })
      },
      _initData() {
        let arr = []
        arr.push({
          old_password: md5(`${this.oldPassword}`),
          password: md5(`${this.newPassword}`)
        })
        this.requestQuery = arr
      }
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

  .change-password
    z-index: 30
    .form-container
      margin-top: 30px
      .item
        width: 90%
        margin: 0 auto
        &:not(:last-child)
          margin-bottom: 15px
        .title
          margin-bottom: 5px
          font-size: $font-size-small
          color: $color-light-black
    .btn-container
      width: 90%
      margin: 0 auto
      margin-top: 20px
      button
        &:active
          background-color: $color-active !important
</style>
