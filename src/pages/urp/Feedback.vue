<template>
  <urp-layout>
    <div class="urp-main-detail">
      <urp-header normal/>
      <div class="list-result-wrap">
        <b-breadcrumb separator-icon="ios-arrow-forward">
          <b-breadcrumb-item :to="{ path: '/urp/index' }">首页</b-breadcrumb-item>
          <b-breadcrumb-item>执行反馈</b-breadcrumb-item>
        </b-breadcrumb>
        <div class="result-detail-box">
          <div class="top-detail" v-if="subject.detail">
            <div class="icon">
              <img src="../../assets/images/urp/bwl.png" alt=""/>
            </div>
            <div class="info">
              <h2 class="mb-10" flex="cross:center">
                <span class="mr-15">{{ subject.detail.name }}</span>
                <b-button icon="ios-create" type="text" @click="gotoRemark">备注</b-button>
              </h2>
              <template v-if="query.type==='FO'">
                <b-row>
                  <b-col :span="8">
                    <simple-label label="统一社会信用代码">{{ subject.detail.unifiedCode }}</simple-label>
                  </b-col>
                  <b-col :span="8">
                    <simple-label label="工商注册号">{{ subject.detail.regNo }}</simple-label>
                  </b-col>
                  <b-col :span="8">
                    <simple-label label="组织机构代码">{{ subject.detail.orgInstCode }}</simple-label>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col :span="8">
                    <simple-label label="法定代表人">{{ subject.detail.natName }}</simple-label>
                  </b-col>
                  <b-col :span="8">
                    <simple-label label="注册日期">{{ subject.detail.regDate }}</simple-label>
                  </b-col>
                </b-row>
                <simple-label label="注册地址">{{ subject.detail.compAddress }}</simple-label>
              </template>
              <template v-else>
                <p>
                  <span>身份证号码：{{ subject.detail.code }}</span>
                </p>
              </template>
            </div>
            <div class="memo-typ" :class="query.memoType==='1'?'black':'red'">
              <img v-if="query.memoType==='1'" src="../../assets/images/urp/black_name.png" alt=""/>
              <img v-else src="../../assets/images/urp/red_name.png" alt=""/>
              {{ query.memoType==='1'?'黑名单':'红名单' }}
            </div>
          </div>
          <urp-left-right>
            <div slot="left-header">联合奖惩备忘录</div>
            <div slot="right-header">处置措施</div>
            <div slot="left" style="margin:0 -24px;">
              <div class="memo-item" v-for="memo in subject.memos" :key="memo.memoId"
                   :class="{'active':memo.memoId===activeMemo.memoId}"
                   @click="handleSelectMemo(memo)">
                {{memo.memoName}}
              </div>
            </div>
            <div slot="right" class="measure-form">
              <div class="measures">
                <h2>{{ activeMemo.memoName }}</h2>
                <b-checkbox-group v-model="checkedMeasures">
                  <div class="item" v-for="item in activeMemo.measures" :key="item.measureId">
                    <b-checkbox :label="item.measureId">{{ item.measureContent }}</b-checkbox>
                  </div>
                </b-checkbox-group>
              </div>
              <div class="form-wrap">
                <b-form>
                  <b-form-item label="涉及金额">
                    <b-input-number :min="0" v-model="amount" placeholder="涉及金额（元）"
                                    style="width: 200px;"/>&nbsp;(元)
                  </b-form-item>
                  <b-form-item label="反馈说明">
                    <div flex="cross:bottom">
                      <b-input v-model="explain" type="textarea" :rows="3" placeholder="输入说明描述..."
                               style="width: 70%;"/>
                      <b-button type="primary" style="width: 80px;margin-left: 16px;" v-waves
                                @click="handleFeedback">提交
                      </b-button>
                    </div>
                  </b-form-item>
                </b-form>
              </div>
            </div>
          </urp-left-right>
        </div>
      </div>
    </div>
  </urp-layout>
</template>

<script>
  import UrpLayout from './components/UrpLayout'
  import UrpHeader from './components/UrpHeader'
  import { deepCopy, isEmpty } from '../../common/utils/assist'
  import * as api from '../../api/urp.api'
  import UrpLeftRight from './components/UrpLeftRight'

  export default {
    name: 'Feedback',
    components: { UrpLeftRight, UrpHeader, UrpLayout },
    data() {
      return {
        query: {
          subjectId: '',
          type: '',
          memoType: '',
          refId: ''
        },
        subject: null,
        activeMemo: {
          memoId: '',
          memoName: '',
          measures: []
        },
        checkedMeasures: [],
        amount: null, //  金额
        explain: '', // 描述
        recordId: '',
        feedbackModal: false
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
        this.query.memoType = memoType || ''
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
          detail: null,
          memos: []
        }
      },
      // 查询详情
      searchDetail() {
        this.resetMemoMeasure()
        api.getFeedbackDetail(this.query).then(resp => {
          this.subject = resp
          if (this.subject.memos && this.subject.memos.length > 0) {
            this.handleSelectMemo(this.subject.memos[0])
          }
        })
      },
      // 初始化相关内容
      resetMemoMeasure() {
        this.activeMemo = {
          memoId: '',
          memoName: '',
          measures: []
        }
        this.checkedMeasures = [] // 已勾选措施
        this.amount = null //  金额
        this.explain = '' // 描述
      },
      // 点击选中左侧一个备忘录
      handleSelectMemo(memo) {
        if (memo.memoId !== this.activeMemo.memoId) {
          this.resetMemoMeasure()
          this.activeMemo.memoId = memo.memoId
          this.activeMemo.memoName = memo.memoName
          this.activeMemo.measures = deepCopy(memo.measures)
        }
      },
      // 执行反馈
      handleFeedback() {
        if (this.checkedMeasures.length === 0) {
          this.$message({ type: 'warning', content: '必须选择一个处置措施！' })
          return
        }
        let query = {
          id: this.query.subjectId,
          memoId: this.activeMemo.memoId,
          explain: this.explain,
          measureIds: this.checkedMeasures
        }
        api.doFeedback(query).then(resp => {
          if (resp.data.code === '0') {
            this.successDo(resp.data.data.recordId)
          } else {
            this.$message({ type: 'danger', content: resp.data.message || '失败！' })
          }
        })
      },
      // 跳转备注列表
      gotoRemark() {
        this.$router.push({ path: '/urp/remarkList', query: { ...this.$route.query, name: this.subject.detail.name } })
      },
      // 成功后操作
      successDo(recordId) {
        this.$confirm({
          render: (h) => {
            return h('div', {
                style: { marginLeft: '-42px' }
              },
              [
                h('div', { style: { lineHeight: '44px' } }, [
                  h('b-icon', { props: { name: 'ios-checkmark-circle', size: 28, color: '#52c41a' } }),
                  h('span', {
                    style: {
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      marginLeft: '12px',
                      fontSize: '16px',
                      color: ' rgba(0,0,0,0.85)'
                    }
                  }, '成功')
                ]),
                h('div', { style: { paddingLeft: '42px', color: 'rgba(0,0,0,.65)' } }, '确定打印吗？')
              ]
            )
          },
          onOk: () => {
            let routeUrl = this.$router.resolve({
              path: '/urp/print',
              query: { recordId }
            })
            window.open(routeUrl.href, '_blank')
            // 清空内容
            this.checkedMeasures = [] // 已勾选措施
            this.amount = null //  金额
            this.explain = '' // 描述
          },
          onCancel: () => {
            // 清空内容
            this.checkedMeasures = [] // 已勾选措施
            this.amount = null //  金额
            this.explain = '' // 描述
          }
        })
      }
    }
  }
</script>
