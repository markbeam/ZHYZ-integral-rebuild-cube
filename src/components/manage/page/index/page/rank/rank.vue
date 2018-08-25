<template>
  <div class="rank c-page">
    <m-header title="积分排行榜"></m-header>
    <div class="container" v-if="topData">
      <cube-button @click.native="showActionSheet">
        {{ selectedPicker.pickerActiveText || '请点击选择排行格式' }}
      </cube-button>
      <cube-scroll :data="topData"
        v-if="topData">
        <ul class="top-list">
          <li class="item" 
            :key="item.id"
            v-for="(item, index) in topData"
            @click="selectItem(item)">
            <p class="ranking-number">{{ index + 1 }}</p>
            <div class="ranking-user-info">
              <div class="avatar"></div>
              <p class="name">{{ item.name }}</p>
              <p class="class-name">{{ item.cls.name }}</p>
            </div>
            <div class="current-integral">
              <p class="score">{{ item.score }}</p>
            </div>
          </li>
        </ul>
      </cube-scroll>
      <!-- 我当前的排名 -->
      <div class="my-rank" v-if="personData">
        <div class="item">
          <p class="ranking-number">{{ personData.rank }}</p>
          <div class="ranking-user-info">
            <div class="avatar"></div>
            <p class="name">{{ personData.name }}</p>
            <p class="class-name" v-if="personData.cls_name">{{ personData.cls_name }}</p>
          </div>
          <div class="current-integral">
            <p class="score">{{ personData.score }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Loading box -->
    <div class="loading-container" 
      v-show="!topData">
      <loading></loading>
    </div>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import Loading from 'base/loading/loading'
  import { ERR_OK } from 'api/config'
  import { getRank } from 'api/rank'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        topData: null,
        personData: null,
        selectedPicker: {
          pickerActiveIndex: 4,
          pickerActiveText: '',
          pickerActiveValue: 0
        }
      }
    },
    created() {
      this._getRank()

      if(this.personalInfo.user_type === '学生' ||
          this.personalInfo.user_type === '班主任') {
        this.ActionSheetData = [
          {
            content: '全校',
            value: 1
          },
          {
            content: '本校区',
            value: 2
          },
          {
            content: '专业部',
            value: 3
          },
          {
            content: '本届',
            value: 4
          },
          {
            content: '本班级',
            value: 5
          }
        ]
      } else {
        this.selectedPicker.pickerActiveIndex = 0
        this.ActionSheetData = [
          {
            content: '全校',
            value: 1
          }
        ]
      }
    },
    methods: {
      selectItem(item) {
        this.$router.push({
          name: 'studentInfo',
          params: {
            data: item
          }
        })
      },
      showActionSheet() {
        this.$createActionSheet({
          title: '请选择（分数相同的话按姓名字母排）',
          active: this.selectedPicker.pickerActiveIndex,
          data: this.ActionSheetData,
          onSelect: (item, index) => {
            this.selectedPicker.pickerActiveIndex = index
            this.selectedPicker.pickerActiveText = item.content
            this.selectedPicker.pickerActiveValue = item.value
            
            // update rank data
            this._getRank()
            
            this.$createToast({
              txt: `选择 ${item.content}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      },
      _getRank() {
        this.topData = null
        getRank(this.selectedPicker.pickerActiveText).then((res) => {
          if(res.code === ERR_OK) {
            this.topData = res.data.list[0].list
            this.personData = res.data.person
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      MHeader,
      Loading
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  $top-three = #FB7299
  $top1 = #FFA500
  $top2 = #21C1FC
  $top3 = #5ECA31

  .rank
    z-index: 20
    background-color: #fbfbfb !important
    .container
      height: 100%
      .top-list, .my-rank
        .item
          position: relative
          padding: 20px 20px
          display: flex
          align-items: center
          // flex-direction: column
          justify-content: space-between
          box-sizing: border-box
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
          &:nth-child(-n+3)
            .name
              color: $top-three
          &:nth-child(1)
            .ranking-number
              color: $top1
          &:nth-child(2)
            .ranking-number
              color: $top2
          &:nth-child(3)
            .ranking-number
              color: $top3
          .ranking-number
            width: 90px
            flex: 0 0 90px
            // text-align: center
            padding-left: 30px
            box-sizing: border-box
            color: $color-light-gray
            font-weight: 700
            font-size: $font-size-large
          .ranking-user-info
            flex: 1
            font-size: 0
            .name, .class-name
              display: inline-block
            .name
              width: 75px
              font-size: $font-size-large
            .class-name
              margin-left: 8px
              font-size: $font-size-small
          .current-integral
            flex: 0 0 40px
            width: 40px
            text-align: center
      .top-list
        margin-top: 5px
        padding-bottom: 35px
        width: 100%
      .my-rank
        position: fixed
        bottom: 0
        left: 0
        z-index: 21
        width: 100%
        box-shadow: -2px -4px 8px $color-transparent-black-i
        background-color: $color-white
</style>
