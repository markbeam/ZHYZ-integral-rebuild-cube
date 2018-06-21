<template>
  <div class="process-verification c-page">
    <m-header title="审核确认" 
      :is-show-close-icon="true"
      back-page="/me"></m-header>
    <div class="container">
      <cube-scroll 
        ref="scroll"
        :data="[verificationData]">
        <!-- 信息部分 -->
        <ul class="view-list-group">
          <h2 class="group-title">申请信息</h2>
          <!-- 申请者姓名 -->
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-id-card"></i>
                姓名
              </p>
              <p class="text" v-if="verificationData.user">{{ verificationData.user.name }}</p>
            </div>
          </li>
          <!-- 申请者班级 -->
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-class"></i>
                班级
              </p>
              <p class="text" v-if="verificationData.user.cls">{{ verificationData.user.cls.name }}</p>
            </div>
          </li>
          <!-- 申请类型 -->
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-type"></i>
                申请类型
              </p>
              <p class="text" v-if="verificationData.leave_type">{{ verificationData.leave_type.name }}</p>
            </div>
          </li>
          <!-- 申请者家长电话 -->
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-Man"></i>
                家长电话
              </p>
              <p class="text" v-if="verificationData.parent_phone">{{ verificationData.parent_phone }}</p>
            </div>
          </li>
          <!-- 申请开始时间 -->
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-time"></i>
                申请开始时间
              </p>
              <p class="text time" v-if="verificationData.begin_time">{{ verificationData.begin_time | formatDate }}</p>
            </div>
          </li>
          <!-- 申请结束时间 -->
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-time"></i>
                申请结束时间
              </p>
              <p class="text time" v-if="verificationData.end_time">{{ verificationData.end_time | formatDate }}</p>
            </div>
          </li>
          <!-- 申请原因 -->
          <li class="item multiple">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-neirongyingxiao"></i>
                申请原因
              </p>
              <p maxlength="200" 
                class="text" 
                v-if="verificationData.content">
                <cube-textarea readonly
                  v-model="verificationData.content">
                </cube-textarea>
              </p>
            </div>
          </li>
          <!-- 班主任评语 -->
          <li class="item multiple" 
            v-for="(item, index) in verificationData.approval"
            v-if="item.status !== 0">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-neirongyingxiao"></i>
                {{ index === 0 ? '班主任评语' : '学生处评语' }}
              </p>
              <p maxlength="200" 
                class="text" >
                <cube-textarea readonly
                  placeholder="暂无评语..."
                  v-model="item.summary">
                </cube-textarea>
              </p>
            </div>
          </li>
        </ul>
        <div class="btn-container" v-show="!isDone">
          <cube-button :light="true" @click.native="permit(1)">同意</cube-button>
          <cube-button :primary="true" @click.native="permit(2)">拒绝</cube-button>
        </div>
      </cube-scroll>
    </div>
    <!-- 点击 同意/拒绝 后显示的输入理由container -->
    <div class="operation-result-container" v-show="isShowResultBox">
      <div class="mask" @click="hideResultBox"></div>
      <div class="operation-result">
        <h2 class="title">{{ resultBoxSubtitle }}理由：</h2>
        <cube-textarea
          v-model="operateResult"
          placeholder="请输入理由（可不填）"
          class="reason"
          autofocus
        ></cube-textarea>
        <cube-button :light="true" @click.native="confirmed">确定</cube-button>
      </div>
    </div>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import { formatDate } from 'common/js/date'
  import { ERR_OK } from 'api/config'
  import { approvalApply } from 'api/application'

  export default {
    props: {
      verificationData: {
        type: Object,
        default: null
      },
      // 是否已经操作完成（自己已经点击 同意/拒绝 按钮了）
      isDone: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        purpose: 1, // 最终意向，1 -> 同意，2 -> 拒绝
        operateResult: '',
        resultBoxSubtitle: '',
        isShowResultBox: false
      }
    },
    created() {
      if(!this.verificationData) {
        this.$router.back()
      }
    },
    methods: {
      // 同意申请
      permit(purpose) {
        if(purpose === 1) {
          this.resultBoxSubtitle = '同意'
        } else {
          this.resultBoxSubtitle = '拒绝'
        }
        this.purpose = purpose
        this.isShowResultBox = true
      },
      hideResultBox() {
        this.isShowResultBox = false
      },
      // 操作完成
      confirmed() {
        this._approvalApply()
        this.hideResultBox()
      },
      _approvalApply() {
        approvalApply(this.verificationData.id, this.purpose, this.operateResult).then((res) => {
          if(res.code === ERR_OK) {
            this.$router.back()
            this.$emit('verifySuccess')
          }
        })
      }
    },
    filters: {
      formatDate(time) {
        time += '000'
        time = parseInt(time)
        let date = new Date(time)

        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      MHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .process-verification
    z-index: 30
    .container
      height: 100%
      .btn-container
        margin-top: 15px
        background-color: $color-white
        button
          &:not(:last-child)
            margin-bottom: 5px
    .operation-result-container
      width: 100%
      height: 100%
      .mask
        position: fixed
        top: 0
        left: 0
        z-index: 31
        width: 100%
        height: 100%
        background-color: $color-transparent-black-v
      .operation-result
        position: absolute
        top: 50%
        left: 50%
        z-index: 32
        padding: 20px 20px 15px 20px
        width: 300px
        box-sizing: border-box
        transform: translate3d(-50%, -50%, 0)
        background-color: $color-white
        .reason
          margin: 8px 0
</style>
