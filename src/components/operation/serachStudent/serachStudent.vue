<template>
  <div class="search-student c-page">
    <m-header title="搜索学生"></m-header>
    <div class="container">
      <div class="input-wrap">
        <cube-input
          v-model="keyword"
          placeholder="请输入学号或关键字"
          type="text"
          clearable
          @keydown.enter.native="nextStep"
        ></cube-input>
      </div>
      <div class="btn-container">
        <cube-button :light="true" @click.navive="nextStep">下一步</cube-button>
        <cube-button :light="true" @click.native="manualSelectStu">手动选择</cube-button>
      </div>
    </div>
    <!-- 手动选择时弹出的选择组件 -->
    <s-ccs ref="SCcs"
      :can-multiple-choice="false"
      @selectedStudent="selectedStudent"></s-ccs>
    <!-- 点击 历史列表 || 搜索 时弹出的组件 -->
    <s-student ref="SStudent"
      :stu-data="stuData" 
      :stu-has-info="stuHasInfo"
      :stu-count="stuCount"
      :subtitle="stuSubtitle"
      :can-multiple-choice="false"
      @selectedStudent="selectedStudent"></s-student>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import SCcs from 'components/operation/components/s-ccs/s-ccs'
  import SStudent from 'components/operation/components/s-student/s-student'
  import { openToast, normalizeList } from 'common/js/util'
  import { searchStudentByKeyword } from 'api/operation'

  export default {
    data() {
      return {
        keyword: '',
        stuData: [],
        stuCount: 0,
        stuHasInfo: true,
        stuSubtitle: '',
        isShowSCcs: false, // 手动选择 组件显示
        isShowSStudent: false // 搜索 & 历史 组件显示
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
      // 点击手动选择学生
      manualSelectStu() {
        this.$refs.SCcs.show()
      },
      // 选择学生后
      selectedStudent(item) {
        this.$router.push({
          name: 'studentInfo',
          params: {
            data: item
          }
        })
      },
      async _searchStudentByKeyword() {
        await searchStudentByKeyword(this.keyword).then((res) => {
          if(!res.length) {
            this.stuHasInfo = false
          } else {
            this.stuHasInfo = true
          }
          this.stuCount = res.length
          this.stuData = normalizeList(res, 'pinyin_name')
        })
      }
    },
    components: {
      SCcs,
      MHeader,
      SStudent
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .search-student 
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
