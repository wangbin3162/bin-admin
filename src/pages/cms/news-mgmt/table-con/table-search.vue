<template>
  <v-filter-bar @keyup-enter="searchHandler">
      <v-filter-item title="新闻标题" :span="8">
        <b-input v-model="query.test" placeholder="请输入"></b-input>
      </v-filter-item>

      <v-filter-item title="内容类型" :span="8">
        <b-select>
        </b-select>
      </v-filter-item>

      <v-filter-item @on-search="searchHandler" @on-reset="resetQueryHandler" :span="8"
        :show-toggle="true" :is-opened="filterOpened"
        @on-toggle="filterOpened=!filterOpened">
      </v-filter-item>

      <collapse-transition>
        <div v-show="filterOpened" style="width: 100%;">
          <v-filter-item title="内容状态" :span="8">
            <b-select>
            </b-select>
          </v-filter-item>

          <v-filter-item title="发布时间" :span="8">
            <b-date-picker type="daterange" placement="bottom-start"
              placeholder="请选择发布时间">
            </b-date-picker>
          </v-filter-item>
        </div>
      </collapse-transition>
    </v-filter-bar>
</template>

<script>
  export default {
    name: 'newsMgmtTableSearch',
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        filterOpened: false,
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
        }
      }
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
        this.$emit('reset', this.query)
      }
    }
  }
</script>
