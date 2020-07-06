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
        <div class="result-detail-box">
          <div class="top-detail" v-if="detail.memo">
            <div class="icon">
              <img src="../../assets/images/urp/bwl.png" alt=""/>
            </div>
            <div class="info">
              <h2 class="mb-10">{{ detail.memo.memoName }}</h2>
              <div flex="box:mean">
                <simple-label label="备忘录类型">{{ memoTypeMap[ detail.memo.memoType ] }}</simple-label>
                <simple-label label="备忘录状态">{{ memoStatusMap[ detail.memo.memoStatus ] }}</simple-label>
                <simple-label label="文号">{{ detail.memo.fileCode }}</simple-label>
              </div>
              <div flex="box:mean">
                <simple-label label="签署日期">{{ detail.memo.signDate }}</simple-label>
                <simple-label label="联合部门数">{{ detail.memo.unionNum }}</simple-label>
                <simple-label label="创建时间">{{ detail.memo.createDate }}</simple-label>
              </div>
            </div>
          </div>
          <urp-left-right>
            <div slot="left-header">参与部门 <span style="color:#999;">({{ detail.departs.length }})</span></div>
            <div slot="right-header">处置措施</div>
            <div slot="left">
              <b-timeline>
                <b-timeline-item v-for="dept in detail.departs" :key="dept.id"
                                 :color="dept.id===activeDeptID?'primary':'info'">
                  <span @click="handleSelectDept(dept.id)"
                        :style="{cursor: 'pointer',color:dept.id===activeDeptID?'#0d85ff':'#35495e'}">
                    {{ dept.name }}
                  </span>
                </b-timeline-item>
              </b-timeline>
            </div>
            <div slot="right">
              <div class="departs-item" v-for="dept in detail.departs" :key="dept.id">
                <div class="dept-name" :class="{'active':dept.id===activeDeptID}"
                     :id="dept.id">
                  {{ dept.name }}
                </div>
                <div class="measure-item" v-for="measure in dept.measures" :key="measure.id">
                  <b-icon name="ios-checkbox"/>
                  <span>{{ measure.measureName }}</span>
                </div>
              </div>
            </div>
          </urp-left-right>
          {{ detail }}
        </div>
      </div>
    </div>
  </urp-layout>
</template>

<script>
  import { isNotEmpty } from '../../common/utils/assist'
  import UrpLayout from './components/UrpLayout'
  import UrpHeader from './components/UrpHeader'
  import { getMemoDetail } from '../../api/urp.api'
  import UrpLeftRight from './components/UrpLeftRight'

  export default {
    name: 'MemoDetail',
    components: { UrpLeftRight, UrpHeader, UrpLayout },
    data() {
      return {
        memoId: '',
        detail: null,
        memoTypeMap: { '1': '惩戒', '2': '激励' },
        memoTypeStyleMap: { '1': 'primary', '2': 'danger' },
        memoStatusMap: { '0': '通报', '1': '实施', '2': '过期' },
        activeDeptID: ''
      }
    },
    created() {
      this.resetMemoDetail()
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
      resetMemoDetail() {
        this.detail = {
          memo: null,
          departs: []
        }
      },
      // 查询详情
      searchDetail() {
        this.activeDeptID = ''
        getMemoDetail(this.memoId).then(resp => {
          if (resp.data.code === '0') {
            this.detail = resp.data.data
            if (this.detail.departs && this.detail.departs.length > 0) {
              this.activeDeptID = this.detail.departs[0].id
            }
          }
        })
      },
      // 点击选中左侧一个部门
      handleSelectDept(id) {
        this.activeDeptID = id
      }
    }
  }
</script>
