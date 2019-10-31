<template>
  <div class="app-wrap">
    <div class="scroll-box">
      <div class="index-wrap">
        <div class="main-wrap">
          <base-header></base-header>
          <div class="search-wrap" :style="searchWrapStyle">
            <h2 v-show="searchNormal">综合信用查询</h2>
            <base-search :is-normal="searchNormal" @on-search="handleSearch"></base-search>
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

  export default {
    name: 'index',
    data () {
      return {
        searchList: [],
        mapping: {}, // 映射对象
        listQuery: {
          q: '',
          type: '',
          page: 1,
          size: 10
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo', 'searchData']),
      searchWrapStyle () {
        return this.searchList.length > 0
          ? { padding: '50px' } : { padding: '150px 50px 100px' }
      },
      searchNormal () {
        return this.searchList.length === 0
      }
    },
    methods: {
      handleSearch (filter) {
        this.$store.dispatch('setSearchData', filter).then(() => {
          // this.$router.push({ path: '/list', query: { q: filter.q } })
          this.listQuery.q = filter.q
          this.listQuery.type = filter.type
          getSearchList(this.listQuery).then(res => {
            this.searchList = res.data.rows
            this.mapping = res.data.mapping
          })
        }).catch(err => {
          this.$message({ type: 'danger', content: err.message })
        })
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
</style>
