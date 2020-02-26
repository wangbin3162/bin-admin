<template>
  <b-cascade :data="options" :placeholder="placeholder" size="small" :render-format="format" :disabled="disabled"
             @on-change="handleChange" v-model="current" change-on-select></b-cascade>
</template>

<script>
  export default {
    name: 'VCascade',
    props: {
      value: {
        type: String
      },
      data: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        default: '全部'
      },
      showLast: {
        type: Boolean,
        default: true
      },
      disabled: Boolean
    },
    data() {
      return {
        current: [],
        options: []
      }
    },
    watch: {
      value: {
        handler(val) {
          const select = this.findChoose(this.options, val)
          if (select) {
            if (select.choose) {
              this.current = select.choose.slice(1)
            } else {
              this.$log.danger('options is mast have choose in nodeMapper!')
            }
          }
        }
      },
      data: {
        handler(val) {
          this.options = val
          const select = this.findChoose(this.options, this.value)
          // 如果能够查询到则表示选中
          if (select) {
            if (select.choose) {
              this.current = select.choose.slice(1)
            } else {
              this.$log.danger('options is mast have choose in nodeMapper!')
            }
          }
        },
        immediate: true
      }
    },
    methods: {
      handleChange(val) {
        let current = val[val.length - 1] || ''
        this.$emit('input', current)
        this.$emit('on-change', current)
      },
      // 递归查询当前选中的数组所选中的数组列表
      findChoose(context, val) {
        const childes = context
        let children = null
        // 如果有孩子
        if (childes.length) {
          for (const child of childes) { // 遍历孩子
            if (child.value === val) {
              children = child
              break
            } else {
              children = this.findChoose(child.children, val)
              if (children) break
            }
          }
        }
        return children
      },
      format(labels) {
        if (this.showLast) {
          return labels[labels.length - 1]
        }
        return labels.join('/')
      }
    }
  }
</script>
