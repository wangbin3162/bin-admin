<template>
  <urp-layout>
    <div class="urp-main-wrap">
      <urp-header></urp-header>
      <div class="search-wrap">
        <urp-search v-model="query" @on-search="handleSearch"></urp-search>
      </div>
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
      <div flex="main:justify" class="memo-container min-height300">
        <div class="block memos">
          <div flex="main:justify" class="title">
            <span class="label">联合奖惩备忘录</span>
            <span class="more">查看更多<b-icon name="doubleright"/></span>
          </div>
          <div class="ul">
            <div v-for="memo in memoList5" :key="memo.id" class="link">
              <span class="label">{{ memo.memoName }}</span><span class="date">{{ memo.createDate }}</span>
            </div>
          </div>
        </div>
        <div class="block results">
          <div flex="main:justify" class="title">
            <span class="label">惩戒激励记录</span>
            <span class="more">查看更多<b-icon name="doubleright"/></span>
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

  export default {
    name: 'UrpIndex',
    components: { UrpSearch, UrpLayout, UrpHeader },
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
        total: 0,
        memoList5: [],
        listResult5: []
      }
    },
    created() {
      this.getUrpCount()
      this.queryHomeMemoAndResult()
    },
    methods: {
      // 查询主体列表
      handleSearch() {
        api.getUrpList(this.query).then(resp => {
          console.log(resp)
        })
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
      }
    }
  }
</script>
