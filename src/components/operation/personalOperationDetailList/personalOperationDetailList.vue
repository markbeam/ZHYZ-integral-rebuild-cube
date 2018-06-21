<template>
  <div class="operation-detail c-page">
    <m-header :title="`个人操作详情 - ${subTitle}`"></m-header>
    <div class="container">
      <!-- 所有记录 -->
      <div class="all" v-show="showType === 1">
        <operation-detail-list :operation-type="1"
          is-withdraw
          @selected="selected"></operation-detail-list>
      </div>
      <!-- 加分记录 -->
      <div class="add" v-show="showType === 2">
        <operation-detail-list :operation-type="2"
          is-withdraw
          @selected="selected"></operation-detail-list>
      </div>
      <!-- 扣分记录 -->
      <div class="min" v-show="showType === 3">
        <operation-detail-list :operation-type="3"
          is-withdraw
          @selected="selected"></operation-detail-list>
      </div>
    </div>
    <!-- 控制显示类型栏 -->
    <cube-toolbar :actions="actions" @click="clickHandler"></cube-toolbar>
    <transition name="slide">
      <router-view :data="detailData"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import OperationDetailList from 'components/operation/components/operation-detail-list/operation-detail-list'

  const OP_TYPE_ALL = 1
  const OP_TYPE_ADD = 2
  const OP_TYPE_MIN = 3

  export default {
    data() {
      return {
        personalData: null,
        detailData: null,
        subTitle: '所有项',
        showType: OP_TYPE_ALL, // 1 -> 显示所有，2 -> 显示加分项， 3 -> 显示减分项
        actions: [
          {
            text: '所有项',
            action: 'showAll'
          },
          {
            text: '加分项',
            action: 'showAdd'
          },
          {
            text: '减分项',
            action: 'showMin'
          }
        ]
      }
    },
    methods: {
      selected(item) {
        this.detailData = item
        this.$router.push({
          name: 'personalOperationDetail'
        })
      },
      showAll(item) {
        this.subTitle = item.text
        this.showType = OP_TYPE_ALL
      },
      showAdd(item) {
        this.subTitle = item.text
        this.showType = OP_TYPE_ADD
      },
      showMin(item) {
        this.subTitle = item.text
        this.showType = OP_TYPE_MIN
      },
      clickHandler(item) {
        if(item.action) {
          this[item.action](item)
        }
      }
    },
    components: {
      MHeader,
      OperationDetailList
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