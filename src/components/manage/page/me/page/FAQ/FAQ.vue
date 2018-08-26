<!-- Frequently Asked Questions -->
<template>
  <div class="faq c-page">
    <m-header title="FAQ"></m-header>
    <div class="container" v-if="qData">
      <cube-button @click.native="showActionSheet">{{ selectedPicker.pickerActiveText || '点击选择问题类型' }}</cube-button>
      <cube-scroll :data="qData">
        <ul class="q-list">
          <li class="item" v-for="item in qData"
            :key="item.id">
            <div class="wrap">
              <h2 class="title">
                <span class="prefix-text">Q: </span>
                <span class="text">{{ item.title }}</span>
              </h2>
              <p class="answer">
                <span class="prefix-text">A: </span>
                <span class="text">{{ item.answer }}</span>
              </p>       
            </div>    
          </li>
        </ul>          
      </cube-scroll>
    </div>
    <!-- Loading box -->
    <div class="loading-container" 
      v-show="!qData">
      <loading></loading>
    </div>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import Loading from 'base/loading/loading'
  import { ERR_OK } from 'api/config'
  import { getFAQ } from 'api/index'

  export default {
    data() {
      return {
        qData: null,
        selectedPicker: {
          pickerActiveText: '新生指引',
          pickerActiveIndex: 0,
          pickerActiveValue: 0
        }
      }
    },
    created() {
      this._getFAQ()
    },
    methods: {
      showActionSheet() {
        this.$createActionSheet({
          title: '请选择',
          active: this.selectedPicker.pickerActiveIndex,
          data: [
            {
              content: '新生指引',
              value: 1
            },
            {
              content: '常规',
              value: 2
            },
            {
              content: '教学',
              value: 3
            }
          ],
          onSelect: (item, index) => {
            this.selectedPicker.pickerActiveIndex = index
            this.selectedPicker.pickerActiveText = item.content
            this.selectedPicker.pickerActiveValue = item.value
            
            // update FAQ data
            this._getFAQ()
            
            this.$createToast({
              txt: `选择 ${item.content}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      },
      _getFAQ() {
        this.qData = null
        getFAQ(this.selectedPicker.pickerActiveText).then((res) => {
          if(res.code === ERR_OK) {
            this.qData = res.data
          }
        })
      }
    },
    components: {
      MHeader,
      Loading
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  
  .faq
    z-index: 20
    .container
      height: 100%
      .q-list
        overflow: hidden
        font-size: $font-size-large
        .item
          &:not(:last-child)
            .wrap
              &:after
                content: ''
                position: absolute
                bottom: 0
                left: 0
                right: 0
                height: 1px
                color: $color-border
                border-bottom: 1px solid $color-border
                box-sizing: border-box
                transform-origin: 0 0
                transform: scaleY(0.5)
          .wrap
            position: relative
            padding: 30px 15px
            width: 100%
            height: 100%
            .title
              margin-bottom: 10px
</style>
