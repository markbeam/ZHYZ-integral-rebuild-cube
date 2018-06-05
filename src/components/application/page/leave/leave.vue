<template>
  <div class="leave c-page">
    <m-header title="请假"></m-header>
    <div class="container">
      <cube-form :model="leaveModel" @validate="validateHandler">
        <cube-form-group>
          <!-- 请假类型 -->
          <cube-form-item :field="fields[0]">
            <cube-button @click="showLeaveTypePicker" 
              class="date-time-btn">{{ leaveModel.leaveType || '请选择请假类型' }}</cube-button>
            <cube-picker ref="leaveTypePicker" 
              title="选择请假类型"
              :data="[leaveTypeList]"
              @select="selectLeaveType"></cube-picker>
          </cube-form-item>
          <!-- 开始时间 -->
          <cube-form-item :field="fields[1]" >
            <cube-button @click="showDateStartPicker" 
              class="date-time-btn">{{ leaveModel.dateStartTimeValue || '请选择开始时间' }}</cube-button>
            <cube-date-picker ref="dateStartPicker" 
              title="选择时间"
              subtitle="年-月-日-时-分"
              :min="[2018, 5, 1, 0, 0]" 
              :max="[2020, 12, 31, 23, 59]"
              :column-count="5"
              @select="dateStartSelectHandler"></cube-date-picker>
          </cube-form-item>
          <!-- 结束时间 -->
          <cube-form-item :field="fields[2]" >
            <cube-button @click="showDateEndPicker" 
              class="date-time-btn">{{ leaveModel.dateEndTimeValue || '请选择结束时间' }}</cube-button>
            <cube-date-picker ref="dateEndPicker" 
              title="选择时间"
              subtitle="年-月-日-时-分"
              :min="[2018, 5, 1, 0, 0]" 
              :max="[2020, 12, 31, 23, 59]"
              :column-count="5"
              @select="dateEndSelectHandler"></cube-date-picker>
          </cube-form-item>
          <!-- 家长电话 -->
          <cube-form-item :field="fields[3]" ></cube-form-item>
          <cube-form-item :field="fields[4]" ></cube-form-item>
        </cube-form-group>
        <cube-form-group>
          <cube-button type="submit" 
            :light="true" 
            class="submit-btn"
            @click.native="applyLeave">提交</cube-button>
        </cube-form-group>
      </cube-form>
    </div>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import { openToast } from 'common/js/util'
  import { ERR_OK } from 'api/config'
  import { getLeaveList, askForLeave } from 'api/application'

  export default {
    data() {
      return {
        requestQuery: null,
        leaveTypeList: null,
        leaveModel: {
          leaveType: '',
          dateStartTimeValue: '',
          dateEndTimeValue: '',
          parentPhoneNumber: '',
          leaveReason: ''
        },
        fields: [
          {
            modelKey: 'leaveType',
            label: '请假类型：',
             rules: {
              required: true
            }
          },
          {
            label: '开始时间：',
            modelKey: 'dateStartTimeValue',
            rules: {
              required: true
            }
          },
          {
            label: '结束时间：',
            modelKey: 'dateEndTimeValue',
            rules: {
              required: true
            }
          },
          {
            type: 'input',
            modelKey: 'parentPhoneNumber',
            label: '家长电话：',
            props: {
              placeholder: '请输入'
            },
            rules: {
              required: true
            }
          },
          {
            type: 'textarea',
            modelKey: 'leaveReason',
            label: '请假事由：',
            props: {
              placeholder: '请输入事由'
            },
            rules: {
              required: true
            }
          }
        ],
        postData: {
          leaveTypeId: 0,
          leaveStartTime: 0,
          leaveEndTime: 0
        }
      }
    },
    created() {
      this._getLeaveList()
    },
    methods: {
      applyLeave() {
        this._askForLeave()
      },
      // 显示请假类型 picker
      showLeaveTypePicker() {
        this.$refs.leaveTypePicker.show()
      },
      // 选择请假开始时间
      showDateStartPicker() {
        this.$refs.dateStartPicker.show()
      },
      // 选择请假结束时间
      showDateEndPicker() {
        this.$refs.dateEndPicker.show()
      },
      validateHandler(result) {
        this.validity = result.validity
        this.valid = result.valid
        // console.log('validity', result.validity, result.valid, result.dirty, result.firstInvalidFieldIndex)
      },
      // 选择请假类型之后
      selectLeaveType(selectedVal, selectedIndex, selectedText) {
        this.postData.leaveTypeId = selectedVal[0]
        this.leaveModel.leaveType = selectedText[0]
      },
      // 选择开始时间之后
      dateStartSelectHandler(date, selectedVal, selectedText) {
        this.postData.leaveStartTime = new Date(date).getTime()
        this.leaveModel.dateStartTimeValue = new Date(selectedVal[0], selectedVal[1] - 1, selectedVal[2]).toDateString()
      },
      // 选择开始结束之后
      dateEndSelectHandler(date, selectedVal, selectedText) {
        this.postData.leaveEndTime = new Date(date).getTime()
        this.leaveModel.dateEndTimeValue = new Date(selectedVal[0], selectedVal[1] - 1, selectedVal[2]).toDateString()
      },
      getDateDiff(startTime, endTime) {
        let dates = Math.round(Math.floor((endTime - startTime)) / (1000 * 60 * 60 * 24))
        return dates
      },
      _getLeaveList() {
        getLeaveList().then((res) => {
          this.leaveTypeList = res
        })
      },
      _askForLeave() {
        this.requestQuery = this._initData()
        askForLeave(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            this.$emit('applySuccessful')
            this.$router.back()
          } else {
            openToast(this, '申请失败，请检查填写的参数', 'error')
          }
        })
      },
      _initData() {
        let arr = []
        arr.push({
          days: this.getDateDiff(this.postData.leaveStartTime, this.postData.leaveEndTime),
          leave_type_id: this.postData.leaveTypeId,
          begin_time: (this.postData.leaveStartTime + '').substr(0, 10),
          end_time: (this.postData.leaveEndTime + '').substr(0, 10),
          content: this.leaveModel.leaveReason,
          parent_phone: this.leaveModel.parentPhoneNumber
        })
        return arr
      }
    },
    components: {
      MHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .leave
    z-index: 30
    .container
      width: 100%
      height: 100%
      .date-time-btn
        color: $color-light-black
        background: none
      .submit-btn
        margin-top: 20px
</style>
