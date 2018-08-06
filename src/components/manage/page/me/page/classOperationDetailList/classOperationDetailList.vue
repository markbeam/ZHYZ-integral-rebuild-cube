<template>
  <div class="operation-detail c-page">
    <m-header title="本班操作详情（一周内）"></m-header>
    <div class="container">
      <!-- 所有记录 -->
      <div class="all">
        <class-operation-list @selected="selected"></class-operation-list>
      </div>
    </div>
    <transition name="slide">
      <router-view :data="detailData"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import ClassOperationList from 'components/manage/components/class-operation-list/class-operation-list'

  export default {
    data() {
      return {
        personalData: null,
        detailData: null
      }
    },
    methods: {
      selected(item) {
        this.detailData = item
        this.$router.push({
          name: 'classOperationDetail'
        })
      }
    },
    components: {
      MHeader,
      ClassOperationList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .operation-detail
    z-index: 20
    .container
      width: 100%
      height: 100%
      & > div
        width: 100%
        height: 100%
</style>