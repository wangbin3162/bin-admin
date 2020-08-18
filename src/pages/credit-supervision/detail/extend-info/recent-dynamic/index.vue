<template>
  <div class="recent-dynamic">
    <b-card shadow="never">
      <template v-slot:header>
        <div flex="main:justify cross:center">
          <span>企业关联图谱</span>
          <b-button type="text">
            全屏查看 >>
          </b-button>
        </div>
      </template>

      <div v-for="o in 4" :key="o" class="text item">
        {{'这是内容区域 ' + o }}
      </div>
    </b-card>

    <b-card head-tip shadow="never"
      :bordered="false" divider="no"
      :body-style="{ padding: 0 }"
      class="mt-20">
      <template v-slot:header>
        <div flex="main:justify cross:center">
          <span>近期动态</span>
          <span class="tip-text">
            近{{ query.month }}月内动态
          </span>
        </div>
      </template>

      <b-table :columns="columns" :data="list">
        <template v-slot:action>
          <b-button type="text">
            查看
          </b-button>
        </template>
      </b-table>

     <div flex="main:right" class="mt-20 mb-5">
        <b-page :total="total" show-elevator
          @on-change="handlePageChange">
        </b-page>
     </div>
    </b-card>
  </div>
</template>

<script>
  import { getPersonDynamic } from '@/api/credit-supervision/detail.api'

  export default {
    name: 'RecentDynamic',
    data () {
      return {
        total: 0,
        query: {
          id: '',
          type: '',
          month: 1,
          size: 10,
          page: 1
        },
        columns: [
          { title: '资源名称', key: 'resourceName' },
          { title: '资源性质', key: '' },
          { title: '创建部门', key: 'createDept' },
          { title: '创建日期', key: 'createDate' },
          { title: '操作', slot: 'action', width: 70 }
        ],
        list: []
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 一些初始化处理
       */
      init () {
        const query = this.$route.query
        this.query.id = query.id
        this.query.type = query.type
        this.getPersonDynamic(this.query)
      },

      /**
       * @author haodongdong
       * @descriptoin 获取近期动态
       * @param {Object} query 查询参数对象
       * @param {string} query.id 主体id
       * @param {number} query.type 主体类型 1 法人 2 自然人
       * @param {string} query.month 查询月数
       * @param {number} query.size 分页大小
       * @param {number} query.page 当前页
       */
      async getPersonDynamic (query) {
        try {
          const res = await getPersonDynamic(query)
          this.total = res.total
          this.list = res.rows
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @description 分页组件页面改变回调
       * @param {number} page 当前页
       */
      handlePageChange (page) {
        this.query.page = page
        this.getPersonDynamic(this.query)
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .recent-dynamic {
   .tip-text {
     color: #8c8c8c;
   }
 }
</style>
