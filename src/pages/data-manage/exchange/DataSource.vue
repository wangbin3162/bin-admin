<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="数据源名称">
            <b-input v-model="listQuery.dataSourceName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="连接类型">
            <b-select v-model="listQuery.dbType" clearable>
              <b-option v-for="(value,key) in dsTypeMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:dataSourceName="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.dataSourceName }}</b-button>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <template v-if="canRemove">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <b-form :model="ds" ref="form" :rules="ruleValidate" :label-width="120">
          <b-row>
            <b-col span="12">
              <b-form-item label="数据源名称" prop="dataSourceName">
                <b-input v-model="ds.dataSourceName" placeholder="请输入数据源名称" :maxlength="20" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="连接类型" prop="dbType">
                <b-select v-model="ds.dbType" clearable>
                  <b-option v-for="(value,key) in dsTypeMap" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="连接驱动" prop="driverClass">
                <b-input v-model="ds.driverClass" placeholder="请输入连接驱动" :maxlength="50" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="数据库名称" prop="dbName">
                <b-input v-model="ds.dbName" placeholder="请输入数据库名称" :maxlength="20" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="主机IP地址" prop="host">
                <b-input v-model="ds.host" placeholder="请输入主机地址" clearable :maxlength="20"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="端口号" prop="port">
                <b-input-number v-model="ds.port" :min="0" style="width: 100%;" :maxlength="6"></b-input-number>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="用户名" prop="userName">
                <b-input v-model="ds.userName" placeholder="请输入用户名" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="密码" prop="password">
                <b-input v-model="ds.password" placeholder="请输入密码" type="password" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item>
            <b-button type="primary" @click="checkLink">测试连接</b-button>
          </b-form-item>
        </b-form>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <v-key-label label="数据源名称" is-half is-first>{{ ds.dataSourceName }}</v-key-label>
        <v-key-label label="连接类型" is-half>{{ ds.dbType }}</v-key-label>
        <v-key-label label="数据库名称" is-half is-first>{{ ds.dbName }}</v-key-label>
        <v-key-label label="连接驱动" is-half>{{ ds.driverClass }}</v-key-label>
        <v-key-label label="主机地址" is-half is-first>{{ ds.host }}</v-key-label>
        <v-key-label label="端口号" is-half>{{ ds.port }}</v-key-label>
        <v-key-label label="用户名" is-bottom>{{ ds.userName }}</v-key-label>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { requiredRule } from '../../../common/utils/validate'
  import { getDataSourceType } from '../../../api/enum.api'
  import * as api from '../../../api/data-manage/data-source.api'

  export default {
    name: 'DataSource',
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '数据源',
        listQuery: {
          dataSourceName: '',
          dbType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '数据源名称', slot: 'dataSourceName' },
          { title: '连接类型', key: 'dbType', align: 'center', width: 180 },
          { title: '数据库名称', key: 'dbName' },
          { title: '主机地址', key: 'host' },
          { title: '端口号', key: 'port', width: 80 },
          { title: '操作', slot: 'action', width: 120 }
        ],
        ds: null,
        ruleValidate: {
          dataSourceName: [requiredRule],
          dbName: [requiredRule],
          dbType: [{ required: true, message: '必填项', trigger: 'change' }],
          driverClass: [requiredRule],
          host: [requiredRule],
          port: [{ required: true, message: '必填项', trigger: 'change', type: 'number' }],
          userName: [requiredRule],
          password: [requiredRule]
        },
        dsTypeMap: {}
      }
    },
    created() {
      this.getEnum()
      this.resetDs()
      this.searchList()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          dataSourceName: '',
          dbType: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        this.ds = { ...row }
        this.openEditPage('check')
      },
      // 新增按钮事件
      handleCreate() {
        this.resetDs()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetDs()
        this.ds = { ...this.ds, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        this.$confirm({
          title: '警告',
          content: `确实要删除当前数据源吗？`,
          loading: true,
          onOk: () => {
            api.removeDs(row.id).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createDs : api.modifyDs
            fun(this.ds).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 测试连接
      checkLink() {
        api.linkCheck(this.ds).then(res => {
          if (res.data.code === '0') {
            this.$alert({ type: 'success', title: '测试连接', content: '测试连接成功' })
          } else {
            this.$alert({ type: 'danger', title: '测试连接', content: '测试连接失败' })
          }
        })
      },
      /* [数据接口] */
      // 通用枚举
      getEnum() {
        // 数据源类型枚举
        getDataSourceType().then(res => {
          if (res.status === 200) {
            this.dsTypeMap = res.data.data
          }
        })
      },
      // 重置对象
      resetDs() {
        this.ds = {
          id: '',
          dataSourceName: '',
          dbName: '',
          dbType: '',
          driverClass: '',
          host: '',
          port: 0,
          userName: '',
          password: ''
        }
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getDataSourceList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>
