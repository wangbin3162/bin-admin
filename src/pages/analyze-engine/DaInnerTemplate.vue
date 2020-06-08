<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="模板名称">
            <b-input v-model.trim="listQuery.tempName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="模板编码">
            <b-input v-model.trim="listQuery.tempCode" placeholder="请输入" clearable></b-input>
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
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)">修改</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" :disabled="!canRemove" text-color="danger"
                      @click="handleRemove(scope.row)">删除
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
      <v-edit-wrap>
        <template slot="full">
          <v-title-bar label="模板信息" class="mb-15"/>
          <b-row type="flex">
            <b-col span="18">
              <b-form :model="template" ref="form" :rules="ruleValidate" :label-width="100">
                <b-row>
                  <b-col span="12">
                    <b-form-item label="模板名称" prop="tempName">
                      <b-input v-model="template.tempName" placeholder="请输入模板名称" clearable></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="模板编码" prop="tempCode">
                      <b-input v-model="template.tempCode" placeholder="编码为sys_开头" clearable
                               :disabled="dialogStatus==='modify'"></b-input>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-form-item v-if="isEdit" label="模板脚本" prop="tempSource">
                  <b-code-editor v-model="template.tempSource" :lint="false" :auto-format="false"/>
                </b-form-item>
                <b-form-item label="模板说明" prop="tempDesc">
                  <b-input v-model="template.tempDesc" placeholder="请输入模板说明" type="textarea" :rows="1"></b-input>
                </b-form-item>
              </b-form>
            </b-col>
            <b-col span="4">
              <div style="padding:55px 0 0 20px;">
                <b-button @click="extractParams" type="primary"
                          transparent :disabled="template.tempSource.length===0">
                  提取模板参数
                </b-button>
              </div>
            </b-col>
          </b-row>
          <v-title-bar label="参数信息" class="mt-20 mb-15"/>
          <temp-params v-model="params"/>
        </template>
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
  import * as api from '../../api/data-analyze/da-inner-temp.api.js'
  import { requiredRule } from '../../common/utils/validate'
  import TempParams from './components/DaInnerTemplate/TempParams'

  export default {
    name: 'DaInnerTemplate',
    components: { TempParams },
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '内置模板',
        listQuery: {
          tempCode: '',
          tempName: '',
          tempType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '模板名称', key: 'tempName' },
          { title: '模板编码', key: 'tempCode' },
          { title: '模板说明', key: 'tempDesc', tooltip: true },
          { title: '模板操作', slot: 'action', width: 130 }
        ],
        treeData: [],
        template: null,
        params: [],
        ruleValidate: {
          tempName: [requiredRule],
          tempCode: [requiredRule, {
            pattern: /^sys_[a-zA-Z0-9_]+ *$/,
            message: '内置模板sys_开头(包含字母、数字和下划线)',
            trigger: 'blur'
          }],
          tempType: [requiredRule],
          tempSource: [requiredRule]
        }
      }
    },
    created() {
      this.resetTemplate()
      this.initTree()
    },
    methods: {
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.tempType = node.code
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          tempName: '',
          tempCode: ''
        }
      },
      // 根据状态或者是资源标识符来获取fields
      getTempFields(callBack) {
        api.getInnerTempDetail(this.template.id).then(res => {
          this.template = res.data.template
          this.params = res.data.params.map(item => ({ ...item, edit: false }))
          callBack && callBack()
        })
      },
      // 提取模板参数
      extractParams() {
        const str = this.template.tempSource
        // eslint-disable-next-line no-useless-escape
        const reg = /\{\{[\#\/\^]*(\w+)\}\}/g
        const result = str.match(reg).map(item => item.replace(reg, '$1'))
        const params = [...new Set(result)]
        // 当前信息项
        let currentItemsMap = new Map(this.params.map(i => ([i.paramCode, i])))
        params.forEach(p => {
          if (!currentItemsMap.has(p)) {
            currentItemsMap.set(p, {
              paramName: '',
              paramCode: p,
              paramType: 'string',
              isRequired: 'Y',
              defaultVal: '',
              paramDesc: '',
              edit: true,
              newOne: true
            })
          }
        })
        this.params = [...currentItemsMap.values()]
        this.$message({ type: 'success', content: '提取成功，重复编码忽略' })
      },
      // 新增按钮事件
      handleCreate() {
        // 获取资源标识符
        this.resetTemplate()
        this.template.tempCode = 'sys_'
        this.openEditPage('create')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let template = { ...row }
        this.$confirm({
          title: '确实要删除当前模板吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeInnerTemp(template).then(res => {
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
      // 编辑事件
      handleModify(row) {
        this.template = { ...row }
        this.getTempFields(() => {
          this.openEditPage('modify')
        })
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
            // 需要过滤params新增未保存的
            let params = this.params.filter(item => !item.newOne)
            let fun = this.dialogStatus === 'create' ? api.createInnerTemp : api.modifyInnerTemplate
            fun(this.template, params).then(res => {
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
      // 验证是否有未添加的
      checkNewOne() {
        return this.params.reduce((total, current) => current.newOne, false)
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getTemplateTree().then(response => {
          if (response.data.code === '0') {
            const tree = response.data.data[0]
            // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
            let data = tree ? this.treeMapper(tree, null, ['code']) : {}
            this.treeData.push(data)
            if (this.treeData.length > 0) {
              // 如果没有当前选中节点则初始化为第一个选中
              if (!this.currentTreeNode) {
                this.currentTreeNode = this.treeData[0]
                // 这里要注意，扩展响应式属性需要这么写
                this.$set(this.treeData[0], 'selected', true)
                this.$set(this.treeData[0], 'expand', true)
              }
              this.listQuery.tempType = this.currentTreeNode.code
              this.handleFilter()
            }
          }
        })
      },
      // 重置对象
      resetTemplate() {
        this.template = {
          id: '',
          tempName: '',
          tempCode: '',
          tempType: this.currentTreeNode ? this.currentTreeNode.code : '',
          tempSource: '',
          tempDesc: ''
        }
        this.params = []
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getInnerTemplateList(this.listQuery).then(response => {
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
