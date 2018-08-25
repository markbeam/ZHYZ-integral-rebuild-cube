<template>
  <div class="my-application c-page">
    <m-header title="我的申请"
      :is-show-close-icon="false"></m-header>
    <div class="container">
      <!-- 尚未审批列表 -->
      <div class="wait-process-container">
        <application-list
          :selected-type="false"
          @selected="selectedItem"></application-list>
      </div>
    </div> 
    <transition name="slide">
      <router-view :verification-data="verificationData"
        :is-done="true"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import ApplicationList from 'components/manage/components/application-list/application-list'

  export default {
    data() {
      return {
        verificationData: null
      }
    },
    methods: {
      selectedItem(item) {
        this.verificationData = item
        this.$router.push({
          name: 'viewVerification'
        })
      }
    },
    components: {
      MHeader,
      ApplicationList
    }
  }
</script>

<style lang="stylus" scoped>
  .my-application
    z-index: 20
    .container
      height: 100%
      .wait-process-container, .over-process-container
        height: 100%
</style>
