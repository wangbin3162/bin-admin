import { checkRulesToFormRules } from '../../components/Validator/FieldsCfg/cfg-util'
import { Decode, Encode, MaskCode } from '../utils/secret'
import { oneOf } from 'bin-ui/src/utils/util'
import FormItem from '../../components/Validator/FormControl/FormItem'
import FormControl from '../../components/Validator/FormControl/FormControl'

/**
 * 动态表单mixin
 * dynamicForm    为动态遍历表单数组，存储所有字段的配置信息
 * form           为动态生成并初始化的form表单对象
 * rules          根据动态表单渲染的动态校验对象
 * dynamicFormRef 为动态渲染表单的ref获取名称
 */
export default {
  components: { FormControl, FormItem },
  data() {
    return {
      dynamicForm: [], // 动态form，用于遍历form表单使用
      form: {},
      rules: {},
      btnLoading: false
    }
  },
  methods: {
    // 根据元信息字段项转换成信息项对象
    fieldsToInfoItem(field, directoryId) {
      // 数据类型映射控件类型
      const dateTypeMapCtrl = {
        string: 'TEXT',
        number: 'NUMBER_TEXT',
        date: 'DATE',
        datetime: 'DATE_TIME',
        text: 'TEXTAREA'
      }
      const typeMap = {
        string: 'string',
        number: 'number',
        date: 'string',
        datetime: 'string',
        text: 'string'
      }[field.dataType]
      const triggerMap = {
        string: 'blur',
        number: 'change',
        date: 'change',
        datetime: 'change',
        text: 'blur'
      }[field.dataType]
      // eslint-disable-next-line no-useless-escape
      const requireRuleStr = `[{\"name\":\"$required\",\"message\":\"${field.fieldTitle}必填\",\"type\":\"${typeMap}\",\"trigger\":\"${triggerMap}\"}]`
      return {
        directoryId,
        fieldName: field.fieldName, // 元信息名称（英文）
        fieldTitle: field.fieldTitle, // 元信息标题
        dataType: field.dataType, // 数据类型
        dataLength: field.dataLength, // 数据长度
        dataPrecision: field.dataPrecision, // 数据精度
        openType: 'PUBLIC', // 信息项公开类型,默认社会公开
        controlType: dateTypeMapCtrl[field.dataType], // 控件类型
        fieldDesc: '', // 提示信息
        validValue: '', // 有效值
        maskModel: '', // 掩码方式
        isEncrypt: '', // 是否加密
        required: 'Y', // 信息项类型，默认核心项
        status: 'use', // 启用状态，默认启用
        tokenizer: '', // 是否分词
        checkRules: requireRuleStr
      }
    },
    // 选择法人,自然人事件
    handleSelectNatLeg(fillField, nat) {
      let [field0, field1, field2, field3] = fillField
      this.form[field0] = nat.id
      this.form[field1] = nat.name
      this.form[field2] = nat.idType
      this.form[field3] = nat.idCode
      // 选中后重新触发校验
      this.$refs.dynamicFormRef.validateField(field1)
      this.$refs.dynamicFormRef.validateField(field2)
      this.$refs.dynamicFormRef.validateField(field3)
    },
    // 表单提交
    handleDynamicFormSubmit() {
      console.log(this.form)
      this.$refs.dynamicFormRef.validate((valid) => {
        if (valid) {
          this.$message({ type: 'success', content: '表单校验成功' })
          this.$log.primary('表单校验成功')
        } else {
          this.$message({ type: 'danger', content: '表单校验失败' })
          this.$log.danger('表单校验失败')
        }
      })
    },
    // 表单重置
    handleDynamicFormReset() {
      this.$refs.dynamicFormRef && this.$refs.dynamicFormRef.resetFields()
    },
    // =======初始化动态form，rules对象======== //
    initDynamicForm(dynamicForm) {
      this.form = {}
      this.rules = {}
      // 额外扩展id和person_id字段
      this.$set(this.form, 'id', '')
      if (!['leg_base_info', 'nat_base_info', 'leg_id_info', 'nat_id_info'].includes(this.resource.tableName)) {
        this.$set(this.form, 'person_id', '')
      }
      dynamicForm.forEach(item => {
        // 1、先根据filedName扩展form对象
        this.$set(this.form, item.fieldName, item.dataType === 'number' ? 0 : '')
        // 2、如果当前字段名称为多主体id_name1 id_name 后为索引，则需要额外添加person_id[index]
        if (item.fieldName.indexOf('id_name') === 0) {
          let index = item.fieldName.slice(7)
          this.$set(this.form, `person_id${index}`, '')
        }
        // 3、根据每个item，执行校验函数并返回校验数组 根据checkRules参数获取实际校验对象
        let rules = checkRulesToFormRules(item.checkRules, this.form)
        if (rules.length > 0) {
          this.$set(this.rules, item.fieldName, rules)
        }
      })
      this.$log.primary('----form----')
      console.log(this.form)
      this.$log.primary('------------')
      this.$log.success('----rules----')
      console.log(this.rules)
      this.$log.success('-------------')
    },
    // =======解码掩码函数======== //
    decodeAndMaskFormat(arr, mask = false) {
      let newArr = []
      arr.forEach(item => {
        let tmp = { ...item }
        this.dynamicForm.forEach(field => {
          let value = ''
          if (field.isEncrypt === '1') { // 解密
            value = Decode(item[field.fieldName])
            // console.log('解码后：' + value)
          }
          if (mask && oneOf(field.maskModel, ['ID_CODE', 'MOBILE_PHONE'])) { // 掩码
            value = MaskCode(tmp[field.fieldName], field.maskModel)
            // console.log('掩码后：' + value)
          }
          tmp[field.fieldName] = value
        })
        newArr.push(tmp)
      })
      return newArr
    },
    // =======单个对象查询到值后解码======== //
    decodeFormObj(obj) {
      let tmp = { ...obj }
      this.dynamicForm.forEach(field => {
        if (field.isEncrypt === '1') { // 解码
          tmp[field.fieldName] = Decode(obj[field.fieldName])
        }
      })
      return tmp
    },
    // =======单个对象编码后form对象======== //
    getEncodeFormObj() {
      let tmp = { ...this.form }
      this.dynamicForm.forEach(field => {
        if (field.isEncrypt === '1') { // 编码
          tmp[field.fieldName] = Encode(this.form[field.fieldName])
        }
      })
      return tmp
    },
    // =======设置form表单对象======== //
    setFormObj(target) {
      // 注意这里不能直接拷贝或者展开，需要逐一对form表单进行填值
      Object.keys(this.form).forEach(key => {
        if (target[key]) {
          this.form[key] = target[key]
        }
      })
    }
  }
}
