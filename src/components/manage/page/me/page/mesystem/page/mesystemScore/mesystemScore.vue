<template>
  <div class="mesystem-list c-page">
    <m-header :title="mesystemData.title" back-page="/me"></m-header>
    <div class="container">
      <cube-scroll 
        :data="[field]" 
        class="mesystem-scroll">
        <!-- 十项常规展示 -->
        <ul class="view-list-group">
          <h2 class="group-title">分数</h2>
          <!-- 十项常规项目 -->
          <li class="item" 
            @click="selectedItem(item, key)"
            v-for="(item, key) in field" 
            v-if="key !== 'sum'">
            <div class="wrap">
              <p class="title">{{ item }}</p>
              <p class="text">{{ 10 + dayData[key] }}</p>
            </div>
          </li>
          <!-- 总分 -->
          <li class="item" @click="totalSelect">
            <div class="wrap">
              <p class="title">总分</p>
              <p class="text">{{ dayData['sum'] }}</p>
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    props: {
      field: { // 对照项目
        type: Object,
        default: null
      },
      dayData: { // 这一天的数据
        type: Object,
        default: null
      }
    },
    created() {
      if(!this.dayData) {
        this.$router.push({
          name: 'me'
        })
      }
    },
    methods: {
      // 单独的项目被点击
      selectedItem(item, key) {
        let tmp = Object.assign({}, this.mesystemData)
        
        Object.assign(tmp, {
          subTitle: item,
          categoryId: key
        })
        this.setMesystemData(tmp)

        this.$router.push({
          name: 'mesystemDetailList'
        })
      },
      // 这天的全部项目查看
      totalSelect(item) {
        let tmp = Object.assign({}, this.mesystemData)
        
        Object.assign(tmp, {
          subTitle: `${this.title}总分`,
          categoryId: 0
        })
        this.setMesystemData(tmp)

        this.$router.push({
          name: 'mesystemDetailList'
        })
      },
      ...mapMutations({
        setMesystemData: 'SET_MESYSTEM_DATA'
      })
    },
    computed: {
      ...mapGetters([
        'mesystemData'
      ])
    },
    components: {
      MHeader
    }
  }
</script>

<style lang="stylus" scoped>
  .mesystem-list
    z-index: 30
</style>
