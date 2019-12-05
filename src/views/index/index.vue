<template>
  <base-layout>
    <div class="main-wrap" :class="{'mini-wrap':showList}">
      <base-header></base-header>
      <div class="links">
        <div class="inner">
          <span class="item"><router-link to="index" tag="a">首页</router-link></span>
          <span class="item"><a href="">信用监管</a></span>
          <span class="item"><a href="">信用评级</a></span>
          <span class="item"><a href="">大数据分析</a></span>
          <span class="item"><a href="">专项应用</a></span>
          <span class="item"><a href="">数据治理</a></span>
        </div>
      </div>
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
  import BaseList from '../../components/base-list/base-list'
  import { mapGetters } from 'vuex'
  import { getSearchList } from '../../api/search'

  export default {
    name: 'index',
    components: { BaseList },
    data () {
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
      searchWrapStyle () {
        return this.showList ? { padding: '50px' } : { padding: '150px 50px 100px' }
      },
      searchSize () {
        return this.showList ? 'small' : 'default'
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      // 将vuex缓存映射至当前组件
      fetchData () {
        // 从vuex拉取缓存条件没有则默认
        const { q, type, reason } = this.queryData
        this.query = Object.assign({}, this.query, { q, type, reason })
        if (this.query.q.length > 0 && this.query.reason.length > 0) {
          this.searchListData()
        }
      },
      handleSearch () {
        if (this.query.reason.length === 0) {
          this.$message({ type: 'danger', content: '查询原因必须选择！' })
          return
        }
        if (this.query.q.length === 0) {
          this.$message({ type: 'danger', content: '请输入查询条件！' })
          return
        }
        this.searchListData()
      },
      handleClear () {
        this.searchList = []
        this.showList = false
        this.total = 0
      },
      // 页码改变
      handlePageChange () {
        this.searchListData()
      },
      // 查看详情
      handleCheckDetail (id) {
        let query = { id, type: this.query.type, reason: this.query.reason }
        this.$router.push({ name: 'detail', query })
      },
      // 查询列表数据
      searchListData () {
        this.loading = true
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
    background: url("../../assets/images/bg.png") no-repeat 0 80px;
    &.mini-wrap {
      background: url("../../assets/images/bannesmallr-bg.png") no-repeat 0 0;
    }
    .search-wrap {
      width: 1300px;
      margin: 0 auto;
      transition: .3s;
      h2 {
        color: #fff;
        text-align: center;
        font-weight: 400;
        font-size: 24px;
      }
    }
  }
  .links {
    background: #f8f8f8;
    padding: 15px 0;
    box-shadow: 0 0 15px #ebebeb inset;
    .inner {
      text-align: right;
      width: 1300px;
      margin: 0 auto;
      .item {
        display inline-block;
        width: 150px;
        text-align: center;
        a {
          color: #666;
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
</style>
