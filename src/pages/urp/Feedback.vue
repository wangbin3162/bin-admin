<template>
  <urp-layout>
    <div class="urp-main-detail">
      <urp-header normal/>
      <div class="list-result-wrap">
        <b-breadcrumb separator-icon="ios-arrow-forward">
          <b-breadcrumb-item :to="{ path: '/urp/index' }">首页</b-breadcrumb-item>
          <b-breadcrumb-item>执行反馈</b-breadcrumb-item>
        </b-breadcrumb>
        <p>执行反馈</p>
        <p>{{ query }}</p>
      </div>
    </div>
  </urp-layout>
</template>

<script>
  import UrpLayout from './components/UrpLayout'
  import UrpHeader from './components/UrpHeader'
  import { isEmpty } from '../../common/utils/assist'
  import { getFeedbackDetail } from '../../api/urp.api'

  export default {
    name: 'Feedback',
    components: { UrpHeader, UrpLayout },
    data() {
      return {
        query: {
          subjectId: '',
          type: '',
          memoTYpe: '',
          refId: ''
        },
        subject: null
      }
    },
    created() {
      this.resetSubject()
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData() {
        // 先从地址栏拉取请求
        let { subjectId, type, memoType, refId } = this.$route.query
        this.query.subjectId = subjectId || ''
        this.query.type = type || ''
        this.query.memoTYpe = memoType || ''
        this.query.refId = refId || ''
        if (isEmpty(subjectId) && isEmpty(refId)) {
          this.$router.push('/urp/index')
        } else {
          this.searchDetail()
        }
      },
      // 重置对象
      resetSubject() {
        this.subject = {
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
        console.log('查询详情', this.query)
        getFeedbackDetail(this.query).then(resp => {
          console.log(resp)
        })
      }
    }
  }
</script>

<style scoped>

</style>
