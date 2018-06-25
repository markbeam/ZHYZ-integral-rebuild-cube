<template>
  <div class="index">
    <div class="m-header">
      <div class="icon"></div>
      <h1 class="text">一职德育积分系统</h1>
    </div>
    <div class="container">
      <cube-scroll 
        ref="scroll"
        :data="[personalInfo]">
        <!-- 轮播图 -->
        <div class="banner">
          <cube-slide :data="baseList"
            loop
            auto-play
            :interval="3000"></cube-slide>
        </div>
        <!-- 功能按钮 用户 & 教师 -->
        <div class="btn-container"
          v-if="personalInfo.user_type === '教师' || personalInfo.user_type === '用户'">
          <ul class="btn-list">
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'operateStudent'}">
                <!-- icon 图片 -->
                <div class="icon ic-operate-student"></div>
                <p class="text">操作学生</p>
              </router-link>
            </li>
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'searchStudent'}">
                <!-- icon 图片 -->
                <div class="icon ic-search-student"></div>
                <p class="text">查询学生</p>
              </router-link>
            </li>
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'personalOperationDetailList'}">
                <!-- icon 图片 -->
                <div class="icon ic-operate-detail"></div>
                <p class="text">操作详情</p>
              </router-link>
            </li>
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'application'}">
                <!-- icon 图片 -->
                <div class="icon ic-apply"></div>
                <p class="text">申请</p>
              </router-link>
            </li>
          </ul>
          <!-- 2 -->
          <ul class="btn-list">
            <!-- 操作班级积分 -->
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'operateClass'}">
                <!-- icon 图片 -->
                <div class="icon ic-operate-student"></div>
                <p class="text">操作班级积分</p>
              </router-link>
            </li>
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'rank'}">
                <!-- icon 图片 -->
                <div class="icon ic-apply"></div>
                <p class="text">积分排行榜</p>
              </router-link>
            </li>
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'feature'}">
                <!-- icon 图片 -->
                <div class="icon ic-feature"></div>
                <p class="text">小功能</p>
              </router-link>
            </li>
          </ul>
        </div>
        <!-- 功能按钮 学生 -->
        <div class="btn-container"
          v-if="personalInfo.user_type === '学生'">
          <ul class="btn-list">
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'searchStudent'}">
                <!-- icon 图片 -->
                <div class="icon ic-search-student"></div>
                <p class="text">查询学生</p>
              </router-link>
            </li>
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'personalOperationDetailList'}">
                <!-- icon 图片 -->
                <div class="icon ic-operate-detail"></div>
                <p class="text">操作详情</p>
              </router-link>
            </li>
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'application'}">
                <!-- icon 图片 -->
                <div class="icon ic-apply"></div>
                <p class="text">申请</p>
              </router-link>
            </li>
          </ul>
          <!-- 2 -->
          <ul class="btn-list">
            <!-- 小功能 -->
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'feature'}">
                <!-- icon 图片 -->
                <div class="icon ic-feature"></div>
                <p class="text">小功能</p>
              </router-link>
            </li>
            <li class="item">
              <router-link tag="div" 
                class="wrap"
                :to="{name: 'rank'}">
                <!-- icon 图片 -->
                <div class="icon ic-search-student"></div>
                <p class="text">积分排行榜</p>
              </router-link>
            </li>
          </ul>
        </div>
      </cube-scroll>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        baseList: [{
          url: 'javascript:',
          image: 'http://www.zhyz.net.cn/service?wdApplication=nr&wdService=nr.getData&path=/xw/data/uploadData/2016/10/18/1476758943632/clip_image001.jpg'
        }, {
          url: 'javascript:',
          image: 'http://www.zhyz.net.cn/service?wdApplication=nr&wdService=nr.getData&path=/xw/data/uploadData/2016/10/18/1476758852343/clip_image001.jpg'
        }, {
          url: 'javascript:',
          image: 'http://www.zhyz.net.cn/service?wdApplication=nr&wdService=nr.getData&path=/xw/data/uploadData/2016/10/18/1476759204737/clip_image001.jpg'
        }]
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .index
    position: relative
    z-index: 10
    .m-header
      position: relative
      height: 50px
      text-align: center
      color: $color-light-black
      background-color: $color-white
      box-shadow: 1px 2px 5px rgba(0, 0, 0, .1)
      font-size: 0
      .icon
        display: inline-block
        vertical-align: top
        margin-top: 6px
        width: 36px
        height: 36px
        margin-right: 9px
        bg-image('logo')
        background-size: 36px 36px
      .text
        display: inline-block
        vertical-align: top
        line-height: 50px
        font-size: $font-size-large
      .mine
        position: absolute
        top: 0
        right: 0
        .icon-mine
          display: block
          padding: 12px
          font-size: 20px
          color: $color-light-black
    .banner
      width: 100%
      height: 207px
      overflow: hidden
    .btn-container
      margin-top: 6px
      padding: 0 5px;
      .btn-list
        margin-bottom: 3px
        width: 100%
        display: flex
        align-items: center
        justify-content: space-between
        box-sizing: border-box
        .item
          flex: 1
          box-sizing: border-box
          border-radius: 2px
          text-align: center
          background-color: $color-white
          transition: box-shadow .3s
          &:active
            box-shadow: 0 10px 20px $color-transparent-black-i
          &:not(:last-child)
            margin-right: 3px
          .wrap
            padding: 16px 0 22px
            .icon
              width: 100%;
              height: 50px;
              background-size: 45px 45px;
              background-position: center;
              background-repeat: no-repeat;
              &.ic-operate-student 
                bg-image('inputNum')
              &.ic-search-student
                bg-image('search')
              &.ic-operate-detail
                bg-image('detail')
              &.ic-apply
                bg-image('apply')
              &.ic-feature
                bg-image('feature')
            .text
              margin-top: 15px;
              text-align: center;
              font-weight: 700;
</style>
