<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="接口名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="接口编码">
            <b-input v-model.trim="listQuery.code" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary" v-if="canCreate" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:type="{row}">{{typeMap[row.type]}}</template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" :disabled="!canModify" @click="handleModify(scope.row)">修改</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" :disabled="!canRemove"
                      text-color="danger" @click="handleRemove(scope.row)">
              删除
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <b-form :model="apiObj" ref="form" :rules="ruleValidate" :label-width="130">
            <b-row>
              <b-col span="8">
                <b-form-item label="接口名称" prop="name">
                  <b-input v-model="apiObj.name" placeholder="请输入接口名称"></b-input>
                </b-form-item>
              </b-col>
              <b-col span="8">
                <b-form-item label="接口类型" prop="type">
                  <b-select v-model="apiObj.type">
                    <b-option v-for="(value,key) in typeMap" :value="key" :key="key">{{ value }}</b-option>
                  </b-select>
                </b-form-item>
              </b-col>
              <b-col span="8">
                <b-form-item label="响应类型" prop="recordType">
                  <b-select v-model="apiObj.recordType">
                    <b-option v-for="(value,key) in recordMap" :value="key" :key="key">{{ value }}</b-option>
                  </b-select>
                </b-form-item>
              </b-col>
            </b-row>
            <b-form-item v-if="apiObj.type === 'SQL'" label="sql语句" prop="sql">
              <b-input v-model="apiObj.sql" placeholder="请输入sql语句" type="textarea"></b-input>
            </b-form-item>
            <b-form-item v-if="apiObj.type === 'URL'" label="url" prop="url">
              <b-input v-model="apiObj.url" placeholder="请输入url"></b-input>
            </b-form-item>
            <b-form-item v-if="apiObj.type === 'TEMPLATE'" label="模板" prop="tempId">
              <template-choose v-model="apiObj.tempId" @on-fields="handlePushFields"
                              :default-name="tempName"></template-choose>
            </b-form-item>
            <b-form-item label="接口描述" prop="describe">
              <b-input v-model="apiObj.describe" placeholder="请输入接口描述" type="textarea"></b-input>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>
        <!--信息项-->
        <b-collapse-wrap title="参数信息" collapse>
          <da-api-fields v-model="apiObj.daParameters"
            :data-type-options="dataTypeOptions">
          </da-api-fields>
        </b-collapse-wrap>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/analyze-engine/da-api.api'
  import { requiredRule } from '../../common/utils/validate'
  import { DaApiFields } from './components/DaApi'
  import TemplateChoose from './components/DaApi/TemplateChoose'
  import { getInnerTempDetail } from '../../api/analyze-engine/da-inner-temp.api'

  export default {
    name: 'DaTheme',
    mixins: [commonMixin, permission],
    components: { DaApiFields, TemplateChoose },
    data() {
      return {
        dialogFormVisible: false,
        tempName: '',
        moduleName: 'API',
        listQuery: {
          name: '',
          code: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '接口名称', key: 'name' },
          { title: '接口类型', slot: 'type' },
          { title: '接口描述', key: 'describe' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        apiObj: null,
        daParameters: [],
        typeMap: {},
        recordMap: {},
        dataTypeOptions: [
          { label: '字符型', value: 'string' },
          { label: '日期型', value: 'date' },
          { label: '数字型', value: 'number' },
          { label: '其他', value: 'object' }
        ],
        ruleValidate: {
          name: [requiredRule],
          type: [{ required: true, message: '必填项', trigger: 'change' }],
          sql: [requiredRule],
          url: [requiredRule],
          tempId: [{ required: true, message: '必填项', trigger: 'change' }]
        }
      }
    },
    created() {
      this.searchList()
      this.resetCurrent()
      this.init()
    },
    methods: {
      init() {
        api.getApiType().then(res => {
          if (res.status === 200) {
            this.typeMap = res.data.data
          }
        })
        api.getRecordType().then(res => {
          if (res.status === 200) {
            this.recordMap = res.data.data
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let apiObj = { ...row }
        this.$confirm({
          title: '确实要删除接口吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeApi(apiObj).then(res => {
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
      // 新增按钮事件
      handleCreate() {
        this.resetCurrent()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetCurrent()
        this.apiObj = { ...this.apiObj, ...row }
        this.apiObj.daParameters = []
        this.openEditPage('modify')
        api.getApiDetail(this.apiObj.id).then(res => {
          this.apiObj.daParameters = res.data.data.map(item => ({ ...item, edit: false }))
          if (this.apiObj.type === 'TEMPLATE') {
            getInnerTempDetail(this.apiObj.tempId).then(response => {
              this.tempName = response.data.template.tempName
            })
          }
        })
      },
      // 重置
      resetCurrent() {
        this.apiObj = {
          id: '',
          name: '',
          describe: '',
          code: '',
          createBy: '',
          recordType: '',
          tempId: '',
          daParameters: []
        }
        this.tempName = ''
      },
      // 填充参数列表
      handlePushFields(fields) {
        // 当前参数信息
        let currentItemsMap = new Map(this.apiObj.daParameters.map(i => ([i.fieldName, i])))
        fields.forEach(field => {
          if (!currentItemsMap.has(field.paramCode)) {
            currentItemsMap.set(field.paramCode, {
              name: field.paramName,
              fieldName: field.paramCode,
              defaultValue: field.defaultVal,
              dataType: field.paramType,
              describe: field.paramDesc,
              edit: true,
              newOne: true
            })
          }
        })
        this.apiObj.daParameters = [...currentItemsMap.values()]
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          code: ''
        }
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.checkNewOne()) {
              this.$alert.warning({ title: '警告', content: '有未保存的参数信息，请全部保存后提交' })
              return
            }
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createApi : api.modifyApi
            this.apiObj.daParameters = this.apiObj.daParameters.filter(item => !item.newOne)
            fun(this.apiObj).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.searchList()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      checkNewOne() {
        return this.apiObj.daParameters.reduce((total, current) => current.newOne, false)
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getApiList(this.listQuery).then(response => {
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
