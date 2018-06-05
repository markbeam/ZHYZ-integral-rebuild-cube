<template>
  <div class="student-operation-detail-list c-page">
    <m-header :title="`${data.name} 操作详情`"></m-header>
    <div class="container">
      <operation-detail-list :data="data"
        :is-withdraw="false"
        @selected="selected"></operation-detail-list>
    </div>
    <transition name="slide">
      <router-view :data="detailData"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import OperationDetailList from 'components/operation/components/operation-detail-list/operation-detail-list'

  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    created() {
      if(!this.data) {
        this.$router.push({
          name: 'searchStudent'
        })
      }
    },
    data() {
      return {
        detailData: null
      }
    },
    methods: {
      selected(item) {
        this.detailData = item
        this.$router.push({
          name: 'studentOperationDetail'
        })
      }
    },
    components: {
      MHeader,
      OperationDetailList
    }
  }
</script>

<style lang="stylus" scoped>
  .student-operation-detail-list
    z-index: 40
    .container
      width: 100%
      height: 100%
</style>
