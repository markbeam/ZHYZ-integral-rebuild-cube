<template>
  <div class="time-bar">
    <cube-scroll :data="timeList"
      ref="BScroll"
      direction="horizontal">
      <ul class="time-list" ref="timeList">
        <li @click="selectItem(item, index)" 
          :class="{'active': activeIndex === index}" 
          class="time-item" v-for="(item, index) in timeList">{{ item.week || item.text }}</li>
      </ul>
    </cube-scroll>
  </div>
</template>

<script>
  export default {
    props: {
      timeList: { // 时间列表
        type: Array,
        default: null
      }
    },
    data() {
      return {
        activeIndex: 0
      }
    },
    methods: {
      // 当时间选择项被点击时
      selectItem(item, index) {
        this.activeIndex = index
        this.$emit('selectedItem', item)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .time-bar
    position: relative
    .cube-scroll-content
      .time-list
        display: inline-block
        white-space: nowrap
        font-size: 0
        background-color: $color-white
        .time-item
          display: inline-block
          width: 70px
          height: 45px
          line-height: 40px
          text-align: center
          font-size: 14px
          box-sizing: border-box
          border-bottom: 0px solid $color-sub
          transition: all .1s
          &.active
            border-width: 2px
</style>
