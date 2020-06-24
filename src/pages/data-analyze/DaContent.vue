<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"
                :lock-select="lockTreeSelect"></b-tree>
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="编码">
            <b-input v-model.trim="listQuery.code" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary" v-if="canCreate"
                    icon="ios-add-circle-outline"
                    :disabled="currentTreeNode&&currentTreeNode.id==='top'"
                    @click="handleCreate">新 增
          </b-button>
          <template slot="right" v-if="hasBatchOperate">
            <b-button type="text" @click="handleBatchOff">批量静态数据</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" @click="handleBatchOn">批量动态数据</b-button>
          </template>
        </v-table-tool-bar>
        <b-table :columns="syncColumns" :data="list" :loading="listLoading" ref="table">
          <template v-slot:name="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
          </template>
          <template v-slot:toggle="scope">
            <span v-if="scope.row.toggle=== 'ON'">动态</span>
            <span v-else>静态</span> &nbsp;
            <b-switch
              :disabled="!havePermission('changeToggle')"
              v-model="scope.row.toggle" :true-value="'ON'" :false-value="'OFF'"
              @on-change="handleChangeStatus(scope.row)">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </b-switch>
          </template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button type="text" :disabled="!canModify" @click="handleModify(row)">修改</b-button>
            <b-divider type="vertical"/>
            <b-dropdown append-to-body @on-click="(name)=>{handleCommand(name,row)}">
              <b-button type="text">更多
                <b-icon name="ios-arrow-down"/>
              </b-button>
              <b-dropdown-menu slot="list">
                <b-dropdown-item :disabled="!havePermission('respCfg')" :style="colorSuccess" name="cfg">
                  配置响应
                </b-dropdown-item>
                <b-dropdown-item :disabled="!havePermission('test')" :style="colorWarning" name="test"
                                 v-if="row.toggle==='ON'">
                  测试
                </b-dropdown-item>
                <b-dropdown-item :disabled="!canRemove" :style="colorDanger" name="remove">
                  删除
                </b-dropdown-item>
              </b-dropdown-menu>
            </b-dropdown>
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
        <b-collapse-wrap title="基本信息">
          <b-form :model="content" ref="form" :rules="ruleValidate" label-position="top">
            <b-row :gutter="20">
              <b-col span="6">
                <b-form-item label="所属主题" prop="themeCode">
                  <b-input v-model="content.themeName" disabled/>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="名称" prop="name">
                  <b-input v-model="content.name"></b-input>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="编码" prop="code">
                  <b-input v-model="content.code"></b-input>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="类型" prop="type">
                  <b-cascader :data="contentTypeMap" v-model="content.type"/>
                </b-form-item>
              </b-col>
            </b-row>
            <b-row :gutter="20">
              <b-col span="6">
                <b-form-item label="数据来源" prop="toggle">
                  <b-radio-group v-model="content.toggle">
                    <b-radio label="ON">
                      <span>动态数据</span>
                    </b-radio>
                    <b-radio label="OFF">
                      <span>静态数据</span>
                    </b-radio>
                  </b-radio-group>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="接口" prop="apiId" v-if="content.toggle==='ON'">
                  <api-choose v-model="content.apiId" :default-name="content.apiName"
                              @on-change="({name})=>this.apiName=name"/>
                </b-form-item>
              </b-col>
            </b-row>
            <b-form-item label="示例数据" prop="data">
              <b-code-editor v-if="isEdit&&content" v-model="content.data"/>
            </b-form-item>
            <b-form-item label="描述" prop="describe">
              <b-input v-model="content.describe" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></b-input>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit()" :loading="btnLoading">提 交</b-button>
          <b-button type="primary" @click="handleSubmit(true)" :loading="btnLoading">配置响应</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <b-row>
            <b-col span="12">
              <v-simple-label label="名称">{{ content.name }}</v-simple-label>
            </b-col>
            <b-col span="12">
              <v-simple-label label="编码">{{ content.code }}</v-simple-label>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <v-simple-label label="类型">
                {{ typeMap[content.category] + (content.subCategory? ' / '+chartTypeMap[content.subCategory]:'')}}
              </v-simple-label>
            </b-col>
            <b-col span="12">
              <v-simple-label label="数据来源">{{ content.toggle==='ON'?'动态数据':'静态数据' }}</v-simple-label>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <v-simple-label label="所属主题">{{ content.themeName }}</v-simple-label>
            </b-col>
            <b-col span="12">
              <v-simple-label label="接口">{{ content.apiName }}</v-simple-label>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="224">
              <v-simple-label label="静态数据">{{ content.data }}</v-simple-label>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="24">
              <v-simple-label label="备注">{{ content.describe }}</v-simple-label>
            </b-col>
          </b-row>
        </b-collapse-wrap>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <response-config-panel ref="resConfigPanel" @on-close="handleCancel"/>
    <content-test-panel ref="testPanel" @on-close="handleCancel"/>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/data-analyze/da-content.api'
  import { getThemeTree } from '../../api/data-analyze/da-theme.api'
  import ApiChoose from './components/DaContent/ApiChoose'
  import { requiredRule } from '../../common/utils/validate'
  import ResponseConfigPanel from '../analyze-engine/components/DaBizTemplate/ResponseConfigPanel'
  import { getApiDetail } from '../../api/analyze-engine/da-api.api'
  import ContentTestPanel from './components/DaContent/ContentTestPanel'

  export default {
    name: 'Content',
    components: { ContentTestPanel, ResponseConfigPanel, ApiChoose },
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '内容',
        listQuery: {
          name: '',
          code: ''
        },
        treeData: [],
        columns: [
          { title: '名称', slot: 'name' },
          { title: '编码', key: 'code', align: 'center' },
          { title: '主题', key: 'themeCode', align: 'center', width: 90 },
          { title: '数据来源', slot: 'toggle', align: 'center' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        contentTypeMap: [],
        typeMap: {},
        chartTypeMap: {},
        content: null,
        ruleValidate: {
          name: [requiredRule],
          code: [requiredRule],
          type: [{ required: true, message: '必填项', trigger: 'change', type: 'array' }],
          toggle: [{ required: true, message: '必填项', trigger: 'change' }],
          themeCode: [{ required: true, message: '必填项', trigger: 'change' }],
          apiId: [{ required: true, message: '必填项', trigger: 'change,blur' }]
        },
        statusMap: { 'I': '初始', 'Y': '启用', 'D': '禁用' },
        apiModel: true
      }
    },
    created() {
      Promise.all([api.getContentType(), api.getChartType()]).then(res => {
        if (res[0].data.code === '0' && res[1].data.code === '0') {
          this.typeMap = res[0].data.data
          this.chartTypeMap = res[1].data.data
          let typeArr = []
          Object.keys(this.typeMap).forEach(key => {
            if (key === 'CHART') {
              let chartArr = []
              Object.keys(this.chartTypeMap).forEach(cKey => {
                chartArr.push({ value: cKey, label: this.chartTypeMap[cKey] })
              })
              typeArr.push({ value: key, label: this.typeMap[key], children: chartArr })
            } else {
              typeArr.push({ value: key, label: this.typeMap[key] })
            }
          })
          this.contentTypeMap = typeArr
        }
      })
      this.resetContent()
      this.initTree()
    },
    computed: {
      // 是否有批量操作权限
      hasBatchOperate() {
        return this.havePermission('batchToggle')
      },
      // 根据是否有批量操作权限获取是否有前面批量勾选列
      syncColumns() {
        if (this.hasBatchOperate) {
          return [
            { type: 'selection', width: 50, align: 'center' },
            ...this.columns
          ]
        }
        return this.columns
      }
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.themeCode = node.code
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          code: '',
          themeCode: this.currentTreeNode ? this.currentTreeNode.code : ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        this.content = { ...this.content, ...row }
        this.getContentDetail(() => {
          this.openEditPage('check')
        })
      },
      // 查看配置响应信息
      handleConfig(row) {
        this.dialogStatus = 'config'
        this.$refs.resConfigPanel && this.$refs.resConfigPanel.open(row.id, row.name)
      },
      // 新增按钮事件
      handleCreate() {
        this.resetContent()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetContent()
        this.content = { ...this.content, ...row }
        this.content.type = [row.category]
        if (row.subCategory) {
          this.content.type.push(row.subCategory)
        }
        this.openEditPage('modify')
      },
      // 获取内容详情
      getContentDetail(callBack) {
        api.getContentDetail(this.content.id).then(res => {
          if (res.data.code === '0') {
            this.content = res.data.data
            callBack && callBack()
          }
        })
      },
      // 更多操作点击事件
      handleCommand(name, row) {
        switch (name) {
          case 'cfg':
            this.handleConfig(row)
            break
          case 'test':
            this.handleTest(row)
            break
          case 'remove':
            this.handleRemove(row)
            break
        }
      },
      // 测试
      handleTest(row) {
        // 获取api的对应参数列表
        getApiDetail(row.apiId).then(res => {
          let params = res.data.data
          this.dialogStatus = 'test'
          this.$refs.testPanel && this.$refs.testPanel.open(row, params)
        })
      },
      // 表单提交
      handleSubmit(cfgFlag) {
        let tmpContent = { ...this.content }
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createContent : api.modifyContent
            fun(tmpContent).then(res => {
              if (res.data.code === '0') {
                if (cfgFlag) {
                  let currentId = res.data.data || tmpContent.id
                  api.getContentDetail(currentId).then(r => {
                    this.content = r.data.data
                    this.dialogStatus = 'config'
                    this.btnLoading = false // 按钮状态清空
                    this.searchList()
                    this.$refs.resConfigPanel.open(this.content.id, this.content.name)
                    this.$message({ type: 'success', content: '操作成功' })
                  })
                } else {
                  this.submitDone(true)
                  this.handleFilter()
                }
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      // 单个启用禁用
      handleChangeStatus(row) {
        let content = { ...row }
        api.changeStatus(content).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            // this.handleFilter()
          } else {
            this.$message({ type: 'danger', content: '操作失败' })
            this.handleFilter()
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let content = { ...row }
        this.$confirm({
          title: '确实要删除当前分析内容吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeContent(content).then(res => {
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
      // 重置对象
      resetContent() {
        this.content = {
          id: '',
          themeCode: this.currentTreeNode ? this.currentTreeNode.code : '',
          name: '',
          code: '',
          describe: '',
          data: '',
          apiId: '',
          toggle: 'OFF',
          type: [],
          apiName: '',
          themeName: this.currentTreeNode ? this.currentTreeNode.title : ''
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getThemeTree().then(response => {
          const list = response.data.data || []
          let root = {
            id: 'top',
            code: '',
            name: '所有主题',
            children: list
          }

          let mapper = node => {
            return {
              id: node.id,
              code: node.code,
              title: node.name,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = mapper(root)
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
            this.resetQuery()
          }
        })
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        api.getContentList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      handleBatchOff() {
        let selections = this.$refs.table.getSelection()
        if (selections.length > 0) {
          let ids = []
          selections.forEach(function (item) {
            ids.push(item.id)
          })
          api.batchOff(ids).then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', content: '操作成功' })
              this.handleFilter()
            } else {
              this.$notice.danger({ title: '操作错误', desc: res.data.message })
            }
          })
        } else {
          this.$message({ type: 'danger', content: '请选择操作的数据' })
        }
      },
      handleBatchOn() {
        let selections = this.$refs.table.getSelection()
        if (selections.length > 0) {
          let ids = []
          selections.forEach(function (item) {
            ids.push(item.id)
          })
          api.batchOn(ids).then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', content: '操作成功' })
              this.handleFilter()
            } else {
              this.$notice.danger({ title: '操作错误', desc: res.data.message })
            }
          })
        } else {
          this.$message({ type: 'danger', content: '请选择操作的数据' })
        }
      }
    }
  }
</script>
