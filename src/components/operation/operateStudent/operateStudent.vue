<template>
  <div class="operate-student c-page">
    <m-header title="操作学生积分"></m-header>
    <div class="container">
      <div class="input-wrap">
        <cube-input
          v-model="keyword"
          placeholder="请输入学号或关键字"
          type="text"
          clearable
          @click.native="showTip"
          @keydown.enter.native="nextStep"
        ></cube-input>
        <cube-tip ref="tip"
          direction="top"
          style="left:123px;">列表可长按多选学生哦！</cube-tip>
      </div>
      <div class="btn-container">
        <cube-button :light="true" @click.navive="nextStep">下一步</cube-button>
        <cube-button :light="true" @click.native="manualSelectStu">手动选择</cube-button>
      </div>
      <div class="history-container">
        <history-list @select="selectHistoryClass"></history-list>
      </div>
    </div>
    <!-- 手动选择时弹出的选择组件 -->
    <s-ccs ref="SCcs"
      :can-multiple-choice="true"
      @multipleSelected="multipleSelected"
      @cancelMultiple="cancelMultiple"
      @selectedStudent="selectedStudent"></s-ccs>
    <!-- 点击 历史列表 || 搜索 时弹出的组件 -->
    <s-student ref="SStudent"
      :stu-data="stuData" 
      :stu-has-info="stuHasInfo"
      :stu-count="stuCount"
      :subtitle="stuSubtitle"
      @multipleSelected="multipleSelected"
      @cancelMultiple="cancelMultiple"
      @selectedStudent="selectedStudent"></s-student>
    <transition name="slide">
      <router-view :data="selectData"
        :is-multiple="isMultiple"
        @operateSuccessed="operateSuccessed"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import SCcs from 'components/operation/components/s-ccs/s-ccs'
  import HistoryList from 'components/operation/components/history-list/history-list'
  import SStudent from 'components/operation/components/s-student/s-student'
  import { openToast, normalizeList } from 'common/js/util'
  import { ERR_OK } from 'api/config'
  import { searchStudentByKeyword, getStuByClsId } from 'api/operation'

  export default {
    data() {
      return {
        keyword: '',
        stuData: [],
        stuHasInfo: true,
        stuCount: 0,
        stuSubtitle: '',
        selectData: null,
        isMultiple: false // 是否多选，关系到执行操作页面的排版
      }
    },
    methods: {
      // 点击下一步
      nextStep() {
        // 判断是否有输入
        if(!this.keyword) {
          openToast(this, '请先输入在进行查询！', 'warn')
          return
        }
        this.stuSubtitle = this.keyword
        this._searchStudentByKeyword()
        this.$refs.SStudent.show()
      },
      // 提示可以多选
      showTip() {
        this.$refs.tip.show()
      },
      // 点击手动选择学生
      manualSelectStu() {
        this.$refs.SCcs.show()
      },
      operateSuccessed() {
        openToast(this, '操作成功！')
      },
      // 选择学生后
      selectedStudent(item) {
        this.selectData = [item]
        this.$router.push({
          name: 'performOperation'
        })
      },
      // 多选学生之后
      multipleSelected(items) {
        this.selectData = items
        this.$router.push({
          name: 'performOperation'
        })
        this.isMultiple = true
      },
      cancelMultiple() {
        this.isMultiple = false
      },
      // 点击了历史班级之后
      selectHistoryClass(item) {
        this.$refs.SStudent.show()
        this.stuSubtitle = item.to_cls.name
        this._getStuByClsId(item.to_cls_id)
      },
      async _getStuByClsId(id) {
        await getStuByClsId(id).then((res) => {
          if(res.code === ERR_OK) {
            this.stuData = normalizeList(res.data, 'name_initials')
            this.stuCount = res.data.length
          }
        })
      },
      async _searchStudentByKeyword() {
        await searchStudentByKeyword(this.keyword).then((res) => {
          if(res.code === ERR_OK) {
            if(!res.data.length) {
              this.stuHasInfo = false
            } else {
              this.stuHasInfo = true
            }

            this.stuCount = res.data.length
            this.stuData = normalizeList(res.data, 'name_initials')
          }
        })
      }
    },
    components: {
      SCcs,
      MHeader,
      HistoryList,
      SStudent
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .operate-student 
    z-index: 20
    .input-wrap
      margin-top: 30px
      .cube-input
        padding: 3px 0
        .cube-input-field
          text-align: center !important
    .btn-container
      margin-top: 20px
      button
        &:not(:last-child)
          margin-bottom: 15px
        &:active
          background-color: $color-active !important
    .history-container
      margin-top: 20px
</style>
