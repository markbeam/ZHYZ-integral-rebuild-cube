<template>
  <div class="random-select c-page">
    <m-header title="随机抽人"
      :is-show-close-icon="true"></m-header>
    <div class="container">
      <cube-scroll :data="finalSelectedList">
        <!-- 操作部分 -->
        <ul class="view-list-group">
          <h2 class="group-title">操作选择</h2>
          <li class="item" @click="showSCcs">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-time"></i>
                选择需要抽人的班级
              </p>
              <p class="text">
                <span class="tip-text" v-if="!selectedClassData.name">
                  请选择
                  <i class="zhyz-right"></i>
                </span>
                <span>{{ selectedClassData.name }}</span>
              </p>
            </div>
          </li>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-time"></i>
                需要抽取的人数
              </p>
              <p class="text">
                <cube-input
                  v-model="selectNumber"
                  placeholder="请输入"
                  :maxlength="2"
                  :max="60"
                  type="number"
                  clearable
                ></cube-input>
              </p>
            </div>
          </li>
        </ul>
        <div class="btn-container">
          <cube-button :light="true"
            @click.native="runSelect">确认</cube-button>
        </div>
        <div class="final-container" v-show="isShowResult">
          <h2 class="title">{{ finalSelectedList.length > 1 ? '“幸运儿们”是：' : '“幸运儿”是：' }}</h2>
          <ul class="final-selected-list">
            <li class="item" 
              v-for="item in finalSelectedList">{{ item.name }}</li>
          </ul>
        </div>
      </cube-scroll>
    </div>
    <!-- 手动选择时弹出的选择组件 -->
    <s-ccs ref="SCcs"
      style="z-index: 31"
      :select-type="2"
      :can-multiple-choice="false"
      @selectedClass="selectedClass"></s-ccs>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import SCcs from 'components/operation/components/s-ccs/s-ccs'
  import { openToast } from 'common/js/util'
  import { getStuByClsId } from 'api/operation'

  export default {
    data() {
      return {
        isShowResult: false,
        selectNumber: 1, // 需要抽取的人数
        selectedClassData: {}, // 班级的信息
        studentDataList: [], // 根据选择的班级 get 到的学生列表
        finalSelectedList: [] // 最终被选中的 “幸运儿” 列表【滑稽】
      }
    },
    methods: {
      // 执行抽人
      runSelect() {
        if(!this.studentDataList.length) {
          openToast(this, '请先选择班级', 'error')
          return
        }
        if(this.selectNumber > this.studentDataList.length) {
          openToast(this, `抽取的人数不能大于班级人数！该班有 ${this.studentDataList.length} 人`, 'error')
          return
        }
        this.isShowResult = false
        openToast(this, '正在抽签... “幸运儿”究竟会是谁呢？', 'loading', 1000, true, () => {
          this.isShowResult = true
        })
        // 清空上次抽取的列表
        this.finalSelectedList = []
        // 创建副本
        let tmpArr = this.studentDataList.slice()
        // 开始随机抽签
        for(let i = 0; i < this.selectNumber; i++) {
          // 生成随机数
          let rand = Math.floor(Math.random() * tmpArr.length)
          // 把该索引的学生 push 进最终抽取人的数组里
          this.finalSelectedList.push(tmpArr[rand])
          // 删除该索引
          tmpArr.splice(rand, 1)
        }
      },
      showSCcs() {
        this.$refs.SCcs.show()
      },
      selectedClass(item) {
        this.selectedClassData = item
        this.$refs.SCcs.hide()
        this._getStuByClsId(item.id)
      },
      _getStuByClsId(clsId) {
        getStuByClsId(clsId).then((res) => {
          this.studentDataList = res
        })
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

  .random-select
    z-index: 30
    .container
      height: 100%
      .final-container
        padding: 10px
        text-align: center
        .title
          margin-bottom: 8px
          font-size: $font-size-large
        .final-selected-list
          width: 100%
          .item
            &:not(:last-child)
              margin-bottom: 6px
</style>
