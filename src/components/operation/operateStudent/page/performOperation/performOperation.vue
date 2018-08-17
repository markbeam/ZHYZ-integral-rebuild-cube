<template>
  <div class="perform-operation c-page">
    <m-header title="执行操作确认" :is-show-close-icon="true"></m-header>
    <div class="container">
      <cube-scroll 
        ref="scroll"
        :data="data">
        <!-- 信息部分 -->
        <ul class="view-list-group" v-if="!isMultiple && studentData">
          <h2 class="group-title">学生信息</h2>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-id-card"></i>
                姓名
              </p>
              <p class="text" v-if="studentData.name">{{ studentData.name }}</p>
            </div>
          </li>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-class"></i>
                班级
              </p>
              <p class="text" v-if="studentData.cls">{{ studentData.cls.name }}</p>
            </div>
          </li>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-number"></i>
                学号
              </p>
              <p class="text" v-if="studentData.number">{{ studentData.number }}</p>
            </div>
          </li>
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-nan" v-show="studentData.sex === '男'"></i>
                <i class="zhyz-female" v-show="studentData.sex === '女'"></i>
                性别
              </p>
              <p class="text">{{ studentData.sex }}</p>
            </div>
          </li>
        </ul>
        <!-- 多选部分 -->
        <ul class="view-list-group" v-else>
          <h2 class="group-title">选择的学生列表</h2>
          <li class="item" v-for="(item, index) in data"
            :key="item.id">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-id-card"></i>
                选择的学生 {{ index + 1}}
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
                <span class="tip-text" v-show="!selectedProjectId">
                  请选择
                  <i class="zhyz-right"></i>
                </span>
                <span>{{ selectedProjectText }}</span>
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
                <span class="tip-text" v-show="!selectedProjectId">
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
  import { openToast, loginFailure } from 'common/js/util'
  import { ERR_OK, CONFIRM_, LOGIN_ERR } from 'api/config'
  import { getPersonalInfo } from 'api/index'
  import { getStudentInfoById, operateStudentScore, getAllCategoryNew, getProjectByCategoryIdNew } from 'api/operation'
  import { mapMutations, mapGetters } from 'vuex'

  // 操作学生积分
  const OPERATION_TYPE = 'person'

  export default {
    props: {
      data: {
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
        studentData: null,
        operationTime: new Date().getTime(),
        operationTimeText: '',
        requestQuery: [],
        selectedProjectId: '', // 选中的项目 ID
        selectedProjectText: '', // 选中的项目 Text
        selectedProjectScore: '', // 选中的项目的分值
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
      if(!this.data) {
        this.$router.back()
      }
      if(!this.isMultiple) {
        this._getStudentInfoById()
      }
    },
    methods: {
      perform() {
        this._operateStudentScore()
      },
      // 选择时间
      selectOperationTime() {
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
            console.log(selectedTime)
          }
        })

        timePicker.setTime(time)
        timePicker.show()
      },
      selectProject() {
        this.$refs.drawer.show()
      },
      async changeHandler(index, item, selectedVal, selectedIndex, selectedText) {
        // fake request
        let data
        let pmType = item.id === 1 ? 'plus' : 'minus' // 选择了加分项还是减分项
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
        this.selectedProjectId = selectedVal[selectedVal.length - 1]
        this.selectedProjectText = selectedText[selectedText.length - 1]
        this.selectedProjectScore = this.padLeftSign(this.tmpData[selectedIndex[selectedIndex.length - 1]].score + '')
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
            this._operateStudentScore(this.overScoreResData.data)
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
      // 根据传进来学生的 data 获取学生详细信息
      _getStudentInfoById() {
        getStudentInfoById(this.data[0].id).then((res) => {
          if(res.code === ERR_OK) {
            this.studentData = res.data
          }
        })
      },
      // 当操作学生积分后更新个人信息
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
      // 操作学生 api
      _operateStudentScore(CONFIRM) {
        this._initData(CONFIRM)
        operateStudentScore(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            this.$emit('operateSuccessed')
            this._getPersonalInfo()
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
            // 判断返回的字段是否为需要提示的学生
            if(item.id === CONFIRM.student_id) {
              item.confirm = 1
              return false
            }
          })
          // 如果是需要提示就返回
          return
        }
        // 否则把学生加进去
        let arr = []
        if(this.isMultiple) {
          this.data.forEach((item) => {
            arr.push({
              confirm: 1,
              student_id: item.id,
              score_item_id: this.selectedProjectId,
              use_score_type: this.isUseExtraScore ? 1 : 0,
              op_time: ((this.operationTime - 60 * 60 * 24 * 1000 * 3) + '').substring(0, 10)
            })
          })
        } else {
          arr.push({
            confirm: 1,
            student_id: this.studentData.id,
            score_item_id: this.selectedProjectId,
            use_score_type: this.isUseExtraScore ? 1 : 0,
            op_time: ((this.operationTime - 60 * 60 * 24 * 1000 * 3) + '').substring(0, 10)
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
  .perform-operation
    z-index: 30
    .container
      height: 100%
      overflow: hidden
</style>
