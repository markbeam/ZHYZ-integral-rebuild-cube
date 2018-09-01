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
              :key="item.id"
              v-for="item in leaveList">
              <div class="left">
                <h2 class="title">{{ `${item.commit_user.name}的${item.form_content.level_type || item.flow.name}` }}</h2>
                <p class="leave-type">班级：{{ item.sponsor_user.cls.name || item.sponsor_user.groups[0].name }}</p>
                <p class="leave-type">请假类型：{{ item.form_content.level_type || item.flow.name }}</p>
                <p class="begin-time">开始时间：{{ item.begin_time | formatDate }}</p>
                <p class="end-time">结束时间：{{ item.end_time | formatDate }}</p>
              </div>
              <div class="right">
                <!-- <p class="create-time">{{ (item.create_time | formatDate).substring(11, 16) }}</p> -->
                <!-- 如果全部审核角色 都审核完毕，就显示通过或拒绝 -->
                <p class="is-pass"
                   v-if="item.status !== 0"
                   :class="{'allow': item.status === 1, 'reject': item.status === 2}"
                >{{ item.status === 1 ? '同意' : '拒绝' }}</p>
                <!-- 否则就显示进度（老师审核 → 部长 → 用户） -->
                <p class="is-pass"
                   v-if="item.status === 0"
                   :class="{'allow': approvalStatus(item).indexOf('班主任审核通过') !== -1,
              'reject': approvalStatus(item) === '申请被拒绝'}"
                >{{ approvalStatus(item) }}</p>
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
  import { ERR_OK } from 'api/config'
  import { viewSchoolLeave } from 'api/application'
  import { verifyApplyText } from 'common/js/util'
  import { mapGetters } from 'vuex'

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
      if(!this.campusData.id) {
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
      approvalStatus(approval) {
        return verifyApplyText(this.personalInfo.id, approval)
      },
      _viewSchoolLeave(date) {
        this.hasInfo = true
        this.leaveList = []
        viewSchoolLeave(this.campusData.id, date).then((res) => {
          if(!res.data.length) {
            this.hasInfo = false
            return
          }

          if(res.code === ERR_OK) {
            this.leaveList = res.data
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
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
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
            flex: 0 0 80%
            width: 80%
            font-size: 14px
            color: #999
            p
              margin: 1px 0
            .title
              margin-bottom: 10px
              font-size: 18px
              color: #222
          .right
            flex: 0 0 20%
            width: 20%
            transform: rotate(30deg)
            text-align: center
            .create-time
              font-size: 14px
              color: #777
            .is-pass
              font-size: 15px
              &.allow
                color: #12b7f5
              &.reject
                color: #f62836
              &.yet
                color: #ff6700
</style>
