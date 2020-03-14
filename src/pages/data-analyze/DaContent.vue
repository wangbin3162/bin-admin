<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"
                :lock-select="lockTreeSelect"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model.trim="listQuery.name"  placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="编码">
            <b-input v-model.trim="listQuery.code"  placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary"
                      icon="ios-add-circle-outline"
                    @click="handleCreate">新 增
          </b-button>
          <template slot="right">
            <b-button type="text" @click="handleBatchOff">批量静态数据</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" @click="handleBatchOn">批量动态数据</b-button>
          </template>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading" ref="table">
          <template v-slot:name="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
          </template>
          <!--状态-->
          <template v-slot:toggle="scope">
            <span v-if="scope.row.toggle=== 'ON'">动态</span>
            <span v-else>静态</span> &nbsp;
            <b-switch
              v-model="scope.row.toggle" :true-value="'ON'" :false-value="'OFF'"
              @on-change="handleChangeStatus(scope.row)">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </b-switch>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <template>
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
        <b-form :model="content" ref="form" :rules="ruleValidate" :label-width="100">
          <b-row>
            <b-col span="12">
              <b-form-item label="名称" prop="name">
                <b-input v-model="content.name"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="编码" prop="code">
                <b-input v-model="content.code"></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="类型" prop="category">
                <b-input v-model="content.category"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="数据来源" prop="toggle">
                <b-select v-model="content.toggle">
                  <b-option value="ON">动态数据</b-option>
                  <b-option value="OFF">静态数据</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="所属主题" prop="themeCode">
                <div flex style="width:100%;">
                  <b-input v-model="content.themeCode" disabled></b-input>
                  <b-button type="primary" @click="handleShowThemeChoose"
                            style="flex:0 0 auto;margin-left:0;font-size: 12px;">选择主题
                  </b-button>
                </div>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="接口" prop="apiId">
                <div flex style="width:100%;">
                  <b-input v-model="content.apiId" disabled></b-input>
                  <b-button type="primary" @click="handleShowApiChoose"
                            style="flex:0 0 auto;margin-left:0;font-size: 12px;">选择接口
                  </b-button>
                </div>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="示例数据" prop="describe">
            <b-input v-model="content.describe" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></b-input>
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
        <div class="p20">
          <v-key-label label="名称">{{ content.name }}</v-key-label>
          <v-key-label label="编码">{{ content.code }}</v-key-label>
          <v-key-label label="所属主题">{{ content.themeCode }}</v-key-label>
          <v-key-label label="接口">{{ content.apiId}}</v-key-label>
          <v-key-label label="静态数据">{{ content.data }}</v-key-label>
          <v-key-label label="备注" is-bottom>{{ content.describe }}</v-key-label>
        </div>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <!--选择接口弹窗-->
    <api-choose ref="apiChoose" @on-choose="handleChooseApi"></api-choose>
    <!--选择主题弹窗-->
    <theme-choose ref="themeChoose" @on-choose="handleChooseTheme"></theme-choose>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as conApi from '../../api/data-analyze/da-content.api'
  import ApiChoose from './components/DaContent/ApiChoose'
  import ThemeChoose from './components/DaContent/ThemeChoose'
  import { requiredRule } from '../../common/utils/validate'

  export default {
    name: 'Content',
    components: { ApiChoose, ThemeChoose },
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
          { type: 'selection', width: 50, align: 'center' },
          { title: '名称', slot: 'name' },
          { title: '编码', key: 'code', align: 'center' },
          { title: '主题', key: 'themeCode', align: 'center', width: 90 },
          { title: '数据来源', slot: 'toggle', align: 'center' },
          { title: '操作', slot: 'action', width: 140 }
        ],
        content: null,
        ruleValidate: {
          name: [requiredRule],
          code: [requiredRule],
          category: [requiredRule],
          toggle: [{ required: true, message: '必填项', trigger: 'change' }],
          themeCode: [{ required: true, message: '必填项', trigger: 'change' }],
          apiId: [{ required: true, message: '必填项', trigger: 'change' }]
        },
        statusMap: { 'I': '初始', 'Y': '启用', 'D': '禁用' },
        apiModel: true
      }
    },
    created() {
      this.resetContent()
      this.initTree()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.themeCode = node.id
        this.listQuery.page = 1
        this.current = 1
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          this.content.themeCode = node.id
        } else {
          this.handleFilter()
        }
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          code: '',
          themeCode: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        this.content = { ...this.content, ...row }
        this.openEditPage('check')
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
        this.openEditPage('modify')
      },
      // 弹窗选择角色
      handleShowDialogChoose() {
        this.$refs.roleChoose && this.$refs.roleChoose.open()
      },
      // 选中一个接口
      handleChooseApi(item) {
        this.content.apiId = item.id
      },
      // 选中一个主题
      handleChooseTheme(item) {
        this.content.themeCode = item.code
      },
      // 表单提交
      handleSubmit() {
        let tmpContent = { ...this.content }
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? conApi.createContent : conApi.modifyContent
            fun(tmpContent).then(res => {
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
      // 单个启用禁用
      handleChangeStatus(row) {
        let content = { ...row }
        conApi.changeStatus(content).then(res => {
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
            conApi.removeContent(content).then(res => {
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
          themeCode: this.currentTreeNode ? this.currentTreeNode.id : '',
          name: '',
          code: '',
          describe: '',
          data: '',
          apiId: '',
          toggle: 'OFF'
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        conApi.getThemeTree().then(response => {
          const list = response.data.data || []
          let root = {
            code: '',
            name: '所有主题',
            children: list
          }

          let mapper = node => {
            return {
              id: node.code,
              title: node.name,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = mapper(root)
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.parentId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
            this.resetQuery()
          }
        })
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        conApi.getContentList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      handleTest() {
        // 测试接口
      },
      handleShowApiChoose() {
        this.$refs.apiChoose && this.$refs.apiChoose.open()
      },
      handleShowThemeChoose() {
        this.$refs.themeChoose && this.$refs.themeChoose.open()
      },
      handleBatchOff() {
        let selections = this.$refs.table.getSelection()
        if (selections.length > 0) {
          let ids = []
          selections.forEach(function (item) {
            ids.push(item.id)
          })
          conApi.batchOff(ids).then(res => {
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
          conApi.batchOn(ids).then(res => {
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
