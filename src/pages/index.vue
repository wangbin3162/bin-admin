<template>
  <base-layout>
    <div class="main-wrap" :class="{'mini-wrap':showList}">
      <base-header @on-home="handleHome"></base-header>
      <div class="search-wrap" :style="searchWrapStyle">
        <h2 v-show="!showList">综合信用查询</h2>
        <base-search v-model="query" :size="searchSize" @on-search="handleSearch" @on-clear="handleClear"></base-search>
      </div>
      <transition name="fade-scale-move">
        <base-list v-show="showList" :total="total" :data="searchList" :mapping="mapping"
                   :loading="loading"
                   @on-check-detail="handleCheckDetail"></base-list>
      </transition>
      <div v-show="!showList" class="center-banner">
        <div flex="main:justify" class="mb-10">
          <div class="card data">
            <div class="inner" style="padding: 50px 40px;">
              <h2>数据可视化</h2>
              <p>Data visualization</p>
              <a class="check" href>
                <b-icon name="ios-arrow-round-forward"/>
                查看
              </a>
            </div>
          </div>
          <div>
            <div class="small-card analysis" @click="goTo('/dir/#/dataManage/dataExchange/gather')">
              <img src="../assets/images/analysis.png" alt="">
              <h2>我的采集</h2>
            </div>
            <div class="small-card collection" @click="goTo('/dir/#/dataManage/dataExchange/collectAnalysis')">
              <img src="../assets/images/collection.png" alt="">
              <h2>归集分析</h2>
            </div>
          </div>
        </div>
        <div flex="main:justify">
          <div class="card service" flex="main:justify cross:center">
            <img src="../assets/images/service.png" alt=""/>
            <div class="inner">
              <h2>信用服务</h2>
              <p>Credit Service</p>
              <a class="check" href="/dir/#/creditService/creditDiff/diffApp" target="_blank">
                <b-icon name="ios-arrow-round-forward"/>
                查看
              </a>
            </div>
          </div>
          <div class="card exchange" flex="main:justify cross:center">
            <img src="../assets/images/exchange.png" alt=""/>
            <div class="inner">
              <h2>交换监控</h2>
              <p>Exchange Monitor</p>
              <a class="check" href="/dir/#/dataManage/dataExchange/exchangeMonitor" target="_blank">
                <b-icon name="ios-arrow-round-forward"/>
                查看
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="page-wrap">
        <b-page :total="total" :current.sync="listQuery.page" v-if="total>listQuery.size"
                show-total @on-change="handlePageChange"></b-page>
      </div>
    </div>
  </base-layout>
</template>

<script>
  import BaseList from '../components/BaseList/index'
  import { mapGetters } from 'vuex'
  import { getSearchList } from '../api/search.api'

  export default {
    name: 'index',
    components: { BaseList },
    data() {
      return {
        listQuery: {
          page: 1,
          size: 10
        },
        query: {
          q: '',
          type: '',
          reason: '1'
        },
        showList: false,
        loading: false,
        searchList: [],
        mapping: {}, // 映射对象
        total: 0
      }
    },
    computed: {
      ...mapGetters(['queryData']),
      searchWrapStyle() {
        return this.showList ? { padding: '50px' } : { padding: '70px 50px 140px' }
      },
      searchSize() {
        return this.showList ? 'small' : 'default'
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      // 将vuex缓存映射至当前组件
      fetchData() {
        // 先从地址栏拉取请求
        let { q, reason, type } = this.$route.query
        // 判断是否携带参数，如有参数则缓存vuex，如无参数则默认退回首页
        if (q && reason && type) {
          this.$store.dispatch('setQuery', { q, reason, type })
        }
        this.query = Object.assign({}, this.query, this.queryData)
        if (this.query.q.length > 0 && this.query.reason.length > 0) {
          this.searchListData()
        }
      },
      handleSearch() {
        if (this.query.reason.length === 0) {
          this.$message({ type: 'danger', content: '查询原因必须选择！' })
          return
        }
        if (this.query.q.length === 0) {
          this.$message({ type: 'danger', content: '请输入查询条件！' })
          return
        }
        let query = {
          q: this.query.q,
          type: this.query.type,
          reason: this.query.reason
        }
        // 判断地址栏请求是否和现有输入的相同，如相同则重新查询，否则重定向地址栏后再拉取数据
        let { q, reason, type } = this.$route.query
        if (q === query.q && reason === query.reason && type === query.type) {
          this.searchListData()
        } else {
          this.$router.replace({ name: 'index', query })
        }
      },
      handleClear() {
        this.searchList = []
        this.showList = false
        this.total = 0
        this.$store.dispatch('setQuery', { q: '', reason: '', type: '1' })
        this.$router.replace({ name: 'index' })
      },
      // 页码改变
      handlePageChange() {
        this.searchListData()
      },
      // 查看详情
      handleCheckDetail(id) {
        let query = { id, type: this.query.type, reason: this.query.reason }
        this.$router.push({ name: 'Detail', query })
      },
      // 在首页中返回首页
      handleHome() {
        this.searchList = []
        this.showList = false
      },
      // 查询列表数据
      searchListData() {
        this.loading = true
        this.searchList = []
        const queryData = { ...this.listQuery, ...this.query }
        // api查询返回列表
        getSearchList(queryData).then(res => {
          this.searchList = res.data.rows
          this.mapping = res.data.mapping
          this.total = res.data.total
          this.showList = true
          this.loading = false
        })
      },
      // 跳转对应连接
      goTo(url) {
        this.$open(url, true)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .main-wrap {
    height: 100%;
    background: url("../assets/images/banner-bg0.png") no-repeat 0 -635px;
    &.mini-wrap {
      background: url("../assets/images/banner-bg.png") no-repeat 0 -370px;
      animation: bg .4s ease-in-out forwards;
    }

    .search-wrap {
      width: 1300px;
      margin: 0 auto;
      transition: .3s;
      h2 {
        color: #fff;
        text-align: center;
        font-weight: 400;
        font-size: 34px;
        letter-spacing: 4px;
      }
    }
    .center-banner {
      width: 1300px;
      margin: 0 auto;
      .card {
        padding: 24px;
        background: #fff;
        .inner {
          h2 {
            font-weight: normal;
            font-size: 18px;
            color: rgba(0, 0, 0, .85);
          }
          p {
            color: rgba(0, 0, 0, .45);
            margin: .7em 0;
          }
          .check {
            display: inline-block;
            margin-top: 1.5em;
            background: #1089ff;
            color: #fff;
            padding: 6px 15px;
            border-radius: 15px;
            .iconfont {
              font-size: 18px;
              vertical-align: -1px;
            }
          }
        }
        &.data {
          width: 942px;
          background: #fff url("../assets/images/bigdata.png") no-repeat 500px bottom;
        }
        &.service {
          width: 646px;
          height: 180px;
          background: #fff url("../assets/images/service.png") no-repeat 30px bottom;
          .inner {
            width: 265px;
          }
        }
        &.exchange {
          width: 646px;
          height: 180px;
          background: #fff url("../assets/images/exchange.png") no-repeat 30px bottom;
          .inner {
            width: 265px;
          }
        }
      }
      .small-card {
        cursor: pointer;
        width: 350px;
        height: 132px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        h2 {
          color: #fff;
          padding-top: 16px;
          font-weight: normal;
        }
        &.analysis {
          margin-bottom: 8px;
          background: url("../assets/images/analysis-bg.png")
        }
        &.collection {
          background: url("../assets/images/collection-bg.png")
        }
      }
    }
  }

  .page-wrap {
    width: 1300px;
    margin: 0 auto;
    text-align: right;
    padding: 20px 0;
  }

  @keyframes bg {
    0% {
      background-position: 0 -370px;
    }
    100% {
      background-position: 0 -90px;
    }
  }
</style>
