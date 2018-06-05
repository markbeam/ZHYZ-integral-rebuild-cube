<template>
  <div class="feature c-page">
    <m-header title="小功能" :is-show-close-icon="false"></m-header>
    <div class="container">
      <ul class="view-list-group">
        <h2 class="group-title">功能</h2>
        <!-- 请假 -->
        <router-link tag="li"
          :to="{name: 'randomSelect'}" 
          class="item">
          <div class="wrap">
            <p class="title">
              <i class="zhyz-qingjia"></i>
              随机抽人
            </p>
            <p class="text">
              <i class="zhyz-right"></i>
            </p>
          </div>
        </router-link>
      </ul>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'

  export default {
    data() {
      return {

      }
    },
    components: {
      MHeader
    }
  }
</script>

<style lang="stylus" scoped>
  .feature
    z-index: 20
</style>
