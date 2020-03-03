<template>
  <div>
    <page-header-wrap v-show="isNormal || isEdit">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="类目名称">
            <b-input v-model.trim="listQuery.classifyName" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="类目编码">
            <b-input v-model.trim="listQuery.classifyCode" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary"
                    v-waves size="small" icon="ios-add"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)">修改</b-button>
            <!--是否有删除键-->
            <template v-if="canRemove">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <b-modal v-model="dialogFormVisible" :title="editTitle"
             append-to-body :mask-closable="false">
      <div class="p15">
        <b-form :model="classify" ref="form" :rules="ruleValidate" :label-width="80">
          <b-form-item label="父级类别">
            <b-alert v-if="currentTreeNode" style="margin: 0;">{{currentTreeNode.title}}</b-alert>
          </b-form-item>
          <b-form-item label="类目名称" prop="classifyName">
            <b-input v-model.trim="classify.classifyName" placeholder="请输入类目名称" clearable :maxlength="30"></b-input>
          </b-form-item>
          <b-form-item label="类目编码" prop="classifyCode">
            <b-input v-model.trim="classify.classifyCode" placeholder="请输入类目编码" clearable
                     :disabled="dialogStatus==='modify'"></b-input>
          </b-form-item>
          <b-form-item label="类目描述" prop="classifyDesc">
            <b-input v-model="classify.classifyDesc" placeholder="请输入描述" type="textarea"></b-input>
          </b-form-item>
        </b-form>
      </div>
      <div slot="footer">
        <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        <b-button @click="handleCancel">取 消</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { requiredRule } from '../../../common/utils/validate'
  import * as api from '../../../api/data-manage/classify.api'

  export default {
    name: 'Classify',
    mixins: [commonMixin, permission],
    data() {
      const validateClassifyName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneClassifyName(this.classify).then(response => {
            if (!response.data.data) {
              callback()
            } else {
              callback(new Error('类目名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateClassifyCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneClassifyCode(this.classify).then(response => {
            if (!response.data.data) {
              callback()
            } else {
              callback(new Error('类目编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        moduleName: '类目',
        listQuery: {
          classifyName: '',
          classifyCode: '',
          parentId: ''
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '类目名称', key: 'classifyName' },
          { title: '类目编码', key: 'classifyCode', align: 'center' },
          { title: '类目描述', key: 'classifyDesc', maxWidth: 300, tooltip: true },
          { title: '操作', slot: 'action', width: 150 }
        ],
        classify: null,
        ruleValidate: {
          classifyName: [requiredRule, { validator: validateClassifyName, trigger: 'blur' }],
          classifyCode: [requiredRule, { validator: validateClassifyCode, trigger: 'blur' }]
        },
        dialogFormVisible: false
      }
    },
    created() {
      this.initTree()
      this.resetClassify()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.parentId = node.id
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          classifyName: '',
          classifyCode: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetClassify()
        this.dialogFormVisible = true
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetClassify()
        this.dialogFormVisible = true
        this.classify = { ...this.classify, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let classify = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前类目吗？`,
          loading: true,
          onOk: () => {
            api.removeClassify(classify).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.initTree()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
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
            let fun = this.dialogStatus === 'create' ? api.createClassify : api.modifyClassify
            fun(this.classify).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.initTree()
              } else {
                this.submitDone(false)
                this.$message({ type: 'danger', content: res.data.message })
              }
              this.dialogFormVisible = false
            })
          }
        })
      },
      // 弹窗取消
      handleCancel() {
        this.dialogStatus = ''
        this.dialogFormVisible = false
      },
      /* [数据接口] */
      // 重置对象
      resetClassify() {
        this.classify = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          classifyName: '',
          classifyCode: '',
          classifyDesc: ''
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getClassifyTree().then(response => {
          const tree = response.data.data
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree ? this.treeMapper(tree) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            // 如果没有当前选中节点则初始化为第一个选中
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              // 这里要注意，扩展响应式属性需要这么写
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.parentId = this.currentTreeNode.id
            this.handleFilter()
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getClassifyList(this.listQuery).then(response => {
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
