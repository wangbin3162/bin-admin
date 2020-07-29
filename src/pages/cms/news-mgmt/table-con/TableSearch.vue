<template>
  <v-filter-bar @keyup-enter="searchHandler">
      <v-filter-item title="新闻标题" :span="8">
        <b-input v-model="query.title" placeholder="请输入" clearable></b-input>
      </v-filter-item>

      <v-filter-item title="新闻类型" :span="8">
        <b-select v-model="query.contentType" clearable>
          <b-option v-for="(value, key) in contentType" :key="key" :value="key">
            {{ value }}
          </b-option>
        </b-select>
      </v-filter-item>

      <v-filter-item @on-search="searchHandler" @on-reset="resetQueryHandler" :span="8"
        :show-toggle="true" :is-opened="filterOpened"
        @on-toggle="filterOpened=!filterOpened">
      </v-filter-item>

      <collapse-transition>
        <div v-show="filterOpened" style="width: 100%;">
          <v-filter-item title="新闻状态" :span="8">
            <b-select v-model="query.contentStatus" clearable>
              <b-option v-for="(value, key) in contentStatus" :key="key" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item>

          <v-filter-item title="发布时间" :span="8">
            <b-date-picker v-model="dateStrArr" type="datetimerange" placement="bottom-start"
              @on-change="dateChangeHandler"
              placeholder="请选择发布时间">
            </b-date-picker>
          </v-filter-item>
        </div>
      </collapse-transition>
    </v-filter-bar>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'NewsMgmtTableSearch',
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        filterOpened: false,
        query: this.value,
        dateStrArr: []
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
        contentType: state => state.newsMgmt.contentType,
        contentStatus: state => state.newsMgmt.contentStatus
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
        this.dateStrArr = []
        this.$emit('reset', this.query)
      },

      /**
       * @author haodongdong
       * @description 时间选择组件时间改变回调
       * @param {string[]} dateStrArr 包含开始于结束日期时间字符串的数组
       */
      dateChangeHandler (dateStrArr) {
        this.query.publishDateStart = dateStrArr[0]
        this.query.publishDateEnd = dateStrArr[1]
      }
    }
  }
</script>
