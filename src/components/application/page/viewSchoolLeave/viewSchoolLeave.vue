<template>
  <div class="mesystem c-page">
    <m-header :title="`${campusData.name} 请假情况`"
      :is-show-close-icon="true"></m-header>
    <div class="container">
      <!-- 时间选择 -->
      <time-bar @selectedItem="daySelect" 
        v-if="weekList" 
        :time-list="weekList"></time-bar>
      <!-- 选择星期几 -->
      <cube-scroll :data="leaveList"
         v-show="hasInfo && leaveList.length">
        <div>
          <ul class="leave-list"
            v-if="leaveList">
            <li class="item" 
              v-for="item in leaveList">
              <div class="left">
                <h2 class="title">{{ `${item.user.name}的${item.leave_type.name}` }}</h2>
                <p class="leave-type">班级：{{ item.user.cls.name }}</p>
                <p class="leave-type">请假类型：{{ item.leave_type.name }}</p>
                <p class="begin-time">开始时间：{{ item.begin_time | formatDate }}</p>
                <p class="end-time">结束时间：{{ item.end_time | formatDate }}</p>
              </div>
              <div class="right">
                <!-- <p class="create-time">{{ (item.create_time | formatDate).substring(11, 16) }}</p> -->
              </div>
            </li>
          </ul>
        </div>
      </cube-scroll>
      <!-- loading -->
      <div class="loading-container"
        v-show="hasInfo && !leaveList.length">
        <loading></loading>
      </div>
      <!-- 当没信息的时候 no-result 组件显示 -->
      <div class="no-result-container" v-show="!hasInfo && !leaveList.length">
        <no-result title="暂无请假数据"></no-result>
      </div>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Loading from 'base/loading/loading'
  import MHeader from 'base/m-header/m-header'
  import NoResult from 'base/no-result/no-result'
  import TimeBar from 'components/manage/components/time-bar/time-bar'
  import { formatDate } from 'common/js/date'
  import { viewSchoolLeave } from 'api/application'

  export default {
    props: {
      campusData: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        weekList: [
          {
            text: '今天'
          },
          {
            text: '昨天'
          },
          {
            text: '前天'
          },
          {
            text: '大前天'
          },
          {
            text: '4天前'
          },
          {
            text: '5天前'
          },
          {
            text: '6天前'
          }
        ],
        leaveList: [],
        hasInfo: true
      }
    },
    created() {
      if(!this.campusData) {
        this.$router.back()
      }
      
      let da = new Date().getTime()
      for(let i = 0; i < this.weekList.length; i++) {
        Object.assign(this.weekList[i], {
          date: formatDate(new Date(da - (i * 3600 * 24 * 1000)), 'yyyy-MM-dd')
        })
      }

      this.$nextTick(() => {
        this._viewSchoolLeave(this.weekList[0].date)
      })
    },
    methods: {
      daySelect(item) {
        this._viewSchoolLeave(item.date)
      },
      _viewSchoolLeave(date) {
        this.hasInfo = true
        this.leaveList = []
        viewSchoolLeave(this.campusData.id, date).then((res) => {
          if(!res.length) {
            this.hasInfo = false
            return
          }
          
          this.leaveList = res
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
      TimeBar,
      Loading,
      MHeader,
      NoResult
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .mesystem
    z-index: 30
    .container
      width: 100%
      height: 100%
      .leave-list
        .item
          position: relative
          padding: 15px 15px
          display: flex
          align-items: center
          justify-content: space-between
          background-color: $color-white
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
          .left
            font-size: 14px
            color: #999
            p
              margin: 1px 0
            .title
              margin-bottom: 10px
              font-size: 18px
              color: #222
          .right
            .create-time
              font-size: 14px
              color: #777
</style>
