<template>
  <transition name="scale">
    <div class="history-classes page-component" v-show="isShow">
      <!-- 头部 -->
      <div class="sub-header">
        <div class="back">
          <i class="icon-hide zhyz-right" @click="hide"></i>
        </div>
        <h2 class="title">{{ title }}</h2>
        <h3 class="sub-title">{{ subtitle }}</h3>
        <h3 class="sub-title" v-show="stuCount > 0">共 {{ stuCount }} 个</h3>
      </div>
      <div class="container">
        <!-- 选择学生 -->
        <div class="listview class">
          <cube-index-list v-if="stuHasInfo && stuData.length"
            :data="stuData">
            <cube-index-list-group
              v-for="(group, index) in stuData"
              :key="index"
              :group="group">
              <cube-index-list-item
                v-for="(item, index) in group.items"
                :key="index"
                :item="item"
                @click.native="selectItem(item)"
                @touchstart.native="onItemTouchStart"
                @touchend.native="onItemTouchEnd"
                @select="selectedStudent">
                <div class="cube-index-list-item-def border-bottom-1px">
                  <p class="multiple-choice"
                    :class="{'selected': isHasSameId(item) > -1}"
                    v-show="canMultipleChoice && isMultiple"></p>
                  <p class="name" v-if="item.name">{{ item.name }}</p>
                </div>
              </cube-index-list-item>
            </cube-index-list-group>
          </cube-index-list>
          <div class="loading-container" v-show="stuHasInfo && !stuData.length">
            <!-- loading 组件 -->
            <loading></loading>
          </div>
          <div class="no-result-container" v-show="!stuHasInfo && !stuData.length">
            <no-result></no-result>
          </div>
        </div>
      </div>
      <transition name="fade-top">
        <!-- 多选顶部操作栏 -->
        <div class="top-multiple-operate" v-show="canMultipleChoice && isMultiple">
          <div class="select-cancel">
            <i class="zhyz-delete" @click="cancelMultipleChoice"></i>
          </div>
          <p class="select-count">{{ selectedStudentList.length }} 个学生被选择</p>
          <div class="btn">
            <p class="select-all" @click="selectAll">
              <i class="icon zhyz-quanxuan"></i>
              全选
            </p>
            <p class="select-confirm" @click="selectConfirm">
              <i class="icon zhyz-seiyw33"></i>
              确认
            </p>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'

  // 出现多选的时间
  const HOLD_TOUCH_TIME = 0.7

  export default {
    props: {
      stuData: {
        type: Array,
        default: null
      },
      stuHasInfo: {
        type: Boolean,
        default: true
      },
      subtitle: {
        type: String,
        default: ''
      },
      stuCount: {
        type: Number,
        default: 0
      },
      canMultipleChoice: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isShow: false,
        title: '选择学生', // 当前头部标题
        isMultiple: false, // 是否开始多选
        itemTime: null, // 长按出现多选操作的时间
        selectedStudentList: [], // 被多选 选择的学生
        selectCountList: []
      }
    },
    methods: {
      // 当选择学生后
      selectedStudent(item) {
        // this.$emit('selectedStudent', item)
        // this.hide()
      },
      // 多选 确认选择
      selectConfirm() {
        if(this.selectedStudentList.length === 1) {
          this.$emit('selectedStudent', this.selectedStudentList[0])
        } else {
          this.$emit('multipleSelected', this.selectedStudentList)
          // this.cancelMultipleChoice()
        }
      },
      // 当点击了单个元素之后
      selectItem(item) {
        if(this.canMultipleChoice && this.isMultiple) {
          // 如果包含此类
          let FIndex = this.isHasSameId(item)
          if(FIndex !== -1) {
            // 把该元素的索引找出来并删除
            this.selectedStudentList.splice(FIndex, 1)
            // 如果没有学生被选择（只剩一个人的时候取消选择），则退出多选模式
            if(this.selectedStudentList.length === 0) {
              this.cancelMultipleChoice()
            }
          } else {
            // 加入到最终返回的数组里
            this.selectedStudentList.push({
              id: item.id,
              name: item.name
            })
          }
        } else {
          this.$emit('selectedStudent', item)
        }
      },
      // 选择全部
      selectAll() {
        // 如果之前没有全部选择
        let stuLen = this.selectCountList.length
        if(this.selectedStudentList.length < stuLen) {
          this.selectCountList.forEach((item) => {
            // 如果列表内没有此条数据（-1 代表没有）
            let FIndex = this.isHasSameId(item)
            if(FIndex === -1) {
              // 把全部学生都加进选择列表去
              this.selectedStudentList.push({
                id: item.id,
                name: item.name
              })
            }
          })
        } else { // 如果之前全部选择了
          this.cancelMultipleChoice()
          // this.selectedStudentList = []
        }
      },
      // 判断是否需要长按选择
      onItemTouchStart() {
        this.itemTime = setTimeout(() => {
          if(this.canMultipleChoice) {
            this.isMultiple = true
          }
        }, HOLD_TOUCH_TIME * 1000)
      },
      onItemTouchEnd() {
        clearTimeout(this.itemTime)
      },
      // 取消多选模式
      cancelMultipleChoice() {
        this.isMultiple = false
        this.selectedStudentList = []
        this.$emit('cancelMultiple')
      },
      // 联动选择，判断最终列表是否包含此条数据
      isHasSameId(newItem) {
        return this.selectedStudentList.findIndex((item) => {
          return item.id === newItem.id
        })
      },
      show() {
        this.isShow = true
      },
      hide() {
        this.isShow = false
      },
      // 计算有多少个元素
      _countingItmes() {
        this.selectCountList = []
        this.stuData.forEach((item, index) => {
          item.items.forEach((cItem, cIndex) => {
            this.selectCountList.push({
              id: cItem.id,
              name: cItem.name
            })
          })
        })
      }
    },
    components: {
      Loading,
      NoResult
    },
    watch: {
      stuData() {
        setTimeout(() => {
          this._countingItmes()
        }, 20)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .history-classes
    position: fixed
    top: 0
    left: 0
    z-index: 21
    width: 100%
    height: 100%
    background-color: $color-white
    .sub-header
      position: relative
      width: 100%
      height: 50px
      color: $color-light-black
      background-color: $color-background
      .back
        display: inline-block
        vertical-align: top
        i
          display: inline-block
          padding: 15px
          font-size: $font-size-large-x
          color: $color-light-black
          box-sizing: border-box
          vertical-align: middle
          &.icon-hide
            transform: rotate(90deg)
          &.icon-back
            transform: rotate(180deg)
          &.icon-delete
            padding: 12px 12px 12px 5px
            font-size: 28px
      .title, .sub-title
        display: inline-block
        no-wrap()
        line-height: 50px
        font-size: $font-size-large
      .sub-title
        font-size: $font-size-medium-x
    .container
      width: 100%
      height: 100%
      .listview
        width: 100%
        height: 100%
        .cube-index-list-item-def
          position: relative
          .name, .multiple-choice
            display: inline-block
            vertical-align: middle
            font-size: 0
          .name
            margin-left: 12px
            font-size: $font-size-medium
          .multiple-choice
            width: 16px
            height: 16px
            box-sizing: border-box
            border-radius: 4px
            border: 1px solid $color-border
            transition: all .3s
            &.selected
              border: none
              box-shadow: 0 3px 6px rgba(0, 0, 0, .1)
              background-color: #5b97fb
    .loading-container
      top: 40%
    .no-result-container
      top: 40%
    .top-multiple-operate
      position: fixed
      top: 0
      display: flex
      align-items: center
      justify-content: center
      z-index: 55
      width: 100%
      height: 50px
      color: $color-white
      background-color: #5b97fb
      transition: all .3s
      &.fade-top-enter, &.fade-top-leave-active
        opacity: 0
      .select-cancel
        flex: 0 0 50px
        width: 50px
        text-align: right
        font-size: $font-size-huge
        i
          display: inline-block
          padding: 10px
      .select-count
        flex: 1
        text-align: center
      .btn
        flex: 1
        font-size: 0
        p
          display: inline-block
          width: 50%
          box-sizing: border-box
          text-align: center
          font-size: $font-size-medium
          .icon
            display: block
            padding-bottom: 2px
            font-size: $font-size-large-x

</style>
