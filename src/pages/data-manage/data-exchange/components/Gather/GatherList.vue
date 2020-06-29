<template>
  <div>
    <page-header-wrap v-show="gatherVisible && isNormal" :title="resource.resourceName"
                      show-close @on-close="handleClose">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="名称">
            <b-input v-model.trim="listQuery.name" placeholder="名称" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"/>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
          <b-button v-if="havePermission('import')" icon="ios-exit" @click="handleBatchImport">批量导入</b-button>
          <div slot="right">
            <b-button v-if="havePermission('download')" type="text" @click="handleDownloadTemplate">模板下载</b-button>
            <template v-if="havePermission('export')">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" @click="handleExport">导出</b-button>
            </template>
            <template v-if="havePermission('records')">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" @click="handleOpenRecordDialog">导入/导出记录</b-button>
            </template>
            <b-divider type="vertical"></b-divider>
            <b-dropdown trigger="custom" :visible="visible" placement="bottom-end" append-to-body>
              <b-button type="text" @click="visible=!visible">
                字段选择
                <b-icon :name="visible?'ios-arrow-up':'ios-arrow-down'"></b-icon>
              </b-button>
              <b-dropdown-menu slot="list" v-click-out-side="clickOutSide"
                               style="padding-left: 5px;width: auto;">
                <b-checkbox-group v-model="showFields">
                  <b-checkbox v-for="col in columns" :key="col.id" :label="col.fieldName"
                              style="display: block;margin-right: 0;">
                    <span>{{col.fieldTitle}}</span>
                  </b-checkbox>
                </b-checkbox-group>
              </b-dropdown-menu>
            </b-dropdown>
          </div>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="dynamicColumns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleCheck(scope.row)">查看</b-button>
            <b-button type="text" @click="handleModify(scope.row)" :disabled="!canModify">修改</b-button>
            <b-button type="text" text-color="danger" @click="handleRemove(scope.row)" :disabled="!canRemove">
              删除
            </b-button>
            <template v-if="scope.row.version&&scope.row.version>0">
              <b-button type="text" text-color="warning"
                        :disabled="!havePermission('history')" @click="handleHistory(scope.row)">历史
              </b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-if="isEdit" :title="editTitle +' '+ resource.resourceName" show-close
                      @on-close="handleCancel">
      <!--为了触发重绘更新form字段设置 使用v-if-->
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <b-form :model="form" ref="dynamicFormRef" label-position="top" :rules="rules">
            <form-item :key="item.id" v-for="item in dynamicForm"
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
        </b-collapse-wrap>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="resource.resourceName+' 详情'" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <div style="user-select: text;" v-if="gather">
            <v-key-label v-for="(item,index) in columns" :key="index"
                         :label="item.fieldTitle"
                         :is-bottom="index===columns.length-1">
          <span v-if="item.controlType==='FILE_UPLOAD'">
            <file-upload :value="gather[item.fieldName]" :resource-key="resource.resourceKey" is-show/>
          </span>
              <span v-else>{{ gather[item.fieldName] }}</span>
            </v-key-label>
          </div>
        </b-collapse-wrap>
        <b-button slot="footer" @click="handleCancel">返 回</b-button>
      </v-edit-wrap>
    </page-header-wrap>
    <!--批量导入弹窗-->
    <b-modal v-model="batchDialog" append-to-body
             :title="$slots.default?$slots.default[0].text:'批量导入'"
             :styles="{top: '200px',width:'350px'}"
             class="file-dialog">
      <b-upload action="/" :before-upload="handleUpload">
        <b-button type="primary" plain icon="ios-pricetags">选择文件</b-button>
      </b-upload>
      <div v-if="file !== null" flex="main:justify" class="file-list">
        <div class="f-color-666">
          <b-icon name="ios-document"></b-icon>
          {{ file.name }}
        </div>
        <div class="close">
          <b-icon name="ios-close-circle-outline" style="cursor: pointer;" @click.native="file=null"></b-icon>
        </div>
      </div>
      <div slot="footer">
        <b-button type="primary" @click="handleImport" :loading="uploadLoading">
          {{ uploadLoading ? '导入中' : '导入' }}
        </b-button>
      </div>
    </b-modal>
    <!--批量导入/导出记录模块 -->
    <import-export-list ref="importExportList" @on-close="handleCancel"/>
    <!--修改历史弹窗-->
    <gather-history ref="gatherHistory" @on-close="handleCancel"/>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import dynamicForm from '../../../../../common/mixins/dynamic-form'
  import { deepCopy } from '../../../../../common/utils/assist'
  import * as api from '../../../../../api/data-manage/gather.api'
  import { initFormList } from '../../../../../components/Validator/FieldsCfg/cfg-util'
  import Util from '../../../../../common/utils/util'
  import ImportExportList from './ImportExportList'
  import GatherHistory from './GatherHistory'
  import FileUpload from '../../../../../components/Validator/FormControl/FileUpload'

  export default {
    name: 'GatherList',
    components: { FileUpload, GatherHistory, ImportExportList },
    mixins: [commonMixin, permission, dynamicForm],
    data() {
      return {
        gatherVisible: false,
        resource: {
          id: '',
          tableName: '', // 元信息表名字
          personClass: '', // 主体类别
          metadataCode: '', // 类目编码 => 这条属性只负责显示当前类目，和拼接资源代码使用，并不会保存
          metadataKey: '', // 资源标识符
          resourceName: '', // 资源名称
          resourceCode: '', // 资源代码
          resourceDesc: '', // 资源描述
          resourceKey: '',
          updatePeriod: '', // 更新周期
          expiryLimit: 0, // 有效期限
          resProperty: '', // 资源性质
          sharedType: '', // 共享属性
          shareCondition: '', // 共享条件
          shareMode: '', // 共享方式
          isOpen: '', // 开放属性
          openCondition: '', // 开放条件
          availableStatus: '',
          status: '',
          items: []
        },
        listQuery: {
          resourceKey: '',
          name: ''
        },
        visible: false, // 列筛选下拉弹窗
        showFields: [],
        columns: [], // 原始表头列数据
        batchDialog: false,
        uploadLoading: false,
        file: null,
        gather: null
      }
    },
    computed: {
      // 当前资源是否是法人
      isLeg() {
        return this.resource.tableName.includes('leg_')
      },
      // 动态列
      dynamicColumns() {
        let ret = []
        this.columns.forEach(item => {
          if (this.showFields.includes(item.fieldName)) {
            ret.push({ title: item.fieldTitle, key: item.fieldName.toLowerCase(), tooltip: true })
          }
        })
        // 最后拼接一个操作栏
        ret.push({ title: '操作', slot: 'action', width: 200 })
        return ret
      }
    },
    methods: {
      // ===========采集面板打开============ //
      open(res, columns) {
        this.resource = deepCopy(res)
        // 过滤 person_id 获取原始列数组
        this.columns = columns.filter(item => item.fieldName.indexOf('_id') === -1 && item.status === 'use')
        // 默认勾选显示前8列，如太多则需要额外查看
        this.columns.forEach((item, index) => index < 8 && this.showFields.push(item.fieldName))
        // 根据原始列扩展动态表单列表数据
        initFormList(this.columns).then(resp => {
          this.dynamicForm = resp
          this.initDynamicForm(resp) // 根据动态列扩展form，rules和
        })
        // 查询列表
        this.resetQuery()
        this.gatherVisible = true
      },
      // ===========采集面板关闭============ //
      handleClose() {
        this.gatherVisible = false
        this.$emit('on-close')
      },
      // =========== 采集面板编辑关闭 =========== //
      handleCancel() {
        this.handleDynamicFormReset()
        this.dialogStatus = ''
      },
      // ===========操作栏-重置============ //
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          resourceKey: this.resource.resourceKey,
          name: ''
        }
        this.handleFilter()
      },
      // ===========操作栏-新增============ //
      handleCreate() {
        // 重置form表单，注意这里不可深拷贝，因为form对象被引用至rules校验函数
        this.setFormObj(this.resetForm)
        this.openEditPage('create')
      },
      // ===========操作栏-批量上传件============ //
      handleBatchImport() {
        this.batchDialog = true
      },
      // ===========操作栏-上传组件钩子============ //
      handleUpload(file) {
        const fileFormat = file.name.split('.').pop().toLocaleLowerCase()
        if (fileFormat !== 'xlsx') {
          this.$message({ type: 'danger', content: '请选择后缀为xlsx的文件！' })
          return false
        }
        this.file = file
        return false
      },
      // ===========操作栏-确认进行上传操作============ //
      handleImport() {
        if (this.file) {
          this.uploadLoading = true
          api.dataImport(this.resource.resourceKey, this.file)
            .then(res => {
              if (res.status === 200 && res.data.code === '0') {
                this.$message({ type: 'success', content: '导入成功，请查看[导入/导出记录]。' })
              } else {
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
              this.file = null
              this.uploadLoading = false
              this.batchDialog = false
            })
            .catch(() => {
              this.file = null
              this.uploadLoading = false
              this.batchDialog = false
            })
        } else {
          this.batchDialog = false
        }
      },
      // ===========操作栏-下载模板============ //
      handleDownloadTemplate() {
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce((resource) => {
            api.downloadTemplate(resource.resourceKey).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, `${resource.resourceName}.xlsx`)
              }
            })
          }, 1000)
        }
        this.downloadEvent(this.resource)
      },
      // ===========操作栏-导出============ //
      handleExport() {
        if (!this.exportEvent) { // 导出事件，需要函数防抖动
          this.exportEvent = this.$util.debounce((resourceKey) => {
            api.dataExport(resourceKey).then(res => {
              if (res.status === 200) {
                this.$message({ type: 'success', content: '导出成功，请查看[导入/导出记录]。' })
              }
            })
          }, 1000)
        }
        this.exportEvent(this.resource.resourceKey)
      },
      // ===========操作栏-导入导出列表============ //
      handleOpenRecordDialog() {
        this.dialogStatus = 'importExportList'
        this.$refs.importExportList && this.$refs.importExportList.open(this.resource)
      },
      // ===========操作栏-筛选关闭操作============ //
      clickOutSide() {
        if (this.visible) {
          this.visible = false
        }
      },
      // ===========列表-查看按钮事件============ //
      handleCheck(row) {
        // 根据id获取详情值
        api.show(row.id, this.resource.resourceKey).then(res => {
          if (res.data.code === '0') {
            this.gather = this.decodeFormObj(res.data.data)
            this.openEditPage('check')
          }
        })
      },
      // ===========列表-编辑事件============ //
      handleModify(row) {
        api.queryOne(row.id, this.resource.resourceKey).then(res => {
          if (res.data.code === '0') {
            // 针对一个对象进行解码，并逐字段设置至form
            let detail = this.decodeFormObj(res.data.data)
            this.setFormObj(detail)
            this.openEditPage('modify')
          }
        })
      },
      // ===========列表-删除============ //
      handleRemove(row) {
        this.$confirm({
          title: '确实要删除当前采集信息吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeGather(this.resource.resourceKey, row.id).then(res => {
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
      // ===========列表-查看历史============ //
      handleHistory(row) {
        this.dialogStatus = 'historyList'
        this.$refs.gatherHistory && this.$refs.gatherHistory.open(row, this.dynamicForm)
      },
      // ===========数据操作-查询动态采集列表============ //
      searchList() {
        this.setListData()
        let keyValues = null
        let ops = null
        // 查询数据时根据表名称动态传参name或comp_name
        if (this.listQuery.name.length > 0) {
          keyValues = this.isLeg ? { comp_name: this.listQuery.name } : { name: this.listQuery.name }
          ops = this.isLeg ? { comp_name: 'LIKE' } : { name: 'LIKE' }
        }
        api.getGatherList(this.listQuery, keyValues, ops).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: this.decodeAndMaskFormat(response.data.rows || [], true),
              total: response.data.total || 0
            })
          }
        })
      },
      // ===========数据操作-表单提交============ //
      handleSubmit() {
        if (!this.$refs.dynamicFormRef) return
        this.$refs.dynamicFormRef.validate((valid) => {
          if (valid) {
            let tmpForm = this.getEncodeFormObj()
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createGather : api.modifyGather
            fun(this.resource.resourceKey, tmpForm).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                // this.submitDone(false)
                this.btnLoading = false // 按钮状态清空
                this.$notice.danger({ title: '操作错误', desc: res.data.message, duration: 10 })
              }
            })
          } else {
            this.$message({ type: 'danger', content: '表单校验失败,请填写正确后提交!' })
          }
        })
      }
    }
  }
</script>
