<template>
  <b-checkbox v-model="checked" @on-change="handleChange">
    {{ item.measureName }}
  </b-checkbox>
</template>

<script>
  export default {
    name: 'MeasureCheckbox',
    props: {
      value: {
        type: String
      },
      item: {
        type: Object
      }
    },
    data() {
      return {
        checked: false
      }
    },
    watch: {
      value: {
        handler(val) {
          this.checked = val === '1'
        },
        immediate: true
      }
    },
    methods: {
      handleChange(val) {
        let str = val ? '1' : '0'
        this.$emit('input', str)
        this.$emit('on-change', str, this.item)
      }
    }
  }
</script>
