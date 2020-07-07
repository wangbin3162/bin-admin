<template>
  <urp-layout>
    <div class="urp-main-detail">
      <urp-header normal></urp-header>
      <div class="list-result-wrap">
        <b-breadcrumb separator-icon="ios-arrow-forward">
          <b-breadcrumb-item :to="{ path: '/urp/index' }">首页</b-breadcrumb-item>
          <b-breadcrumb-item>联合奖惩执行记录</b-breadcrumb-item>
        </b-breadcrumb>
        <div class="list-counts">
          <div class="item">
            <img src="../../assets/images/urp/icon_search.png" alt=""/>
            <div>
              <h4>累计查询次数</h4>
              <p><span>{{ countObj.queryNum }}</span>条</p>
            </div>
          </div>
          <div class="item">
            <img src="../../assets/images/urp/icon_jl.png" alt=""/>
            <div>
              <h4>激励次数</h4>
              <p><span>{{ countObj.jlNum }}</span>条</p>
            </div>
          </div>
          <div class="item">
            <img src="../../assets/images/urp/icon_cj.png" alt=""/>
            <div>
              <h4>惩戒次数</h4>
              <p><span>{{ countObj.cjNum }}</span>条</p>
            </div>
          </div>
        </div>
        <v-table-wrap>
          <!--查询条件-->
          <v-filter-bar @keyup-enter="handleFilter">
            <v-filter-item title="主体名称">
              <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable/>
            </v-filter-item>
            <!--添加查询按钮位置-->
            <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
          </v-filter-bar>
          <!--中央表格-->
          <b-table :columns="columns" :data="list" :loading="listLoading">
            <template v-slot:action="{row}">
              <b-button type="text" @click="handleCancel(row)">撤销</b-button>
              <b-button type="text" @click="print(row)">打印</b-button>
              <b-button type="text" @click="handleCheck(row)">查看</b-button>
            </template>
          </b-table>
          <!--下方分页器-->
          <b-page :total="total" show-total show-sizer :current.sync="listQuery.page"
                  @on-change="handleCurrentChange"
                  @on-page-size-change="handleSizeChange"></b-page>
        </v-table-wrap>
      </div>
    </div>

    <b-modal v-model="detailVisible" class-name="table-page-detail-modal"
             footer-hide width="1200"
             :mask-closable="false">
      <title-bar tip-pos="left" :font-size="18" :label="record.name+'执行记录详情'" slot="header"></title-bar>
      <div class="table-page-inner">
        <key-label-wrap>
          <key-label label="主体名称" is-full>{{ record.name }}</key-label>
          <key-label label="奖惩备忘录" is-full>{{ record.memoName }}</key-label>
          <key-label label="反馈时间" is-full>{{ record.feedbackDate }}</key-label>
          <key-label label="证件号码" is-full>{{ record.idCode }}</key-label>
          <key-label label="统一社会信用代码" is-full>{{ record.orgInstCode }}</key-label>
          <key-label label="工商注册号" is-full>{{ record.regNo }}</key-label>
          <key-label label="措施内容" is-full>{{ record.measureContent }}</key-label>
        </key-label-wrap>
      </div>
    </b-modal>
    <b-modal v-model="cancelVisible" :mask-closable="false" title="撤销执行记录">
      <b-form :model="cancelObj" ref="form" :label-width="100">
        <b-form-item label="主体名称">
          <b-input v-model="cancelObj.name" readonly/>
        </b-form-item>
        <b-form-item label="撤销原因" prop="cancelReason"
                     :rules=" { required: true, message: '撤销原因必填', trigger: 'blur' }">
          <b-input v-model="cancelObj.cancelReason" type="textarea"
                   :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入原因..."/>
        </b-form-item>
      </b-form>
      <div slot="footer">
        <b-button @click="cancelVisible=false">取消</b-button>
        <b-button type="primary" @click="handleCancelSubmit">确定</b-button>
      </div>
    </b-modal>
  </urp-layout>
</template>

<script>
  import UrpLayout from './components/UrpLayout'
  import UrpHeader from './components/UrpHeader'
  import { cancelResult, getListResult, getListResultCount } from '../../api/urp.api'
  import mixin from '../../common/mixins/mixin'

  export default {
    name: 'ListResult',
    mixins: [mixin],
    components: { UrpHeader, UrpLayout },
    data() {
      return {
        listQuery: {
          name: '',
          idCode: ''
        },
        columns: [
          { title: '主体名称', key: 'name', tooltip: true },
          { title: '奖惩备忘录', key: 'memoName', tooltip: true },
          { title: '措施', key: 'measureContent', tooltip: true },
          { title: '反馈时间', key: 'feedbackDate', tooltip: true },
          { title: '操作', slot: 'action', width: 150 }
        ],
        record: null,
        detailVisible: false,
        cancelVisible: false,
        cancelObj: {
          recordId: '',
          name: '',
          cancelReason: ''
        },
        countObj: {
          cjNum: 0,
          jlNum: 0,
          queryNum: 0
        }
      }
    },
    created() {
      this.resetQuery()
      this.resetRecord()
      getListResultCount().then(resp => {
        if (resp.data.code === '0') {
          this.countObj = resp.data.data
        }
      })
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          idCode: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        this.record = { ...row }
        this.detailVisible = true
      },
      // 撤销
      handleCancel(row) {
        this.cancelObj.recordId = row.id
        this.cancelObj.name = row.name
        this.cancelObj.cancelReason = ''
        this.cancelVisible = true
        this.$refs.form && this.$refs.form.resetFields()
      },
      // 撤销提交
      handleCancelSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            cancelResult(this.cancelObj).then(resp => {
              if (resp.data.code === '0') {
                this.$message({ type: 'success', content: '撤销成功！' })
              } else {
                this.$message({ type: 'danger', content: resp.data.message || '撤销失败！' })
              }
              this.cancelVisible = false
            })
          }
        })
      },
      // 打印
      print(row) {
        let routeUrl = this.$router.resolve({
          path: '/urp/print',
          query: { recordId: row.id }
        })
        window.open(routeUrl.href, '_blank')
      },
      // 重置对象
      resetRecord() {
        this.record = {
          id: '',
          memoName: '',
          name: '',
          idCode: '',
          unifiedCode: '',
          orgInstCode: '',
          feedbackDate: '',
          feedbackSource: '',
          measureContent: ''
        }
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        getListResult(this.listQuery).then(resp => {
          this.setListData({
            list: resp.data.rows,
            total: resp.data.total
          })
        })
      }
    }
  }
</script>
