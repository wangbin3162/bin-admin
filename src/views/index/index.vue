<template>
  <div class="app-wrap">
    <div class="scroll-box">
      <div class="index-wrap">
        <div class="main-wrap" :class="{'mini-wrap':showList}">
          <base-header></base-header>
          <div class="search-wrap" :style="searchWrapStyle">
            <h2 v-show="!showList">综合信用查询</h2>
            <base-search :size="searchSize" @on-search="handleSearch"></base-search>
          </div>
          <transition name="fade-scale-move">
            <base-list v-show="showList" :total="total" :data="searchList" :mapping="mapping"></base-list>
          </transition>
          <div class="page-wrap">
            <b-page v-if="total>listQuery.size" :total="total" :current.sync="listQuery.page"
                    show-total @on-change="handlePageChange"></b-page>
          </div>
        </div>
        <base-footer></base-footer>
      </div>
    </div>
    <b-back-top></b-back-top>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getSearchList } from '../../api/search'
  import BaseList from '../../components/base-list/base-list'

  export default {
    name: 'index',
    components: { BaseList },
    data () {
      return {
        listQuery: {
          q: '',
          type: '',
          page: 1,
          size: 10
        },
        showList: false,
        searchList: [],
        mapping: {}, // 映射对象
        total: 0
      }
    },
    computed: {
      ...mapGetters(['userInfo', 'searchData']),
      searchWrapStyle () {
        return this.showList ? { padding: '50px' } : { padding: '150px 50px 100px' }
      },
      searchSize () {
        return this.showList ? 'small' : 'default'
      }
    },
    created () {
      this.handleSearch({ q: '大米科技', type: '1', reason: '' })
    },
    methods: {
      handleSearch (filter) {
        this.$store.dispatch('setSearchData', filter).then(() => {
          this.listQuery.q = filter.q
          this.listQuery.type = filter.type
          getSearchList(this.listQuery).then(res => {
            this.searchList = res.data.rows
            this.mapping = res.data.mapping
            this.total = res.data.total
            this.showList = true
          })
          // this.$router.push({ path: '/list', query: { q: filter.q } })
        }).catch(err => {
          this.$message({ type: 'danger', content: err.message })
        })
      },
      // 页码改变
      handlePageChange (page) {
        console.log(page)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .app-wrap {
    height: 100%;
    .scroll-box {
      height: 100%;
      overflow: auto;
      .index-wrap {
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        .main-wrap {
          flex: 1;
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
