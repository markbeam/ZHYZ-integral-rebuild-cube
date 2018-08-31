<template>
  <keep-alive>
    <div class="rank c-page">
      <m-header title="积分排行榜"></m-header>
      <div class="sort-setting-container">
        <div class="sample-sort" v-if="!isAdvancedSort">
          <cube-button @click.native="showSampleActionSheet">
            {{ selectedPicker.pickerActiveText || '请点击选择排行格式' }}
          </cube-button>
        </div>
        <div class="advanced-sort" v-else>
          <div class="first">
            <cube-button @click.native="showCampusActionSheet" class="sort-btn">
              {{ selectedCampusPicker.pickerActiveText || '选择校区' }}
            </cube-button>
            <cube-button @click.native="showDepartmentActionSheet" class="sort-btn">
              {{ selectedDepartmentPicker.pickerActiveText || '选择专业部' }}
            </cube-button>
            <cube-button @click.native="showClassActionSheet" class="sort-btn">
              {{ selectedClassPicker.pickerActiveText || '选择班级' }}
            </cube-button>
          </div>
          <div class="second">
            <cube-button @click.native="showGradeActionSheet" class="sort-btn">
              {{ selectedGradePicker.pickerActiveText || '选择年级' }}
            </cube-button>
          </div>
        </div>
        <cube-checkbox v-model="isAdvancedSort" @click.native="showAdvancedOption">
          {{ isAdvancedSort ? '高级搜索' : '简单选择' }}
        </cube-checkbox>
      </div>
      <!-- 简单搜索显示的数据 -->
      <div class="container">
        <cube-scroll :data="topData"
          v-if="topData">
          <ul class="top-list">
            <li class="item" 
              :key="item.id"
              v-for="(item, index) in topData"
              @click="selectItem(item)">
              <p class="ranking-number">{{ index + 1 }}</p>
              <div class="ranking-user-info">
                <div class="avatar"></div>
                <p class="name">{{ item.name }}</p>
                <p class="class-name">{{ item.cls.name }}</p>
              </div>
              <div class="current-integral">
                <p class="score">{{ item.score }}</p>
              </div>
            </li>
          </ul>
        </cube-scroll>
        <!-- 我当前的排名 -->
        <div class="my-rank" v-if="personData">
          <div class="item">
            <p class="ranking-number">{{ personData.rank }}</p>
            <div class="ranking-user-info">
              <div class="avatar"></div>
              <p class="name">{{ personData.name }}</p>
              <p class="class-name" v-if="personData.cls_name">{{ personData.cls_name }}</p>
            </div>
            <div class="current-integral">
              <p class="score">{{ personData.score }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Loading box -->
      <div class="loading-container" 
        v-show="!topData">
        <loading></loading>
      </div>
    </div>
  </keep-alive>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import Loading from 'base/loading/loading'
  import { ERR_OK } from 'api/config'
  import { getRank, getRankAdvanced } from 'api/rank'
  import { getAllCampus, getDepartmentByCampusId, getClassByDepartmenId, getGradeList } from 'api/operation'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        topData: null,
        personData: null,
        isAdvancedSort: false,
        clickAdvCount: 0,
        globalGId: 0,
        globalGrade: 0,
        globalLimit: 100,
        campusData: [],
        selectedCampusId: 0,
        departmentData: [],
        selectedDepartmentId: 0,
        classData: [],
        selectedClassId: 0,
        gradeData: [],
        selectedPicker: {
          pickerActiveIndex: 0,
          pickerActiveText: '',
          pickerActiveValue: 0
        },
        selectedCampusPicker: {
          pickerActiveText: '',
          pickerActiveValue: 0
        },
        selectedDepartmentPicker: {
          pickerActiveText: '',
          pickerActiveValue: 0
        },
        selectedClassPicker: {
          pickerActiveText: '',
          pickerActiveValue: 0
        },
        selectedGradePicker: {
          pickerActiveText: '',
          pickerActiveValue: 0
        }
      }
    },
    created() {
      this._getRank()

      setTimeout(() => {
        if(this.personalInfo.user_type === '学生') {
          this.ActionSheetData = [
            {
              content: '全校',
              value: 1
            },
            {
              content: '本校区',
              value: 2
            },
            {
              content: '专业部',
              value: 3
            },
            {
              content: '本届',
              value: 4
            },
            {
              content: '本班级',
              value: 5
            }
          ]
          this.selectedPicker.pickerActiveIndex = 4
          } else if(this.personalInfo.roles[0].name === '班主任' || this.personalInfo.roles[1].name === '班主任') {
            this.selectedPicker.pickerActiveIndex = 1
              this.ActionSheetData = [
                {
                  content: '全校',
                  value: 1
                },
                {
                  content: '本班级',
                  value: 5
                }
              ]
          } else {
          this.selectedPicker.pickerActiveIndex = 0
          this.ActionSheetData = [
            {
              content: '全校',
              value: 1
            }
          ]
        }
      }, 100)
    },
    methods: {
      selectItem(item) {
        this.$router.push({
          name: 'studentInfo',
          params: {
            data: item
          }
        })
      },
      showAdvancedOption() {
        ++this.clickAdvCount
        if(this.clickAdvCount === 1) {
          this._getAllCampus()
          this._getGradeList()
        }
      },
      // 简单选择
      showSampleActionSheet() {
        this.$createActionSheet({
          title: '请选择',
          active: this.selectedPicker.pickerActiveIndex,
          data: this.ActionSheetData,
          onSelect: (item, index) => {
            this.selectedPicker.pickerActiveIndex = index
            this.selectedPicker.pickerActiveText = item.content
            this.selectedPicker.pickerActiveValue = item.value
            
            // update rank data
            this._getRank()
            
            this.$createToast({
              txt: `选择 ${item.content}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      },
      // 高级搜索 --- 校区
      showCampusActionSheet() {
        this.$createActionSheet({
          title: '请选择校区',
          active: this.selectedCampusPicker.pickerActiveIndex,
          data: this.campusData,
          onSelect: (item, index) => {
            this.selectedCampusPicker.pickerActiveIndex = index
            this.selectedCampusPicker.pickerActiveText = item.content
            this.selectedCampusPicker.pickerActiveValue = item.value
            
            // update rank data
            this.globalGId = item.value
            this.selectedCampusId = item.value
            this.departmentData = []
            this.classData = []

            this.selectedDepartmentPicker = {
              pickerActiveText: '',
              pickerActiveValue: 0
            }
            this.selectedClassPicker = {
              pickerActiveText: '',
              pickerActiveValue: 0
            }
            
            this._getDepartmentByCampusId()
            this._getRankAdvanced()
            
            this.$createToast({
              txt: `选择 ${item.content}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      },
      // 高级搜索 --- 专业部
      showDepartmentActionSheet() {
        this.$createActionSheet({
          title: '请选择专业部',
          active: this.selectedDepartmentPicker.pickerActiveIndex,
          data: this.departmentData,
          onSelect: (item, index) => {
            this.selectedDepartmentPicker.pickerActiveIndex = index
            this.selectedDepartmentPicker.pickerActiveText = item.content
            this.selectedDepartmentPicker.pickerActiveValue = item.value
            
            // update rank data
            this.globalGId = item.value
            this.selectedDepartmentId = item.value
            this.classData = []

            this.selectedClassPicker = {
              pickerActiveText: '',
              pickerActiveValue: 0
            }
            
            this._getClassByDepartmenId()
            this._getRankAdvanced()
            
            this.$createToast({
              txt: `选择 ${item.content}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      },
      // 高级搜索 --- 班级
      showClassActionSheet() {
        this.$createPicker({
          title: '请选择班级',
          selectedIndex: [this.selectedClassPicker.pickerActiveIndex],
          data: [this.classData],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            this.selectedClassPicker.pickerActiveIndex = selectedIndex[0]
            this.selectedClassPicker.pickerActiveText = selectedText[0]
            this.selectedClassPicker.pickerActiveValue = selectedVal[0]
            
            // update rank data
            this.globalGId = selectedVal[0]
            // this.selectedClassId = item.value
            this._getRankAdvanced()
            
            this.$createToast({
              txt: `选择 ${selectedText}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      },
      showGradeActionSheet() {
        this.$createActionSheet({
          title: '请选择年级',
          active: this.selectedGradePicker.pickerActiveIndex,
          data: this.gradeData,
          onSelect: (item, index) => {
            this.selectedGradePicker.pickerActiveIndex = index
            this.selectedGradePicker.pickerActiveText = item.content
            this.selectedGradePicker.pickerActiveValue = item.value
            
            // update rank data
            this.globalGrade = item.value
            this.selectedGradeId = item.value
            this._getRankAdvanced()
            
            this.$createToast({
              txt: `选择 ${item.content}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      },
      _getRank() {
        this.topData = null
        getRank(this.selectedPicker.pickerActiveText).then((res) => {
          if(res.code === ERR_OK) {
            this.topData = res.data.list[0].list
            this.personData = res.data.person
          }
        })
      },
      // 查看排行（指定 校区/专业部/年级/班级）
      _getRankAdvanced() {
        this.topData = null
        getRankAdvanced(this.globalGId, this.globalGrade, this.globalLimit).then((res) => {
          if(res.code === ERR_OK) {
            this.topData = res.data
          }
        })
      },
      // get 校区数据
      _getAllCampus() {
        getAllCampus().then((res) => {
          if(res.code === ERR_OK) {
            // this.campusData = res.data
            res.data.forEach((item, index) => {
              this.campusData.push({
                content: item.name,
                value: item.id
              })
            })
          }
        })
      },
      // 根据 校区id 获取专业部数据
      _getDepartmentByCampusId() {
        getDepartmentByCampusId(this.selectedCampusId).then((res) => {
          if(res.code === ERR_OK) {
            res.data.forEach((item, index) => {
              this.departmentData.push({
                content: item.name,
                value: item.id
              })
            })
          }
        })
      },
      // 根据 专业部id 获取班级数据
      _getClassByDepartmenId() {
        getClassByDepartmenId(this.selectedDepartmentId).then((res) => {
          if(res.code === ERR_OK) {
            res.data.forEach((item, index) => {
              this.classData.push({
                text: item.name,
                value: item.id
              })
            })
          }
        })
      },
      _getGradeList() {
        getGradeList().then((res) => {
          if(res.code === ERR_OK) {
            res.data.grades.forEach((item, index) => {
              this.gradeData.push({
                content: `${item}级`,
                value: item
              })
            })
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      MHeader,
      Loading
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  $top-three = #FB7299
  $top1 = #FFA500
  $top2 = #21C1FC
  $top3 = #5ECA31

  .rank
    z-index: 20
    background-color: #fbfbfb !important
    .sort-setting-container
      .advanced-sort
        .first
          display: flex
          margin-bottom: 5px
          .sort-button
            flex: 1
            margin: 0 3px
    .container
      height: 100%
      .top-list, .my-rank
        .item
          position: relative
          padding: 20px 20px
          display: flex
          align-items: center
          // flex-direction: column
          justify-content: space-between
          box-sizing: border-box
          &:not(:last-child)
            &:after
              content: ''
              position: absolute
              bottom: 0
              left: 0
              right: 0
              height: 1px
              color: $color-border
              border-bottom: 1px solid $color-border
              box-sizing: border-box
              transform-origin: 0 0
              transform: scaleY(0.5)
          &:nth-child(-n+3)
            .name
              color: $top-three
          &:nth-child(1)
            .ranking-number
              color: $top1
          &:nth-child(2)
            .ranking-number
              color: $top2
          &:nth-child(3)
            .ranking-number
              color: $top3
          .ranking-number
            width: 90px
            flex: 0 0 90px
            // text-align: center
            padding-left: 30px
            box-sizing: border-box
            color: $color-light-gray
            font-weight: 700
            font-size: $font-size-large
          .ranking-user-info
            flex: 1
            font-size: 0
            .name, .class-name
              display: inline-block
            .name
              width: 75px
              font-size: $font-size-large
            .class-name
              margin-left: 8px
              font-size: $font-size-small
          .current-integral
            flex: 0 0 40px
            width: 40px
            text-align: center
      .top-list
        margin-top: 5px
        padding-bottom: 35px
        width: 100%
      .my-rank
        position: fixed
        bottom: 0
        left: 0
        z-index: 21
        width: 100%
        box-shadow: -2px -4px 8px $color-transparent-black-i
        background-color: $color-white
</style>
