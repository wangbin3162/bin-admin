<template>
  <cre-sup-layout>
    <div class="industry-black-list">
      <cre-sup-header></cre-sup-header>

      <div class="search">
        <p>行业黑名单排名</p>
        <span>关注行业黑名单企业数量变化</span>
      </div>

      <div class="main-con">
        <div class="left">
          <div class="header">
            <span>一共4条数据</span>
          </div>

          <b-table :columns="columns" :data="list" class="m15">
            <template v-slot:action="{ index }">
              <span v-if="index % 2 === 0">已添加</span>
              <b-button v-else type="text">
                添加监管
              </b-button>
            </template>
          </b-table>

          <div flex="main:right" class="pr-10">
            <b-page :total="total"
              :current.sync="query.page"
              :page-size="query.size"
              show-elevator
              @on-change="handlePageChange">
            </b-page>
          </div>
        </div>

        <div class="right">
          <!-- 右侧头部导航 -->
          <tip-my-supervision class="mb-10"></tip-my-supervision>
          <!-- 市场主体预警 -->
          <tip-market-warn></tip-market-warn>
        </div>
      </div>
    </div>
  </cre-sup-layout>
</template>

<script>
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'
  import TipMySupervision from '@/pages/credit-supervision/components/TipMySupervision'
  import TipMarketWarn from '@/pages/credit-supervision/components/TipMarketWarn'

  export default {
    name: 'IndustryBlackList',
    components: {
      CreSupLayout,
      CreSupHeader,
      TipMySupervision,
      TipMarketWarn
    },
    data () {
      return {
        total: 0,
        query: {
          size: 10,
          page: 1
        },
        list: [
          { a: '建筑', b: '400', c: '15%' },
          { a: '金融', b: '700', c: '40%' },
          { a: '保险', b: '300', c: '24%' },
          { a: '环保', b: '100', c: '10%' }
        ],
        columns: [
          { type: 'index', width: 50 },
          { title: '行业名称', key: 'a', ellipsis: true, tooltip: true },
          { title: '黑名单数量', key: 'b' },
          { title: '占比', key: 'c' },
          { title: '操作', slot: 'action', width: 70 }
        ]
      }
    },
    created () {

    },
    methods: {
      handlePageChange () {

      }
    }
  }
</script>

<style lang="stylus" scoped>
 .industry-black-list {
    height: 100%;
    background: url("../../../assets/images/credit-supervision/banner-bg0.png") no-repeat 0 0;
    background-size: 100% 310px;
    transition: background .3s;

    .search {
      padding-top: 50px;
      height: 230px;
      width: 1300px;
      margin: 0 auto;

      p {
        margin-bottom: 5px;
        font-size: 27px;
        color: #ffffff;
      }

     span {
       color: #ffffff;
     }
    }

    .main-con {
      display: flex;
      justify-content: space-between;
      width: 1300px
      margin: 25px auto 25px;

      .left {
        width: 69%;
        background: #ffffff;
        min-height: 400px;

        .header {
          display: flex;
          align-items: center;
          padding-left: 10px;
          height: 50px;
          border-bottom: 1px solid #d9d9d9;
          color: #8c8c8c;
        }
      }

      .right {
        width: 30%;
        // background: #ffffff;
        // min-height: 400px;
      }
    }
  }
</style>
