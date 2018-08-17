<template>
  <div class="student-operation-detail c-page">
    <m-header title="详情"></m-header>
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
          name: 'searchStudent'
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
  .student-operation-detail
    z-index: 50
</style>
