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
        memoList5: [
          {
            id: '06c5fa1ba3d64e1990ce469a90a46fc9',
            memoName: '联合公安局奖励的备忘录',
            createDate: '2020-05-15 09:57:13'
          },
          {
            id: '0ae843540e0344b89a103cabfb6b30e1',
            memoName: '1111',
            createDate: '2020-05-15 09:57:13'
          },
          {
            id: '34dd346dc1ba401e85a1a8a6d6940da6',
            memoName: '0519法人惩戒备忘录',
            createDate: '2020-05-15 09:57:13'
          },
          {
            id: 'ad19ede4a33047ad963dd3a68333499f',
            memoName: '我是惩戒激励备忘录',
            createDate: '2020-05-15 09:57:13'
          },
          {
            id: '32710d21aa5a432080c802d26b344000',
            memoName: '激励备忘录',
            createDate: '2020-05-15 09:57:13'
          }
        ],
        listResult5: [
          {
            id: '06c5fa1ba3d64e1990ce469a90a46fc9',
            name: '孙菲菲'
          },
          {
            id: '0ae843540e0344b89a103cabfb6b30e1',
            name: '孙菲菲'
          },
          {
            id: '34dd346dc1ba401e85a1a8a6d6940da6',
            name: '王军'
          },
          {
            id: 'ad19ede4a33047ad963dd3a68333499f',
            name: '张三'
          },
          {
            id: '32710d21aa5a432080c802d26b344000',
            name: '李四'
          }
        ]
      }
    },
    created() {
      api.getUrpCounts().then(resp => {
        this.urpCount = resp
      })
    },
    methods: {
      handleSearch() {
        console.log('search:', this.query)
      }
    }
  }
</script>
