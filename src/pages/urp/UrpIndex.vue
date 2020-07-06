<template>
  <urp-layout>
    <div class="urp-main-wrap" :class="{'mini-wrap':showList}">
      <urp-header></urp-header>
      <div class="search-wrap">
        <urp-search v-model="query" @on-search="handleSearch" @on-clear="handleClear"></urp-search>
      </div>
      <transition name="fade-scale-move">
        <urp-list v-show="showList" :data="searchList"
                  :loading="loading"
                  @on-check-detail="handleCheckDetail"></urp-list>
      </transition>
      <div v-show="!showList" class="card-container" flex="main:justify">
        <div class="card card1">
          <h2><span>{{ urpCount.count1 }}</span>条</h2>
          <p>备忘录</p>
        </div>
        <div class="card card2">
          <h2><span>{{ urpCount.count2 }}</span>条</h2>
          <p>奖惩激励记录</p>
        </div>
        <div class="card card3">
          <h2><span>{{ urpCount.count3 }}</span>条</h2>
          <p>奖惩名单</p>
        </div>
        <div class="card card4">
          <h2><span>{{ urpCount.count4 }}</span>条</h2>
          <p>实施部门</p>
        </div>
        <div class="card card5">
          <h2><span>{{ urpCount.count5 }}</span>条</h2>
          <p>奖惩措施</p>
        </div>
      </div>
      <div v-show="!showList" flex="main:justify" class="memo-container min-height300">
        <div class="block memos">
          <div flex="main:justify" class="title">
            <span class="label">联合奖惩备忘录</span>
            <router-link to="/urp/memoList" class="more">查看更多
              <b-icon name="doubleright"/>
            </router-link>
          </div>
          <div class="ul">
            <div v-for="memo in memoList5" :key="memo.id" class="link"
                 @click="handleCheckMemo(memo.id)">
              <span class="label">{{ memo.memoName }}</span><span class="date">{{ memo.createDate | filterTime }}</span>
            </div>
          </div>
        </div>
        <div class="block results">
          <div flex="main:justify" class="title">
            <span class="label">惩戒激励记录</span>
            <router-link to="/urp/listResult" class="more">查看更多
              <b-icon name="doubleright"/>
            </router-link>
          </div>
          <div class="ul">
            <div v-for="result in listResult5" :key="result.id" class="link">
              <span class="label">{{ result.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </urp-layout>
</template>

<script>
  import UrpHeader from './components/UrpHeader'
  import UrpLayout from './components/UrpLayout'
  import UrpSearch from './components/UrpSearch'
  import * as api from '../../api/urp.api'
  import UrpList from './components/UrpList'
  import { isNotEmpty } from '../../common/utils/assist'

  export default {
    name: 'UrpIndex',
    components: { UrpList, UrpSearch, UrpLayout, UrpHeader },
    data() {
      return {
        query: {
          keyword: '',
          type: 'FO' // [FO,ZRP]
        },
        urpCount: {},
        showList: false,
        loading: false,
        searchList: [],
        memoList5: [],
        listResult5: []
      }
    },
    created() {
      this.getUrpCount()
      this.queryHomeMemoAndResult()
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData() {
        // 先从地址栏拉取请求
        let { keyword, type } = this.$route.query
        // 判断是否携带参数，如有参数则缓存vuex，如无参数则默认退回首页
        this.query.keyword = keyword || ''
        this.query.type = type || 'FO'
        if (isNotEmpty(this.query.keyword) && isNotEmpty(this.query.type)) {
          this.searchListData()
        }
      },
      // 查询主体列表
      handleSearch() {
        let { query } = this
        // 判断地址栏请求是否和现有输入的相同，如相同则重新查询，否则重定向地址栏后再拉取数据
        let { keyword, type } = this.$route.query
        if (keyword === query.keyword && type === query.type) {
          this.searchListData()
        } else {
          this.$router.replace({ path: '/urp/index', query })
        }
      },
      // 清空
      handleClear() {
        this.searchList = []
        this.showList = false
        this.query = { keyword: '', type: 'FO' }
        this.$router.replace({ path: '/urp/index' })
      },
      // 查看备忘录
      handleCheckMemo(id) {
        this.$router.push({ path: '/urp/memoDetail', query: { id } })
      },
      // 初始化首页的统计计数
      getUrpCount() {
        api.getUrpCounts().then(resp => {
          this.urpCount = resp
        })
      },
      // 查询首页的前五条备忘录和惩戒激励记录
      queryHomeMemoAndResult() {
        this.memoList5 = []
        this.listResult5 = []
        api.getMemoList({ memoName: '', memoType: '', page: 1, size: 5 })
          .then(resp => {
            this.memoList5 = resp.data.rows
          })
        api.getListResult({ name: '', idCode: '', page: 1, size: 5 })
          .then(resp => {
            this.listResult5 = resp.data.rows
          })
      },
      // 列表点击执行记录
      handleCheckDetail(item) {
        let { subjectId, type, memoType, refId } = item
        this.$router.push({ path: '/urp/feedback', query: { subjectId, type, memoType, refId } })
      },
      // 查询列表数据
      searchListData() {
        this.loading = true
        this.searchList = []
        api.getUrpList(this.query).then(resp => {
          if (resp.data.code === '0') {
            this.searchList = resp.data.data.subjects
            this.showList = true
            this.loading = false
          } else {
            this.$message({ type: 'warning', content: resp.data.message })
            this.loading = false
          }
        })
      }
    }
  }
</script>
