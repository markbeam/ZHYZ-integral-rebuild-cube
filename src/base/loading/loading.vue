<template>
  <div class="loading">
    <div class="loader"></div>
    <p class="desc">{{ title }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '正在吐血加载中...'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .loading
    position: relative
    width: 100%
    text-align: center
    z-index: 100
    .desc
      margin-top: 15px
      font-size: $font-size-medium
      color: $color-light-black
    .loader
      position: relative
      left: 50%
      width: 2.5em
      height: 2.5em
      transform: rotate(165deg)
      transform: translate3d(-50%, 0 ,0 )
    .loader:before, .loader:after
      content: ''
      position: absolute
      top: 50%
      left: 50%
      display: block
      width: 0.5em
      height: 0.5em
      border-radius: 0.25em
      transform: translate(-50%, -50%)
    .loader:before
      animation: before 2s infinite
    .loader:after
      animation: after 2s infinite

    @keyframes before
      0%
        width: 0.5em
        box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75)
      35%
        width: 2.5em
        box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75)
      70%
        width: 0.5em
        box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75)
      100%
        box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75)
    @keyframes after
      0%
        height: 0.5em
        box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75)
      35%
        height: 2.5em
        box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75)
      70%
        height: 0.5em
        box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75)
      100%
        box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75)

</style>
