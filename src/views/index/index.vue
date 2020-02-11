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
      <div class="page-wrap">
        <b-page v-if="total>listQuery.size" :total="total" :current.sync="listQuery.page"
                show-total @on-change="handlePageChange"></b-page>
      </div>
    </div>
  </base-layout>
</template>

<script>
  import BaseList from '../../components/BaseList/index'
  import { mapGetters } from 'vuex'
  import { getSearchList } from '../../api/search.api'

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
        return this.showList ? { padding: '50px' } : { padding: '170px 50px 100px' }
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
      }
    }
  }
</script>

<style scoped lang="stylus">
  .main-wrap {
    background: url("../../assets/images/banner-bg0.png") no-repeat 0 0;

    &.mini-wrap {
      background: url("../../assets/images/banner-bg.png") no-repeat 0 -370px;
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
