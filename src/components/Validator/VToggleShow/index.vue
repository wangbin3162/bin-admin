<template>
  <span v-if="!toggle" style="margin: 0 10px; cursor: pointer" @click="emitValue(true)">
    <b-tooltip :content="showText">
      <b-icon name="ios-eye-off" color="#666" size="20" style="vertical-align: -2px;"/>
    </b-tooltip>
  </span>
  <span v-else style="margin: 0 10px; cursor: pointer" @click="emitValue(false)">
    <b-tooltip :content="hideText">
      <b-icon name="ios-eye" color="#666" size="20" style="vertical-align: -2px;"/>
    </b-tooltip>
  </span>
</template>

<script>
  export default {
    name: 'VToggleShow',
    props: {
      value: {
        type: Boolean
      },
      showText: {
        type: String,
        default: '显示'
      },
      hideText: {
        type: String,
        default: '隐藏'
      }
    },
    data() {
      return {
        toggle: false
      }
    },
    watch: {
      value: {
        handler(val) {
          this.toggle = val
        },
        immediate: true
      }
    },
    methods: {
      // 更新model value
      emitValue(value) {
        this.toggle = value
        this.$emit('input', this.toggle)
        this.$emit('change', this.toggle)
      }
    }
  }
</script>
