<template>
  <div>
    <page-header-wrap v-show="visible && !batchDialog" show-close @on-close="close"
      :title="`[${cfgTitle}] 响应信息配置`">
      <v-table-wrap>
        <div slot="tree">
          <div class="mb-15">
            <b-tooltip content="新增根节点">
              <b-button icon="ios-add-circle-outline" @click="handleCreateRoot" :disabled="!isRootNode"/>
            </b-tooltip>
            <b-tooltip content="编辑当前节点">
              <b-button icon="ios-create" @click="handleModifyRoot" :disabled="isRootNode"/>
            </b-tooltip>
            <b-tooltip content="移除当前节点">
              <b-button icon="ios-remove-circle-outline" @click="handleRemove(currentTreeNode)" :disabled="isRootNode"/>
            </b-tooltip>
          </div>
          <b-tree :data="treeData" @on-select-change="handTreeCurrentChange"/>
        </div>
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline"
            @click="handleCreate" :disabled="isRootNode || needEdit">
            新 增
          </b-button>
          <b-button v-if="canCreate" icon="ios-medkit"
            @click="handleCreateBatch" :disabled="isRootNode || needEdit">
            批量新增
          </b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:respKind="{row}">
            <b-tag type="success" v-if="row.respKind==='RECORD'" size="mini">{{ respTypeMap[row.respKind] }}</b-tag>
            <b-tag type="primary" v-else size="mini">{{ respTypeMap[row.respKind] }}</b-tag>
          </template>
          <template v-slot:dataType="{row}">{{ dataTypeMap[row.dataType] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button :disabled="!canModify" type="text" @click="handleModify(row)">修改</b-button>
            <!--是否有删除键-->
            <template v-if="canRemove">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>

      <div class="mt-20">
        <interface-test v-if="openInterfaceTest" :initParam="interfaceTestInitParam">
        </interface-test>
      </div>
    </page-header-wrap>
    <page-header-wrap v-show="batchDialog" :title="`${currentTreeNode?currentTreeNode.title:''}批量添加响应`"
                      show-close @on-close="batchDialog = false">
      <v-edit-wrap>
        <div>
          <b-alert closable>手动输入或复制粘贴json文本至下面编辑框，确保无误后点击转换添加列表。<span slot="close">不再提示</span></b-alert>
          <b-ace-editor v-model="batchStr"/>
          <div class="p15 t-center">
            <b-button type="success" plain icon="ios-barcode" @click="formatCode">
              格式化
            </b-button>
            <b-button type="primary" plain icon="ios-list-box" :disabled="batchStr.length===0"
                      @click="batchStrChange">转换为添加列表
            </b-button>
          </div>
          <!-- <resp-params v-model="batchItemList" :data-type-map="dataTypeMap"
                       :biz-id="listQuery.bizId"
                       :parent-id="currentTreeNode?currentTreeNode.id:''"
                       resp-kind="RECORD"/> -->
        </div>
        <!--保存提交-->
        <div slot="footer">
          <b-button @click="batchDialog = false">取 消</b-button>
          <b-button type="primary" @click="handleBatchSubmit" :loading="batchLoading">提 交</b-button>
        </div>
      </v-edit-wrap>
    </page-header-wrap>
    <!--新增修改编辑-->
    <b-drawer v-model="drawerVisible" :title="`编辑响应${resp.parentId?'':'根'}节点`"
              width="720" :mask-closable="false">
      <b-form :model="resp" :rules="ruleValidate" ref="form" label-position="top">
        <b-row :gutter="20">
          <b-col span="12">
            <b-form-item label="响应类型" prop="respKind">
              <b-select v-model="resp.respKind" placeholder="请选择" clearable>
                <b-option v-for="(value,key) in respTypeMap" :key="key" :value="key">{{ value }}</b-option>
              </b-select>
            </b-form-item>
          </b-col>
          <b-col span="12">
            <b-form-item label="键名" prop="keyName">
              <b-input v-model="resp.keyName" placeholder="请输入键名" clearable @on-change="keyNameChange"/>
            </b-form-item>
          </b-col>
        </b-row>
        <b-row :gutter="20">
          <b-col span="12">
            <b-form-item label="别名" prop="keyAlias">
              <b-input v-model="resp.keyAlias" placeholder="别名建议和键名一致" clearable/>
            </b-form-item>
          </b-col>
          <b-col span="12">
            <b-form-item label="键路径" prop="keyPath">
              <b-input v-model="resp.keyPath" placeholder="键路径一般是'/键名'" clearable/>
            </b-form-item>
          </b-col>
        </b-row>
        <b-row :gutter="20">
          <b-col span="12">
            <b-form-item label="数据类型" prop="dataType">
              <b-select v-model="resp.dataType" placeholder="请选择" clearable>
                <b-option v-for="(value,key) in dataTypeMap" :key="key" :value="key">{{ value }}</b-option>
              </b-select>
            </b-form-item>
          </b-col>
          <b-col span="12">
            <b-form-item label="序号" prop="orderNo">
              <b-input-number :min="1" v-model="resp.orderNo" style="width: 100%;"/>
            </b-form-item>
          </b-col>
        </b-row>
        <b-form-item label="标题" prop="title">
          <b-input v-model="resp.title" placeholder="请输入标题"/>
        </b-form-item>
        <b-form-item label="说明" prop="memo">
          <b-input v-model="resp.memo" type="textarea" placeholder="请输入响应说明"/>
        </b-form-item>
      </b-form>
      <div slot="footer">
        <b-button @click="drawerVisible = false">取 消</b-button>
        <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
      </div>
    </b-drawer>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import { requiredRule } from '../../../../common/utils/validate'
  import * as api from '../../../../api/analyze-engine/da-business-temp.api.js'
  import { queryLeftRespInfos } from '../../../../api/data-analyze/da-content.api'
  import RespParams from '../../../analyze-engine/components/DaBizTemplate/RespParams'
  import InterfaceTest from './InterfaceTest'

  export default {
    name: 'ResponseConfigPanelAnalyzeCon',
    components: { RespParams, InterfaceTest },
    mixins: [commonMixin, permission],
    data() {
      return {
        visible: false,
        listQuery: {
          bizId: ''
        },
        cfgTitle: '',
        resp: null,
        ruleValidate: {
          respKind: [{ required: true, message: '类型必选', trigger: 'change' }],
          keyName: [requiredRule, {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
            message: '字母开头(包含字母、数字和下划线)',
            trigger: 'blur'
          }],
          keyAlias: [requiredRule, {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
            message: '字母开头(包含字母、数字和下划线)',
            trigger: 'blur'
          }],
          keyPath: [requiredRule, {
            pattern: /^(\/[a-zA-Z0-9_]+)+$/,
            message: '合法路径以/开头(包含字母、数字和下划线)',
            trigger: 'blur'
          }]
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '键名', key: 'keyName' },
          { title: '别名', key: 'keyAlias' },
          { title: '键路径', key: 'keyPath' },
          { title: '标题', key: 'title' },
          { title: '响应类型', slot: 'respKind', align: 'center', width: 90 },
          { title: '数据类型', slot: 'dataType', align: 'center', width: 90 },
          { title: '说明', key: 'memo' },
          { title: '操作', slot: 'action', width: 130 }
        ],
        drawerVisible: false,
        batchDialog: false,
        batchLoading: false,
        batchStr: '',
        batchItemList: [],
        respTypeMap: { QUERY: '查询', METRIC: '度量', BUCKET: '分组', RECORD: '记录' },
        dataTypeMap: {
          string: '字符',
          long: '整数',
          double: '小数',
          date: '日期',
          datetime: '日期时间',
          boolean: '布尔',
          map: 'map集合'
        },
        // 以下为重构后需要的参数
        interfaceTestInitParam: null, // 接口测试组件interface-test需要使用的参数
        openInterfaceTest: false // 用于控制interface-test组件测生命周期
      }
    },
    computed: { // 重构新增计算属性
      isRootNode () { // 用于判断当前选中的节点是否是根节点
        let res = false
        if (this.currentTreeNode && this.currentTreeNode.root) res = true
        return res
      },
      needEdit () { // 用于判断子节点是否需要编辑
        let res = false
        if (this.currentTreeNode && !this.currentTreeNode.root) {
          if (this.currentTreeNode.id === null) res = true
        }
        return res
      }
    },
    created() {
      this.resetResp(null, null)
      this.getEnum()
    },
    methods: {
      open(bizId, title, mappingFields) {
        this.interfaceTestInitParam = { // 封装interface-test组件需要使用的参数
          contentId: bizId,
          mappingFields
        }
        this.listQuery.bizId = bizId
        this.cfgTitle = title
        this.visible = true
        this.queryLeftRespInfos(bizId)
        this.openInterfaceTest = true // 用于控制interface-test组件测生命周期
      },
      close() {
        this.visible = false
        this.treeData = []
        this.list = []
        this.currentTreeNode = null
        this.openInterfaceTest = false
        this.$emit('on-close')
      },
      /**
       * @author haodongdong
       * @description b-tree组件当前节点改变事件回调
       * @param {Array} data 选中的节点数组
       * @param {Object} node 当前节点
       */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node // 此处需要放在this.handleFilter() 上面，因为searchList内会取currentTreeNode.id
        if (!node.root && node.id !== null) {
          this.handleFilter()
        } else {
          this.list = []
        }
      },
      // 添加跟响应节点
      handleCreateRoot() {
        this.resetResp(null, this.currentTreeNode.apiId)
        this.openEditPage('create')
        this.drawerVisible = true
      },
      // 编辑节点事件
      handleModifyRoot() {
        this.resp = { ...this.currentTreeNode.obj }
        this.openEditPage('modify')
        this.drawerVisible = true
      },
      handleCreate() {
        if (!this.currentTreeNode) {
          this.$message({ type: 'danger', content: '请选择一个响应节点后再新增！' })
          return
        }
        this.resetResp(this.currentTreeNode.id, this.currentTreeNode.apiId)
        this.openEditPage('create')
        this.drawerVisible = true
      },
      // 批量新增记录节点
      handleCreateBatch() {
        if (!this.currentTreeNode) {
          this.$message({ type: 'danger', content: '请选择一个响应节点后再新增！' })
          return
        }
        this.batchStr = ''
        this.batchItemList = []
        this.batchDialog = true
      },
      // 格式化编辑器
      formatCode() {
        try {
          this.batchStr = JSON.stringify(JSON.parse(this.batchStr), null, 2)
        } catch (e) {

        }
      },
      // 将json转换为item对象
      batchStrChange() {
        try {
          // 转换为标准js对象
          const passObj = JSON.parse(this.batchStr)
          let keys = Object.keys(passObj)
          // 当前参数信息
          let currentItemsMap = new Map(this.batchItemList.map(i => ([i.keyName, i])))
          keys.forEach(key => {
            if (!currentItemsMap.has(key)) {
              currentItemsMap.set(key, {
                bizId: this.listQuery.bizId,
                parentId: this.currentTreeNode.id,
                respKind: 'RECORD',
                keyName: key,
                keyAlias: key,
                keyPath: `/${key}`,
                dataType: 'string',
                orderNo: 1,
                title: key,
                edit: true,
                newOne: true
              })
            }
          })
          this.batchItemList = [...currentItemsMap.values()]
        } catch (e) {
          this.$message({ type: 'danger', content: '数据源不是标准json，无法批量添加！' })
        }
      },
      handleBatchSubmit() {
        this.batchLoading = true
        // 需要过滤params新增未保存的
        let params = this.batchItemList.filter(item => !item.newOne)
        api.batchAddResp(params).then(res => {
          this.batchLoading = false // 按钮状态清空
          if (res.data.code === '0') {
            this.batchDialog = false
            this.$message({ type: 'success', content: '操作成功' })
            this.handleFilter()
          } else {
            this.$notice.danger({ title: '操作错误', desc: res.data.message })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let resp = { ...row }
        this.$confirm({
          title: '确实要删除当前响应节点吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeResp(resp.id).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleRefresh(resp.respKind)
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
        this.resetResp(this.currentTreeNode.id, row.apiId)
        this.resp = { ...row }
        this.openEditPage('modify')
        this.drawerVisible = true
      },
      // 键名更改事件
      keyNameChange() {
        this.resp.keyAlias = this.resp.keyName
        this.resp.keyPath = '/' + this.resp.keyName
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            // 需要过滤params新增未保存的
            // let fun = this.dialogStatus === 'create' ? api.addResp : api.modifyResp
            let fun = null
            if (this.dialogStatus === 'create') { // 重构 添加新的判断逻辑
              fun = api.addResp
            } else {
              if (this.resp.id === null) {
                fun = api.addResp
              } else {
                fun = api.modifyResp
              }
            }
            fun(this.resp).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.drawerVisible = false
                this.handleRefresh(this.resp.respKind)
              } else {
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 根据删除新增的类型来判断是否要刷新树
      handleRefresh(type) {
        if (type === 'RECORD') {
          this.handleFilter()
        } else {
          this.queryLeftRespInfos(this.listQuery.bizId)
        }
      },
      // 重置响应对象
      resetResp(parentId, apiId) {
        this.resp = {
          bizId: this.listQuery.bizId,
          apiId, // 重构时添加
          parentId,
          keyName: '',
          keyAlias: '',
          keyPath: '',
          respKind: '',
          dataType: '',
          memo: '',
          orderNo: 1,
          title: ''
        }
      },
      // 获取enum
      getEnum() {
        api.getRespTypeEnum().then(res => {
          if (res.data.code === 0) {
            this.respTypeMap = res.data.data
          }
        })
        api.getDataTypeEnum().then(res => {
          if (res.data.code === 0) {
            this.dataTypeMap = res.data.data
          }
        })
      },
      // 查询所有列表
      searchList() {
        if (!this.currentTreeNode) {
          return
        }
        this.setListData()
        api.getRespList(this.currentTreeNode.id, this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      /**
       * @author haodongdong
       * @description 重构 构建树，由于业务需求，此处树只有两层，所以做简单的二重循环处理。
       * @param {Array} tree 待处理的树结构数据
       * @returns {Array}
       */
      buildTree (tree) {
        tree.forEach((item, index) => {
          item.selected = false
          item.expand = true
          item.root = true

          if (item.children && item.children.length) {
            item.children.forEach((subItem, subIndex) => {
              subItem.obj = { ...subItem } // 需要提交的数据结构放入obj字段
              if (index === 0 && subIndex === 0) { // 如果是第一个根节点的第一个子节点则设置默认选中
                subItem.selected = true
                this.currentTreeNode = subItem
                this.handleFilter()
              } else {
                subItem.selected = false
              }
              subItem.expand = false
              subItem.title = subItem.id === null ? `(请编辑) ${subItem.keyName}` : subItem.keyName
            })
          }
        })
        return tree
      },
      // 重构 获取左侧树
      async queryLeftRespInfos (id) {
        try {
          const res = await queryLeftRespInfos(id)
          this.treeData = this.buildTree(res)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>
