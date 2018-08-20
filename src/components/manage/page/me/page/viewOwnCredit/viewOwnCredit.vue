<template>
  <div class="view-own-credit c-page">
    <m-header title="查看我的学分" :is-show-close-icon="false"></m-header>
    <div class="container">
      <div class="btn-container">
        <cube-button @click="selectedTerm">点击选择学期 {{ '- ' + selectedPicker.pickerActiveText }}</cube-button>
      </div>
      <cube-scroll 
        ref="scroll"
        style="padding-bottom: 120px"
        :data="creditList">
        <ul class="view-list-group-multiple" 
          :key="item.id"
          v-for="(item, index) in creditList"
          v-if="index === selectedPicker.pickerActiveIndex">
          <h2 class="group-title">{{ item.term }}</h2>
          <h3 class="group-subtitle">当前总学分（全部）：{{ totalCredit }}</h3>
          <!-- 查看本班十项常规 -->
          <li class="item" :key="subData.id"
            v-for="subData in item.data">
            <div class="wrap">
              <p class="title">
                <i class="zhyz-number1"></i>
                {{ subData.KC }}
              </p>
              <div class="sub-wrap">
                <p class="exam">
                  <span class="subject">平时：</span>
                  <span class="score">{{ subData.PS }}</span>
                </p>
                <p class="exam">
                  <span class="subject">期中：</span>
                  <span class="score">{{ subData.QZ }}</span>
                </p>
              </div>
              <div class="sub-wrap">
                <p class="exam">
                  <span class="subject">期末：</span>
                  <span class="score">{{ subData.QM }}</span>
                </p>
                <p class="exam">
                  <span class="subject">总评：</span>
                  <span class="score">{{ subData.ZP }}</span>
                </p>
              </div>
              <div class="sub-wrap">
                <p class="credit-score">
                  <span class="subject">学分：</span>
                  <span class="score">{{ subData.CREDIT }}</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
  import MHeader from 'base/m-header/m-header'
  import { ERR_OK } from 'api/config'
  import { getStudentCreditById } from 'api/index'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        creditList: null,
        tremSelectList: [],
        totalCredit: 0,
        selectedPicker: {
          pickerActiveIndex: 0,
          pickerActiveText: ''
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this._getStudentCreditById()
      })
    },
    methods: {
      selectedTerm() {
        this.$createActionSheet({
          title: '请选择学期',
          active: this.selectedPicker.pickerActiveIndex,
          data: this.tremSelectList,
          onSelect: (item, index) => {
            this.selectedPicker.pickerActiveIndex = index
            this.selectedPicker.pickerActiveText = item.content
            this.$createToast({
              txt: `选择 ${item.content}`,
              type: 'correct',
              time: 1000
            }).show()
          }
        }).show()
      },
      figureCredit(data) {
        let tmpTotalCredit = 0
        for(let i of data) {
          for(let j of i.data) {
            tmpTotalCredit += parseInt(j.CREDIT ? j.CREDIT : '0')
          }
        }
        this.totalCredit = tmpTotalCredit
      },
      _getStudentCreditById() {
        getStudentCreditById(this.personalInfo.number).then((res) => {
          if(res.code === ERR_OK) {
            this.creditList = res.data
            for(let i of res.data) {
              this.tremSelectList.push({
                content: i.term
              })
            }
            this.figureCredit(res.data)
          }
        })
      }
    },
    filters: {
      filterText(text) {
        let arr = text.split('#')
        return arr[1]
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      MHeader
    },
    watch: {
      personalInfo() {
        this._getStudentCreditById()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .view-own-credit
    z-index: 20
    .container
      width: 100%
      height: 100%
      .btn-container
        margin: 15px 0 15px
      .view-list-group-multiple
        width: 100%
        .group-title, .group-subtitle
          padding: 0 0 10px
          text-align: center
          font-size: $font-size-large
          color: $color-light-black
        .group-subtitle
          font-size: $font-size-medium-x
        .item
          padding-left: 15px
          background-color: $color-white
          &:active
            background-color: $color-item-active !important
          &:not(:first-child)
            .wrap
              &:after
                content: ''
                position: absolute
                top: 0
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
            padding: 10px 0 10px
            .title
              margin-bottom: 6px
              font-size: $font-size-large
            .sub-wrap
              padding: 2px 0
              display: flex
              align-items: center
              justify-content: space-between
              box-sizing: border-box
              overflow: hidden
              .exam
                flex: 1
</style>
