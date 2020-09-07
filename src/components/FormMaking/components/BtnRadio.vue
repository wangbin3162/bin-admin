<template>
  <b-button-group>
    <b-button v-for="item in options" :key="item.value"
              :type="value === item.value ? active:'default'"
              :size="size"
              :disabled="disabled"
              @click="change(item.value)"
    >
      {{ item.label }}
    </b-button>
  </b-button-group>
</template>

<script>
import { oneOf } from 'bin-ui/src/utils/util'

export default {
  name: 'BtnRadio',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default: 'default'
    },
    active: {
      validator(value) {
        return oneOf(value, ['primary', 'success', 'info', 'warning', 'danger'])
      },
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default() {
        return [
          { value: 'Option 1', label: '选项一' },
          { value: 'Option 2', label: '选项二' },
          { value: 'Option 3', label: '选项三' }
        ]
      }
    }
  },
  methods: {
    change(val) {
      this.$emit('input', val)
    }
  }
}
</script>
