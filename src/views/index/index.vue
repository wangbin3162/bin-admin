<template>
  <base-layout>
    <div class="main-wrap" :class="{'mini-wrap':showList}">
      <base-header></base-header>
      <div class="search-wrap" :style="searchWrapStyle">
        <h2 v-show="!showList">综合信用查询</h2>
        <base-search :size="searchSize" @on-search="handleSearch" @on-clear="handleClear"></base-search>
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
          q: '',
          type: '',
          reason: '',
          page: 1,
          size: 10
        },
        showList: false,
        loading: false,
        searchList: [],
        mapping: {}, // 映射对象
        total: 0
      }
    },
    computed: {
      ...mapGetters(['searchData']),
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
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    methods: {
      // 将vuex缓存映射至当前组件
      fetchData () {
        this.listQuery.q = this.searchData.q
        this.listQuery.type = this.searchData.type
        this.listQuery.reason = this.searchData.reason
        if (this.listQuery.q.length > 0 && this.listQuery.reason.length > 0) {
          this.searchListData()
        }
      },
      handleSearch () {
        this.listQuery.q = this.searchData.q
        this.listQuery.type = this.searchData.type
        this.listQuery.reason = this.searchData.reason
        if (this.listQuery.reason.length === 0) {
          this.$message({ type: 'danger', content: '查询原因必须选择！' })
          return
        }
        if (this.listQuery.q.length === 0) {
          this.$message({ type: 'danger', content: '请输入查询条件！' })
          return
        }
        this.searchListData()
      },
      handleClear () {
        this.listQuery.q = ''
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
        this.$store.dispatch('setDetailId', id)
        const { q, type, reason } = this.listQuery
        this.$router.push({ name: 'detail', query: { id, q, type, reason } })
      },
      // 查询列表数据
      searchListData () {
        this.loading = true
        // api查询返回列表
        getSearchList(this.listQuery).then(res => {
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
  .page-wrap {
    width: 1300px;
    margin: 0 auto;
    text-align: right;
    padding: 20px 0;
  }
</style>
