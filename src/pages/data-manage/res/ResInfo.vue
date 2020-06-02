<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="资源名称" :span="8">
            <b-input v-model.trim="listQuery.resourceName" placeholder="资源名称(中文名)" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="资源性质" :span="8">
            <v-cascade :data="resPropertyOptions" v-model="listQuery.resProperty" style="width: 100%;"></v-cascade>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item :span="8" @on-search="handleFilter" @on-reset="resetQuery"
                         :show-toggle="true" :is-opened="filterOpened" @on-toggle="filterOpened=!filterOpened"/>
          <template v-if="filterOpened">
            <v-filter-item title="资源状态" :span="8">
              <b-select v-model="listQuery.status" clearable>
                <b-option v-for="(value,key) in resStatusMap" :key="key" :value="key">{{ value }}</b-option>
              </b-select>
            </v-filter-item>
            <v-filter-item title="可用状态" :span="8">
              <b-select v-model="listQuery.availableStatus" clearable>
                <b-option v-for="(value,key) in availableStatusMap" :key="key" :value="key">{{ value }}</b-option>
              </b-select>
            </v-filter-item>
          </template>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--资源名称-->
          <template v-slot:resourceName="{row}">
            <b-button type="text" @click="handleCheck(row)">{{ row.resourceName }}</b-button>
          </template>
          <template v-slot:personClass="{row}">{{ personClassMap[row.personClass] }}</template>
          <template v-slot:resProperty="{row}">{{ resPropertyMap[row.resProperty] }}</template>
          <template v-slot:status="{row}">
            <b-tag no-border font-size="14px" :type="row.status==='audited'?'success':'info'">
              {{ resStatusMap[row.status] }}
            </b-tag>
          </template>
          <template v-slot:availableStatus="{row}">
            <b-tooltip
              :content="row.availableStatus === 'notavailable' ? '不可用状态，资源依赖的元信息发生变更，请及时更新' : '可用状态'"
              theme="light" max-width="200" style="padding-top: 3px;">
              <b-icon
                :name="row.availableStatus==='available'?'ios-checkmark-circle-outline':'ios-close-circle-outline'"
                size="20" :color="availableStatusStyleMap[row.availableStatus]"/>
            </b-tooltip>
          </template>
          <!--扩展配置-->
          <template v-slot:ext="{row}">
            <b-button type="text" @click="handleExt(row)"
                      :disabled="!havePermission('extSync')||row.status!=='audited'||row.availableStatus === 'notavailable' ">
              配置
            </b-button>
          </template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button :disabled="!canModify" type="text" @click="handleModify(row)">
              修改
            </b-button>
            <b-divider type="vertical"/>
            <b-dropdown append-to-body @on-click="(name)=>{handleCommand(name,row)}">
              <b-button type="text">更多
                <b-icon name="ios-arrow-down"/>
              </b-button>
              <b-dropdown-menu slot="list">
                <b-dropdown-item v-if="row.status==='edit'"
                                 :disabled="!havePermission('publish')" :style="colorSuccess"
                                 name="publish">
                  发布
                </b-dropdown-item>
                <b-dropdown-item v-if="row.status==='audited'" :disabled="!havePermission('sampleData')"
                                 :style="colorWarning" name="test">
                  示例数据
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
    <page-header-wrap v-if="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <template slot="full">
          <b-collapse value="1" simple>
            <b-collapse-panel title="基础信息" name="1">
              <b-form :model="resource" ref="form" :rules="ruleValidate" label-position="top" class="p10">
                <b-row :gutter="10">
                  <b-col span="6">
                    <b-form-item label="元信息名称" prop="tableName">
                      <div flex style="width: 100%;">
                        <b-input v-model="resource.tableName" placeholder="选择元信息带入" readonly
                                 class="choose-btn"></b-input>
                        <b-button style="flex:0 0 auto;" type="primary" plain @click="handleShowDialogChoose">选择
                        </b-button>
                      </div>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="主体类别" prop="personClass">
                      <b-input :value="personClassMap[resource.personClass]" placeholder="选择元信息带入" readonly></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="资源名称" prop="resourceName">
                      <b-input v-model="resource.resourceName" placeholder="请输入资源名称" clearable></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="资源代码" prop="resourceCode">
                      <div flex style="width:100%;">
                        <b-tag type="primary" style="margin: 0;flex:0 0 auto;">
                          210{{ resource.metadataCode }}
                        </b-tag>
                        <div flex-box="1">
                          <b-input v-model="resource.resourceCode" placeholder="请输入资源代码" clearable/>
                        </div>
                      </div>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-row :gutter="10">
                  <b-col span="6">
                    <b-form-item label="更新周期" prop="updatePeriod">
                      <b-select v-model="resource.updatePeriod" clearable>
                        <b-option v-for="(value,key) in updateMap" :key="key" :value="key">{{ value }}</b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="资源性质" prop="resProperty">
                      <v-cascade :data="resPropertyOptions" v-model="resource.resProperty"></v-cascade>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="有效期限(月)" prop="expiryLimit">
                      <b-input-number v-model.number="resource.expiryLimit" :min="0"
                                      style="width: 100%;"></b-input-number>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="共享属性" prop="sharedType">
                      <b-select v-model="resource.sharedType" clearable @on-change="sharedTypeChange">
                        <b-option v-for="(value,key) in shareMap" :key="key" :value="key">{{ value }}</b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-row :gutter="10">
                  <b-col span="6">
                    <b-form-item label="开放属性" prop="isOpen">
                      <b-select v-model="resource.isOpen" clearable @on-change="isOpenChange">
                        <b-option v-for="(value,key) in openMap" :key="key" :value="key">{{ value }}</b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="开放条件" prop="openCondition">
                      <b-input v-model="resource.openCondition" placeholder="请输入开放条件" clearable
                               :disabled="resource.isOpen!=='1'"></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="共享条件" prop="sharedConditions">
                      <b-input v-model="resource.sharedConditions" placeholder="请输入共享条件" clearable
                               :disabled="resource.sharedType!=='DEPART_RANGE'"></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="6">
                    <b-form-item label="共享方式" prop="sharedMode">
                      <b-input v-model="resource.sharedMode" placeholder="请输入共享方式" clearable
                               :disabled="resource.sharedType!=='DEPART_RANGE'"></b-input>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-form-item label="资源摘要" prop="resourceDesc">
                  <b-input v-model="resource.resourceDesc" placeholder="请输入摘要" type="textarea"></b-input>
                </b-form-item>
              </b-form>
            </b-collapse-panel>
          </b-collapse>
          <template v-if="resource.items">
            <v-title-bar label="信息项配置" class="mb-20">
              <div class="pr-20">
                <b-button type="text" icon="ios-eye" @click="previewForm">预览</b-button>
                <b-button v-if="dialogStatus==='modify' && resource.availableStatus === 'notavailable'"
                          type="text" @click="handleReload" icon="ios-refresh">
                  重载信息项
                </b-button>
                <b-button type="text" icon="ios-bug"
                          @click.native="debugJson=!debugJson"
                          :text-color="debugJson?'danger':'primary'">
                  debug
                </b-button>
              </div>
            </v-title-bar>
            <fields-cfg v-model="resource.items"/>
            <!--调试模式-->
            <div class="mt-15" v-if="debugJson">
              <b-tag type="success" size="small">实际存储对象[fields]</b-tag>
              <b-code-editor :value="JSON.stringify(resource.items,null,2)" readonly/>
            </div>
          </template>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap v-if="currentTreeNode">
        <template slot="full">
          <v-title-bar label="资源信息详情" class="mb-15"></v-title-bar>
          <b-row type="flex" justify="center">
            <b-col span="18">
              <v-key-label label="资源名称" is-half is-first>{{ resource.resourceName }}</v-key-label>
              <v-key-label label="所属类目" is-half>{{ resource.dirClassifyName }}</v-key-label>
              <v-key-label label="资源代码">{{ resource.resourceCode }}</v-key-label>
              <v-key-label label="资源摘要">{{ resource.resourceDesc }}</v-key-label>
              <v-key-label label="主体类别" is-half is-first>{{ personClassMap[resource.personClass] }}</v-key-label>
              <v-key-label label="共享属性" is-half>{{ shareMap[resource.sharedType] }}</v-key-label>
              <v-key-label label="共享条件" is-half is-first>{{ resource.shareCondition }}</v-key-label>
              <v-key-label label="共享方式" is-half>{{ resource.shareMode }}</v-key-label>
              <v-key-label label="开放属性" is-half is-first>{{ openMap[resource.isOpen] }}</v-key-label>
              <v-key-label label="开放条件" is-half>{{ resource.openCondition }}</v-key-label>
              <v-key-label label="资源性质" is-half is-first>{{ resPropertyMap[resource.resProperty] }}</v-key-label>
              <v-key-label label="更新周期" is-half>{{ updateMap[resource.updatePeriod] }}</v-key-label>
              <v-key-label label="有效期限" is-bottom>{{ resource.expiryLimit }}</v-key-label>
            </b-col>
          </b-row>
          <v-title-bar label="信息项明细" class="mb-15 mt-15"></v-title-bar>
          <b-table disabled-hover :data="resource.items" :columns="checkItemsTableColumns">
            <template v-slot:dataType="{row}">{{ dataTypeMap[row.dataType] }}</template>
            <template v-slot:status="{row}">{{ fieldStatusMap[row.status] }}</template>
          </b-table>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <!--选择元信息弹窗-->
    <meta-data-choose ref="metaDataChoose" @on-choose="handleChooseOne"/>
    <!--资源扩展-->
    <res-ext-edit ref="resExtEdit" @on-close="handleCancel"/>
    <!--示例数据-->
    <sample-data ref="sampleData" @on-close="handleCancel"/>
    <!--预览表单-->
    <b-modal v-model="previewModal" title="预览表单"
             fullscreen @on-hidden="previewModalForm=false"
             :body-styles="{overflowY:'auto',top:'55px'}">
      <b-form v-if="previewModalForm" :model="form" :rules="rules" ref="dynamicFormRef" label-position="top">
        <!--自定义form-item-->
        <form-item :key="item.id||index" v-for="(item,index) in dynamicForm"
                   :label="item.fieldTitle"
                   :prop="item.fieldName"
                   :control-type="item.controlType">
          <!--动态控件-->
          <form-control v-model="form[item.fieldName]"
                        :resource-key="resource.resourceKey"
                        :control-type="item.controlType"
                        :field-name="item.fieldName"
                        :field-desc="item.fieldDesc"
                        :field-title="item.fieldTitle"
                        :data-length="item.dataLength"
                        :data-precision="item.dataPrecision"
                        :options="item.validOptions"
                        :table-name="resource.tableName"
                        @on-select="handleSelectNatLeg">
          </form-control>
        </form-item>
      </b-form>
      <div slot="footer">
        <b-button @click="previewModal=false">取 消</b-button>
        <b-button @click="handleDynamicFormReset">重 置</b-button>
        <b-button type="primary" @click="handleDynamicFormSubmit">测 试</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import dynamicForm from '../../../common/mixins/dynamic-form'
  import { getClassifyTree } from '../../../api/data-manage/classify.api'
  import { getPersonClassTree } from '../../../api/data-manage/metadata.api'
  import { getFieldCtrl } from '../../../api/enum.api'
  import * as api from '../../../api/data-manage/res-info.api'
  import { MetaDataChoose, ResExtEdit, SampleData } from './components/ResInfo'
  import { requiredRule } from '../../../common/utils/validate'
  import { getResourceInfo } from '../../../api/data-manage/gather.api'
  import { initFormList } from '../../../components/Validator/FieldsCfg/cfg-util'
  import FieldsCfg from '../../../components/Validator/FieldsCfg/FieldsCfg'

  // map映射中如 #static 标识: 静态不改变的枚举的暂不调用接口获取
  export default {
    name: 'ResInfo',
    components: { SampleData, FieldsCfg, ResExtEdit, MetaDataChoose },
    mixins: [commonMixin, permission, dynamicForm],
    data() {
      const validateResourceCode = (rule, value, callback) => {
        if (!/^[0-9]{4}$/.test(value)) {
          callback(new Error('请输入四位数字，不足请补0'))
        } else {
          if (this.resource.metadataCode.length === 0) {
            callback(new Error('必须选择元信息补足前缀'))
          } else {
            let code = '210' + this.resource.metadataCode + value
            api.checkResCodeExist(this.resource.id, code).then(res => {
              if (!res.data.data) {
                callback()
              } else {
                callback(new Error('编码重复'))
              }
            }).catch(() => {
              callback(new Error('验证重复性出错，检查服务'))
            })
          }
        }
      }
      return {
        debugJson: false,
        moduleName: '资源信息',
        listQuery: {
          resourceCode: '', // 所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '', // 资源性质
          availableStatus: '', // 可用状态
          status: '' // 状态
        },
        treeData: [],
        columns: [
          { title: '资源名称', slot: 'resourceName' },
          { title: '主体类别', slot: 'personClass', width: 130 },
          { title: '资源性质', slot: 'resProperty', width: 120, align: 'center' },
          { title: '资源状态', slot: 'status', width: 90, align: 'center' },
          { title: '可用状态', slot: 'availableStatus', width: 90, align: 'center' },
          { title: '扩展配置', slot: 'ext', width: 90, align: 'center' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        checkItemsTableColumns: [
          { title: '名称', key: 'fieldName' },
          { title: '标题', key: 'fieldTitle' },
          { title: '数据类型', slot: 'dataType' },
          { title: '启用状态', slot: 'status' }
        ],
        resource: null,
        ruleValidate: {
          tableName: [requiredRule],
          personClass: [requiredRule],
          resourceName: [requiredRule],
          resourceCode: [requiredRule, { validator: validateResourceCode, trigger: 'blur' }],
          updatePeriod: [{ required: true, message: '更新周期必选', trigger: 'change' }],
          resProperty: [{ required: true, message: '资源性质必选', trigger: 'change' }],
          sharedType: [{ required: true, message: '共享属性必选', trigger: 'change' }],
          isOpen: [{ required: true, message: '开放属性必选', trigger: 'change' }],
          expiryLimit: [{ required: true, message: '有效期限必填', trigger: ['blur', 'change'], type: 'number' }]
        },
        resPropertyMap: {}, // 资源性质映射
        resPropertyOptions: [],
        personClassMap: {}, // 主体类别映射
        personClassOptions: [],
        availableStatusMap: { available: '可用', notavailable: '不可用' }, // 可用状态映射 #static
        availableStatusStyleMap: { available: '#52c41a', notavailable: '#f5222d' },
        resStatusMap: { edit: '草稿', audited: '已发布', closed: '已删除' }, // 资源状态映射 #static
        shareMap: { PUBLIC: '共享', PRIVATE: '不共享', DEPART_RANGE: '有条件共享' }, // 共享属性 #static
        openMap: { '1': '是', '0': '否' }, // 开放属性#static
        updateMap: {
          '0_IN_TIME_M': '实时',
          '1_IN_DAY_M': '每天',
          '2_IN_WEEK_M': '每周',
          '3_IN_MONTH_M': '每月',
          '4_IN_QUARTER_Q': '每季',
          '5_IN_YEAR_Y': '每年'
        }, // 更新周期#static
        fieldCtrlMap: {}, // 字段控件类型#static
        dataTypeMap: {
          string: '字符型',
          number: '数值型',
          money: '货币型',
          boolean: '逻辑型',
          date: '日期型',
          datetime: '日期时间型',
          text: '备注型'
        },
        fieldStatusMap: { use: '选用', ignore: '不选用' }, // 资源信息项状态#static
        previewModal: false,
        previewModalForm: false
      }
    },
    created() {
      this.getEnum()
      this.initTree()
      this.resetResource()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.resourceCode = node.code
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          resourceCode: this.currentTreeNode ? this.currentTreeNode.code : '', // 类目类别所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '', // 资源性质
          availableStatus: '', // 可用状态
          status: ''// 状态
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetResource()
        this.openEditPage('create')
      },
      // 查看按钮事件
      handleCheck(row) {
        api.getResDetail(row.id).then(res => {
          this.resource = res.data.data
          this.openEditPage('check')
        })
      },
      // 编辑事件
      handleModify(row) {
        api.getResDetail(row.id).then(res => {
          this.openEditPage('modify')
          this.resource = res.data.data
          // 分隔类目编码,并显示后四位 210,C0204,1234
          this.resource.metadataCode = this.resource.resourceCode.slice(3, 8)
          this.resource.resourceCode = this.resource.resourceCode.slice(-4)
        })
      },
      // 更多操作点击事件
      handleCommand(name, row) {
        switch (name) {
          case 'publish':
            this.handlePublish(row)
            break
          case 'test':
            this.handleSampleData(row)
            break
          case 'remove':
            this.handleRemove(row)
            break
        }
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let res = { ...row }
        this.$confirm({
          title: '确定要删除当前资源信息吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeResInfo(res).then(res => {
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
      // 弹窗提示是否发布
      handlePublish(row) {
        let res = { ...row }
        this.$confirm({
          title: '确定要发布本条资源信息？',
          content: '关联的资源信息不可用。',
          loading: true,
          onOk: () => {
            api.publishResInfo(res).then(res => {
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
      // 示例数据弹窗
      handleSampleData(row) {
        // 根据resourceKey获取资源信息，并将原始表头信息传入gather-list组件
        getResourceInfo(row.resourceKey).then(res => {
          if (res.data.code === '0') {
            let detail = res.data.data
            if (detail && detail.items) {
              let columns = detail.items.filter(i => i.id)
              this.dialogStatus = 'sampleData'
              this.$refs.sampleData.open(detail, columns)
            }
          } else {
            this.$notice.danger({ title: '提示', desc: res.data.message })
          }
        })
      },
      // 扩展配置
      handleExt(row) {
        api.getResDetail(row.id).then(res => {
          const resource = res.data.data
          api.queryExt(row.resourceKey).then(res => {
            const obj = {
              resourceKey: resource.resourceKey,
              resourceName: resource.resourceName,
              items: resource.items,
              cfg: res.data.data
            }
            this.dialogStatus = 'extEdit'
            this.$refs.resExtEdit.open(obj)
          })
        })
      },
      // 共享条件更改联动
      sharedTypeChange(val) {
        if (val !== 'DEPART_RANGE') {
          this.resource.shareCondition = ''
          this.resource.shareMode = ''
        }
      },
      // 开放属性更改联动事件
      isOpenChange(val) {
        if (val !== '1') this.resource.openCondition = ''
      },
      // 弹窗选择元信息
      handleShowDialogChoose() {
        this.$refs.metaDataChoose && this.$refs.metaDataChoose.open()
      },
      // 选中一个元信息
      handleChooseOne(item) {
        this.resource.tableName = item.tableName // 元信息英文表名带入
        this.resource.personClass = item.personClass // 元信息主体类型带入
        this.resource.resourceName = item.metadataName // 元信息标题名带入资源名称
        this.resource.metadataCode = item.metadataCode // 元信息所属类目code
        this.resource.metadataKey = item.metadataKey // 资源标识符带入
        // 格式化items
        this.resource.items = item.fields.map(field => {
          return this.fieldsToInfoItem(field, this.resource.id)
        }).filter(item => item.fieldName.indexOf('_id') === -1)
        // 选中后重新触发校验
        this.$refs.form.validateField('tableName')
        this.$refs.form.validateField('personClass')
        this.$refs.form.validateField('resourceName')
        this.$refs.form.validateField('resourceCode')
      },
      // 重载信息项，用于编辑时，校验元信息信息项是否有增删，刷新当前信息项使用
      handleReload() {
        this.$confirm({
          title: '确定重载信息项吗？',
          content: '重载后会移除已删除的信息项、增加新的信息项！',
          loading: true,
          onOk: () => {
            api.itemsReload(this.resource.resourceKey).then(res => {
              if (res.data.code === '0') {
                // 当前信息项
                let currentItemsMap = new Map(this.resource.items.map(i => ([i.fieldName, i])))
                // 先判断是否有移除的
                if (res.data.data.deletedFields) {
                  // 移除的项
                  const removeItems = res.data.data.deletedFields
                  // 原信息项移除
                  removeItems.forEach(item => {
                    if (currentItemsMap.has(item.fieldName)) {
                      currentItemsMap.delete(item.fieldName)
                    }
                  })
                }
                if (res.data.data.addFields) {
                  // 新增项
                  const addItems = res.data.data.addFields
                  addItems.forEach(item => {
                    if (!currentItemsMap.has(item.fieldName) && item.fieldName.indexOf('_id') === -1) {
                      currentItemsMap.set(item.fieldName, this.fieldsToInfoItem(item, this.resource.id))
                    }
                  })
                }
                this.resource.items = [...currentItemsMap.values()]
                this.$message({ type: 'success', content: '信息项重载成功' })
              } else {
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
              this.$modal.remove()
            })
          }
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 判断信息项是否存在空标题
            let emptyItemFieldIndex = this.resource.items.findIndex(i => i.fieldTitle.length === 0)
            if (emptyItemFieldIndex > -1) {
              this.$message({
                type: 'danger',
                content: `请填写字段[${this.resource.items[emptyItemFieldIndex].fieldName}]标题！`
              })
              return
            }
            this.btnLoading = true
            let status = this.resource.status
            // 这里修改的时候需要额外判断是否发布，如已经发布，则实际相当于copy一个新增，后台会将原有同名元信息设置为历史状态
            let fun = (this.dialogStatus === 'create' || (this.dialogStatus === 'modify' && status === 'audited'))
              ? api.createResInfo : api.modifyResInfo
            fun(this.resource).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      /* [数据接口] */
      // 通用枚举
      getEnum() {
        // 资源信息项控件类型枚举
        getFieldCtrl().then(res => {
          if (res.status === 200) {
            this.fieldCtrlMap = res.data.data
          }
        })
        // 主体类别树信息 code=A
        getPersonClassTree().then(res => {
          if (res.status === 200) {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let personClasses = []
            let mapper = (node, parentCode) => {
              personClasses.push({ key: node.code, value: node.text })
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
            this.personClassOptions = data.children || []
            // 转换类型映射值（扁平化）
            personClasses.forEach(item => {
              this.personClassMap[item.key] = item.value
            })
          }
        })
        // 资源性质树信息 code=B
        api.getResPropertyTree().then(res => {
          if (res.status === 200) {
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
      // 重置对象
      resetResource() {
        this.resource = {
          id: '',
          tableName: '', // 元信息表名字
          personClass: '', // 主体类别
          metadataCode: '', // 类目编码 => 这条属性只负责显示当前类目，和拼接资源代码使用，并不会保存
          metadataKey: '', // 资源标识符
          resourceName: '', // 资源名称
          resourceCode: '', // 资源代码
          resourceDesc: '', // 资源描述
          resourceKey: '',
          updatePeriod: '0_IN_TIME_M', // 更新周期
          expiryLimit: 24, // 有效期限
          resProperty: 'B03', // 资源性质
          sharedType: 'PUBLIC', // 共享属性
          shareCondition: '', // 共享条件
          shareMode: '', // 共享方式
          isOpen: '0', // 开放属性
          openCondition: '', // 开放条件
          availableStatus: '',
          status: '',
          dirClassifyName: '',
          items: []
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getClassifyTree('C').then(response => {
          const tree = response.data.data
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
            this.listQuery.resourceCode = this.currentTreeNode.code
            this.handleFilter()
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getResInfoList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 预览form
      previewForm() {
        if (this.resource.items.length === 0) {
          this.$message({ type: 'danger', content: '没有配置信息项，请配置后预览' })
          return
        }
        // 过滤person_id
        let fields = this.resource.items.filter(item => item.fieldName.indexOf('_id') === -1 && item.status === 'use')
        // 根据原始列扩展动态表单列表数据
        initFormList(fields).then(res => {
          this.previewModal = true
          this.previewModalForm = true
          this.handleDynamicFormReset()
          this.dynamicForm = res
          this.initDynamicForm(res) // 根据动态列扩展form，rules和
        })
      }
    }
  }
</script>
