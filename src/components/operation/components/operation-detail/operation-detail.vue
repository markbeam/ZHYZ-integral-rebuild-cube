<template>
  <div class="operation-detail">
    <cube-scroll 
      ref="scroll"
       v-if="data.id"
      :data="[data]">
    <ul class="view-list-group basic">
      <!-- 操作类型 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-type"></i>
            操作类型
          </p>
          <p class="text" v-if="data.type">{{ data.type }}</p>
        </div>
      </li>
      <!-- 操作者 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-Man"></i>
            操作者
          </p>
          <p class="text" v-if="data.from_user.name">{{ data.from_user.name }}</p>
        </div>
      </li>
      <!-- 被操作者 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-icontab04"></i>
            被操作者
          </p>
          <p class="text" v-if="data.to_user">{{ data.to_user.name }}</p>
        </div>
      </li>
      <!-- 被操作班 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-banjiketang"></i>
            被操作班
          </p>
          <p class="text" v-if="data.to_cls.name">{{ data.to_cls.name }}</p>
        </div>
      </li>
      <!-- 内容 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-neirongyingxiao"></i>
            内容
          </p>
          <p class="text" v-if="data.content">{{ data.content }}</p>
        </div>
      </li>
      <!-- 加减个人分数 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-xinjian-"></i>
            加减个人分数
          </p>
          <p class="text">{{ padLeftZero(data.score) }}</p>
        </div>
      </li>
      <!-- 加减班级分数 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-xinjian-"></i>
            加减班级分数
          </p>
          <p class="text">{{ padLeftZero(data.cls_score) }}</p>
        </div>
      </li>
      <!-- 操作时间 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-time"></i>
            操作时间
          </p>
          <p class="text time" v-if="data.op_time">{{ data.op_time | formatDate }}</p>
        </div>
      </li>
      <!-- 创建时间 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-time"></i>
            创建时间
          </p>
          <p class="text time" v-if="data.create_time">{{ data.create_time | formatDate }}</p>
        </div>
      </li>
      <!-- 是否使用拓展积分 -->
      <li class="item">
        <div class="wrap">
          <p class="title">
            <i class="zhyz-tuozhan"></i>
            使用拓展积分
          </p>
          <p class="text time">{{ isUseExtraScoreText }}</p>
        </div>
      </li>
    </ul>
  </cube-scroll>
  </div>
</template>

<script>
  import { formatDate } from 'common/js/date'

  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    methods: {
      // 补全分数左边的符号（+ -）
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      }
    },
    filters: {
      formatDate(time) {
        time += '000'
        time = parseInt(time)
        let date = new Date(time)

        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    computed: {
      isUseExtraScoreText() {
        return this.data.more.use_score_type === 1 ? '是' : '否'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .operation-detail
    width: 100%
</style>
