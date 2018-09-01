<template>
  <div class="perform-operation c-page">
    <m-header title="执行操作确认" :is-show-close-icon="true"></m-header>
    <div class="container">
      <cube-scroll 
        ref="scroll"
        :data="[classData]">
        <!-- 信息部分 -->
        <ul class="view-list-group" v-if="!isMultiple && classData">
          <h2 class="group-title">班级信息</h2>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-class"></i>
                班级
              </p>
              <p class="text">{{ classData.name }}</p>
            </div>
          </li>
        </ul>
        <!-- 多选部分 -->
        <ul class="view-list-group" v-else>
          <h2 class="group-title">选择的班级列表</h2>
          <li class="item" v-for="(item, index) in multipleClassData">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-id-card"></i>
                选择的班级 {{ index + 1}}
              </p>
              <p class="text" v-if="item.name">{{ item.name }}</p>
            </div>
          </li>
        </ul>
        <!-- 操作部分 -->
        <ul class="view-list-group">
          <h2 class="group-title">操作选择</h2>
          <li class="item" @click="selectOperationTime">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-time"></i>
                选择时间
              </p>
              <p class="text">
                <span class="tip-text" v-if="!operationTimeText">
                  请选择
                  <i class="zhyz-right"></i>
                </span>
                <span>{{ operationTimeText }}</span>
              </p>
            </div>
          </li>
          <li class="item" @click="selectProject">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-xiangmu"></i>
                考评项目
              </p>
              <p class="text">
                <span class="tip-text" v-show="!selectedProjectId[0]">
                  请选择
                  <i class="zhyz-right"></i>
                </span>
                <div class="project-text">
                  <p class="projects"
                    v-for="(item, index) in selectedProjectText"
                    :key="index">{{ item }}</p>
                </div>
              </p>
            </div>
          </li>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-number1"></i>
                分值
              </p>
              <p class="text">
                <span class="tip-text" v-show="!selectedProjectId[0]">
                  请先选择考评项目
                </span>
                <span>{{ selectedProjectScore }}</span>
              </p>
            </div>
          </li>
          <li class="item" 
            @click.prevent="toggleUseExtraScore"
            v-if="personalInfo.user_type === '教师'">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-kuozhan"></i>
                是否使用拓展积分
              </p>
              <p class="text switch">
                <cube-switch v-model="isUseExtraScore">{{ this.isUseExtraScore ? '是' : '否' }}</cube-switch>
              </p>
            </div>
          </li>
        </ul>
        <div class="btn-container">
          <cube-button :light="true"
            @click.native="perform">确认</cube-button>
        </div>
      </cube-scroll>
    </div>
    <div class="drawer-container">
      <cube-drawer
        ref="drawer"
        title="请选择考评项目"
        :data="projectData"
        :selected-index="selectedIndex"
        @change="changeHandler"
        @select="selectHandler"></cube-drawer>
    </div>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import { formatDate } from 'common/js/date'
  import { openToast, loginFailure } from 'common/js/util'
  import { getPersonalInfo } from 'api/index'
  import { ERR_OK, CONFIRM_, LOGIN_ERR } from 'api/config'
  import { operateClassScore, getAllCategoryNew, getProjectByCategoryIdNew } from 'api/operation'
  import { mapMutations, mapGetters } from 'vuex'

  // 操作班级积分
  const OPERATION_TYPE = 'class' // 0 -> 个人项目，1 -> 班级项目

  export default {
    props: {
      classData: {
        type: Object,
        default: null
      },
      multipleClassData: {
        type: Array,
        default: null
      },
      isMultiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        operationTime: new Date().getTime(),
        operationTimeText: '',
        requestQuery: [],
        selectedProjectId: [], // 选中的项目 ID
        selectedProjectText: [], // 选中的项目 Text
        selectedProjectScore: '', // 选中的项目的分值
        selectedTempProjectScore: 0, // 选中的项目的分值
        isShowConfirmBox: false, // 是否显示超出分数限制 box
        isUseExtraScore: false, // 是否使用拓展积分
        projectData: [
          [
            {
              text: '加分项',
              id: 1
            },
            {
              text: '减分项',
              id: 2
            }
          ],
          [],
          []
        ],
        selectedIndex: []
      }
    },
    created() {
      if(!this.classData) {
        this.$router.back()
      }
    },
    methods: {
      perform() {
        this._operateClassScore()
      },
      // 选择时间 --- time picker
      /* selectOperationTime() {
        const time = new Date().valueOf()
        const timePicker = this.$createTimePicker({
          title: '选择操作时间',
          showNow: true,
          minuteStep: 1,
          delay: 15,
          day: {
            len: 4,
            filter: ['大前天', '前天', '昨天', '今天'],
            format: 'M月d日'
          },
          onSelect: (selectedTime, selectedText) => {
            this.operationTime = selectedTime
            this.operationTimeText = selectedText
          }
        })

        timePicker.setTime(time)
        timePicker.show()
      }, */
      // 选择时间 --- date picker
      selectOperationTime() {
        if(!this.dateTimePicker) {
          this.dateTimePicker = this.$createDatePicker({
            title: '选择操作时间',
            min: new Date(2010, 1, 1, 0, 0),
            max: new Date(2030, 12, 31, 23, 59),
            delay: 15,
            columnCount: 5,
            value: new Date(),
            onSelect: this.OperationTimeHandle
          })
        }

        this.dateTimePicker.show()
      },
      OperationTimeHandle(date, selectedVal, selectedText) {
        let formatTime = new Date(date + '').valueOf()
        this.operationTime = formatTime
        this.operationTimeText = formatDate(new Date(formatTime), 'yyyy-MM-dd hh:mm')
      },
      selectProject() {
        this.$refs.drawer.show()
      },
      async changeHandler(index, item, selectedVal, selectedIndex, selectedText) {
        // fake request
        let data
        // 选择了加分项还是减分项
        let pmType = item.id === 1 ? 'plus' : 'minus'
        if(index === 0) {
          // 选择完加减分后
          await getAllCategoryNew(pmType, OPERATION_TYPE).then((res) => {
            if(res.code === LOGIN_ERR) {
              loginFailure()
            }
            if(res.code === ERR_OK) {
              data = res.data
            }
          })
        } else {
          // 选择完项目后
          await getProjectByCategoryIdNew(OPERATION_TYPE, item.value).then((res) => {
            if(res.code === LOGIN_ERR) {
              loginFailure()
            }
            if(res.code === ERR_OK) {
              data = res.data
              this.tmpData = res.data
            }
          })
        }
        // refill panel(index + 1) data
        this.$refs.drawer.refill(index + 1, data)
      },
      selectHandler(selectedVal, selectedIndex, selectedText) {
        this.selectedProjectId.push(selectedVal[selectedVal.length - 1])
        this.selectedProjectText.push(selectedText[selectedText.length - 1])
        this.selectedTempProjectScore += this.tmpData[selectedIndex[selectedIndex.length - 1]].cls_score
        this.selectedProjectScore = this.padLeftSign(this.selectedTempProjectScore)
      },
      // 超出分数限制
      overScoreConfirm(res) {
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-warn',
          title: '注意',
          content: res.msg,
          confirmBtn: {
            text: '确定',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            this.onConfirm()
            this._operateClassScore(this.overScoreResData.data)
          },
          onCancel: () => {
            this.requestQuery = []
          }
        }).show()
      },
      // toggle 使用拓展积分
      toggleUseExtraScore() {
        this.isUseExtraScore = !this.isUseExtraScore
      },
      padLeftSign(num) {
        return num < 0 ? num : '+' + num
      },
      _getPersonalInfo() {
        getPersonalInfo().then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          if(res.code === ERR_OK) {
            this.setPersonalInfo(res.data)
          }
        })
      },
      // 操作班级 api
      _operateClassScore(CONFIRM) {
        this._initData(CONFIRM)
        operateClassScore(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            this.$emit('operateSuccessed')
            this.$router.back()
          } else if(res.code === CONFIRM_) { // 学生分数即将达到限制时
            this.overScoreConfirm(res)
          } else if(res.code === LOGIN_ERR) {
            loginFailure()
          } else {
            openToast(this, res.msg, 'error')
          }
        })
      },
      _initData(CONFIRM) {
        // 匹配是否为那个超出分数的人
        if(CONFIRM && this.requestQuery.length) {
          this.requestQuery.forEach((item) => {
            // 判断返回的字段是否为需要提示的班级
            if(item.id === CONFIRM.cls_id) {
              item.confirm = 1
              return false
            }
          })
          // 如果是需要提示就返回
          return
        }
        // 否则把班级加进去
        let arr = []
        let _optime = (this.operationTime + '').substring(0, 10)
        // 如果有多个班级
        if(this.isMultiple) {
          this.multipleClassData.forEach((item) => {
            this.selectedProjectId.forEach((citem) => {
              arr.push({
                confirm: 1,
                cls_id: item.id,
                score_item_id: citem,
                use_score_type: this.isUseExtraScore ? 1 : 0,
                op_time: _optime
              })
            })
          })
        } else {
          this.selectedProjectId.forEach((item) => {
            arr.push({
              confirm: 1,
              cls_id: this.classData.id,
              score_item_id: item,
              use_score_type: this.isUseExtraScore ? 1 : 0,
              op_time: _optime
            })
          })
        }
        this.requestQuery = arr
      },
      ...mapMutations({
        setPersonalInfo: 'SET_CURRENT_PERSONAL_ACCOUNT_INFO'
      })
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      MHeader
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .perform-operation
    z-index: 30
    .container
      height: 100%
      overflow: hidden
      .projects
        display: block
        color: $color-transparent-black-v 
</style>
