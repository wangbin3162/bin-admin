// 参数设置组件，根据传入的类型去生成不同的组件
const NUM = '0'
const STRING = '1'
const RADIO = '2'
const CHECKBOX = '3'
export default {
  name: 'param-conf',
  data () {
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
    valueMode: {
      type: String,
      default: '0' // { '0': '数字','1': '字符串', '2': '内部单选', '3': '内部多选' }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  render (h) {
    let node
    switch (this.valueMode) {
      case NUM:
        node = h('b-input-number', {
          props: {
            value: this.number
          },
          on: { input: this.handleInputNum }
        })
        break
      case STRING:
        node = h('b-input', {
          props: {
            value: this.currentValue,
            placeholder: '请输入参数值',
            clearable: true
          },
          on: { input: this.handleInput }
        })
        break
      case RADIO:
        node = h('b-radio-group', {
            props: { value: this.currentValue },
            on: { input: this.radioChange }
          },
          this.options.map((item) => {
            return h('b-radio', {
              props: { label: item.value }
            }, [item.label])
          })
        )
        break
      case CHECKBOX:
        node = h('b-checkbox-group', {
            props: { value: this.items },
            on: { input: this.checkboxChange }
          },
          this.options.map((item) => {
            return h('b-checkbox', {
              props: { label: item.value }
            }, [item.label])
          })
        )
        break
      default:
        node = h('span', ['参数占位符'])
        break
    }
    return node
  },
  watch: {
    value: {
      handler (val) {
        // 缓存选中数组
        this.items = this.valueMode === CHECKBOX ? val.split(',') : []
        this.number = this.valueMode === NUM ? Number(this.value) : 0
        this.currentValue = val
      },
      immediate: true
    }
  },
  methods: {
    // 数字输入框输入
    handleInputNum (value) {
      this.$emit('input', value.toString())
    },
    // 输入框输入
    handleInput (value) {
      this.currentValue = value
      this.$emit('input', this.currentValue)
    },
    // 单选框改变
    radioChange (value) {
      this.currentValue = value
      this.$emit('input', this.currentValue)
    },
    // 多选框数组转换成字符串
    checkboxChange (arr) {
      let value = []
      // 根据原options数组来决定选中顺序
      this.options.forEach(item => {
        if (arr.includes(item.value)) {
          value.push(item.value)
        }
      })
      this.$emit('input', value.join(','))
    }
  }
}
