<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="资源名称">
            <b-input v-model="listQuery.resourceName" placeholder="请输入节点名称" clearable size="small"></b-input>
          </v-filter-item>
          <v-filter-item title="交换类型" :span="5">
            <b-select v-model="listQuery.changeType" clearable placeholder="全部" size="small">
              <b-option v-for="(value,key) in exchangeTypeMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="信息流向" :span="4">
            <b-select v-model="listQuery.flowDirection" clearable placeholder="全部" size="small">
              <b-option v-for="(value,key) in flowDirectionMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="有效状态" :span="4">
            <b-select v-model="listQuery.availableStatus" clearable placeholder="全部" size="small">
              <b-option v-for="(value,key) in availableStatusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item :span="5" @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary"
                    v-waves size="small" icon="ios-add"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:flowDirection="scope">{{ flowDirectionMap[scope.row.flowDirection] }}</template>
          <template v-slot:changeType="scope">{{ exchangeTypeMap[scope.row.changeType] }}</template>
          <template v-slot:transmitKind="scope">{{ transmitKindMap[scope.row.transmitKind] }}</template>
          <!--有效状态-->
          <template v-slot:availableStatus="scope">
            <span v-if="scope.row.availableStatus==='available'" style="color:#48c9b0;">可用</span>
            <span v-else style="color:#e91e63;">不可用</span>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)">
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
        <template v-if="mission.exInfoDesc" slot="full">
          <v-title-bar label="方案信息" tip-pos="left" class="mb-20"></v-title-bar>
          <b-form :model="mission" ref="form" :rules="ruleValidate" label-position="top">
            <b-row :gutter="20">
              <b-col span="6">
                <b-form-item label="方案名称" prop="cfgName">
                  <b-input v-model="mission.cfgName" disabled></b-input>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="方案编码" prop="cfgCode">
                  <b-input v-model="mission.cfgCode" disabled></b-input>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="资源名称" prop="resourceName">
                  <b-input v-model="mission.resourceName" disabled></b-input>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="元信息名称" prop="metadataName">
                  <b-input v-model="mission.metadataName" disabled></b-input>
                </b-form-item>
              </b-col>
            </b-row>
          </b-form>
          <!--任务配置明细组件-->
          <ex-info-cfg v-model="mission.exInfoDesc"></ex-info-cfg>
          <!--映射关系-->
          <item-map v-model="mission.itemMap" slot="full"></item-map>
        </template>
        <!--新增和修改库对库模式-->
        <template v-else slot="full">
          <b-form :model="mission" ref="form" :rules="ruleValidate" label-position="top">
            <b-row :gutter="20">
              <b-col span="6">
                <b-form-item label="方案名称" prop="configId">
                  <b-input v-if="dialogStatus === 'modify'" v-model="mission.cfgName" disabled></b-input>
                  <scheme-choose v-else v-model="mission.configId" :default-name="mission.cfgName"
                                 @on-change="handleConfigChoose"></scheme-choose>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="方案编码" prop="cfgCode">
                  <b-input v-model="mission.cfgCode" placeholder="选择方案填充" readonly
                           :disabled="dialogStatus === 'modify'"></b-input>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item v-if="isCollect" label="源资源" prop="nodeTableName">
                  <b-input v-if="dialogStatus === 'modify'" v-model="mission.nodeTableName" disabled></b-input>
                  <data-source-table-choose v-else v-model="mission.nodeTableName"
                                            :ds-id="sourceDataSource?sourceDataSource.id:''"
                                            @on-change="handleTableChoose">
                  </data-source-table-choose>
                </b-form-item>
                <b-form-item v-else label="源资源" prop="resourceKey">
                  <b-input v-if="dialogStatus === 'modify'" v-model="mission.resourceName" disabled></b-input>
                  <res-choose v-else v-model="mission.resourceKey" :default-name="mission.resourceName"
                              :ds-id="sourceDataSource?sourceDataSource.id:''"
                              @on-change="handleResourceChoose"></res-choose>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item v-if="isCollect" label="目标资源" prop="resourceKey">
                  <b-input v-if="dialogStatus === 'modify'" v-model="mission.resourceName" disabled></b-input>
                  <res-choose v-else v-model="mission.resourceKey" :default-name="mission.resourceName"
                              :ds-id="sourceDataSource?sourceDataSource.id:''"
                              @on-change="handleResourceChoose"></res-choose>
                </b-form-item>
                <b-form-item v-else label="目标资源" prop="nodeTableName">
                  <b-input v-if="dialogStatus === 'modify'" v-model="mission.nodeTableName" disabled></b-input>
                  <data-source-table-choose v-else v-model="mission.nodeTableName"
                                            :ds-id="sourceDataSource?sourceDataSource.id:''"
                                            @on-change="handleTableChoose">
                  </data-source-table-choose>
                </b-form-item>
              </b-col>
            </b-row>
            <b-collapse value="0" simple>
              <b-collapse-panel title="交换方案名称详情" name="1">
                <div flex="box:mean" v-if="sourceDataSource && targetDataSource">
                  <div style="padding-right: 10px;">
                    <b-tag style="margin-bottom: 15px;">源数据源信息</b-tag>
                    <v-key-label label="数据源名称">{{ sourceDataSource.dataSourceName }}</v-key-label>
                    <v-key-label label="数据库名称">{{ sourceDataSource.dbName }}</v-key-label>
                    <v-key-label label="连接接驱动">{{ sourceDataSource.driverClass }}</v-key-label>
                    <v-key-label label="用户">{{ sourceDataSource.userName }}</v-key-label>
                    <v-key-label label="连接类型">{{ sourceDataSource.dbType }}</v-key-label>
                    <v-key-label label="端口号">{{ sourceDataSource.port }}</v-key-label>
                    <v-key-label label="主机地址" is-bottom>{{ sourceDataSource.host }}</v-key-label>
                  </div>
                  <div style="padding-left: 10px;">
                    <b-tag style="margin-bottom: 15px;">目标数据源信息</b-tag>
                    <v-key-label label="数据源名称">{{ targetDataSource.dataSourceName }}</v-key-label>
                    <v-key-label label="数据库名称">{{ targetDataSource.dbName }}</v-key-label>
                    <v-key-label label="连接接驱动">{{ targetDataSource.driverClass }}</v-key-label>
                    <v-key-label label="用户">{{ targetDataSource.userName }}</v-key-label>
                    <v-key-label label="连接类型">{{ targetDataSource.dbType }}</v-key-label>
                    <v-key-label label="端口号">{{ targetDataSource.port }}</v-key-label>
                    <v-key-label label="主机地址" is-bottom>{{ targetDataSource.host }}</v-key-label>
                  </div>
                </div>
                <b-alert v-else type="error">未选择方案</b-alert>
              </b-collapse-panel>
            </b-collapse>
            <v-title-bar label="信息项映射" class="mb-15"></v-title-bar>
            <info-item-map :one-list="oneFields" :two-list="twoFields"
                           :value="mission.itemMap" @on-change="handleItemMap">
            </info-item-map>
          </b-form>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/data-manage/switching-mission.api'
  import { getAvailableStatus, getExchangeType, getFlowDirection } from '../../../api/enum.api'
  import { getTablesFields } from '../../../api/data-manage/data-source.api'
  import { getFields } from '../../../api/data-manage/res-info.api'
  import { requiredRule } from '../../../common/utils/validate'
  import {
    ExInfoCfg,
    ItemMap,
    SchemeChoose,
    ResChoose,
    DataSourceTableChoose,
    InfoItemMap
  } from './components/SwitchingMission'

  export default {
    name: 'SwitchingMission',
    components: { InfoItemMap, DataSourceTableChoose, ResChoose, SchemeChoose, ItemMap, ExInfoCfg },
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '交换任务',
        listQuery: {
          resourceName: '',
          flowDirection: '',
          changeType: 'AUTO',
          availableStatus: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '资源名称', key: 'resourceName', tooltip: true },
          { title: '交换方案', key: 'cfgName' },
          { title: '信息流向', slot: 'flowDirection', align: 'center', width: 90 },
          { title: '交换类型', slot: 'changeType', align: 'center', width: 90 },
          { title: '资源标识', key: 'resourceKey' },
          { title: '元信息标识', key: 'metadataKey' },
          { title: '有效状态', slot: 'availableStatus', width: 90, align: 'center' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        mission: null, // 任务
        ruleValidate: {
          configId: [requiredRule],
          cfgName: [requiredRule],
          cfgCode: [requiredRule],
          resourceKey: [requiredRule],
          resourceName: [requiredRule],
          metadataName: [requiredRule],
          nodeTableName: [requiredRule]
        },
        sourceDataSource: null,
        targetDataSource: null,
        tableFields: [], // 库表字段
        resFields: [], // 资源列表
        flowDirectionMap: { COLLECT: '归集', SUBMIT: '上报', SHARE: '共享' }, // 信息流向
        exchangeTypeMap: { MANUAL: '人工交换', AUTO: '自动交换' }, // 交换类型
        availableStatusMap: { available: '可用', not_available: '不可用' } // 有效状态
      }
    },
    created() {
      this.getEnum()
      this.resetMission()
      this.searchList()
    },
    computed: {
      //  是否是归集
      isCollect() {
        return this.mission && this.mission.flowDirection === 'COLLECT'
      },
      oneFields() {
        return this.isCollect ? this.tableFields : this.resFields
      },
      twoFields() {
        return this.isCollect ? this.resFields : this.tableFields
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          resourceName: '',
          flowDirection: '',
          changeType: 'AUTO',
          availableStatus: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        this.mission = { ...row }
        this.openEditPage('check')
      },
      // 新增按钮事件
      handleCreate() {
        this.resetMission()
        // 清空已选择的源资源和目标资源
        this.sourceDataSource = null
        this.targetDataSource = null
        // 清空源资源字段和目标字段数组
        this.resFields = []
        this.tableFields = []
        this.canSubmit = false
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.canSubmit = true
        let configId = row.configId
        // 查询cfgCode
        api.getMissionDetail(row.id).then(response => {
          if (!response.data.code || response.data.code !== '0') {
            this.$message({ type: 'danger', content: response.data.message || '任务详情查询出错!' })
            return
          }
          this.mission = response.data.data
          // 判断是否是文件类型
          this.openEditPage('modify')
          // 查询两个数据源
          api.queryDataSourceByCfgId(configId).then(res => {
            if (!res.data.code || res.data.code !== '0') {
              this.$message({ type: 'danger', content: res.data.message || '数据源查询错误!' })
              return
            }
            this.sourceDataSource = res.data.data.sourceDataSource
            this.targetDataSource = res.data.data.targetDataSource
            // 如果是归集模式则分别填充两个列表
            let dsId = this.sourceDataSource.id
            let tableName = this.mission.nodeTableName
            let resourceKey = this.mission.resourceKey
            // 获取tableFields
            getTablesFields(dsId, tableName).then(res => {
              if (res.status === 200) {
                this.tableFields = res.data.map(item => {
                  return { name: item.name, desc: item.desc, required: item.nullable === 0 }
                })
              }
            })
            // 获取resFields
            getFields(resourceKey).then(res => {
              if (res.status === 200) {
                this.resFields = res.data.map(item => {
                  return {
                    name: item.fieldName,
                    desc: item.fieldTitle,
                    type: item.controlType,
                    required: item.required === 'Y'
                  }
                })
              }
            })
          })
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.canSubmit) {
              this.$alert({ type: 'danger', title: '错误', content: '目标资源还有必填字段没有配置映射！' })
              return
            }
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createMission : api.modifyMission
            fun(this.mission).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(false)
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        this.$confirm({
          title: '警告',
          content: `确实要删除当前交换任务吗？`,
          loading: true,
          onOk: () => {
            api.removeMission(row.id).then(res => {
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
      // 方案选择事件
      handleConfigChoose(scheme) {
        this.mission.configId = scheme.id
        this.mission.cfgName = scheme.cfgName
        this.mission.cfgCode = scheme.cfgCode
        // 信息流向，用于判断源资源和目标资源，分别需要选择哪个源资源id
        this.mission.flowDirection = scheme.flowDirection

        // 选中后重新触发校验
        this.$refs.form.validateField('configId')
        this.$refs.form.validateField('cfgCode')
        if (scheme.id && scheme.id !== '') {
          api.queryDataSourceByCfgId(scheme.id).then(res => {
            this.sourceDataSource = res.data.data.sourceDataSource
            this.targetDataSource = res.data.data.targetDataSource
          })
        } else { // 如果清空了则重置两个展示对象
          this.sourceDataSource = null
          this.targetDataSource = null
        }
      },
      // 资源选择（资源信息）
      handleResourceChoose(res) {
        this.mission.resourceKey = res.resourceKey
        this.mission.resourceName = res.resourceName
        this.mission.metadataKey = res.metadataKey
        this.resFields = res.fields.map(item => {
          return {
            name: item.fieldName,
            desc: item.fieldTitle,
            type: item.controlType,
            required: item.required === 'Y'
          }
        }) // 缓存资源列表
        // 选中后重新触发校验
        this.$refs.form.validateField('resourceKey')
      },
      // 资源选择（库表字段）
      handleTableChoose(fields) {
        this.tableFields = fields.map(item => {
          return {
            name: item.name,
            desc: item.desc,
            required: item.nullable === 0
          }
        }) // 缓存资源列表
        // 选中后重新触发校验
        this.$refs.form.validateField('nodeTableName')
      },
      // 字段映射值
      handleItemMap(value, hasRequired) {
        this.mission.itemMap = value
        this.canSubmit = !hasRequired
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
        // 有效状态枚举
        getAvailableStatus().then(res => {
          if (res.status === 200) {
            this.availableStatusMap = res.data.data
          }
        })
      },
      // 重置对象
      resetMission() {
        this.mission = {
          id: '',
          configId: '',
          cfgName: '',
          cfgCode: '',
          flowDirection: '',
          resourceName: '',
          resourceKey: '',
          metadataKey: '',
          metadataName: '',
          exInfoDesc: null, // 任务配置明细
          itemMap: ''
        }
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getMissionList(this.listQuery).then(response => {
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
