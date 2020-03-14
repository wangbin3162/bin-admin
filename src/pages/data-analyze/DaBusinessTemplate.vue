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
            <b-input v-model.trim="listQuery.tempName"  placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="模板编码">
            <b-input v-model.trim="listQuery.tempCode"  placeholder="请输入" clearable></b-input>
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
          <template v-slot:tempName="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.tempName }}</b-button>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)">修改</b-button>
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
        <template slot="full">
          <v-title-bar label="模板信息" class="mb-15"/>
          <b-row type="flex" justify="end">
            <b-col span="18">
              <b-form :model="template" ref="form" :rules="ruleValidate" :label-width="130">
                <b-row>
                  <b-col span="12">
                    <b-form-item label="模板名称" prop="tempName">
                      <b-input v-model="template.tempName" placeholder="请输入模板名称" clearable></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="模板编码" prop="tempCode">
                      <b-input v-model="template.tempCode" placeholder="编码为biz_开头" clearable
                               :disabled="dialogStatus==='modify'"></b-input>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-form-item label="模板脚本" prop="tempSource">
                  <b-input v-model="template.tempSource" placeholder="请输入模板脚本" type="textarea" :rows="4"></b-input>
                </b-form-item>
                <b-form-item label="模板说明" prop="tempDesc">
                  <b-input v-model="template.tempDesc" placeholder="请输入模板说明" type="textarea" :rows="4"></b-input>
                </b-form-item>
              </b-form>
            </b-col>
            <b-col span="4">
              <div style="padding:58px 0 0 20px;">
                <b-button @click="handleOpenInner">提取内置模板</b-button>
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
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap v-if="template&&currentTreeNode">
        <div slot="full">
          <v-title-bar label="模板信息" class="mb-15"/>
          <v-key-label label="模板名称" is-half is-first>{{ template.tempName }}</v-key-label>
          <v-key-label label="所属类型" is-half>{{ currentTreeNode.title }}</v-key-label>
          <v-key-label label="模板编码" is-half is-first>{{ template.tempCode }}</v-key-label>
          <v-key-label label="创建人" is-half>{{ template.createBy }}</v-key-label>
          <v-key-label label="模板脚本">{{ template.tempSource }}</v-key-label>
          <v-key-label label="模板描述" is-bottom>{{ template.tempDesc }}</v-key-label>
          <v-title-bar label="参数信息" class="mt-20 mb-15"/>
          <!--max-height="432"-->
          <b-table disabled-hover :data="params" :columns="paramsColumns" size="small"></b-table>
        </div>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <InnerTempChoose ref="innerTempModal" @on-choose="handleChooseTemp"/>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/data-analyze/da-business-temp.api.js'
  import { requiredRule } from '../../common/utils/validate'
  import TempParams from './components/DaInnerTemplate/TempParams'
  import InnerTempChoose from './components/DaInnerTemplate/InnerTempChoose' // 使用同内置模板模块

  export default {
    name: 'DaBusinessTemplate',
    components: { InnerTempChoose, TempParams },
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '业务模板',
        listQuery: {
          tempCode: '',
          tempName: '',
          tempType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '模板名称', slot: 'tempName' },
          { title: '模板编码', key: 'tempCode' },
          { title: '模板说明', key: 'tempDesc' },
          { title: '模板操作', slot: 'action', width: 130, align: 'center' }
        ],
        treeData: [],
        template: null,
        params: [],
        paramsColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '参数名称', key: 'paramName' },
          { title: '参数编码', key: 'paramCode' },
          { title: '参数类型', key: 'paramType' },
          { title: '是否必填', key: 'isRequired' },
          { title: '默认', key: 'defaultVal' },
          { title: '参数说明', key: 'paramDesc' }
        ],
        ruleValidate: {
          tempName: [requiredRule],
          tempCode: [requiredRule, {
            pattern: /^biz_[a-zA-Z0-9_]+ *$/,
            message: '内置模板biz_开头(包含字母、数字和下划线)',
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
      // 查看按钮事件
      handleCheck(row) {
        this.template = { ...row }
        this.getTempFields(() => {
          this.openEditPage('check')
        })
      },
      // 根据状态或者是资源标识符来获取fields
      getTempFields(callBack) {
        api.getBusinessTempDetail(this.template.id).then(res => {
          this.template = res.data.template
          this.params = res.data.params.map(item => ({ ...item, edit: false }))
          callBack && callBack()
        })
      },
      // 新增按钮事件
      handleCreate() {
        // 获取资源标识符
        this.resetTemplate()
        this.template.tempCode = 'biz_'
        this.openEditPage('create')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let template = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前模板吗？`,
          loading: true,
          onOk: () => {
            api.removeBusinessTemp(template).then(res => {
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
      // 打开提取内置模板面板
      handleOpenInner() {
        this.$refs.innerTempModal && this.$refs.innerTempModal.open()
      },
      handleChooseTemp(temp) {
        this.template.tempSource = temp.tempSource
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            // 需要过滤params新增未保存的
            let params = this.params.filter(item => !item.newOne)
            let fun = this.dialogStatus === 'create' ? api.createBusinessTemp : api.modifyBusinessTemplate
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
        api.getBusinessTemplateList(this.listQuery).then(response => {
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
