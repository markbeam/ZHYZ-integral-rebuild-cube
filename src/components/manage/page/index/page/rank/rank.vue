<template>
  <div class="rank c-page">
    <m-header title="积分排行榜"></m-header>
    <div class="container">
      <cube-button @click.native="showActionSheet">{{ selectedPicker.pickerActiveText || '请点击选择排行格式' }}</cube-button>
      <cube-scroll :data="topList"
        v-show="topList.length">
        <ul class="top-list">
          <li class="item" 
            v-for="(item, index) in topList"
            @click="selectItem(item)">
            <p class="ranking-number">{{ index + 1 }}</p>
            <div class="ranking-user-info">
              <div class="avatar"></div>
              <p class="name">{{ item.name }}</p>
              <p class="class-name">软件15{{ index + 1 }}</p>
            </div>
            <div class="current-integral">
              <p class="score">81</p>
            </div>
          </li>
        </ul>
      </cube-scroll>
      <!-- 我当前的排名 -->
      <div class="my-rank">
        <div class="item">
          <p class="ranking-number">287</p>
          <div class="ranking-user-info">
            <div class="avatar"></div>
            <p class="name">梁文阳</p>
            <p class="class-name">软件151</p>
          </div>
          <div class="current-integral">
            <p class="score">20</p>
          </div>
        </div>
      </div>
      <!-- Loading box -->
      <div class="loading-container" 
        v-show="!topList.length">
        <loading></loading>
      </div>
    </div>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import Loading from 'base/loading/loading'

  export default {
    data() {
      return {
        topList: [
          {
            name: '吴家恒',
            id: 1
          },
          {
            name: '陈星龙',
            id: 2
          },
          {
            name: '温竣皓',
            id: 3
          },
          {
            name: '何子浩',
            id: 4
          },
          {
            name: '雷阳',
            id: 5
          }
        ],
        selectedPicker: {
          pickerActiveIndex: 0,
          pickerActiveText: '',
          pickerActiveValue: 0
        }
      }
    },
    methods: {
      selectItem(item) {
        console.log(item)
        // this.$router.push({
        //   name: 'studentInfo',
        //   params: {
        //     data: item
        //   }
        // })
      },
      showActionSheet() {
        this.$createActionSheet({
          title: '请选择',
          active: this.selectedPicker.pickerActiveIndex,
          data: [
            {
              content: '全校排名',
              value: 1
            },
            {
              content: '本校排名',
              value: 2
            },
            {
              content: '本专业部排名',
              value: 3
            },
            {
              content: '本班排名',
              value: 4
            }
          ],
          onSelect: (item, index) => {
            this.selectedPicker.pickerActiveIndex = index
            this.selectedPicker.pickerActiveText = item.content
            this.selectedPicker.pickerActiveValue = item.value
            this.$createToast({
              txt: `选择 ${item.content}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      }
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
              font-size: $font-size-large
            .name
              width: 75px
            .class-name
              margin-left: 8px
              font-size: $font-size-small
          .current-integral
            flex: 0 0 40px
            width: 40px
            text-align: center
      .top-list
        margin-top: 5px
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
