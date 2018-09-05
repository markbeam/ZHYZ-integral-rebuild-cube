<template>
  <div class="index">
    <div class="m-header">
      <div class="icon"></div>
      <h1 class="text">一职德育积分系统</h1>
    </div>
    <div class="container">
      <cube-scroll ref="scroll">
        <!-- 轮播图 -->
        <div class="banner">
          <cube-slide :data="baseList"
                      loop
                      auto-play
                      :interval="3000"></cube-slide>
        </div>
        <!-- 功能按钮 -->
        <div class="btn-container">
          <div class="btn-title-container">
            <h3 class="btn-box-title">所有应用</h3>
          </div>
          <ul class="btn-list"
              v-for="menu in mineMenu">
            <li class="item">
              <router-link tag="div"
                           class="wrap"
                           :name="menu.routeLink.attrs.name"
                           :to="menu.routeLink.attrs.to">
                <!-- icon 图片 -->
                <div class="icon"
                     :class="menu.icon"></div>
                <p class="text">{{ menu.text }}</p>
              </router-link>
            </li>
          </ul>
        </div>
        <!-- 占位 -->
        <div style="height: 116px"></div>
      </cube-scroll>
    </div>
    <transition name="slide">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="slide">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  const menuList = [
    {
      id: 'operate-student',
      text: '操作学生',
      icon: 'ic-operate-student',
      routeLink: {
        attrs: {
          to: {
            name: 'operateStudent'
          }
        }
      }
    },
    {
      id: 'search-student',
      text: '查询学生',
      icon: 'ic-search-student',
      routeLink: {
        attrs: {
          name: 'disableAlive',
          to: {
            name: 'searchStudent'
          }
        }
      }
    },
    {
      id: 'operate-detail',
      text: '操作详情',
      icon: 'ic-operate-detail',
      routeLink: {
        attrs: {
          to: {
            name: 'personalOperationDetailList'
          }
        }
      }
    },
    {
      id: 'apply',
      text: '申请',
      icon: 'ic-apply',
      routeLink: {
        attrs: {
          to: {
            name: 'application'
          }
        }
      }
    },
    {
      id: 'operate-class',
      text: '操作班级分',
      icon: 'ic-operate-class',
      routeLink: {
        attrs: {
          to: {
            name: 'operateClass'
          }
        }
      }
    },
    {
      id: 'rank',
      text: '积分排行榜',
      icon: 'ic-rank',
      routeLink: {
        attrs: {
          to: {
            name: 'rank'
          }
        }
      }
    },
    {
      id: 'feature',
      text: '小功能',
      icon: 'ic-feature',
      routeLink: {
        attrs: {
          to: {
            name: 'feature'
          }
        }
      }
    }
  ]

  export default {
    data() {
      return {
        baseList: [{
          url: 'javascript:',
          image: 'static/school-bg1.jpg'
        }, {
          url: 'javascript:',
          image: 'static/school-bg2.jpg'
        }, {
          url: 'javascript:',
          image: 'static/school-bg3.jpg'
        }],
        mineMenu: []
      }
    },
    created: function() {
      this._initMenu()
    },
    watch: {
      personalInfo: {
        handler: function(val, oldval) {
          this._initMenu()
        }
      }
    },
    methods: {
      _initMenu: function() {
        let lists = []

        switch (this.personalInfo.user_type) {
          case '用户':
            lists = lists.concat([
              'search-student',
              'operate-student',
              'operate-class',
              'operate-detail',
              'apply',
              'rank',
              'feature'
            ])
            break

          case '教师':
            lists = lists.concat([
              'operate-student',
              'search-student',
              'operate-detail',
              'apply',
              'rank',
              'feature'
            ])
            break

          case '学生':
            lists = lists.concat([
              'search-student',
              'operate-detail',
              'apply',
              'rank',
              'feature'
            ])
            break

          default:
            lists = lists.concat([
              'rank',
              'feature'
            ])
            break
        }

        this.mineMenu = []

        // 处理每个用户类型的按钮
        for(let i in lists) {
          for(let j1 in menuList) {
            if(lists[i] === menuList[j1].id) {
              this.mineMenu.push(menuList[j1])
              break
            }
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {}
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .index
    position: relative
    height: 100vh
    overflow: hidden
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
          width: 50px
          font-size: 20px
          color: $color-light-black
          line-height: 50px
    .banner
      width: 100%
      height: 120px
      overflow: hidden
    .container
      height: 100%
    .btn-container
      margin: 14px 14px 0
      padding-bottom: 22px
      background: #ffffff
      border-radius: 16px
      overflow hidden
      box-shadow: 0 0 15px rgba(0, 0, 0, .1)
      .btn-title-container
        padding-left: 14px
        border-bottom: 1px solid #eee
        line-height: 40px
        .btn-box-title
          font-size: 16px
          font-weight: 700
      .btn-list
        box-sizing: border-box
        .item
          float: left
          width: 25%
          box-sizing: border-box
          text-align: center
          &:active
            box-shadow: 0 10px 20px $color-transparent-black-i
          .wrap
            padding: 22px 0 0
            .icon
              height: 30px;
              background-size: auto 100%;
              background-position: center;
              background-repeat: no-repeat;
              &.ic-operate-student
                bg-image('student')
              &.ic-operate-class
                bg-image('class')
              &.ic-search-student
                bg-image('search1')
              &.ic-operate-detail
                bg-image('detail')
              &.ic-apply
                bg-image('leave')
              &.ic-feature
                bg-image('feature')
              &.ic-rank
                bg-image('rank')
            .text
              /*margin-top: 14px;*/
              margin-top: 16px;
              text-align: center;
              /*font-weight: 700;*/
              font-size: 14px
              text-overflow: ellipsis;
              white-space: nowrap;
</style>
