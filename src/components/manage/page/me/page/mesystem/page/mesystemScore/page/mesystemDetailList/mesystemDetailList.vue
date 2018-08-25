<template>
  <div class="operation-detail c-page">
    <m-header :title="mesystemData.subTitle" 
      :is-show-close-icon="true"
      back-page="me"></m-header>
    <div class="container">
      <mesystem-list @selected="selected"></mesystem-list>
    </div>
    <transition name="slide">
      <router-view :data="detailData"></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import MesystemList from 'components/manage/components/mesystem-list/mesystem-list'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        detailData: null
      }
    },
    created() {
      if(!this.mesystemData) {
        this.$router.push({
          name: 'me'
        })
      }
    },
    methods: {
      selected(item) {
        this.detailData = item
        this.$router.push({
          name: 'mesystemDetail'
        })
      }
    },
    computed: {
      ...mapGetters([
        'mesystemData'
      ])
    },
    components: {
      MHeader,
      MesystemList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .operation-detail
    z-index: 20
    .container
      width: 100%
      height: 100%
      & > div
        width: 100%
        height: 100%
</style>