<template>
  <div class="operate-student c-page">
    <m-header title="操作班级积分" :is-show-close-icon="false"></m-header>
    <div class="container">
      <div class="btn-container">
        <cube-button :light="true" @click.native="manualSelectCls">选择班级</cube-button>
      </div>
    </div>
    <!-- 手动选择时弹出的选择组件 -->
    <s-ccs ref="SCcs"
      :select-type="2"
      :can-multiple-choice="true"
      @multipleSelected="multipleSelected"
      @cancelMultiple="cancelMultiple"
      @selectedClass="selectedClass"></s-ccs>
    <transition name="slide">
      <router-view :class-data="selectData"
        :multiple-class-data="multipleSelectData"
        :is-multiple="isMultiple"
        @operateSuccessed="operateSuccessed"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import SCcs from 'components/operation/components/s-ccs/s-ccs'
  import { openToast } from 'common/js/util'

  export default {
    data() {
      return {
        selectData: null,
        multipleSelectData: null,
        isMultiple: false // 是否多选，关系到执行操作页面的排版
      }
    },
    methods: {
      // 点击手动选择班级
      manualSelectCls() {
        this.$refs.SCcs.show()
      },
      operateSuccessed() {
        openToast(this, '操作成功！')
      },
      // 选择班级后
      selectedClass(item) {
        this.selectData = item
        this.$router.push({
          name: 'performClassOperation'
        })
      },
      // 多选班级之后
      multipleSelected(items) {
        this.multipleSelectData = items
        this.$router.push({
          name: 'performClassOperation'
        })
        this.isMultiple = true
      },
      cancelMultiple() {
        this.isMultiple = false
      }
    },
    components: {
      SCcs,
      MHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .operate-student 
    z-index: 20
    .input-wrap
      margin-top: 30px
    .btn-container
      margin-top: 20px
      button
        &:not(:last-child)
          margin-bottom: 15px
        &:active
          background-color: $color-active !important
</style>
