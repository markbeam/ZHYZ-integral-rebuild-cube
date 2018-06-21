<template>
  <div class="me">
    <!-- 设置按钮 -->
    <div class="setting-container">
      <router-link tag="a" :to="{name: 'setting'}">
        <span class="setting-icon">
          <i class="setting zhyz-setting"></i>
        </span>
      </router-link>
    </div>
    <!-- 头像 -->
    <div class="avatar-container" 
      :style="{'background-color': personalInfo.sex === '女' ? '#ff537d' : '#53a1ff'}">
      <!-- 头部 -->
      <div class="head-top">
        <!-- 头像 女 -->
        <div class="avatar" v-if="personalInfo.sex === '女'">
          <div class="icon female"></div>
        </div>
        <!-- 头像 男 -->
        <div class="avatar" v-else>
          <div class="icon male"></div>
        </div>
        <!-- 班级 -->
        <p class="text name">{{ personalInfo.name }}</p>
      </div>
    </div>
    <div class="container">
      <!-- 管理员 -->
      <div class="administrator" v-if="personalInfo.user_type === '管理员'">
        <!-- 角色 -->
        <div class="integral-container">
          <ul class="score-list">
            <li class="bar-item">
              <p class="title">角色</p>
              <p class="score-text" v-show="!personalInfo.roles[0]">超级管理员</p>
              <p class="score-text" v-show="personalInfo.roles[0]" v-for="item in personalInfo.roles">{{ item.name }}</p>
            </li>
          </ul>
        </div>
        <!-- 功能 -->
        <div class="feature-container">
          <ul class="view-list-group basic">
            <h2 class="group-title">功能</h2>
            <!-- 查看十项常规 -->
            <li class="item" @click="viewMesystem">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-id-card"></i>
                  查看十项常规
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </li>
            <!-- 审批申请 -->
            <router-link tag="li" :to="{name: 'processapplication'}" class="item">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-icon-audit"></i>
                  审批申请
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
      <!-- 教师 -->
      <div class="administrator" v-if="personalInfo.user_type === '教师'">
        <!-- 角色 -->
        <div class="integral-container">
          <ul class="score-list">
            <!-- 基础积分 -->
            <li class="bar-item">
              <p class="title">我管理的班级</p>
              <p class="score-text">1</p>
            </li>
            <li class="bar-item">
              <p class="title">基础积分</p>
              <p class="score-text">{{ personalInfo.tea_basic_score }}</p>
            </li>
            <li class="bar-item">
              <p class="title">拓展积分</p>
              <p class="score-text">{{ personalInfo.tea_extra_score }}</p>
            </li>
          </ul>
        </div>
        <!-- 功能 -->
        <div class="feature-container">
          <ul class="view-list-group">
            <h2 class="group-title">功能</h2>
            <li class="item" @click="viewMesystem">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-bianmaguize"></i>
                  查看本班十项常规
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </li>
            <!-- 查看本班操作情况 -->
            <router-link tag="li" :to="{name: 'me'}" class="item">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-neirongyingxiao"></i>
                  查看本班操作情况
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </router-link>
            <!-- 查看本班考勤情况 -->
            <router-link tag="li" :to="{name: 'me'}" class="item">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-neirongyingxiao"></i>
                  查看本班考勤情况
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </router-link>
            <!-- 审批申请 -->
            <router-link tag="li" :to="{name: 'processapplication'}" class="item">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-icon-audit"></i>
                  审批申请
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
      <!-- 学生 -->
      <div class="student" v-if="personalInfo.user_type === '学生'">
        <!-- 积分 -->
        <div class="integral-container">
          <ul class="score-list">
            <!-- 基础积分 -->
            <li class="bar-item">
              <p class="title">总积分</p>
              <p class="score-text">{{ personalInfo.stu_total_score }}</p>
            </li>
            <li class="bar-item">
              <p class="title">已换购积分</p>
              <p class="score-text">{{ personalInfo.stu_exchange_score }}</p>
            </li>
            <li class="bar-item">
              <p class="title">目前积分</p>
              <p class="score-text">{{ currentScore }}</p>
            </li>
            <li class="bar-item">
              <p class="title">德育分</p>
              <p class="score-text">{{ personalInfo.stu_moral_edu_score }}</p>
            </li>
          </ul>
        </div>
        <!-- 功能 -->
        <div class="feature-container">
          <ul class="view-list-group">
            <h2 class="group-title">功能</h2>
            <!-- 查看班级十项常规 -->
            <li class="item" @click="viewMesystem">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-bianmaguize"></i>
                  查看班级十项常规
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </li>
            <!-- 查看本班操作情况 -->
            <router-link tag="li" :to="{name: 'me'}" class="item">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-neirongyingxiao"></i>
                  查看本班操作情况
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </router-link>
            <!-- 我的申请 -->
            <router-link tag="li" :to="{name: 'myApplication'}" class="item">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-icon-audit"></i>
                  我的申请
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </router-link>
            <!-- 查看自己的学分 -->
            <router-link tag="li" :to="{name: 'viewOwnCredit'}" class="item">
              <div class="wrap">
                <p class="title">
                  <i class="zhyz-number"></i>
                  查看我的学分
                </p>
                <p class="text">
                  <i class="zhyz-right"></i>
                </p>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
    <!-- 手动选择时弹出的选择组件 -->
    <s-ccs ref="SCcs"
      style="z-index: 11"
      :select-type="2"
      @selectedClass="selectedClass"></s-ccs>
    <transition name="slide">
      <router-view :cls="cls"></router-view>
    </transition>
  </div>
</template>

<script>
  import SCcs from 'components/operation/components/s-ccs/s-ccs'
  import { mapGetters } from 'vuex'
  
  export default {
    data() {
      return {
        cls: {}
      }
    },
    methods: {
      viewMesystem() {
        // if(this.personalInfo.user_type === '学生') {
        //   Object.assign(this.cls, {
        //     clsId: this.personalInfo.cls.id,
        //     clsName: this.personalInfo.cls.name
        //   })
        //   this.$router.push({
        //     name: 'mesystem'
        //   })
        // } else if(this.personalInfo.user_type === '教师') {
        //   this.$refs.SCcs.show()
        // } else if(this.personalInfo.user_type === '管理员') {
        //   this.$refs.SCcs.show()
        // }
        this.$refs.SCcs.show()
      },
      selectedClass(item) {
        Object.assign(this.cls, {
          clsId: item.id,
          clsName: item.name
        })
        this.$router.push({
          name: 'mesystem'
        })
      }
    },
    computed: {
      // 学生当前的积分，总分 - 以换购的积分
      currentScore() {
        return this.personalInfo.stu_total_score - this.personalInfo.stu_moral_edu_score
      },
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      SCcs
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .me
    osition: relative
    z-index: 10
    .setting-container
      position: relative
      height: 100%
      .setting-icon
        position: absolute !important
        top: 20px
        right: 20px
        z-index: 10
        extend-click()
        .setting
          font-size: $font-size-huge
          color: $color-white
    .avatar-container
      .head-top
        position: relative
        padding-top: 30px
        height: 210px
        display: flex
        align-items: center
        align-content: center
        justify-content: center
        flex-direction: column
        box-sizing: border-box
        background-color: $color-other
        .avatar
          padding-top: 5px
          width: 110px
          height: 110px
          border-radius: 50%
          box-sizing: border-box
          background-color: $color-white
          .icon
            width: 100px
            height: 100px
            margin: auto
            border-radius: 50%
            background-size: 100px 100px
            bg-image('avatar_male')
            &.male
              bg-image('avatar_male')
            &.female
              bg-image('avatar_female')
        .text
          margin-top: 8px
          font-size: $font-size-large
          color: $color-white
    .integral-container
      width: 100%
      box-shadow: 1px 2px 6px rgba(0, 0, 0, .1)
      background: $color-white
      .score-list
        padding: 10px 0
        display: flex
        text-align: center
        align-items: center
        align-content: center
        justify-content: center
        box-sizing: border-box
        .bar-item
          position: relative
          flex: 1
          &:not(:last-child)::after
            content: ''
            position: absolute
            width: 0px
            height: 70%
            transform: translate3d(0, 20%, 0)
            top: 0
            right: 0
            border-right: 1px solid $color-transparent-black-ii
          .title
            font-size: $font-size-medium
            color: $color-transparent-black-v
          .score-text
            margin-top: 5px
            color: $color-light-black
    .feature-container
      margin-top: 15px
      
</style>
