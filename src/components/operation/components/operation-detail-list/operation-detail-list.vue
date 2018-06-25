<template>
  <div class="operation-detail-list">
    <div class="container">
      <cube-scroll 
        ref="scroll"
        v-show="hasInfo && operations.length"
        :data="operations"
        :options="options"
        @pulling-up="onPullingUp">
        <!-- 能撤回 -->
        <cube-swipe class="list-content"
          v-if="isWithdraw && personalInfo.user_type === '用户' || personalInfo.user_type === '教师'">
          <transition-group name="swipe" tag="ul">
            <li v-for="(item, index) in operations"
              @click="selectItem(item)" 
              :key="item.id"
              class="list-item">
              <cube-swipe-item
                ref="swipeItem"
                autoShrink
                :class="{'withdrawed': item.more.set_failure_time}"
                :btns="item.more.set_failure_time ? btnsWithdraw : btns"
                :index="index"
                @btn-click="withdraw">
                <div class="left">
                  <p class="title">{{ item.content }}</p>
                  <span class="klass" v-if="item.to_cls">{{ item.to_cls.name }}</span>
                  <span class="name" v-if="item.to_user">{{ item.to_user.name }}</span>
                  <span class="time" v-if="item.create_time">{{ item.create_time | formatDate }}</span>
                </div>
                <div class="right">
                  <p class="add-subtrac-score" 
                    :style="{'color': item.score > 0 ? '#12b7f5' : '#f62836'}">{{ padLeftZero(item.score) }}</p>
                </div>
              </cube-swipe-item>
            </li>
          </transition-group>
        </cube-swipe>
        <!-- 数据列表 -->
        <ul class="list-content"
          v-if="!isWithdraw || personalInfo.user_type === '学生'">
          <!-- 学生 -->
          <li @click="selectItem(item)" 
            :key="item.id"
            class="list-item" 
            v-for="item in operations">
            <div class="wrapper">
              <div class="left">
                <p class="title">{{ item.content }}</p>
                <span class="klass" v-if="item.to_cls">{{ item.to_cls.name }}</span>
                <span class="name" v-if="item.to_user">{{ item.to_user.name }}</span>
                <span class="time" v-if="item.create_time">{{ item.create_time | formatDate }}</span>
              </div>
              <div class="right">
                <p class="add-subtrac-score" 
                :style="{'color': item.score > 0 ? '#12b7f5' : '#f62836'}">{{ padLeftZero(item.score) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </cube-scroll>
      <!-- loading -->
      <div class="loading-container"
        v-show="hasInfo && !operations.length">
        <loading></loading>
      </div>
      <!-- 暂无数据 -->
      <div class="no-result-container" 
        v-show="!hasInfo && !operations.length">
        <no-result></no-result>
      </div>
    </div>
  </div>
</template>

<script>
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import { openToast } from 'common/js/util'
  import { formatDate } from 'common/js/date'
  import { ERR_OK } from 'api/config'
  import { getStudentOperationInfo,
    getPersonalOperationInfo,
    getPersonalAddTypeList,
    getPersonalDeeTypeList,
    withdrawOperateHistory,
    unWithdrawOperateHistory } from 'api/operation'
  import { mapGetters } from 'vuex'

  const OP_TYPE_STU = 0
  const OP_TYPE_ALL = 1
  const OP_TYPE_ADD = 2
  const OP_TYPE_MIN = 3

  export default {
    props: {
      data: {
        type: Object,
        default: null
      },
      operationType: {
        type: Number,
        default: OP_TYPE_STU // 0 -> 某个学生的项（传入id），1 -> 全部分，2 -> 加分项，3 -> 减分项
      },
      // 是否能撤回
      isWithdraw: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        btns: [
          {
            action: 'withdraw',
            text: '撤回',
            color: '#FF6700'
          }
        ],
        btnsWithdraw: [
          {
            action: 'unWithdraw',
            text: '取消撤回',
            color: '#FF6700'
          }
        ],
        hasInfo: true, // 是否有数据（该学生没被操作过）
        isContinue: true,
        pageIndex: 1, // 当前应该请求的页数
        operations: [], // 数据
        options: {
          scrollbar: false,
          pullUpLoad: false
        }
      }
    },
    created() {
      if(this.operationType === OP_TYPE_STU && !this.data) {
        this.$router.back()
      }
      this._getOperationInfo()
    },
    methods: {
      // 上拉加载回调
      onPullingUp() {
        this._getOperationInfo()
      },
      selectItem(item, event) {
        this.$emit('selected', item)
      },
      // 撤回按钮被点击时
      withdraw(btn, index) {
        // 阻止冒泡
        let OE = event
        OE.cancelBubble = true
        OE.stopPropagation()
        if(this.operations[index].more.set_failure_time) {
          this.$set(this.operations[index].more, 'set_failure_time', '')
          this._unWithdrawOperateHistory(this.operations[index])
        } else {
          this.$set(this.operations[index].more, 'set_failure_time', 'disables')
          this._withdrawOperateHistory(this.operations[index])
        }
      },
      // 补全分数左边的符号（+ -）
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      },
      _withdrawOperateHistory(item) {
        withdrawOperateHistory(item.id + '').then((res) => {
          if(res.code === ERR_OK) {
            openToast(this, '撤回成功！')
          } else {
            openToast(this, res.msg, 'error')
          }
        })
      },
      _unWithdrawOperateHistory(item) {
        unWithdrawOperateHistory(item.id + '').then((res) => {
          if(res.code === ERR_OK) {
            openToast(this, '取消撤回成功！')
          } else {
            openToast(this, res.msg, 'error')
          }
        })
      },
       _getOperationInfo() {
        if(this.operationType === OP_TYPE_STU) {
          getStudentOperationInfo(this.data.id, this.pageIndex).then((res) => {
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
            if(this.operations.length >= res.page.total) {
              this.$refs.scroll.forceUpdate()
            } else {
              // 每加载一次数据，控制请求页数的值 +1
              this.pageIndex++
              this.operations = this.operations.concat(res.data)
            }
          })
        } else if(this.operationType === OP_TYPE_ALL) {
          getPersonalOperationInfo(this.pageIndex).then((res) => {
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
            if(this.operations.length >= res.page.total) {
              this.$refs.scroll.forceUpdate()
            } else {
              // 每加载一次数据，控制请求页数的值 +1
              this.pageIndex++
              this.operations = this.operations.concat(res.data)
            }
          })
        } else if(this.operationType === OP_TYPE_ADD) {
          getPersonalAddTypeList(this.pageIndex).then((res) => {
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
                    noMore: '还拉？再拉也没分加啦！' // No more data 时显示的文字
                  }
                }
              }
              this.isContinue = false
            }
            // 判断是否最后一页
            if(this.operations.length >= res.page.total) {
              this.$refs.scroll.forceUpdate()
            } else {
              // 每加载一次数据，控制请求页数的值 +1
              this.pageIndex++
              this.operations = this.operations.concat(res.data)
            }
          })
        } else if(this.operationType === OP_TYPE_MIN) {
          getPersonalDeeTypeList(this.pageIndex).then((res) => {
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
                    noMore: '还拉？还想扣多点分？' // No more data 时显示的文字
                  }
                }
              }
              this.isContinue = false
            }
            // 判断是否最后一页
            if(this.operations.length >= res.page.total) {
              this.$refs.scroll.forceUpdate()
            } else {
              // 每加载一次数据，控制请求页数的值 +1
              this.pageIndex++
              this.operations = this.operations.concat(res.data)
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

        return formatDate(date, 'yyyy-MM-dd hh:mm')
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
  @import "~common/stylus/variable"

  .operation-detail-list
    width: 100%
    height: 100%
    .container
      width: 100%
      height: 100%
      .list-content
        position: relative
        background: #fff
        .list-item
          box-sizing: border-box
          border-bottom: 1px solid #e5e5e5
          .withdrawed
            color: #d8d6d6
            p
              color: #d8d6d6 !important
          .cube-swipe-item, .wrapper
            height: 100%
            padding: 16px 0 16px 20px
          .left, .right
            font-size: 0
            display: inline-block
            vertical-align: middle
          .left
            width: 80%
            .title
              margin-bottom: 2px
              text-overflow: ellipsis
              overflow: hidden
              white-space: nowrap
              font-size: $font-size-medium-x
            .name, .klass
              margin-right: 3px
              font-size: $font-size-small
            .time
              font-size: $font-size-small-s
          .right
            width: 18%
            text-align: center
            .add-subtrac-score
              font-size: $font-size-medium-x
</style>
