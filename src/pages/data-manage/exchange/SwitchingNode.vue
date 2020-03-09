<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="节点名称">
            <b-input v-model="listQuery.nodeName" placeholder="请输入节点名称" size="small" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="节点类型">
            <b-select v-model="listQuery.nodeType" clearable placeholder="全部" size="small">
              <b-option v-for="(value,key) in nodeTypeMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary"
                    v-waves size="small" icon="ios-add"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--节点名称-->
          <template v-slot:nodeName="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.nodeName }}</b-button>
          </template>
          <!--节点类型-->
          <template v-slot:nodeType="scope">{{ nodeTypeMap[scope.row.nodeType] }}</template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify || scope.row.isDefault" type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <template v-if="canRemove && !scope.row.isDefault">
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
    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <b-form :model="exchangeNode" ref="form" :rules="ruleValidate" :label-width="120">
          <b-row>
            <b-col span="12">
              <b-form-item label="节点名称" prop="nodeName">
                <b-input v-model="exchangeNode.nodeName" placeholder="请输入节点名称" :maxlength="20" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="节点类型" prop="nodeType">
                <b-select v-model="exchangeNode.nodeType" placeholder="全部"
                          @on-change="handleNodeTypeChange">
                  <b-option v-for="(value,key) in nodeTypeMap" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="节点编码" prop="nodeCode">
                <b-input v-model="exchangeNode.nodeCode" placeholder="请输入节点编码" :maxlength="20" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="节点描述" prop="nodeDesc">
                <b-input v-model="exchangeNode.nodeDesc" placeholder="请输入节点描述" :maxlength="100" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="文件类型" prop="infoSource" v-if="exchangeNode.nodeType==='FILE'">
                <b-select v-model="exchangeNode.infoSource" clearable>
                  <b-option value="Excel" label="Excel"></b-option>
                  <b-option value="txt" label="txt"></b-option>
                  <b-option value="xml" label="xml"></b-option>
                </b-select>
              </b-form-item>
              <b-form-item label="引用数据源" prop="infoSource" v-else>
                <data-source-choose v-model="exchangeNode.infoSource"
                                    :default-name="exchangeNode.nameSource"></data-source-choose>
              </b-form-item>
            </b-col>
          </b-row>
        </b-form>
        <!--保存提交-->
        <template slot="footer">
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <v-title-bar label="节点详情" class="mb-15"></v-title-bar>
        <div style="user-select:text;">
          <v-key-label label="节点名称" is-half is-first>{{ exchangeNode.nodeName }}</v-key-label>
          <v-key-label label="节点类型" is-half>{{ exchangeNode.nodeType }}</v-key-label>
          <v-key-label label="节点编码" is-half is-first is-bottom>{{ exchangeNode.nodeCode }}</v-key-label>
          <v-key-label label="节点描述" is-half is-bottom>{{ exchangeNode.nodeDesc }}</v-key-label>
        </div>
        <template v-if="exchangeNode.dataSourceDto">
          <v-title-bar label="数据源详情" class="mt-15 mb-15"></v-title-bar>
          <div style="user-select:text;">
            <v-key-label label="数据源名称" is-half is-first>{{ exchangeNode.dataSourceDto.dataSourceName }}</v-key-label>
            <v-key-label label="连接类型" is-half>{{ exchangeNode.dataSourceDto.dbType }}</v-key-label>
            <v-key-label label="数据库名称" is-half is-first>{{ exchangeNode.dataSourceDto.dbName }}</v-key-label>
            <v-key-label label="连接驱动" is-half>{{ exchangeNode.dataSourceDto.driverClass }}</v-key-label>
            <v-key-label label="主机地址" is-half is-first>{{ exchangeNode.dataSourceDto.host }}</v-key-label>
            <v-key-label label="端口号" is-half>{{ exchangeNode.dataSourceDto.port }}</v-key-label>
            <v-key-label label="用户名" is-bottom>{{ exchangeNode.dataSourceDto.userName }}</v-key-label>
          </div>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/data-manage/switching-node.api'
  import { getExchangeNodeType } from '../../../api/enum.api'
  import { requiredRule } from '../../../common/utils/validate'
  import { DataSourceChoose } from './components/SwitchingNode'

  export default {
    name: 'SwitchingNode',
    components: { DataSourceChoose },
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '节点',
        listQuery: {
          nodeName: '',
          nodeType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '节点名称', slot: 'nodeName', tooltip: true, width: 300 },
          { title: '节点编码', key: 'nodeCode', align: 'center', width: 120 },
          { title: '节点类型', slot: 'nodeType', align: 'center' },
          { title: '节点描述', key: 'nodeDesc', tooltip: true },
          { title: '引用数据源', key: 'nameSource' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        exchangeNode: null,
        ruleValidate: {
          nodeName: [requiredRule],
          nodeType: [{ required: true, message: '必填项', trigger: 'change' }],
          nodeCode: [requiredRule],
          nodeDesc: [requiredRule],
          infoSource: [{ required: true, message: '必填项', trigger: 'change' }]
        },
        nodeTypeMap: {}
      }
    },
    created() {
      this.getEnum()
      this.resetNode()
      this.searchList()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          nodeName: '',
          nodeType: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        // 判断是否是文件系统
        const isFile = row.nodeType === 'FILE'
        if (isFile) {
          this.exchangeNode = { ...row }
          this.openEditPage('check')
        } else {
          api.getNodeDetail(row.id).then(res => {
            if (res.data.code === '0') {
              this.exchangeNode = res.data.data
              this.openEditPage('check')
            }
          })
        }
      },
      // 新增按钮事件
      handleCreate() {
        this.resetNode()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetNode()
        this.exchangeNode = { ...this.exchangeNode, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        this.$confirm({
          title: '警告',
          content: `确实要删除当前节点吗？`,
          loading: true,
          onOk: () => {
            api.removeNode(row.id).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
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
            let fun = this.dialogStatus === 'create' ? api.createNode : api.modifyNode
            fun(this.exchangeNode).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                // this.submitDone(false)
                this.btnLoading = false // 按钮状态清空
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 节点类型改变事件
      handleNodeTypeChange(value) {
        this.exchangeNode.infoSource = ''
        this.$refs.form.validateField('infoSource')
      },
      /* [数据接口] */
      // 通用枚举
      getEnum() {
        // 数据源类型枚举
        getExchangeNodeType().then(res => {
          if (res.status === 200) {
            this.nodeTypeMap = res.data.data
          }
        })
      },
      // 重置对象
      resetNode() {
        this.exchangeNode = {
          id: '',
          nodeName: '',
          nodeCode: '',
          nodeType: 'RDBMS',
          nodeDesc: '',
          infoSource: '',
          nameSource: '',
          dataSourceDto: null
        }
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getExchangeNodeList(this.listQuery).then(response => {
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
