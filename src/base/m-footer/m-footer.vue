<template>
  <div class="m-footer">
    <div class="tab">
      <router-link tag="div" class="index tab-item" to="/index">
        <i class="icon zhyz-home"></i>
        <span class="tab-link">首页</span>
      </router-link>
      <router-link tag="div" class="me tab-item" to="/me">
        <i class="icon zhyz-me"></i>
        <span class="tab-link">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  // 默认蓝色
  $active-font-color = #46a6ff
  .m-footer
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    background-color: $color-white
    z-index: 10
    .tab
      display: flex
      align-items: center
      align-content: center
      justify-content: center
      height: 52px
      box-shadow: 1px -1px 15px rgba(0, 0, 0, .1)
      font-size: $font-size-medium
      .tab-item
        flex: 1
        text-align: center
        color: $color-light-black
        .icon
          display: block
          margin: 0 0 4px
          font-size: $font-size-large-x
        .tab-link
          padding-bottom: 5px
        &.router-link-active
          color: $active-font-color
</style>
