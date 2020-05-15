// form-control 根据控件类型返回不同的控件
import SelectLegInput from './SelectLegInput'
import SelectNatInput from './SelectNatInput'
import { oneOf } from 'bin-ui/src/utils/util'

export default {
  name: 'FormControl',
  components: { SelectLegInput, SelectNatInput },
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
          on: { 'on-select-leg': this.handleSelectLeg }
        })
        break
      case 'NAT_PERSON':
        node = h('select-nat-input', {
          props: {
            value: this.currentValue,
            placeholder: `选择自然人`
          },
          on: { 'on-select-nat': this.handleSelectNat }
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
    // 法人选择事件,从法人控件中监听并继续向上层抛出
    handleSelectLeg(leg) {
      let index = oneOf(this.fieldName, ['name', 'comp_name']) ? '' : this.fieldName.slice('id_name'.length)
      // 填充字段名称，需要根据多主体索引来判断
      let fillField = [
        `person_id${index}`,
        this.fieldName,
        `id_type${index}`,
        `id_code${index}`
      ]
      this.$emit('on-select-leg', fillField, {
        id: leg.id,
        name: leg.compName,
        idType: leg.idType,
        idCode: leg.idCode
      })
    },
    // 自然人选择事件,从自然人控件中监听并继续向上层抛出
    handleSelectNat(nat) {
      let index = oneOf(this.fieldName, ['name', 'comp_name']) ? '' : this.fieldName.slice('id_name'.length)
      // 填充字段名称，需要根据多主体索引来判断
      let fillField = [
        `person_id${index}`,
        this.fieldName,
        `id_type${index}`,
        `id_code${index}`
      ]
      this.$emit('on-select-nat', fillField, {
        id: nat.id,
        name: nat.name,
        idType: nat.idType,
        idCode: nat.idCode
      })
    }
  }
}
