<template>
  <!--元信息项编辑 for Metadata.vue -->
  <div>
    <b-table disabled-hover :data="totalData" size="small" :columns="fieldsColumns">
      <!--类型-->
      <template v-slot:dataType="scope">{{ dataTypeMap[scope.row.dataType] }}</template>
      <!--排序-->
      <template v-slot:sort="scope">
        <template v-if="!scope.row.status">
          <v-sort-arrow @on-up="handleSort('up',scope.index)" @on-down="handleSort('down',scope.index)"></v-sort-arrow>
        </template>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <template v-if="!scope.row.status">
          <b-button type="text" @click="handleModify(scope.row,scope.index)">
            修改
          </b-button>
          <b-divider type="vertical"></b-divider>
          <b-button type="text" style="color:red;" @click="handleRemove(scope.row,scope.index)">删除</b-button>
        </template>
      </template>
    </b-table>
    <b-button type="primary" size="small" icon="ios-add" transparent
              style="width: 100%;margin-top: 16px;margin-bottom: 8px;"
              @click="handleCreateItem">添加信息项
    </b-button>
    <!--新增修改弹窗-->
    <b-modal v-model="dialogFormVisible" width="800"
             :title="dialogTitle" :mask-closable="false">
      <div class="p10">
        <b-form :model="metaItem" ref="form" :rules="ruleValidate" :label-width="80">
          <b-row>
            <b-col span="12">
              <b-form-item label="名称" prop="fieldName">
                <b-input v-model="metaItem.fieldName" placeholder="请输入名称" clearable :maxlength="30"
                         :disabled="dialogStatus === 'modify' && !!metaItem.id"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="标题" prop="fieldTitle">
                <b-input v-model="metaItem.fieldTitle" placeholder="请输入标题" clearable :maxlength="64"></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="数据类型" prop="dataType">
                <b-select v-model="metaItem.dataType" placeholder="请选择类型"
                          :disabled="dialogStatus === 'modify' && !!metaItem.id"
                          clearable @on-change="handleTypeChange">
                  <b-option v-for="item in dataTypeOptions" :value="item.value" :key="item.value" :label="item.label">
                    <span>{{ item.label }}</span>
                    <span style="float:right;color:#ccc">{{ item.value }}</span>
                  </b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-row>
                <b-col span="12">
                  <b-form-item label="数据长度" prop="dataLength" v-if="showDataLength">
                    <b-input-number v-model="metaItem.dataLength"></b-input-number>
                  </b-form-item>
                </b-col>
                <b-col span="12">
                  <b-form-item label="数据精度" prop="dataPrecision" v-if="showDataPrecision">
                    <b-input-number v-model="metaItem.dataPrecision"></b-input-number>
                  </b-form-item>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-form-item label="备注" prop="fieldDesc">
            <b-input v-model="metaItem.fieldDesc" placeholder="请输入备注" type="textarea"></b-input>
          </b-form-item>
        </b-form>
      </div>
      <div slot="footer">
        <b-button type="primary" @click="handleSubmit">提 交</b-button>
        <b-button @click="dialogFormVisible = false">取 消</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import * as api from '../../../../../api/data-manage/metadata.api'
  import { isLetterW, isTitleNotStartNum, requiredRule } from '../../../../../common/utils/validate'
  import { deepCopy } from '../../../../../common/utils/assist'
  import { downGo, upGo } from '../../../../../common/utils/arr-utils'

  export default {
    name: 'meta-fields',
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      personClass: {
        type: String
      },
      dataTypeMap: {
        type: Object
      },
      dataTypeOptions: {
        type: Array
      }
    },
    computed: {
      dialogTitle() {
        return this.dialogStatus === 'create' ? '添加信息项' : this.dialogStatus === 'modify' ? '修改信息项' : '标题'
      },
      showDataLength() {
        return ['string', 'number', 'money', 'text'].includes(this.metaItem.dataType)
      },
      showDataPrecision() {
        return ['number', 'money'].includes(this.metaItem.dataType)
      },
      // 系统信息项个数
      sysItemCount() {
        return this.totalData.filter(item => item.status).length
      }
    },
    data() {
      // 信息项名称校验
      const validateFieldName = (rule, value, callback) => {
        if (value.length > 0) {
          if (isLetterW(value)) {
            api.checkFieldName(this.personClass, this.metaItem.fieldName).then(response => {
              if (!response.data.data) {
                callback()
              } else {
                callback(new Error('字段名不合法或重复!'))
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          } else {
            callback(new Error('英文字母开头(包括字母、数字和下划线)'))
          }
        }
      }
      // 信息项标题校验
      const validateFieldTitle = (rule, value, callback) => {
        if (value.length > 0) {
          if (isTitleNotStartNum(value)) { // 中文、字母、数字、()、（）、/和下划线，且数字不能出现在首位的字符串
            callback()
          } else {
            callback(new Error('非数字开头(中文、字母、数字、中英文括号、/和_)'))
          }
        }
      }
      // 信息项数据长度校验
      const validateDataLength = (rule, value, callback) => {
        const reg = /^\d+$/ // 正整数
        if (value <= 0) {
          callback(new Error('数据长度必须大于0'))
        } else if (!reg.test(value)) {
        callback(new Error('数据长度必须为整数'))
      } else {
          callback()
        }
      }
      return {
        fieldsColumns: [
          { title: '名称', key: 'fieldName' },
          { title: '标题', key: 'fieldTitle', tooltip: true },
          { title: '类型', slot: 'dataType', width: 100, align: 'center' },
          { title: '数据长度', key: 'dataLength', width: 100, align: 'center' },
          { title: '数据精度', key: 'dataPrecision', width: 100, align: 'center' },
          { title: '备注', key: 'fieldDesc' },
          { title: '排序', slot: 'sort', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 150, align: 'center' }
        ],
        totalData: [],
        metaItem: null,
        ruleValidate: {
          fieldName: [requiredRule, { validator: validateFieldName, trigger: 'blur' }],
          fieldTitle: [requiredRule, { validator: validateFieldTitle, trigger: 'blur' }],
          dataType: [{ required: true, message: '数据类型必选', trigger: 'change' }],
          dataLength: [{ required: true, validator: validateDataLength, trigger: 'blur' }]
        },
        formLoading: false,
        dialogFormVisible: false, // 编辑页是否显示
        dialogStatus: '',
        currentIndex: -1
      }
    },
    created() {
      this.resetItem()
    },
    watch: {
      value: {
        handler(val) {
          this.totalData = [...val]
        },
        immediate: true
      }
    },
    methods: {
      // 添加信息项
      handleCreateItem() {
        this.resetItem()
        this.openDialog('create')
      },
      // 新增一个主体
      handleAddPerson() {
        this.$emit('on-add-person')
      },
      // 修改信息项
      handleModify(row, index) {
        this.metaItem = deepCopy(row)
        this.currentIndex = index // 当前选中的行数
        this.openDialog('modify')
      },
      // 删除信息项
      handleRemove(row, index) {
        this.$confirm({
          title: '警告',
          content: '确认删除此信息项吗？',
          onOk: () => {
            this.totalData.splice(index, 1) // 清除一个未保存的项
            this.resetHandle('删除项成功')
          }
        })
      },
      // 信息项排序方法
      handleSort(type, index) {
        // 复制一个data
        let arr = deepCopy(this.totalData)
        if (type === 'up') { // 上移操作
          if (index > this.sysItemCount) {
            let newArr = upGo(arr, index)
            this.totalData = deepCopy(newArr)
            this.resetHandle('上移一层')
          }
        } else if (type === 'down') { // 下移一层操作
          if (index !== arr.length - 1) {
            let newArr = downGo(arr, index)
            this.totalData = deepCopy(newArr)
            this.resetHandle('下移一层')
          }
        }
      },
      // 打开窗口
      openDialog(status) {
        this.$refs.form && this.$refs.form.resetFields()
        this.dialogFormVisible = true
        this.dialogStatus = status
      },
      // 数据类型改版事件
      handleTypeChange(val) {
        switch (val) {
          case 'string':
          case 'text':
            this.metaItem.dataLength = 64
            this.metaItem.dataPrecision = null
            break
          case 'number':
            this.metaItem.dataLength = 24
            this.metaItem.dataPrecision = 0
            break
          case 'money':
            this.metaItem.dataLength = 24
            this.metaItem.dataPrecision = 0
            break
          default:
            this.metaItem.dataLength = null
            this.metaItem.dataPrecision = null
            break
        }
      },
      // 表单提交,只需要缓存至数组即可
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.dialogStatus === 'create') { // 新增时需要push一个数据
              this.totalData.push(deepCopy(this.metaItem))
            } else if (this.dialogStatus === 'modify') {
              this.totalData[this.currentIndex] = deepCopy(this.metaItem)
            }
            this.resetHandle(`${this.dialogStatus === 'create' ? '新增' : '修改'}成功`)
          }
        })
      },
      // 重置操作和更新model
      resetHandle(message) {
        // 清空当前修改行
        this.currentIndex = -1
        // 1.emit-input
        this.emitValue()
        // 2.关闭窗口
        this.dialogFormVisible = false
        // 3.打印操作
        this.$message({ type: 'success', content: message })
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      },
      // 初始化信息项操作
      resetItem() {
        this.metaItem = {
          fieldName: '',
          fieldTitle: '',
          dataType: '',
          dataLength: null,
          dataPrecision: null,
          fieldDesc: ''
        }
      }
    }
  }
</script>
