<template>
  <div class="manage">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <m-footer></m-footer>
  </div>
</template>

<script>
  import MFooter from 'base/m-footer/m-footer'
  import { getPersonalInfo } from 'api/index'
  import { mapMutations } from 'vuex'
  import { ERR_OK } from 'api/config'

  export default {
    data() {
      return {
      }
    },
    created() {
      setTimeout(() => {
        this._getPersonalInfo()
      }, 20)
    },
    methods: {
      // 用这个请求判断是否正常登陆
      _getPersonalInfo() {
        getPersonalInfo().then((res) => {
          if(res.code === ERR_OK) {
            this.setPersonalInfo(res.data) // 保存个人信息存到 vuex 里
          } else {
            this.$router.push('/login')
          }
        })
      },
      ...mapMutations({
        setPersonalInfo: 'SET_CURRENT_PERSONAL_ACCOUNT_INFO'
      })
    },
    components: {
      MFooter
    }
  }
</script>

<style lang="stylus" scoped>

</style>

