<template>
  <div class="application-list">
    <cube-scroll 
      ref="scroll"
      v-show="hasInfo && applications.length"
      :data="applications"
      :options="options"
      @pulling-up="onPullingUp">
      <ul class="list-content">
        <!-- 详细 -->
        <li @click="selectItem(item, $event)" 
          :key="item.begin_time"
          v-for="item in applications"
          class="list-item">
          <div class="left">
            <p class="title">{{ item.leave_type.name }}</p>
            <p class="create-time time">申请时间：{{ item.create_time | formatDate }}</p>
            <p class="name">{{ item.user.name }} <span v-if="item.user.cls">{{ item.user.cls.name }}</span></p>
            <p class="time">开始时间：{{ item.begin_time | formatDate }}</p>
            <p class="time">结束时间：{{ item.end_time | formatDate }}</p>
          </div>
          <div class="right">
            <!-- 如果全部审核角色 都审核完毕，就显示通过或拒绝 -->
            <p class="is-pass" 
              v-if="item.status !== 0"
              :class="{'allow': item.status === 1, 'reject': item.status === 2}"
              >{{ item.status === 1 ? '同意' : '拒绝' }}</p>
            <!-- 否则就显示进度（老师审核 → 部长 → 管理员） -->
            <p class="is-pass" 
              v-if="item.status === 0"
              :class="{'allow': approvalStatus(item).indexOf('班主任审核通过') !== -1, 
              'reject': approvalStatus(item) === '申请被拒绝'}"
              >{{ approvalStatus(item) }}</p>
          </div>
        </li>
      </ul>
    </cube-scroll>
    <!-- loading -->
    <div class="loading-container"
      v-show="hasInfo && !applications.length">
      <loading></loading>
    </div>
    <!-- 暂无数据 -->
    <div class="no-result-container" 
      v-show="!hasInfo && !applications.length">
      <no-result></no-result>
    </div>
  </div>
</template>

<script>
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import { formatDate } from 'common/js/date'
  import { verifyApplyText } from 'common/js/util'
  import { getProcessApplicationList, studentGetFinalProcessApplyList } from 'api/application'
  import { mapGetters } from 'vuex'

  export default {
    props: {
      selectedType: { // 显示的类别，ture -> 老师 / 管理员，false -> 学生
        type: Boolean,
        default: true
      },
      showType: { // 显示 加减分 类型
        Type: String,
        default: 'wait'
      }
    },
    data() {
      return {
        applications: [],
        hasInfo: true, // 是否有数据（该学生没被操作过）
        isContinue: true,
        pageIndex: 1, // 当前应该请求的页数
        options: {
          scrollbar: false,
          pullUpLoad: false
        }
      }
    },
    created() {
      this._getApplicationList()
    },
    methods: {
      // 上拉加载回调
      onPullingUp() {
        this._getProcessApplyList()
      },
      selectItem(item, event) {
        this.$emit('selected', item)
      },
      approvalStatus(approval) {
        return verifyApplyText(this.personalInfo.id, approval)
      },
      // 进度
      approvalProgress(approval) {
        let count = 0
        for(let i of approval) {
          if(i.status !== 0) {
            count++
          }
        }
        return ((count / approval.length) * 100).toFixed(0) + '%'
      },
      // 补全分数左边的符号（+ -）
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      },
      refresh() {
        this.isContinue = true
        this.pageIndex = 1
        this.applications = []
        this._getApplicationList()
      },
      _getApplicationList() {
        if(this.selectedType) {
          getProcessApplicationList(this.selectedType, this.pageIndex).then((res) => {
            // 如果没数据
            if(this.isContinue) {
              if(res.page.total === 0) {
                this.hasInfo = false
              }
              // 多于一页的数据才加载这些选项（BS scroll）
              if(res.page.total > 15) {
                this.options.scrollbar = {
                  fade: true,
                  interactive: false
                }
                this.options.pullUpLoad = {
                  threshold: 0,
                  txt: {
                    more: '正在加载...', // 加载更多时显示的文字
                    noMore: '到底了，你再怎么拉也没有啦' // No more data 时显示的文字
                  }
                }
              }
              this.isContinue = false
            }
            // 判断是否最后一页
            if(this.applications.length >= res.page.total) {
              this.$refs.scroll.forceUpdate()
            } else {
              // 每加载一次数据，控制请求页数的值 +1
              this.pageIndex++
              this.applications = this.applications.concat(res.data)
            }
          })
        } else {
          let filter = ''
          studentGetFinalProcessApplyList(filter, this.pageIndex).then((res) => {
            // 如果没数据
            if(this.isContinue) {
              if(res.page.total === 0) {
                this.hasInfo = false
              }
              // 多于一页的数据才加载这些选项（BS scroll）
              if(res.page.total > 15) {
                this.options.scrollbar = {
                  fade: true,
                  interactive: false
                }
                this.options.pullUpLoad = {
                  threshold: 0,
                  txt: {
                    more: '正在加载...', // 加载更多时显示的文字
                    noMore: '到底了，你再怎么拉也没有啦' // No more data 时显示的文字
                  }
                }
              }
              this.isContinue = false
            }
            // 判断是否最后一页
            if(this.applications.length >= res.page.total) {
              this.$refs.scroll.forceUpdate()
            } else {
              // 每加载一次数据，控制请求页数的值 +1
              this.pageIndex++
              this.applications = this.applications.concat(res.data)
            }
          })
        }
      }
    },
    filters: {
      formatDate(time) {
        time += '000'
        time = parseInt(time)
        let date = new Date(time)

        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      Loading,
      NoResult
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .application-list
    height: 100%
    .list-content
      position: relative
      background: #fff
      .list-item
        position: relative
        display: flex
        align-items: center
        justify-content: space-between
        height: 80px
        padding: 0 10px 0 20px
        border-bottom: 1px solid #e5e5e5
        transition: all .3s ease
        box-sizing: border-box
        .left
          flex: 0 0 80%
          width: 80%
          .title
            font-size: 20px
            margin-bottom: 2px
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
          .time
            font-size: 11px
            margin-top: 2px
          .create-time
            position: absolute
            top: 15px
            right: 25%
        .right
          flex: 0 0 20%
          width: 20%
          transform: rotate(30deg)
          text-align: center
          .is-pass
            font-size: 15px
            &.allow
              color: #12b7f5
            &.reject
              color: #f62836
            &.yet
              color: #ff6700
</style>
