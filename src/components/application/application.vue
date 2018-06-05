<template>
  <div class="application c-page">
    <m-header title="申请" :is-show-close-icon="false"></m-header>
    <div class="container">
      <ul class="view-list-group">
        <h2 class="group-title">功能</h2>
        <!-- 请假 -->
        <router-link tag="li"
          v-if="personalInfo.user_type === '学生'"
          :to="{name: 'leave'}" 
          class="item">
          <div class="wrap">
            <p class="title">
              <i class="zhyz-qingjia"></i>
              请假
            </p>
            <p class="text">
              <i class="zhyz-right"></i>
            </p>
          </div>
        </router-link>
        <!-- 留宿申请 -->
        <router-link tag="li" 
          v-if="personalInfo.user_type === '学生'"
          :to="{name: 'application'}" 
          class="item">
          <div class="wrap">
            <p class="title">
              <i class="zhyz-fangzi"></i>
              留宿申请
            </p>
            <p class="text">
              <i class="zhyz-right"></i>
            </p>
          </div>
        </router-link>
        <!-- 设置学生假期 -->
        <router-link tag="li" 
          v-if="personalInfo.user_type === '管理员' || personalInfo.user_type === '教师'"
          :to="{name: 'setStudentLeave'}" 
          class="item">
          <div class="wrap">
            <p class="title">
              <i class="zhyz-ziyouanpai"></i>
              设置学生请假
            </p>
            <p class="text">
              <i class="zhyz-right"></i>
            </p>
          </div>
        </router-link>
        <!-- 查看本校请假情况 -->
        <li class="item" @click="viewSchollLeave">
          <div class="wrap">
            <p class="title">
              <i class="zhyz-shuju"></i>
              查看本校请假情况
            </p>
            <p class="text">
              <i class="zhyz-right"></i>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 手动选择时弹出的选择组件 -->
    <s-ccs ref="SCcs"
      style="z-index: 21"
      :select-type="1"
      @selectedCampus="selectedCampus"></s-ccs>
      <transition name="slide">
        <router-view @applySuccessful="applySuccessful"
          :campus-data="campusData"></router-view>
      </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import SCcs from 'components/operation/components/s-ccs/s-ccs'
  import { mapGetters } from 'vuex'
  import { openToast } from 'common/js/util'

  export default {
    data() {
      return {
        campusData: 2
      }
    },
    methods: {
      viewSchollLeave() {
        this.$refs.SCcs.show()
      },
      selectedCampus(item) {
        console.log(item)
        this.campusData = item
        this.$router.push({
          name: 'viewSchoolLeave'
        })
      },
      applySuccessful() {
        openToast(this, '申请成功！')
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      SCcs,
      MHeader
    }
  }
</script>

<style lang="stylus" scoped>
  .application
    z-index: 20
</style>
