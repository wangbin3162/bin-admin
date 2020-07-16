<template>
  <v-filter-bar @keyup-enter="searchHandler">
      <v-filter-item title="通知标题">
        <b-input v-model="query.title" placeholder="请输入" clearable></b-input>
      </v-filter-item>

      <v-filter-item title="通知类型">
        <b-select v-model="query.type" clearable>
          <b-option v-for="(value, key) in noticeType" :key="key" :value="key">
            {{ value }}
          </b-option>
        </b-select>
      </v-filter-item>

      <v-filter-item title="通知状态">
        <b-select v-model="query.notifyStatus" clearable>
          <b-option v-for="(value, key) in noticeStatus" :key="key" :value="key">
            {{ value }}
          </b-option>
        </b-select>
      </v-filter-item>

      <v-filter-item @on-search="searchHandler" @on-reset="resetQueryHandler">
      </v-filter-item>

    </v-filter-bar>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'NoticeMgmtTableSearch',
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        query: this.value
      }
    },
    watch: {
      value: {
        handler (newVal, oldVal) {
          this.query = newVal
        },
        deep: true
      },
      query: {
        handler (newVal, oldVal) {
          this.$emit('input', newVal)
        },
        deep: true
      }
    },
    computed: {
      ...mapState({
        noticeType: state => state.noticeMgmt.noticeType,
        noticeStatus: state => state.noticeMgmt.noticeStatus
      })
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 搜索按钮回调
       */
      searchHandler () {
        this.$emit('search', this.query)
      },
      /**
       * @author haodongdong
       * @description 重置按钮回调
       */
      resetQueryHandler () {
        this.query.title = ''
        this.query.type = ''
        this.query.notifyStatus = ''
        this.query.size = 10
        this.query.page = 1
        // 如果以this.query = {}的形式给query赋值，watch内发出的input事件会慢于以下的reset事件
        this.$emit('reset', this.query)
      }

    }
  }
</script>
