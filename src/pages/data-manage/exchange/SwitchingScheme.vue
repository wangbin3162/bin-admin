<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="方案名称" :span="4">
            <b-input v-model="listQuery.cfgName" placeholder="请输入节点名称" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="交换类型" :span="4">
            <b-select v-model="listQuery.exchangeType" clearable placeholder="全部">
              <b-option v-for="(value,key) in exchangeTypeMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="信息流向" :span="4">
            <b-select v-model="listQuery.flowDirection" clearable placeholder="全部">
              <b-option v-for="(value,key) in flowDirectionMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="方案状态" :span="4">
            <b-select v-model="listQuery.status" clearable placeholder="全部">
              <b-option v-for="(value,key) in exchangeStatusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item :span="5" @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary" v-if="canCreate"
                    icon="ios-add-circle-outline"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:cfgName="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.cfgName }}</b-button>
          </template>
          <template v-slot:flowDirection="scope">{{ flowDirectionMap[scope.row.flowDirection] }}</template>
          <template v-slot:exchangeType="scope">{{ exchangeTypeMap[scope.row.exchangeType] }}</template>
          <template v-slot:transmitKind="scope">{{ transmitKindMap[scope.row.transmitKind] }}</template>
          <!--状态-->
          <template v-slot:status="scope">
            <b-switch v-model="scope.row.status" true-value="Y" false-value="N"
                      :disabled="!havePermission('changeStatus')||scope.row.isDefault"
                      inactive-color="#ff4949"
                      @on-change="handleChangeStatusFlag(scope.row)">
            </b-switch>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify || scope.row.isDefault" type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <b-divider type="vertical"></b-divider>
            <b-button type="text" :disabled="!canRemove || scope.row.isDefault"
                      text-color="danger" @click="handleRemove(scope.row)">删除
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
        <b-collapse-wrap title="基本信息">
          <b-form :model="scheme" ref="form" :rules="ruleValidate" :label-width="120">
            <b-row>
              <b-col span="12">
                <b-form-item label="方案名称" prop="cfgName">
                  <b-input v-model="scheme.cfgName" placeholder="请输入方案名称" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="运行周期" prop="cronStr">
                  <run-cycle v-model="scheme.cronStr"></run-cycle>
                </b-form-item>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <b-form-item label="信息流向" prop="flowDirection">
                  <b-select v-model="scheme.flowDirection" append-to-body
                            @on-change="flowDirectionChange">
                    <b-option v-for="(value,key) in flowDirectionMap" :key="key" :value="key">{{ value }}</b-option>
                  </b-select>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="所属部门" prop="cfgDeptName">
                  <div flex>
                    <b-input v-model="scheme.cfgDeptName" readonly placeholder="请选择所属部门" clearable></b-input>
                    <b-button type="primary" @click="handleShowModal">
                      选择
                    </b-button>
                  </div>
                </b-form-item>
              </b-col>
            </b-row>
            <template v-if="scheme.flowDirection&&scheme.flowDirection.length>0">
              <b-divider dashed></b-divider>
              <b-row>
                <b-col span="12">
                  <b-form-item label="交换类型" prop="exchangeType">
                    <b-select v-model="scheme.exchangeType"
                              @on-change="changeTypeChange" :disabled="changeTypeDisable">
                      <b-option v-for="(value,key) in exchangeTypeMap" :key="key" :value="key">{{ value }}</b-option>
                    </b-select>
                  </b-form-item>
                </b-col>
                <b-col span="12">
                  <b-form-item label="传输方式" prop="transmitKind">
                    <b-select v-model="scheme.transmitKind"
                              :disabled="scheme.exchangeType==='AUTO'"
                              @on-change="transmitKindChange">
                      <b-option v-for="(value,key) in transmitKindMap" :key="key" :value="key">{{ value }}</b-option>
                    </b-select>
                  </b-form-item>
                </b-col>
              </b-row>
              <b-row>
                <b-col span="12">
                  <b-form-item label="源节点" prop="source">
                    <node-choose :value="scheme.source" :default-name="scheme.nameSource"
                                 :disabled-btn="disableSource"
                                 :node-type="sourceNodeType" @on-select="handleFillSource"></node-choose>
                  </b-form-item>
                </b-col>
                <b-col span="12">
                  <b-form-item label="目标节点" prop="target">
                    <node-choose :value="scheme.target" :default-name="scheme.nameTarget"
                                 :disabled-btn="disableTarget"
                                 node-type="RDBMS" @on-select="handleFillTarget"></node-choose>
                  </b-form-item>
                </b-col>
              </b-row>
            </template>
          </b-form>
        </b-collapse-wrap>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <div>
            <flow-chart
              :source="scheme.nameSource"
              :target="scheme.nameTarget"
              :flow-direction="flowDirectionMap[scheme.flowDirection]"
              :transmit-kind="scheme.transmitKind"/>
          </div>
          <div>
            <b-row>
              <b-col span="12">
                <v-simple-label label="方案名称">{{ scheme.cfgName }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="方案编码">{{ scheme.cfgCode }}</v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <v-simple-label label="交换类型">{{ exchangeTypeMap[scheme.exchangeType] }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="信息流向">{{ flowDirectionMap[scheme.flowDirection] }}</v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <v-simple-label label="原节点">{{ scheme.nameSource }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="传输方式">{{ transmitKindMap[scheme.transmitKind] }}</v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <v-simple-label label="运行周期">{{ scheme.cronStr }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="目标节点">{{ scheme.nameTarget }}</v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <v-simple-label label="状态">{{ exchangeStatusMap[scheme.status] }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="创建周期">{{ scheme.createDate }}</v-simple-label>
              </b-col>
            </b-row>
          </div>
        </b-collapse-wrap>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <dept-choose ref="deptChoose" @on-change="handleChooseDept"/>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/data-manage/switching-scheme.api'
  import { getExchangeStatus, getExchangeType, getFlowDirection, getTransmitKind } from '../../../api/enum.api'
  import { NodeChoose, RunCycle, FlowChart } from './components/SwitchingScheme'
  import { getDefaultNode } from '../../../api/data-manage/switching-node.api'
  import { requiredRule } from '../../../common/utils/validate'
  import DeptChoose from './components/SwitchingMission/DeptChoose'
  // 非空字段提示
  export default {
    name: 'SwitchingScheme',
    components: { NodeChoose, RunCycle, FlowChart, DeptChoose },
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '方案',
        listQuery: {
          cfgName: '',
          flowDirection: '',
          exchangeType: '',
          status: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '交换方案名称', slot: 'cfgName' },
          { title: '信息流向', slot: 'flowDirection', align: 'center', width: 120 },
          { title: '交换类型', slot: 'exchangeType', align: 'center', width: 120 },
          { title: '传输方式', slot: 'transmitKind', align: 'center', width: 120 },
          { title: '信息源', key: 'nameSource' },
          { title: '目标系统', key: 'nameTarget' },
          { title: '状态', slot: 'status', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        scheme: null, // 方案
        ruleValidate: {
          cfgName: [requiredRule],
          cfgDeptName: [{ required: true, message: '必填项', trigger: 'change' }],
          flowDirection: [{ required: true, message: '必填项', trigger: 'change' }],
          cronStr: [{ required: true, message: '必填项', trigger: 'blur,change' }],
          exchangeType: [{ required: true, message: '必填项', trigger: 'change' }],
          transmitKind: [{ required: true, message: '必填项', trigger: 'change' }],
          source: [{ required: true, message: '必填项', trigger: 'change' }],
          target: [{ required: true, message: '必填项', trigger: 'change' }]
        },
        flowDirectionMap: { COLLECT: '归集', SUBMIT: '上报', SHARE: '共享' }, // 信息流向
        exchangeTypeMap: { MANUAL: '人工交换', AUTO: '自动交换' }, // 交换类型
        transmitKindMap: { FILE: '上传文件', FTP: '文件传输', DB_DB: '库对库' }, // 传输方式
        exchangeStatusMap: { Y: '启用', N: '禁用' }
      }
    },
    created() {
      // 获取默认节点code和name
      getDefaultNode().then(res => {
        const { nodeCode, nodeName } = res.data.data
        this.defaultNode = { code: nodeCode, name: nodeName }
      })
      // this.getEnum()
      this.resetScheme()
      this.searchList()
    },
    computed: {
      changeTypeDisable() {
        return this.scheme && this.scheme.flowDirection !== 'COLLECT'
      },
      sourceNodeType() {
        return this.scheme && this.scheme.exchangeType === 'MANUAL' &&
        (this.scheme.transmitKind === 'FILE' || this.scheme.transmitKind === 'FTP')
          ? 'FILE' : 'RDBMS'
      },
      disableSource() {
        // 只要是归集的，目标节点都为隐藏选择
        return this.scheme && this.scheme.flowDirection !== 'COLLECT'
      },
      disableTarget() {
        // 只要是归集的，目标节点都为隐藏选择
        return this.scheme && this.scheme.flowDirection === 'COLLECT'
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          cfgName: '',
          flowDirection: '',
          exchangeType: '',
          status: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        // 判断是否是文件系统
        this.scheme = { ...row }
        this.openEditPage('check')
      },
      // 新增按钮事件
      handleCreate() {
        this.resetScheme()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetScheme()
        this.scheme = { ...this.scheme, ...row }
        this.openEditPage('modify')
      },
      // 单个启用禁用
      handleChangeStatusFlag(row) {
        let scheme = { ...row }
        api.changeStatus(scheme).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            this.handleFilter()
          } else {
            this.$message({ type: 'danger', content: '操作失败' })
          }
        })
      },
      handleShowModal() {
        this.$refs.deptChoose && this.$refs.deptChoose.open()
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createScheme : api.modifyScheme
            fun(this.scheme).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(true)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        this.$confirm({
          title: '确实要删除当前交换方案吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeScheme(row.id).then(res => {
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
      // 信息流向改变事件
      flowDirectionChange(value) {
        // 如果是归集
        if (value === 'COLLECT') {
          // 则默认交换类型为人工交换
          this.scheme.exchangeType = 'MANUAL'
          // 传输方式为文件
          this.scheme.transmitKind = 'FILE'
          // 源节点默认为文件
          this.scheme.source = ''
          this.scheme.nameSource = ''
          // 目标节点设置为默认
          this.scheme.target = this.defaultNode.code
          this.scheme.nameTarget = this.defaultNode.name
        } else { // 如果是上报和共享
          // 则默认交换类型为自动交换
          this.scheme.exchangeType = 'AUTO'
          // 传输方式为库对库
          this.scheme.transmitKind = 'DB_DB'
          // 原节点设置为默认
          this.scheme.source = this.defaultNode.code
          this.scheme.nameSource = this.defaultNode.name
          // 目标节点待选择
          this.scheme.target = ''
          this.scheme.nameTarget = ''
        }
      },
      // 交换类型改变事件
      changeTypeChange(value) {
        // 如果是自动交换，则设置传输方式设置为库对库交换
        if (value === 'AUTO') {
          this.scheme.transmitKind = 'DB_DB'
          // 源节点默认为可选
          this.scheme.source = ''
          this.scheme.nameSource = ''
          // 目标节点设置为默认
          this.scheme.target = this.defaultNode.code
          this.scheme.nameTarget = this.defaultNode.name
        } else {
          // 传输方式为文件
          this.scheme.transmitKind = 'FILE'
          // 源节点默认为文件
          this.scheme.source = ''
          this.scheme.nameSource = ''
          // 目标节点设置为默认
          this.scheme.target = this.defaultNode.code
          this.scheme.nameTarget = this.defaultNode.name
        }
      },
      // 传输方式改变事件
      transmitKindChange(value) {
        // 如果是自动交换，则设置传输方式设置为库对库交换
        if (value === 'FILE' || value === 'FTP') {
          this.scheme.source = ''
          this.scheme.nameSource = ''
          // 目标节点设置为默认
          this.scheme.target = this.defaultNode.code
          this.scheme.nameTarget = this.defaultNode.name
        } else { // 库对库
          // 原节点设置为默认
          this.scheme.source = ''
          this.scheme.nameSource = ''
          // 目标节点设置为默认
          this.scheme.target = this.defaultNode.code
          this.scheme.nameTarget = this.defaultNode.name
        }
      },
      // 填充source
      handleFillSource(obj) {
        this.scheme.source = obj.code
        this.scheme.nameSource = obj.name
      },
      // 填充target
      handleFillTarget(obj) {
        this.scheme.target = obj.code
        this.scheme.nameTarget = obj.name
      },
      // 填充cronstr
      handleCronStr(cronStr) {
        this.scheme.cronStr = cronStr
      },
      // 填充cronstr
      handleCronChange(cronStr) {
        this.scheme.cronStr = cronStr
      },
      /* [数据接口] */
      // 通用枚举
      getEnum() {
        // 交换方案信息流向枚举
        getFlowDirection().then(res => {
          if (res.status === 200) {
            this.flowDirectionMap = res.data.data
          }
        })
        // 交换方案交换类型枚举
        getExchangeType().then(res => {
          if (res.status === 200) {
            this.exchangeTypeMap = res.data.data
          }
        })
        // 交换方案传输方式枚举
        getTransmitKind().then(res => {
          if (res.status === 200) {
            this.transmitKindMap = res.data.data
          }
        })
        // 交换方案状态枚举
        getExchangeStatus().then(res => {
          if (res.status === 200) {
            this.exchangeStatusMap = res.data.data
          }
        })
      },
      // 重置对象
      resetScheme() {
        this.scheme = {
          id: '',
          cfgName: '',
          cfgCode: '',
          flowDirection: 'COLLECT',
          exchangeType: '',
          transmitKind: '',
          source: '',
          target: '',
          cronStr: '',
          nameSource: '',
          nameTarget: '',
          cfgDept: '',
          cfgDeptName: ''
        }
      },
      // 选择部门
      handleChooseDept(dept) {
        // 没有选过值，关闭，则重置为自定义，否则跳过
        this.scheme.cfgDept = dept.id
        this.scheme.cfgDeptName = dept.value
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getSchemeList(this.listQuery).then(response => {
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
