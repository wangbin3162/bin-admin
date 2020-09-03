<template>
  <div class="widget-form-container">
    <b-empty class="form-empty" v-if="data.list.length === 0">从左侧拖拽来添加字段</b-empty>
    <b-form ref="form" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth">
      <div class="widget-form-list"></div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'WidgetForm',
  props: ['data', 'select'],
  data() {
    return {
      selectWidget: this.select
    }
  },
  mounted() {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>
