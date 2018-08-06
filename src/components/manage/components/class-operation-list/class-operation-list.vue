<template>
  <div class="operation-detail-list">
    <div class="container">
      <cube-scroll 
        ref="scroll"
        v-show="hasInfo && clsOperationDataList.length"
        :data="clsOperationDataList">
        <!-- 数据列表 -->
        <ul class="list-content">
          <!-- 学生 -->
          <li @click="selectItem(item)" 
            :key="item.id"
            class="list-item" 
            v-for="item in clsOperationDataList">
            <div class="wrapper">
              <div class="left">
                <p class="title">{{ item.content }}</p>
                <span class="klass" v-if="item.to_cls">{{ item.to_cls.name }}</span>
                <span class="name" v-if="item.to_user">{{ item.to_user.name }}</span>
                <span class="time" v-if="item.op_time">{{ item.op_time | formatDate }}</span>
              </div>
              <div class="right">
                <p class="add-subtrac-score"
                :style="{'color': item.cls_score > 0 ? '#12b7f5' : '#f62836'}">{{ padLeftZero(item.cls_score) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </cube-scroll>
      <!-- loading -->
      <div class="loading-container"
        v-show="hasInfo && !clsOperationDataList.length">
        <loading></loading>
      </div>
      <!-- 暂无数据 -->
      <div class="no-result-container"
        v-show="!hasInfo && !clsOperationDataList.length">
        <no-result></no-result>
      </div>
    </div>
  </div>
</template>

<script>
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import { formatDate } from 'common/js/date'
  import { ERR_OK } from 'api/config'
  import { getClassOperationList } from 'api/operation'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        hasInfo: true, // 是否有数据（该学生没被操作过）
        clsOperationDataList: []
      }
    },
    created() {
      if(!this.personalInfo) {
        this.$router.back()
      }
      this._getClassOperationList()
    },
    methods: {
      // 上拉加载回调
      onPullingUp() {
        this._getClassOperationList()
      },
      selectItem(item, event) {
        this.$emit('selected', item)
      },
      // 补全分数左边的符号（+ -）
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      },
       _getClassOperationList() {
        getClassOperationList().then((res) => {
          if(res.code === ERR_OK) {
            if(!res.data.length) {
              this.hasInfo = false
              return
            }
            this.clsOperationDataList = res.data
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
