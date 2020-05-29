// j-form 包裹组件
export default {
  name: 'JForm',
  props: {
    model: { //
      type: Object,
      required: true
    },
    rules: { //
      type: Object,
      required: true
    }
  },
  render(h) {
    let node
    node = h('b-form', {
      props: {
        model: this.model,
        rules: this.rules
      }
    }, this.$slots.default)
    return node
  }
}
