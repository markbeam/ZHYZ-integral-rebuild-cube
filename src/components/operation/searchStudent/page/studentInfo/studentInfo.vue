<template>
  <div class="student-info c-page">
    <m-header :title="`${data.name} 信息`"
      :is-show-close-icon="true"></m-header>
    <div class="container">
      <!-- 头像 icon -->
      <div class="avatar-container">
        <!-- 头像 女 -->
        <div class="avatar" v-if="data.sex === '女'">
          <div class="icon female"></div>
        </div>
        <!-- 头像 男 -->
        <div class="avatar" v-else>
          <div class="icon male"></div>
        </div>
        <div class="text">
          <!-- 姓名 -->
          <p class="name">{{ data.name }}</p>
          <!-- 班级 -->
          <span class="class">{{ data.cls.name }}</span>
          <!-- 性别 -->
          <span class="sex">{{ data.sex }}</span>
        </div>
      </div>
      <!-- 积分信息 -->
      <div class="integral-information-container">
        <div class="bar">
          <!-- 积分 -->
          <ul class="integral-list">
            <li class="item integral">
              <p class="score">{{ data.scoreTotal || data.score }}</p>
              <p class="tip">总积分</p>
            </li>
            <!-- 已换购积分 -->
            <li class="item moral-integral">
              <p class="score">{{ totalCredit || 0 }}</p>
              <p class="tip">当前学分</p>
            </li>
            <!-- 德育分 -->
            <li class="item moral-integral">
              <p class="score">{{ data.moralEduSroce || 0 }}</p>
              <p class="tip">德育分</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 查看请假详情 & 操作详情 -->
      <div class="detail-container">
        <ul class="view-list-group basic">
          <h2 class="group-title">统计</h2>
          <!-- 查看十项常规 -->
          <li class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-time"></i>
                请假次数
              </p>
              <p class="text">
                <span class="aooly-count">1</span>
                <i class="zhyz-right"></i>
              </p>
            </div>
          </li>
          <!-- 审批请假 -->
          <router-link tag="li" :to="{name: 'studentOperationDetailList'}" class="item">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-chakanxiangqing"></i>
                操作详情
              </p>
              <p class="text">
                <i class="zhyz-right"></i>
              </p>
            </div>
          </router-link>
        </ul>
      </div>
    </div>
    <transition name="slide">
      <router-view :data="data"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import { ERR_OK } from 'api/config'
  import { getStudentCreditById } from 'api/index'

  export default {
    data() {
      return {
        data: this.$route.params.data,
        totalCredit: 0
      }
    },
    created() {
      if(!this.$route.params.data) {
        this.$router.back()
      }
      this._getStudentCreditById()
    },
    methods: {
      figureCredit(data) {
        let tmpTotalCredit = 0
        for(let i of data) {
          for(let j of i.data) {
            tmpTotalCredit += parseInt(j.CREDIT ? j.CREDIT : '0')
          }
        }
        this.totalCredit = tmpTotalCredit
      },
      _getStudentCreditById() {
        getStudentCreditById(this.data.number).then((res) => {
          if(res.code === ERR_OK) {
            this.figureCredit(res.data)
          }
        })
      }
    },
    components: {
      MHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .student-info
    z-index: 30
    .container
      .avatar-container
        padding: 20px 25px 15px
        width: 100%
        background-color: $color-white
        .avatar, .text
          display: inline-block
          vertical-align: middle
          font-size: 0
        .avatar
          .icon
            width: 75px
            height: 75px
            border-radius: 75%
            border: 2px solid $color-border
            box-shadow: 0 5px 10px $color-transparent-black-ii
            background-size: 75px 75px
            &.male
              bg-image('avatar_male')
            &.female
              bg-image('avatar_female')
        .text
          margin-left: 15px
          .name
            margin-bottom: 10px
            font-weight: 700
            color: $color-black
            font-size: $font-size-large
          span
            font-size: $font-size-medium
            color: $color-transparent-black-v
      .integral-information-container
        background-color: $color-white
        .integral-list
          display: flex
          align-items: center
          justify-content: space-between
          box-sizing: border-box
          .item
            position: relative
            padding: 15px 0 20px
            flex: 1
            text-align: center
            &:not(:last-child)            
              &:after
                content: ''
                position: absolute
                top: 20px
                right: 0
                height: 40px
                color: $color-border
                border-right: 1px solid $color-border
                box-sizing: border-box
                // transform: translate3d(0, -50%, 0)
                transform-origin: 0 0
                transform: scaleX(0.5)
            .score
              margin-bottom: 15px
              font-size: $font-size-large-x
            .tip
              font-size: $font-size-medium
              color: $color-transparent-black-v
</style>
