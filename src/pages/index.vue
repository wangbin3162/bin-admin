<template>
  <base-layout>
    <div class="main-wrap" :class="{'mini-wrap':showList}">
      <base-header @on-home="handleHome"></base-header>

      <div class="search-wrap">
        <h2 v-show="!showList">综合信用查询</h2>
        <base-search v-model="query" :size="searchSize" @on-search="handleSearch" @on-clear="handleClear"></base-search>
      </div>

      <base-content v-show="!showList"></base-content>

      <div v-show="!showList" class="center-banner">
        <b-row :gutter="20">
          <b-col :span="6">
            <div class="card">
              <div class="inner">
                <img src="../assets/images/bigdata.png" alt="bigdata">
                <h2>数据可视化</h2>
                <a class="check" href="/data" target="_blank">
                  <b-icon name="ios-arrow-round-forward"/>
                  查询
                </a>
              </div>
            </div>
          </b-col>
          <b-col :span="6">
            <div class="card">
              <div class="inner">
                <img src="../assets/images/service.png" alt="service">
                <h2>信用服务</h2>
                <a class="check" href="" target="_blank">
                  <b-icon name="ios-arrow-round-forward"/>
                  查询
                </a>
              </div>
            </div>
          </b-col>
          <b-col :span="6">
            <div class="card">
              <div class="inner">
                <img src="../assets/images/exchange.png" alt="exchange">
                <h2>信用监管</h2>
                <a class="check" href="" target="_blank">
                  <b-icon name="ios-arrow-round-forward"/>
                  查询
                </a>
              </div>
            </div>
          </b-col>
          <b-col :span="6">
            <div class="card">
              <div class="inner">
                <img src="../assets/images/joint.png" alt="joint">
                <h2>联合奖惩</h2>
                <router-link tag="a" class="check" to="/urp/index" target="_blank">
                  <b-icon name="ios-arrow-round-forward"/>
                  查询
                </router-link>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>

       <!--查询列表结果-->
      <transition name="fade-scale-move">
        <base-list v-show="showList"
                   :total="total" :data="searchList"
                   :mapping="mapping" :loading="loading"
                   :current-type="query.type"
                   @on-check-detail="handleCheckDetail"></base-list>
      </transition>

      <div class="page-wrap">
        <b-page :total="total" :current.sync="listQuery.page"
          v-if="total>listQuery.size"
          show-total @on-change="handlePageChange">
        </b-page>
      </div>
    </div>
  </base-layout>
</template>

<script>
  import { getSearchList } from '../api/search.api'
  import { isEmpty, isNotEmpty } from '../common/utils/assist'
  import BaseList from '../components/BaseList/index'
  import BaseContent from '../components/BaseContent'

  export default {
    name: 'index',
    components: { BaseList, BaseContent },
    data() {
      return {
        listQuery: {
          page: 1,
          size: 10
        },
        query: {
          q: '',
          type: '1',
          reason: ''
        },
        showList: false,
        loading: false,
        searchList: [],
        mapping: {}, // 映射对象
        total: 0
      }
    },
    computed: {
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
          this.query = Object.assign({}, { q, reason, type })
        }
        if (isNotEmpty(this.query.q) && isNotEmpty(this.query.reason)) {
          this.searchListData()
        }
      },
      handleSearch() {
        if (isEmpty(this.query.reason)) {
          this.$message({ type: 'danger', content: '请选择查询原因！' })
          return
        }
        if (isEmpty(this.query.q)) {
          this.$message({ type: 'danger', content: '请输入查询条件！' })
          return
        }
        let { query } = this
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
        this.query = { q: '', reason: '', type: '1' }
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
      }
    }
  }
</script>
