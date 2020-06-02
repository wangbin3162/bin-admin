// form-item 包裹组件
export default {
  name: 'FormItem',
  props: {
    controlType: {
      type: String,
      default: 'TEXT'
    },
    label: { // 标题文字
      type: String,
      required: true
    },
    prop: { // 校验字段属性，需跟form中和rules中属性一致
      type: String,
      required: true
    }
  },
  render(h) {
    let node
    node = h('b-form-item', {
      props: {
        label: this.label,
        prop: this.prop
      }
    }, this.$slots.default)
    return h('div', { style: this.wrapStyle }, [node])
  },
  computed: {
    wrapStyle() {
      return {
        width: ['FILE_UPLOAD', 'TEXTAREA'].indexOf(this.controlType) > -1 ? '100%' : '25%',
        display: 'inline-block',
        padding: '0 5px'
      }
    }
  }
}
