<template>
  <div class="key-label" :style="rowStyle">
    <div class="inner" flex="box:first">
      <span class="label" :style="labelStyle">{{ label }}</span>
      <span class="val">
        <slot>文字</slot>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'KeyLabel',
    props: {
      label: {
        type: String,
        default: 'label',
        required: true
      },
      labelWidth: {
        type: String,
        default: '145px'
      },
      labelPosition: {
        type: String,
        default: 'left'
      },
      isFull: Boolean
    },
    computed: {
      rowStyle () {
        let style = {}
        style = Object.assign({}, {
          width: this.isFull ? '100%' : '50%'
        })
        return style
      },
      labelStyle () {
        return {
          width: this.labelWidth,
          textAlign: this.labelPosition
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .key-label {
    display: inline-block;
    line-height: 40px;
    border-bottom: 1px solid #f0f3f5;
    .label {
      padding: 0 15px;
      background: #fafbfc;
    }
    .val {
      padding: 0 10px;
      word-wrap: break-word;
    }
  }
</style>
