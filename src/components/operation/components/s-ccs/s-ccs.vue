<template>
  <transition name="scale">
    <div class="s-ccs page-component" v-show="isShow">
      <!-- 头部 -->
      <div class="sub-header">
        <div class="back">
          <i class="icon-hide zhyz-right" v-show="showType === 1" @click="hide"></i>
          <i class="icon-back zhyz-right" v-show="showType !== 1" @click="back"></i>
          <i class="icon-delete zhyz-delete" v-show="showType !== 1" @click="hide"></i>
        </div>
        <h2 class="title">{{ title }}</h2>
        <h3 class="sub-title">{{ subtitle }}</h3>
      </div>
      <div class="container">
        <!-- 选择校区 -->
        <div class="listview campus" v-show="showType === 1">
          <cube-index-list v-if="camData && camData.length"
            :data="camData"
            @select="selectedCampus"></cube-index-list>
        </div>
        <!-- 选择班级 -->
        <div class="listview class" v-show="showType === 2">
          <!-- <cube-index-list v-if="clsData && clsData.length"
            :data="clsData"
            @select="selectedClass"></cube-index-list> -->
            <cube-index-list v-if="clsData && clsData.length"
              :data="clsData">
              <cube-index-list-group
                v-for="(group, index) in clsData"
                :key="index"
                :group="group">
                <cube-index-list-item
                  v-for="(item, index) in group.items"
                  :key="index"
                  :item="item"
                  @click.native="selectClsItem(item)"
                  @touchstart.native="onItemTouchStart"
                  @touchend.native="onItemTouchEnd"
                  @select="selectedClass">
                  <div class="cube-index-list-item-def border-bottom-1px">
                    <p class="multiple-choice"
                      :class="{'selected': isHasSameId(item) > -1}"
                      v-show="canMultipleChoice && isMultiple"></p>
                    <p class="name">{{ item.name }}</p>
                  </div>
                </cube-index-list-item>
              </cube-index-list-group>
            </cube-index-list>
            <div class="loading-container" v-show="!clsData.length">
              <!-- loading 组件 -->
              <loading></loading>
            </div>
        </div>
        <!-- 选择学生 -->
        <div class="listview class" v-show="showType === 3">
          <cube-index-list v-if="stuData && stuData.length"
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
                  <p class="name">{{ item.name }}</p>
                </div>
              </cube-index-list-item>
            </cube-index-list-group>
          </cube-index-list>
            <div class="loading-container" v-show="!stuData.length">
              <!-- loading 组件 -->
              <loading></loading>
            </div>
        </div>
      </div>
      <!-- 多选顶部操作栏 -->
      <transition name="fade-top">
        <div class="top-multiple-operate" v-show="canMultipleChoice && isMultiple">
          <div class="select-cancel">
            <i class="zhyz-delete" @click="cancelMultipleChoice"></i>
          </div>
          <p class="select-count">{{ selectedDataList.length }} 个{{ selectType === 1 ? '校区' : (selectType === 2 ? '班级' : '学生') }}被选择</p>
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
  import { normalizeList, loginFailure } from 'common/js/util'
  import { LOGIN_ERR } from 'api/config'
  import { getAllCampus, getClsListByCampusId, getStuByClsId } from 'api/operation'

  // 不同类型
  /* eslint-disable */
  const SHOW_CAMPUS = 1
  const SHOW_CLASS = 2
  const SHOW_STUDENT = 3

  // 出现多选的时间
  const HOLD_TOUCH_TIME = 0.7

  export default {
    props: {
      selectType: { // 需要选择的类型 校区/班级/学生
        type: Number,
        default: SHOW_STUDENT
      },
      canMultipleChoice: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isShow: false,
        camData: null, // 可供选择的校区数据
        clsData: [], // 可供选择的班级数据（根据校区 id 获取）
        stuData: [], // 可供选择的学生数据（根据班级 id 获取）
        title: '', // 当前头部标题
        subtitle: '', // 副标题，补充文字
        showType: SHOW_CAMPUS, // 当前显示的类型
        isMultiple: false, // 是否开始多选
        itemTime: null, // 长按出现多选操作的时间
        selectedDataList: [], // 被多选 选择的学生
        selectCountList: []
      }
    },
    created() {
      this._getAllCampus()
      this.computedTitle(this.showType)
    },
    methods: {
      // 选择校区后
      selectedCampus(item) {
        if(this.selectType === SHOW_CAMPUS) {
          this.$emit('selectedCampus', item)
        } else {
          this.showType = SHOW_CLASS
          this._getClsListByCampusId(item.id)
        }
      },
      // 当选择班级后
      selectedClass(item) {
        if(this.selectType === SHOW_CLASS) {
          // this.$emit('selectedClass', item)
        } else {
          this.showType = SHOW_STUDENT
          this.subtitle = item.name
          this._getStuByClsId(item.id)
        }
      },
      // 当选择学生后
      selectedStudent(item) {
        // this.$emit('selectedStudent', item)
        // this.hide()
      },
      // 多选 确认选择
      selectConfirm() {
        if(this.selectedDataList.length === 1) {
          if(this.selectType === SHOW_CLASS) {
            this.$emit('selectedClass', this.selectedDataList[0])
          } else if(this.selectType === SHOW_STUDENT) {
            this.$emit('selectedStudent', this.selectedDataList[0])
          }
        } else {
          this.$emit('multipleSelected', this.selectedDataList)
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
            this.selectedDataList.splice(FIndex, 1)
            // 如果没有学生被选择（只剩一个人的时候取消选择），则退出多选模式
            if(this.selectedDataList.length === 0) {
              this.cancelMultipleChoice()
              return
            }
          } else {
            // 加入到最终返回的数组里
            this.selectedDataList.push({
              id: item.id,
              name: item.name
            })
          }
        } else {
          this.$emit('selectedStudent', item)
        }
      },
      // 点击了班级之后
      selectClsItem(item) {
        if(this.canMultipleChoice && this.isMultiple) {
          // 如果包含此类
          let FIndex = this.isHasSameId(item)
          if(FIndex !== -1) {
            // 把该元素的索引找出来并删除
            this.selectedDataList.splice(FIndex, 1)
            // 如果没有学生被选择（只剩一个人的时候取消选择），则退出多选模式
            if(this.selectedDataList.length === 0) {
              this.cancelMultipleChoice()
              return
            }
          } else {
            // 加入到最终返回的数组里
            this.selectedDataList.push({
              id: item.id,
              name: item.name
            })
          }
        } else {
          this.$emit('selectedClass', item)
        }
      },
      // 选择全部
      selectAll() {
        // 如果之前没有全部选择
        let stuLen = this.selectCountList.length
        if(this.selectedDataList.length < stuLen) {
          this.selectCountList.forEach((item) => {
            // 如果列表内没有此条数据（-1 代表没有）
            let FIndex = this.isHasSameId(item)
            if(FIndex === -1) {
              // 把全部学生都加进选择列表去
              this.selectedDataList.push({
                id: item.id,
                name: item.name
              })
            }
          })
        } else { // 如果之前全部选择了
          this.cancelMultipleChoice()
          // this.selectedDataList = []
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
        this.selectedDataList = []
        this.$emit('cancelMultiple')
      },
      // 联动选择，判断最终列表是否包含此条数据
      isHasSameId(newItem) {
        return this.selectedDataList.findIndex((item) => {
          return item.id === newItem.id
        })
      },
      show() {
        this.isShow = true
      },
      hide() {
        this.isShow = false
        this.showType = SHOW_CAMPUS
      },
      back() {
        this.showType -= 1
        if(this.showType === SHOW_CAMPUS) {
          this.clsData = []
        } else if(this.showType === SHOW_CLASS) {
          this.stuData = []
          this.subtitle = ''
        }
      },
      computedTitle(type) {
        switch(type) {
          case 1:
            this.title = '选择校区'
            break
          case 2:
            this.title = '选择班级'
            break
          case 3:
            this.title = '选择学生'
            break
        }
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
      },
      // 计算有多少个班级元素
      _countingClsItmes() {
        this.selectCountList = []
        this.clsData.forEach((item, index) => {
          item.items.forEach((cItem, cIndex) => {
            this.selectCountList.push({
              id: cItem.id,
              name: cItem.name
            })
          })
        })
      },
      // get 所有校区
      _getAllCampus() {
        this.isShowLoading = true
        getAllCampus().then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.camData = normalizeList(res, 'name')
          this.isShowLoading = false
        })
      },
      // 根据校区 id 获取班级
      _getClsListByCampusId(id) {
        this.isShowLoading = true
        getClsListByCampusId(id).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.clsData = normalizeList(res, 'code')
          this.isShowLoading = false
        })
      },
      // 根据班级 id 获取学生
      _getStuByClsId(id) {
        this.isShowLoading = true
        getStuByClsId(id).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.stuData = normalizeList(res, 'name_initials')
          this.isShowLoading = false
        })
      }
    },
    components: {
      Loading
    },
    watch: {
      showType(newType) {
        this.computedTitle(newType)
      },
      stuData() {
        setTimeout(() => {
          this._countingItmes()
        }, 20)
      },
      clsData() {
        setTimeout(() => {
          this._countingClsItmes()
        }, 20)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .s-ccs
    position: fixed
    top: 0
    left: 0
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
      position: relative
      top: 50%
      left: 50%
      transform: translate3d(-50%, -50%, 0)
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
