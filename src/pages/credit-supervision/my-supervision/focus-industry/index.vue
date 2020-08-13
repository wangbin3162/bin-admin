<template>
  <div class="market-supervision">
    <div class="header">
      <span>一共10条数据</span>

      <b-button type="text" @click="open = true">
        + 添加监管
      </b-button>
    </div>

    <b-table :columns="columns" :data="list" class="m15">
      <template v-slot:d>
        <b-button type="text">
          取消监管
        </b-button>
      </template>
    </b-table>

    <div flex="main:right" class="mr-15">
      <b-page :total="total"
        :current.sync="query.page"
        :page-size="query.size"
        @on-change="handlePageChange">
      </b-page>
    </div>

    <add-supervision v-model="open"></add-supervision>
  </div>
</template>

<script>
  import AddSupervision from '@/pages/credit-supervision/my-supervision/focus-industry/AddSupervision'

  export default {
    name: 'FocusIndustrSupervision',
    props: {

    },
    components: {
      AddSupervision
    },
    data () {
      return {
        open: false,
        total: 0,
        query: {
          size: 10,
          page: 1
        },
        list: [
          { a: '建筑', b: '700', c: '15%' },
          { a: '建筑', b: '700', c: '15%' },
          { a: '建筑', b: '700', c: '15%' },
          { a: '建筑', b: '700', c: '15%' },
          { a: '建筑', b: '700', c: '15%' },
          { a: '建筑', b: '700', c: '15%' },
          { a: '建筑', b: '700', c: '15%' }
        ],
        columns: [
          { type: 'index', width: 50 },
          { title: '行业名称', key: 'a' },
          { title: '黑名单数量', key: 'b' },
          { title: '占比', key: 'c' },
          { title: '操作', slot: 'd' }
        ]
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 分页组件页面切换回调
       */
      handlePageChange () {

      }
    }
  }
</script>

<style lang="stylus" scoped>
  .market-supervision {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      height: 50px;
      border-bottom: 1px solid #d9d9d9;

      span {
        color: #8c8c8c;
      }
    }

  }
</style>
