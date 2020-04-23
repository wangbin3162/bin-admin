<template>
  <div>
    <page-header-wrap v-show="gatherVisible && isNormal" :title="resource.resourceName"
                      show-close @on-close="handleClose">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model.trim="listQuery.name" placeholder="名称" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
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
              <b-dropdown-menu slot="list" style="padding-left: 5px;width: auto;">
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
            <b-button type="text" text-color="danger" @click="handleRemove(scope.row)" :disabled="!canModify">
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
    <page-header-wrap v-show="isCheck" :title="resource.resourceName+' 详情'" show-close @on-close="handleCancel">
      <v-edit-wrap v-if="gather" style="user-select: text;">
        <v-key-label v-for="(item,index) in columns" :key="index"
                     :label="item.fieldTitle"
                     :is-bottom="index===columns.length-1">
          {{ gather[item.fieldName] }}
        </v-key-label>
        <b-button slot="footer" @click="handleCancel">返 回</b-button>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="editTitle +' '+ resource.resourceName" show-close
                      @on-close="handleCancel">
      <!--为了触发重绘更新form字段设置 使用v-if-->
      <v-edit-wrap v-if="isEdit">
        <b-form slot="full" :model="form" ref="form" label-position="top" :rules="rules">
          <form-item :key="item.id" v-for="item in dynamicForm"
                     :label="item.fieldTitle"
                     :prop="item.fieldName"
                     :control-type="item.controlType">
            <!--动态控件-->
            <form-control v-model="form[item.fieldName]"
                          :control-type="item.controlType"
                          :field-name="item.fieldName"
                          :field-desc="item.fieldDesc"
                          :field-title="item.fieldTitle"
                          :options="item.validOptions"
                          :table-name="resource.tableName"
                          @on-select-leg="handleSelectLeg"
                          @on-select-nat="handleSelectNat">
            </form-control>
          </form-item>
        </b-form>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <!--批量导入/导出记录模块 -->
    <import-export-list ref="importExportList" @on-close="handleCancel"></import-export-list>
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
    <!--修改历史弹窗-->
    <gather-history ref="gatherHistory"></gather-history>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { deepCopy } from '../../../../../common/utils/assist'
  import * as api from '../../../../../api/data-manage/gather.api'
  import { jsonDataToRules } from '../../../res/components/Validator/validate.cfg'
  import FormItem from '../FormControl/FormItem'
  import FormControl from '../FormControl/FormControl'
  import { Decode, Encode, MaskCode } from '../../../../../common/utils/secret'
  import GatherHistory from './GatherHistory'
  import Util from '../../../../../common/utils/util'
  import ImportExportList from './ImportExportList'

  export default {
    name: 'GatherList',
    components: { ImportExportList, GatherHistory, FormControl, FormItem },
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          resourceKey: '',
          name: ''
        },
        isLeg: false, // 是否是法人，这里用resource.tableName 来判断
        resource: null,
        visible: false,
        gatherVisible: false,
        showFields: [],
        columns: [], // 原始表头列数据
        gather: null,
        dynamicForm: [], // 动态表单数组
        form: {}, // 动态表单
        resetForm: {},
        rules: {}, // 动态校验对象
        batchDialog: false,
        file: null,
        uploadLoading: false
      }
    },
    created() {
      this.resetResource()
    },
    computed: {
      dynamicColumns() {
        let ret = []
        this.columns.forEach(item => {
          if (this.showFields.includes(item.fieldName)) {
            ret.push({ title: item.fieldTitle, key: item.fieldName, tooltip: true })
          }
        })
        // 最后拼接一个操作栏
        ret.push({ title: '操作', slot: 'action', width: 200 })
        return ret
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          resourceKey: this.resource.resourceKey,
          name: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        // 根据id获取详情值
        api.show(row.id, this.resource.resourceKey).then(res => {
          if (res.data.code === '0') {
            this.gather = this.decodeOneFormat(res.data.data)
            this.openEditPage('check')
          }
        })
      },
      // 新增按钮事件
      handleCreate() {
        // 重置form表单，注意这里不可深拷贝，因为form对象被引用至rules校验函数
        this.setFormObj(this.resetForm)
        this.openEditPage('create')
      },
      // 批量上传按钮事件
      handleBatchImport() {
        this.batchDialog = true
      },
      // 上传组件钩子
      handleUpload(file) {
        const fileFormat = file.name.split('.').pop().toLocaleLowerCase()
        if (fileFormat !== 'xlsx') {
          this.$message({ type: 'danger', content: '请选择后缀为xlsx的文件！' })
          return false
        }
        this.file = file
        return false
      },
      // 确认进行上传操作
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
      // 下载模板
      handleDownloadTemplate() {
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce(() => {
            api.downloadTemplate(this.resource.resourceKey).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, `${this.resource.resourceName}.xlsx`)
              }
            })
          }, 1000)
        }
        this.downloadEvent()
      },
      // 导出
      handleExport() {
        if (!this.exportEvent) { // 导出事件，需要函数防抖动
          this.exportEvent = this.$util.debounce(() => {
            api.dataExport(this.resource.resourceKey).then(res => {
              if (res.status === 200) {
                this.$message({ type: 'success', content: '导出成功，请查看[导入/导出记录]。' })
              }
            })
          }, 1000)
        }
        this.exportEvent()
      },
      // 导入导出列表
      handleOpenRecordDialog() {
        this.dialogStatus = 'importExportList'
        this.$refs.importExportList && this.$refs.importExportList.open(this.resource)
      },
      // 弹窗提示是否删除
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
      // 查看历史
      handleHistory(row) {
        this.$refs.gatherHistory && this.$refs.gatherHistory.open(row.id)
      },
      // 编辑事件
      handleModify(row) {
        api.queryOne(row.id, this.resource.resourceKey).then(res => {
          if (res.data.code === '0') {
            // 针对一个对象进行解码，并逐字段设置至form
            let detail = this.decodeOneFormat(res.data.data)
            this.setFormObj(detail)
            this.openEditPage('modify')
          }
        })
      },
      // 表单提交事件
      handleSubmit() {
        if (!this.$refs.form) return
        this.$refs.form.validate((valid) => {
          if (valid) {
            let tmpForm = this.encodeOneFormat(this.form)
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createGather : api.modifyGather
            fun(this.resource.resourceKey, tmpForm).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                // this.submitDone(false)
                this.btnLoading = false // 按钮状态清空
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          } else {
            this.$message({ type: 'danger', content: '表单校验失败,请填写正确后提交!' })
          }
        })
      },
      // 打开弹窗
      open(res, columns) {
        this.resource = deepCopy(res)
        this.isLeg = this.resource.tableName.includes('leg_')
        this.listQuery.resourceKey = res.resourceKey
        this.listQuery.name = '' // 清空查询条件
        // 获取原始列数组
        this.columns = columns.filter(item => !item.fieldName.includes('_id'))
        // 默认勾选显示前8列，如太多则需要额外查看
        this.columns.forEach((item, index) => index < 8 && this.showFields.push(item.fieldName))
        // 根据原始列扩展动态表单列表数据
        this.initFormList().then(res => {
          this.dynamicForm = res
          this.initDynamicForm(this.dynamicForm) // 根据动态列扩展form，rules和
        })
        // 根据resourceKey再获取列表值
        this.searchList()
        this.gatherVisible = true
      },
      handleClose() {
        this.gatherVisible = false
        this.$emit('on-close')
      },
      // 初始化form集合，扩展form对象和rules校验对象
      initDynamicForm(dynamicForm) {
        this.form = {}
        this.rules = {}
        // 额外扩展id和person_id字段
        this.$set(this.form, 'id', '')
        if (!['leg_base_info', 'nat_base_info', 'leg_id_info', 'nat_id_info'].includes(this.resource.tableName)) {
          this.$set(this.form, 'person_id', '')
        }
        dynamicForm.forEach(item => {
          // 先根据filedName扩展form对象
          this.$set(this.form, item.fieldName, '')
          // 根据每个item，执行校验函数并返回校验数组
          let rules = jsonDataToRules(item, this.form)
          if (rules.length > 0) {
            this.$set(this.rules, item.fieldName, rules)
          }
        })
        // this.$log.primary('----rules----')
        // console.log(this.rules)
        // this.$log.primary('-------------')
        this.resetForm = deepCopy(this.form)
        this.$refs.form && this.$refs.form.resetFields()
      },
      // 初始化动态菜单列表
      async initFormList() {
        let dynamicForm = deepCopy(this.columns)
        try {
          let promises = this.columns.map((item) => this.initItemsByValidValue(item.validValue))
          let results = await Promise.all(promises)
          for (let i = 0; i < this.columns.length; i++) {
            dynamicForm[i]['validOptions'] = results[i]
          }
        } catch (e) {
          this.$log.danger(e)
        }
        return dynamicForm
      },
      // 根据字符值判断是字典值还是枚举值，然后初始化items数组
      async initItemsByValidValue(valid) {
        let ret = []
        if (valid.isNotEmpty()) { // 如果不为空则去初始化数组
          const index = valid.indexOf(';')
          if (index > -1) { // 如有;则为枚举型
            let names = valid.slice(0, index).split('/')
            let codes = valid.slice(index + 1).split('/')
            for (let i = 0; i < codes.length; i++) {
              ret.push({ code: codes[i], name: names[i] })
            }
          } else {
            // 根据code查询字典项
            let code = valid.slice(valid.indexOf('/') + 1)
            await api.getDictItems(code).then(res => {
              if (res.data.code === '0') {
                ret = res.data.data
              }
            })
          }
        }
        return ret
      },
      // 选择法人事件
      handleSelectLeg(leg) {
        this.form['person_id'] = leg.id
        this.form['comp_name'] = leg.compName
        this.form['id_type'] = leg.idType
        this.form['id_code'] = leg.idCode
        // 选中后重新触发校验
        this.$refs.form.validateField('comp_name')
        this.$refs.form.validateField('id_type')
        this.$refs.form.validateField('id_code')
      },
      // 选择自然人事件
      handleSelectNat(nat) {
        this.form['person_id'] = nat.id
        this.form['name'] = nat.name
        this.form['id_type'] = nat.idType
        this.form['id_code'] = nat.idCode
        // 选中后重新触发校验
        this.$refs.form.validateField('name')
        this.$refs.form.validateField('id_type')
        this.$refs.form.validateField('id_code')
      },
      // 查询动态采集列表
      searchList() {
        this.setListData()
        let keyValues = null
        let ops = null
        // 查询数据时根据表名称动态传参name或comp_name
        if (this.listQuery.name.isNotEmpty()) {
          keyValues = this.isLeg ? { comp_name: this.listQuery.name } : { name: this.listQuery.name }
          ops = this.isLeg ? { comp_name: 'LIKE' } : { name: 'LIKE' }
        }
        api.getGatherList(this.listQuery, keyValues, ops).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: this.decodeAndMaskFormat(response.data.rows),
              total: response.data.total
            })
          }
        })
      },
      // 解码和掩码处理列表
      decodeAndMaskFormat(arr) {
        let newArr = []
        arr.forEach(item => {
          let tmp = { ...item }
          this.dynamicForm.forEach(field => {
            if (field.isEncrypt === '1') { // 解密
              tmp[field.fieldName] = Decode(item[field.fieldName])
              // console.log('解码后：' + tmp[field.fieldName])
            }
            if (field.maskModel === 'ID_CODE' || field.maskModel === 'MOBILE_PHONE') { // 掩码
              tmp[field.fieldName] = MaskCode(tmp[field.fieldName], field.maskModel)
              // console.log('掩码后：' + tmp[field.fieldName])
            }
          })
          newArr.push(tmp)
        })
        return newArr
      },
      // 单个对象查询到值后解码
      decodeOneFormat(obj) {
        let tmp = { ...obj }
        this.dynamicForm.forEach(field => {
          if (field.isEncrypt === '1') { // 解码
            tmp[field.fieldName] = Decode(obj[field.fieldName])
            // console.log('单个对象解码后：' + tmp[field.fieldName])
          }
        })
        return tmp
      },
      // 单个对象编码后
      encodeOneFormat(obj) {
        let tmp = { ...obj }
        this.dynamicForm.forEach(field => {
          if (field.isEncrypt === '1') { // 编码
            tmp[field.fieldName] = Encode(obj[field.fieldName])
            // console.log('单个对象编码后：' + tmp[field.fieldName])
          }
        })
        return tmp
      },
      // 设置form表单对象，注意这里不能直接拷贝或者展开，需要逐一对form表单进行填值
      setFormObj(target) {
        Object.keys(this.form).forEach(key => {
          this.form[key] = target[key]
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
          resourceCode: '1234', // 资源代码
          resourceDesc: '测试资源描述', // 资源描述
          resourceKey: '',
          updatePeriod: '0_IN_TIME_M', // 更新周期
          expiryLimit: 24, // 有效期限
          resProperty: 'B01', // 资源性质
          sharedType: 'PUBLIC', // 共享属性
          shareCondition: '', // 共享条件
          shareMode: '', // 共享方式
          isOpen: '0', // 开放属性
          openCondition: '', // 开放条件
          availableStatus: '',
          status: '',
          items: []
        }
      }
    }
  }
</script>
