<template>
  <urp-layout>
    <div class="urp-main-detail">
      <urp-header normal/>
      <div class="list-result-wrap">
        <b-breadcrumb separator-icon="ios-arrow-forward">
          <b-breadcrumb-item :to="{ path: '/urp/index' }">首页</b-breadcrumb-item>
          <b-breadcrumb-item :to="{ path: '/urp/memoList' }">联合奖惩备忘录</b-breadcrumb-item>
          <b-breadcrumb-item>备忘录详情</b-breadcrumb-item>
        </b-breadcrumb>
        <p>备忘录详情(接口暂未提供)</p>
        <p>{{ memoId }}</p>
      </div>
    </div>
  </urp-layout>
</template>

<script>
  import { isNotEmpty } from '../../common/utils/assist'
  import UrpLayout from './components/UrpLayout'
  import UrpHeader from './components/UrpHeader'

  export default {
    name: 'MemoDetail',
    components: { UrpHeader, UrpLayout },
    data() {
      return {
        memoId: '',
        memo: null
      }
    },
    created() {
      this.resetMemo()
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData() {
        // 先从地址栏拉取请求
        let { id } = this.$route.query
        this.memoId = id || ''
        if (isNotEmpty(this.memoId)) {
          this.searchDetail()
        } else {
          this.$router.push('/urp/memoList')
        }
      },
      // 重置对象
      resetMemo() {
        this.memo = {
          id: '',
          memoName: '',
          memoType: '1',
          unionNum: 0,
          memoStatus: '0',
          fileCode: '',
          signDate: '',
          initiateDept: '',
          initiateDeptName: '',
          departs: [],
          measures: []
        }
      },
      // 查询详情
      searchDetail() {
        console.log('查询详情', this.memoId)
      }
    }
  }
</script>
