<template>
  <!--资源信息，信息项表格组件 for ResInfo.vue -->
  <div style="padding: 10px 0;">
    <b-table disabled-hover :data="totalData" :columns="fieldsColumns" size="small">
      <!--标题-->
      <template v-slot:fieldTitle="scope">
        <b-input v-model="totalData[scope.index].fieldTitle" @on-change="emitValue" size="small"></b-input>
      </template>
      <!--信息项类型-选择必填项下拉框-->
      <template v-slot:required="scope">
        <b-select v-model="totalData[scope.index].required" append-to-body @on-change="emitValue" size="small">
          <b-option v-for="(value,key) in fieldTypeMap" :key="key" :value="key">{{ value }}</b-option>
        </b-select>
      </template>
      <!--数据类型-->
      <template v-slot:dataType="scope">{{ dataTypeMap[scope.row.dataType] }}</template>
      <!--有效值-->
      <template v-slot:validValue="scope">
        <valid-value-input v-model="totalData[scope.index].validValue"
                           :data-type="scope.row.dataType"
                           :current-index="scope.index"
                           @on-clear="handleClearValidValue"
                           @on-command="handleCommand">
        </valid-value-input>
      </template>
      <!--验证规则配置-->
      <template v-slot:ruleCfg="scope">
        <b-button type="text" @click="handleClickValidate(scope.index)">
          <b-icon name="ios-git-compare" size="14"></b-icon>
          配置
        </b-button>
      </template>
      <!--是否分词-->
      <template v-slot:tokenizer="scope">
        <b-select v-model="totalData[scope.index].tokenizer" append-to-body @on-change="emitValue"
                  placeholder=""
                  :disabled="scope.row.dataType!=='string'||scope.row.validValue.length>0">
          <b-option v-for="(value,key) in tokenizerMap" :key="key" :value="key">{{ value }}</b-option>
        </b-select>
      </template>
      <!--排序-->
      <template v-slot:sort="scope">
        <v-sort-arrow @on-up="handleSort('up',scope.index)" @on-down="handleSort('down',scope.index)"></v-sort-arrow>
      </template>
      <!--启用状态-->
      <template v-slot:status="scope">
        <b-switch v-model="totalData[scope.index].status"
                  true-value="use" false-value="ignore"
                  @on-change="emitValue"></b-switch>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button type="text" @click="handleModify(scope.row,scope.index)">编辑</b-button>
      </template>
    </b-table>
    <!--编辑弹窗-->
    <b-modal v-model="dialogFormVisible" width="800" title="修改信息项" :mask-closable="false">
      <b-form :model="item" ref="form" :rules="ruleValidate" :label-width="100">
        <b-row>
          <b-col span="12">
            <b-form-item label="名称" prop="fieldName" class="bin-form-item-required">
              <b-input v-model="item.fieldName" placeholder="请输入名称" clearable disabled></b-input>
            </b-form-item>
          </b-col>
          <b-col span="12">
            <b-form-item label="标题" prop="fieldTitle">
              <b-input v-model="item.fieldTitle" placeholder="请输入标题" clearable></b-input>
            </b-form-item>
          </b-col>
        </b-row>
        <b-row>
          <b-col span="12">
            <b-form-item label="数据类型" prop="dataType" class="bin-form-item-required">
              <b-input :value="dataTypeMap[item.dataType]" placeholder="请输入标题" clearable disabled></b-input>
            </b-form-item>
          </b-col>
          <b-col span="12">
            <b-form-item label="控件类型" prop="controlType">
              <b-select v-model="item.controlType" placeholder="请选择类型" clearable>
                <b-option v-for="(value,key) in fieldCtrlMap" :value="key" :key="key">{{ value }}</b-option>
              </b-select>
            </b-form-item>
          </b-col>
        </b-row>
        <b-row>
          <b-col span="12">
            <b-form-item label="掩码方式" prop="maskModel">
              <b-select v-model="item.maskModel" clearable>
                <b-option value="ID_CODE">身份证</b-option>
                <b-option value="MOBILE_PHONE">手机号</b-option>
              </b-select>
            </b-form-item>
          </b-col>
          <b-col span="12">
            <b-form-item label="是否加密" prop="isEncrypt">
              <b-select v-model="item.isEncrypt" clearable>
                <b-option value="0">否</b-option>
                <b-option value="1">是</b-option>
              </b-select>
            </b-form-item>
          </b-col>
        </b-row>
        <b-row>
          <b-col span="12">
            <b-form-item label="公开类型" prop="openType">
              <b-select v-model="item.openType" placeholder="请选择类型" clearable>
                <b-option v-for="(value,key) in fieldOpenTypeMap" :value="key" :key="key">{{ value }}</b-option>
              </b-select>
            </b-form-item>
          </b-col>
          <b-col span="12">
            <b-form-item label="是否分词">
              <b-select v-model="item.tokenizer"
                        :disabled="item.dataType!=='string'||item.validValue.length>0">
                <b-option v-for="(value,key) in tokenizerMap" :key="key" :value="key">{{ value }}</b-option>
              </b-select>
            </b-form-item>
          </b-col>
        </b-row>
        <b-form-item label="提示内容" prop="fieldDesc">
          <b-input v-model="item.fieldDesc" placeholder="请输入提示内容" type="textarea"></b-input>
        </b-form-item>
      </b-form>
      <div slot="footer" class="t-center">
        <b-button type="primary" @click="handleSubmit">确 定</b-button>
        <b-button @click="dialogFormVisible = false">取 消</b-button>
      </div>
    </b-modal>
    <!--系统字典弹窗-->
    <sys-dict-choose ref="sysDictChoose" @on-choose="handleChooseDict"></sys-dict-choose>
    <!--枚举值编辑弹窗-->
    <enum-edit ref="enumEdit" @on-change="handleEnumChange"></enum-edit>
    <!--校验配置编辑弹窗-->
    <validate-edit ref="validateEdit" @on-save="saveRules"></validate-edit>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../../common/utils/assist'
  import { downGo, upGo } from '../../../../../common/utils/arr-utils'
  import SysDictChoose from './SysDictChoose'
  import ValidValueInput from './ValidValueInput'
  import EnumEdit from './EnumEdit'
  import ValidateEdit from '../Validator/ValidateEdit'
  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'ResInfoItems',
    components: { ValidateEdit, EnumEdit, ValidValueInput, SysDictChoose },
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      dataTypeMap: {
        type: Object,
        required: true
      },
      fieldCtrlMap: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        fieldsColumns: [
          { title: '名称', key: 'fieldName'},
          { title: '标题', slot: 'fieldTitle' },
          { title: '信息项类型', slot: 'required', width: 110 },
          { title: '数据类型', slot: 'dataType', width: 90, align: 'center' },
          { title: '有效值', slot: 'validValue', width: 200 },
          { title: '验证规则', slot: 'ruleCfg', width: 90, align: 'center' },
          { title: '是否分词', slot: 'tokenizer', width: 90 },
          { title: '排序', slot: 'sort', width: 75, align: 'center' },
          { title: '启用状态', slot: 'status', width: 90, align: 'center' },
          { title: '操作', slot: 'action', width: 90, align: 'center' }
        ],
        totalData: [],
        item: null,
        ruleValidate: {
          fieldTitle: [requiredRule],
          controlType: [{ required: true, message: '控件类型必选', trigger: 'change' }],
          openType: [{ required: true, message: '公开类型必选', trigger: 'change' }]
        },
        formLoading: false,
        dialogFormVisible: false, // 编辑页是否显示
        dialogStatus: '',
        currentIndex: -1,
        fieldTypeMap: { Y: '核心项', G: '一般项', A: '辅助项' }, // 资源信息项类型枚举#static
        fieldOpenTypeMap: { PUBLIC: '社会公开', DEPART_RANGE: '授权访问', PRIVATE: '不公开' }, // 资源信息项公开类型#static
        fieldStatusMap: { use: '选用', ignore: '不选用' },
        tokenizerMap: { N: '否', Y: '是' }
      }
    },
    created() {
      this.resetItem()
    },
    watch: {
      value: {
        handler(val) {
          this.totalData = this.formatItems(val)
        },
        immediate: true
      }
    },
    methods: {
      // 针对传入的数组对是否分词进行初始化
      formatItems(items) {
        return items.map(i => {
          let item = { ...i }
          // 如果已经有值
          if (item.tokenizer) {
            // 如果设置了有效值则必须为Y
            if (item.validValue.length > 0) {
              item.tokenizer = 'Y'
            }
          } else {
            // 如果类型为字符型
            if (item.dataType === 'string') {
              // 如果有效值存在
              item.tokenizer = item.validValue.length > 0 ? 'Y' : 'N'
            } else {
              item.validValue = '' // 如果类型不是字符型，则有效值必须为空
              item.tokenizer = '' // 是否分词也必须为空
            }
          }
          return item
        })
      },
      // 下拉选择填充有效值事件
      handleCommand(type, index) {
        this.currentIndex = index // 当前选中的行数
        if (type === 'DICT') {
          this.$refs.sysDictChoose && this.$refs.sysDictChoose.open()
        } else {
          const valid = this.totalData[this.currentIndex].validValue
          this.$refs.enumEdit && this.$refs.enumEdit.open(valid)
        }
      },
      // 清空有效值事件
      handleClearValidValue(index) {
        this.currentIndex = index // 当前清空有效值的行数
        this.totalData[this.currentIndex].validValue = ''
        // 清空当前修改行
        this.currentIndex = -1
        // emit-input
        this.emitValue()
      },
      // 点击校验配置事件
      handleClickValidate(index) {
        this.currentIndex = index // 当前选中的行数
        this.$refs.validateEdit && this.$refs.validateEdit.open(this.totalData[index].checkRules)
      },
      // 保存一个校验字符串
      saveRules(rules) {
        this.totalData[this.currentIndex].checkRules = rules
        this.resetHandle('操作成功!')
      },
      // 选中一个字典值事件
      handleChooseDict(value) {
        this.totalData[this.currentIndex].validValue = value
        this.resetHandle('填充有效值成功')
      },
      // 枚举编辑改变事件
      handleEnumChange(result) {
        this.totalData[this.currentIndex].validValue = result
        this.resetHandle('填充有效值成功')
      },
      // 信息项排序方法
      handleSort(type, index) {
        // 复制一个data
        let arr = deepCopy(this.totalData)
        if (type === 'up') { // 上移操作
          if (index > 0) {
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
      // 修改信息项
      handleModify(row, index) {
        this.item = deepCopy(row)
        this.currentIndex = index // 当前选中的行数
        this.openDialog('modify')
      },
      // 打开窗口
      openDialog(status) {
        this.$refs.form && this.$refs.form.resetFields()
        this.dialogFormVisible = true
        this.dialogStatus = status
      },
      // 表单提交,只需要缓存至数组即可
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.dialogStatus === 'modify') {
              this.totalData[this.currentIndex] = deepCopy(this.item)
            }
            this.resetHandle('修改成功')
          }
        })
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      },
      // 初始化信息项操作
      resetItem() {
        this.item = {
          fieldName: '',
          fieldTitle: '',
          dataType: '',
          openType: 'PUBLIC', // 信息项公开类型,默认社会公开
          controlType: 'TEXT', // 控件类型,默认文本框
          fieldDesc: '', // 提示信息
          validValue: '', // 有效值
          maskModel: '', // 掩码方式
          isEncrypt: '', // 是否加密
          required: 'Y', // 信息项类型，默认核心项
          status: 'use', // 启用状态，默认启用
          tokenizer: '', // 是否分词
          // eslint-disable-next-line no-template-curly-in-string
          checkRules: '{"rules":["$required(obj, value, {\\"message\\":\\"${title}不可以为空\\"})"]}'
        }
      }
    }
  }
</script>
