<template>
  <div class="history-list">
    <h1 class="title">
      <span class="text">最常使用</span>
    </h1>
    <ul>
      <li class="history-item" 
        @click="selectItem(item)" 
        v-if="index < 5"
        v-for="(item, index) in historyList">
        <span class="text">{{ item.to_cls.name }}</span>
        <span class="icon">
          <i class="zhyz-dot"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  import { getOftenOperateClassList } from 'api/operation'

  export default {
    data() {
      return {
        historyList: null
      }
    },
    created() {
      this._getOftenOperateClassList()
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      _getOftenOperateClassList() {
        getOftenOperateClassList().then((res) => {
          this.historyList = res
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .history-list
    padding: 0 10px
    .title
      display: flex
      align-items: center
      height: 40px
      font-size: $font-size-medium
      color: $color-transparent-black-viii
      .text
        flex: 1
      .clear
        extend-click()
        .zhyz-clear
          font-size: $font-size-medium
          color: $color-transparent-black-v
    .history-item
      display: flex
      align-items: center
      height: 45px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-transparent-black-v
      .icon
        extend-click()
        .zhyz-dot
          font-size: $font-size-small
          color: $color-transparent-black-viii
</style>
