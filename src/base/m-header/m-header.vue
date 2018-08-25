<template>
  <div class="sub-header">
    <div class="back">
      <i class="icon zhyz-right" @click.prevent.stop="back"></i>
      <span v-if="isShowCloseIcon">
        <div class="split-line"></div>
        <router-link tag="i" :to="{name: backPage}" class="zhyz-delete go-to-home"></router-link>
      </span>
    </div>
    <h2 class="title">{{ title }}</h2>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      isShowCloseIcon: {
        type: Boolean,
        default: false
      },
      backPage: {
        type: String,
        default: 'index'
      }
    },
    methods: {
      back() {
        this.$router.back()
      }
    }
  }
</script>
  
<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .sub-header
    position: relative
    width: 100%
    height: 50px
    box-shadow: 0px 1px 2px $color-transparent-black-i
    color: $color-head
    background-color: $color-white
    .back
      position: absolute
      top: 0
      left: 0px
      font-size: 0
      i
        transition: all .3s
        &:active
          background: #dedede
      .icon
        display: inline-block
        padding: 14px 16px
        transform: rotate(180deg)
        font-size: $font-size-large-x
        vertical-align: middle
      .go-to-home
        padding: 11px 13px
        display: inline-block
        font-size: 28px
        vertical-align: middle
      .split-line
        display: inline-block
        vertical-align: middle
        width: 1px
        height: 30px
        background-color: rgba(0, 0, 0, .4)
        transform: scale(0.5, 1)
    .title 
      position: absolute
      left: 50%
      transform: translateX(-50%)
      color: #555
      font-weight: bold
      no-wrap()
      text-align: center
      line-height: 50px
      font-size: $font-size-large
    
</style>

