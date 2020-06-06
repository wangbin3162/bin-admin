// form-control 根据控件类型返回不同的控件
import SelectLegInput from './SelectLegInput'
import SelectNatInput from './SelectNatInput'
import SelectNatOrLeg from './SelectNatOrLeg'
import FileUpload from './FileUpload'
import { oneOf } from 'bin-ui/src/utils/util'

export default {
  name: 'FormControl',
  components: { SelectLegInput, SelectNatInput, SelectNatOrLeg, FileUpload },
  data() {
    return {
      currentValue: '',
      items: [],
      number: 0
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    resourceKey: {
      type: String,
      required: true
    },
    controlType: {
      type: String,
      default: 'TEXT'
    },
    fieldName: { // 字段名称(英文)，用于判断是否是只读
      type: String,
      default: ''
    },
    fieldTitle: { // 字段标题，用于拼接提示语句或选项值
      type: String,
      default: ''
    },
    fieldDesc: {
      type: String,
      default: ''
    },
    dataLength: {
      type: Number
    },
    dataPrecision: {
      type: Number
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    tableName: {
      type: String,
      default: ''
    }
  },
  render(h) {
    const readonly = (this.fieldName.indexOf('id_code') === 0 || this.fieldName.indexOf('id_type') === 0) &&
      (this.tableName !== 'leg_base_info' && this.tableName !== 'nat_base_info')
    // const readonly = false
    let node
    switch (this.controlType) {
      case 'TEXT':
        node = h('b-input', {
          props: {
            value: this.currentValue,
            maxlength: this.dataLength,
            placeholder: `${this.fieldDesc ? this.fieldDesc : '请输入' + this.fieldTitle}`,
            disabled: readonly,
            clearable: !readonly
          },
          on: { input: this.handleInput }
        })
        break
      case 'NUMBER_TEXT':
        node = h('b-input-number', {
          props: {
            value: this.currentValue,
            precision: this.dataPrecision,
            disabled: readonly,
            clearable: !readonly
          },
          style: { width: '100%' },
          on: { 'on-change': this.handleInput }
        })
        break
      case 'TEXTAREA':
        node = h('b-input', {
          props: {
            value: this.currentValue,
            maxlength: this.dataLength,
            placeholder: `${this.fieldDesc ? this.fieldDesc : '请输入' + this.fieldTitle}`,
            autosize: { minRows: 1, maxRows: 4 },
            type: 'textarea'
          },
          on: { 'input': this.handleInput }
        })
        break
      case 'DATE':
        node = h('b-date-picker', {
          props: {
            value: this.currentValue,
            placeholder: `${this.fieldDesc ? this.fieldDesc : '请选择' + this.fieldTitle}`,
            appendToBody: true
          },
          on: { 'on-change': this.handleInput }
        })
        break
      case 'DATE_TIME':
        node = h('b-date-picker', {
          props: {
            type: 'datetime',
            value: this.currentValue,
            placeholder: `${this.fieldDesc ? this.fieldDesc : '请选择' + this.fieldTitle}`,
            appendToBody: true
          },
          on: { 'on-change': this.handleInput }
        })
        break
      case 'SELECT':
        node = h('b-select', {
            props: {
              value: this.currentValue,
              placeholder: `${this.fieldDesc ? this.fieldDesc : '请选择' + this.fieldTitle}`,
              disabled: readonly,
              clearable: !readonly,
              appendToBody: true
            },
            on: { 'on-change': this.handleInput }
          },
          this.options.map((item) => {
            return h('b-option', { props: { value: item.code } }, [item.name])
          })
        )
        break
      case 'MULTIPLE_SELECT':
        node = h('b-select', {
            props: {
              value: this.currentValue.split(','),
              placeholder: `${this.fieldDesc ? this.fieldDesc : '请选择' + this.fieldTitle}`,
              disabled: readonly,
              clearable: !readonly,
              appendToBody: true,
              multiple: true,
              maxTagCount: 2
            },
            on: { 'on-change': this.handleInputMultiple }
          },
          this.options.map((item) => {
            return h('b-option', { props: { value: item.code } }, [item.name])
          })
        )
        break
      case 'LEG_PERSON':
        node = h('select-leg-input', {
          props: {
            value: this.currentValue,
            placeholder: `选择法人`
          },
          on: { 'on-select': this.handleSelectNatOrLeg }
        })
        break
      case 'NAT_PERSON':
        node = h('select-nat-input', {
          props: {
            value: this.currentValue,
            placeholder: `选择自然人`
          },
          on: { 'on-select': this.handleSelectNatOrLeg }
        })
        break
      case 'NAT_OR_LEG_PERSON':
        node = h('select-nat-or-leg', {
          props: {
            value: this.currentValue,
            placeholder: `选择自然人或法人`
          },
          on: { 'on-select': this.handleSelectNatOrLeg }
        })
        break
      case 'FILE_UPLOAD':
        node = h('file-upload', {
          props: {
            value: this.currentValue,
            resourceKey: this.resourceKey
          },
          on: { input: this.handleInput }
        })
        break
      default:
        node = h('b-input', { props: { value: `没有 ${this.controlType} 类型的控件`, disabled: true } })
        break
    }
    return node
  },
  watch: {
    value: {
      handler(val) {
        this.currentValue = val
      },
      immediate: true
    }
  },
  methods: {
    // 触发emit input函数
    handleInput(value) {
      this.currentValue = value
      this.$emit('input', this.currentValue)
    },
    // 触发多选input函数
    handleInputMultiple(value) {
      this.currentValue = value.join(',')
      this.$emit('input', this.currentValue)
    },
    // 选择自然人或法人事件,基本item，type，codes，六码
    handleSelectNatOrLeg(item, type, codes) {
      let index = oneOf(this.fieldName, ['name', 'comp_name']) ? '' : this.fieldName.slice('id_name'.length)
      let baseInfo = {}
      baseInfo[`person_id${index}`] = item.id
      baseInfo[this.fieldName] = item.name
      baseInfo[`id_type${index}`] = item.idType
      baseInfo[`id_code${index}`] = item.idCode
      let result = { ...baseInfo }
      if (type === 'leg' && codes) {
        // 判断是否是【双公示】】法人行政许可【leg_xzxk_info】或 法人行政处罚【leg_xzcf_info
        if (this.tableName === 'leg_xzxk_info') {
          result = {
            ...baseInfo,
            ...{
              'xk_xdr_shxym': codes.idShxym, // 统一社会信用代码
              'xk_xdr_gszc': codes.idGszc, // 工商注册号
              'xk_xdr_zzjg': codes.idShxym, // 组织机构代码
              'xk_xdr_swdj': codes.idShxym, // 税务登记号
              'xk_xdr_sydw': codes.idShxym, // 事业单位证书号
              'xk_xdr_shzz': codes.idShxym // 社会组织登记号
            }
          }
        }
        if (this.tableName === 'leg_xzcf_info') {
          result = {
            ...baseInfo,
            ...{
              'cf_xdr_shxym': codes.idShxym, // 统一社会信用代码
              'cf_xdr_gszc': codes.idGszc, // 工商注册号
              'cf_xdr_zzjg': codes.idShxym, // 组织机构代码
              'cf_xdr_swdj': codes.idShxym, // 税务登记号
              'cf_xdr_sydw': codes.idShxym, // 事业单位证书号
              'cf_xdr_shzz': codes.idShxym // 社会组织登记号
            }
          }
        }
      }
      this.$emit('on-select', result)
    }
  }
}
