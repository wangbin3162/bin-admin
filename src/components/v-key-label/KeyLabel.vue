<template>
  <div class="key-label" :style="rowStyle">
    <div class="inner" flex>
      <span class="label" :style="labelStyle">{{ label }}</span>
      <span class="val" flex-box="1">
        <slot>文字</slot>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VKeyLabel',
    props: {
      label: {
        type: String,
        default: 'label',
        required: true
      },
      labelWidth: {
        type: String,
        default: '130px'
      },
      labelPosition: {
        type: String,
        default: 'right'
      },
      isHalf: Boolean,
      isFirst: Boolean,
      isBottom: Boolean
    },
    computed: {
      rowStyle () {
        let style = {}
        style = Object.assign({}, {
          width: this.isHalf ? '50%' : '100%',
          borderBottom: !this.isBottom ? 'none' : null,
          borderRight: this.isFirst ? 'none' : null
        })
        return style
      },
      labelStyle () {
        let style = {
          width: this.labelWidth,
          textAlign: this.labelPosition
        }
        return style
      }
    }
  }
</script>

<style scoped lang="stylus">
  .key-label {
    display: inline-block;
    line-height: 40px;
    border: 1px solid #d5d9de;
    .label {
      padding: 0 10px;
      background: #fafafa;
      border-right: 1px solid #d5d9de;
    }
    .val {
      padding: 0 10px;
    }
  }
</style>
