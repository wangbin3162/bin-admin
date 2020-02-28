// form-control 根据控件类型返回不同的控件
import LegPersonChoose from './LegPersonChoose'
import NatPersonChoose from './NatPersonChoose'

const READONLY = ['id_code', 'id_type']
export default {
  name: 'FormControl',
  components: { LegPersonChoose, NatPersonChoose },
  data() {
    return {
      currentValue: '',
      items: [],
      number: 0
    }
  },
  props: {
    value: {
      type: String,
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
    const readonly = READONLY.includes(this.fieldName) && (this.tableName !== 'leg_base_info' && this.tableName !== 'nat_base_info')
    let node
    switch (this.controlType) {
      case 'TEXT':
        node = h('b-input', {
          props: {
            value: this.currentValue,
            placeholder: `${this.fieldDesc ? this.fieldDesc : '请输入' + this.fieldTitle}`,
            disabled: readonly,
            clearable: !readonly
          },
          on: { input: this.handleInput }
        })
        break
      case 'TEXTAREA':
        node = h('b-input', {
          props: {
            value: this.currentValue,
            placeholder: `${this.fieldDesc ? this.fieldDesc : '请输入' + this.fieldTitle}`,
            rows: 2,
            type: 'textarea'
          },
          on: { input: this.handleInput }
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
      case 'LEG_PERSON':
        node = h('leg-person-choose', {
          props: {
            value: this.currentValue,
            placeholder: `选择法人填充${this.fieldDesc}等字段`,
            readonly: readonly,
            clearable: !readonly
          },
          on: { 'on-select-leg': this.handleSelectLeg }
        })
        break
      case 'NAT_PERSON':
        node = h('nat-person-choose', {
          props: {
            value: this.currentValue,
            placeholder: `选择自然人填充${this.fieldDesc}等字段`,
            readonly: readonly,
            clearable: !readonly
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
    // 法人选择事件,从法人控件中监听并继续向上层抛出
    handleSelectLeg(leg) {
      this.$emit('on-select-leg', leg)
    },
    // 自然人选择事件,从自然人控件中监听并继续向上层抛出
    handleSelectNat(nat) {
      this.$emit('on-select-nat', nat)
    }
  }
}
