<template>
  <urp-layout>
    <div class="urp-main-detail">
      <urp-header normal/>
      <div class="list-result-wrap">
        <b-breadcrumb separator-icon="ios-arrow-forward">
          <b-breadcrumb-item :to="{ path: '/urp/index' }">首页</b-breadcrumb-item>
          <b-breadcrumb-item :to="{ path: '/urp/feedback',query:{
             subjectId: $route.query.subjectId,
             type: $route.query.type,
             memoType: $route.query.memoType,
             refId: $route.query.refId  }
          }">
            {{ listQuery.name }}
          </b-breadcrumb-item>
          <b-breadcrumb-item>备注列表</b-breadcrumb-item>
        </b-breadcrumb>
        <v-table-wrap>
          <!--操作栏-->
          <v-table-tool-bar>
            <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
          </v-table-tool-bar>
          <!--中央表格-->
          <b-table :columns="columns" :data="list" :loading="listLoading">
            <template #isShare="{row}">{{ row.isShare==='1'?'是':'否' }}</template>
            <template #action="{row}">
              <b-button type="text" @click="handleRemove(row)" text-color="danger">删除</b-button>
            </template>
          </b-table>
          <!--下方分页器-->
          <b-page :total="total" show-total show-sizer :current.sync="listQuery.page"
                  @on-change="handleCurrentChange"
                  @on-page-size-change="handleSizeChange"></b-page>
        </v-table-wrap>
      </div>
    </div>

    <b-modal v-model="modal" :mask-closable="false" title="新增备注">
      <b-form :model="remark" ref="form" :label-width="100">
        <b-form-item label="level">
          <b-rate v-model="remark.level" style="margin-top: 6px;"></b-rate>
        </b-form-item>
        <b-form-item label="是否共享" prop="isShare">
          <b-switch v-model="remark.isShare" true-value="1" false-value="2" style="margin-top: 6px;"></b-switch>
        </b-form-item>
        <b-form-item label="备注" prop="remark"
                     :rules=" { required: true, message: '备注内容必填', trigger: 'blur' }">
          <b-input v-model="remark.remark" type="textarea"
                   :autosize="{minRows: 2,maxRows: 3}"
                   placeholder="请输入备注内容..."/>
        </b-form-item>
      </b-form>
      <div slot="footer">
        <b-button @click="modal=false">取消</b-button>
        <b-button type="primary" @click="handleSubmit">确定</b-button>
      </div>
    </b-modal>
  </urp-layout>
</template>

<script>
  import UrpLayout from './components/UrpLayout'
  import UrpHeader from './components/UrpHeader'
  import { getRemarkList, remarkEdit } from '../../api/urp.api'
  import mixin from '../../common/mixins/mixin'
  import { isEmpty } from '../../common/utils/assist'

  export default {
    name: 'RemarkList',
    mixins: [mixin],
    components: { UrpHeader, UrpLayout },
    data() {
      return {
        listQuery: {
          subjectId: '',
          name: ''
        },
        columns: [
          { title: '备注内容', key: 'remark', tooltip: true },
          { title: '备注时间', key: 'recordTime', tooltip: true },
          { title: '是否公开', slot: 'isShare', align: 'center' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        modal: false,
        remark: null
      }
    },
    created() {
      this.resetRemark()
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData() {
        // 先从地址栏拉取请求
        let { subjectId, name } = this.$route.query
        this.listQuery.subjectId = subjectId || ''
        this.listQuery.name = name || ''
        if (isEmpty(subjectId)) {
          this.$router.push('/urp/index')
        } else {
          this.searchList()
        }
      },
      resetRemark() {
        this.remark = {
          subjectId: '',
          optType: '1',
          remark: '',
          level: 1,
          id: '',
          isShare: ''
        }
      },
      // 新增按钮事件
      handleCreate() {
        // 获取资源标识符
        this.resetRemark()
        this.remark.subjectId = this.listQuery.subjectId
        this.remark.optType = '1'
        this.remark.isShare = '2'
        this.modal = true
        this.$refs.form && this.$refs.form.resetFields()
      },
      // 删除操作
      handleRemove(row) {
        this.resetRemark()
        this.remark.subjectId = this.listQuery.subjectId
        this.remark.optType = '2'
        this.remark.id = row.id
        this.$confirm({
          title: '确实要删除当前备注吗？',
          loading: true,
          okType: 'danger',
          onOk: () => {
            remarkEdit(this.remark).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.searchList()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 提交备注
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            remarkEdit(this.remark).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.searchList()
              } else {
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
              this.modal = false
            })
          }
        })
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        getRemarkList(this.listQuery).then(resp => {
          this.setListData({
            list: resp.data.data.rows,
            total: resp.data.data.total
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
