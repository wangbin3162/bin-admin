<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"/>
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="资源名称">
            <b-input v-model.trim="listQuery.resourceName" placeholder="标题名称" clearable/>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"/>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:resProperty="{row}">{{ resPropertyMap[row.resProperty] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button :disabled="!canModify" type="text" @click="handleModify(row)">
              修改
            </b-button>
            <b-divider type="vertical"/>
            <b-button :disabled="!canRemove" type="text" @click="handleRemove(row)" text-color="danger">
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
    <page-header-wrap v-if="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <b-form :model="doc" ref="form" :rules="ruleValidate" label-position="top" class="p10">
            <b-row :gutter="10">
              <b-col span="6">
                <b-form-item label="资源信息" prop="resourceName">
                  <common-res-select v-model="doc.resourceKey" :default-name="doc.resourceName"
                                     @on-change="handleChooseRes"/>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="表名称" prop="tableName">
                  <b-input :value="doc.tableName" readonly placeholder="选择资源带入"/>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="资源性质" prop="resProperty">
                  <b-input :value="resPropertyMap[doc.resProperty]" placeholder="选择资源带入"/>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="排序" prop="sortNum">
                  <b-input-number v-model="doc.sortNum" style="width: 100%;"/>
                </b-form-item>
              </b-col>
            </b-row>
          </b-form>
        </b-collapse-wrap>
        <b-collapse-wrap title="信息项">
          <doc-fields-cfg :all-fields="allFields"
                          :field-names="doc.fieldNames" :field-titles="doc.fieldTitles"
                          @on-change="handleFieldsChange"/>
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
  import * as api from '../../api/data-analyze/file-classify.api'
  import { getItemsWithId, getResPropertyTree } from '../../api/data-manage/res-info.api'
  import CommonResSelect from './components/FileClassify/CommonResSelect'
  import DocFieldsCfg from './components/FileClassify/DocFieldsCfg'
  import { deepCopy } from '../../common/utils/assist'

  export default {
    name: 'FileClassify',
    components: { DocFieldsCfg, CommonResSelect },
    mixins: [commonMixin, permission],
    created() {
      this.getEnum()
      this.resetDocs()
      this.initTree()
    },
    data() {
      return {
        moduleName: '内容',
        listQuery: {
          classifyId: '', // 所属分类
          resourceName: ''
        },
        treeData: [],
        columns: [
          { type: 'index', width: 70 },
          { title: '标题', key: 'resourceName' },
          { title: '资源性质', slot: 'resProperty' },
          { title: '排序', key: 'sortNum', align: 'center', width: 90 },
          { title: '操作', slot: 'action', width: 190 }
        ],
        doc: null,
        ruleValidate: {
          resourceName: [{ required: true, message: '必填项', trigger: 'change,blur' }]
        },
        allFields: [], // 已选资源的全部字段
        resPropertyMap: {} // 资源性质平铺
      }
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.classifyId = node.id
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetDocs()
        this.allFields = [] // 已选资源的全部字段
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetDocs()
        this.doc = { ...row }
        getItemsWithId(row.resourceKey).then(resp => {
          this.allFields = resp.data // 已选资源的全部字段
        })
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        this.$confirm({
          title: '确定要删除当前档案分类吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeDocs(row.id).then(res => {
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
            let doc = { ...this.doc }
            let fun = this.dialogStatus === 'create' ? api.createDocs : api.modifyDocs
            fun(doc).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
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
      // 选择资源信息事件
      handleChooseRes(resource, fields) {
        if (resource) {
          let { resourceName, tableName, resProperty } = resource
          this.doc.resourceName = resourceName
          this.doc.tableName = tableName
          this.doc.resProperty = resProperty
        } else {
          this.doc.resourceName = ''
          this.doc.tableName = ''
          this.doc.resProperty = ''
        }
        this.doc.fieldNames = ''
        this.doc.fieldTitles = ''
        this.allFields = deepCopy(fields)
      },
      // 资源信息配置改变
      handleFieldsChange(checkFields) {
        this.doc.fieldNames = checkFields[0]
        this.doc.fieldTitles = checkFields[1]
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          classifyId: this.currentTreeNode ? this.currentTreeNode.id : '', // 类目类别所属分类
          resourceName: ''
        }
        this.handleFilter()
      },
      // 重置对象
      resetDocs() {
        this.doc = {
          id: '',
          classifyId: this.currentTreeNode ? this.currentTreeNode.id : '',
          resourceKey: '',
          resourceName: '',
          tableName: '',
          fieldNames: '',
          fieldTitles: '',
          resProperty: '',
          sortNum: 0
        }
      },
      /* [数据接口] */
      // 通用枚举
      getEnum() {
        // 资源性质树信息 code=B
        getResPropertyTree().then(res => {
          if (res.data.code === '0') {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let temp = []
            let mapper = (node, parentCode) => {
              temp.push({ key: node.code, value: node.text })
              let parents = parentCode ? parentCode.split(',') : []
              parents.push(node.code)
              let child = []
              if (node.children) {
                node.children.forEach(item => {
                  child.push(mapper(item, parents.join(',')))
                })
              }
              return {
                value: node.code,
                label: node.text,
                choose: parents, // 配合级联展开时使用
                children: child
              }
            }
            // 转换级联菜单格式
            let data = tree ? mapper(tree) : {}
            this.resPropertyOptions = data.children || []
            // 转换类型映射值（扁平化）
            temp.forEach(item => {
              this.resPropertyMap[item.key] = item.value
            })
          }
        })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getTreeList().then(response => {
          const tree = response.data.data
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree ? this.treeMapper(tree, null, ['code']) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            // 如果没有当前选中节点则初始化为第一个选中
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.classifyId = this.currentTreeNode.id
            this.handleFilter()
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getDocsConfigList(this.listQuery).then(response => {
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
