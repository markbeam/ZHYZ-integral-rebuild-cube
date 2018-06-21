<template>
  <div class="process-leave c-page">
    <m-header :title="`审批申请 - ${subTitle}`"></m-header>
    <div class="container">
      <!-- 尚未审批列表 -->
      <div class="wait-process-container" v-show="showType === 1">
        <application-list :show-type="'wait'"
          ref="wait"
          @selected="selectedWait"></application-list>
      </div>
      <!-- 已未审批列表 -->
      <div class="over-process-container" v-show="showType === 2">
        <application-list :show-type="'over'"
          ref="over"
          @selected="selectedOver"></application-list>
      </div>
    </div>
    <!-- 控制显示类型栏 -->
    <cube-toolbar :actions="actions" @click="clickHandler"></cube-toolbar>
    <transition name="slide">
      <router-view :verification-data="verificationData"
        :is-done="isDone"
        @verifySuccess="verifySuccess"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import ApplicationList from 'components/manage/components/application-list/application-list'
  import { openToast } from 'common/js/util'

  const SHOW_WAIT = 1
  const SHOW_OVER = 2

  export default {
    data() {
      return {
        // 1 -> 未审批列表，2 -> 已审批列表
        showType: 1,
        isDone: false,
        subTitle: '未审批',
        actions: [
          {
            text: '未审批',
            action: 'showWait'
          },
          {
            text: '已审批',
            action: 'showOver'
          }
        ],
        verificationData: null
      }
    },
    methods: {
      selectedWait(item) {
        this.verificationData = item
        this.isDone = false
        this.$router.push({
          name: 'processVerification'
        })
      },
      selectedOver(item) {
        this.verificationData = item
        this.isDone = true
        this.$router.push({
          name: 'processVerification'
        })
      },
      showWait(item) {
        this.showType = SHOW_WAIT
        this.subTitle = item.text
      },
      showOver(item) {
        this.subTitle = item.text
        this.showType = SHOW_OVER
      },
      clickHandler(item) {
        if(item.action) {
          this[item.action](item)
        }
      },
      verifySuccess() {
        openToast(this, '操作成功！')
        this.$refs.wait.refresh()
        this.$refs.over.refresh()
      }
    },
    components: {
      MHeader,
      ApplicationList
    }
  }
</script>

<style lang="stylus" scoped>
  .process-leave
    z-index: 20
    .container
      height: 100%
      .wait-process-container, .over-process-container
        height: 100%
</style>
