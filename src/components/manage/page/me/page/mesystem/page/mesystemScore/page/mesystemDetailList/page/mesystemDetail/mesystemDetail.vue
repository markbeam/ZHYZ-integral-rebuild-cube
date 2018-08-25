<template>
  <div class="personal-operation-detail c-page">
    <m-header title="详情"
    :is-show-close-icon="true"
    back-page="me"></m-header>
    <div class="container">
      <operation-detail :data="data"></operation-detail>
    </div>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import OperationDetail from 'components/operation/components/operation-detail/operation-detail'

  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    created() {
      if(!this.data) {
        this.$router.push({
          name: 'me'
        })
      }
    },
    components: {
      MHeader,
      OperationDetail
    }
  }
</script>

<style lang="stylus" scoped>
  .personal-operation-detail
    z-index: 30
</style>
