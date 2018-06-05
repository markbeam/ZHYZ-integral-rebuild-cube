<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="stylus">
  @import "~common/stylus/index"
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  
  #app
    width: 100%
    height: 100%
    // 各个页面初始样式
    .c-page
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background-color: $color-background
    .view-list-group
      margin-bottom: 20px
      &:first-child
        margin-top: 15px
      .group-title
        margin: 0 10px 5px
        font-size: $font-size-small
        color: $color-light-gray
      .item
        padding-left: 15px
        font-size: $font-size-medium-x
        box-sizing: border-box
        background-color: $color-white
        &:active
          background-color: $color-item-active !important
        &:not(:last-child)
          .wrap
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
        .wrap
          position: relative
          padding: 14px 14px 14px 2px
          width: 100%
          height: 100%
          display: flex
          align-items: center
          justify-content: space-between
          box-sizing: border-box
          overflow: hidden
          &.exit
            padding: 16px
            text-align: center              
            .title
              color: $color-exit
          .title
            flex: 1
            color: $color-light-black
            [class^="zhyz-"], [class*=" zhyz-"]
              font-size: $font-size-large
          .text
            flex: 1
            text-align: right
            color: $color-transparent-black-v
            &.switch
              flex: 0 0 76px
              width: 76px
    .cube-slide
        width: 100%
        height: 100%
        .cube-slide-item
          img
            width: 100% !important
            height: 100%
    .loading-container, .no-result-container
      position: relative
      top: 40%
      left: 50%
      transform: translate3d(-50%, -50%, 0)
    .cube-btn-light
      color: $color-white
      background-color: $color-sub
      &:active
        background-color: @color-active !important
    span.selected
      color: $color-main !important
    .time-bar
      .cube-scroll-content
        padding-bottom: 0
        display: inline-block !important
    .cube-dialog-btn_highlight
      color: $color-exit !important
    .cube-index-list-content, .cube-scroll-content
      padding-bottom: 30px
    .view-own-credit
      .cube-scroll-content
        padding-bottom: 125px
        .cube-scroll-list-wrapper
          padding-bottom: 125px
    .slide-enter-active, .slide-leave-active {
      transition: all .3s ease
    }
    .slide-enter, .slide-leave-to {
      transform: translate3d(100%, 0, 0)
    }
    .scale-enter-active, .scale-leave-active {
      transition: all .3s ease-out
    }
    .scale-enter, .scale-leave-to {
      opacity: 0
      transform: translate3d(0, 100%, 0)
    }
</style>
