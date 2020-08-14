<template>
  <b-select :value="current.value" @on-change="handleChange" size="small">
    <b-option v-for="item in options" :key="item.id"
              :value="item.fieldName" :label="item.fieldTitle">
      <span>{{ item.fieldTitle }}</span>
      <span style="float:right;color:#ccc">{{ item.fieldName }}</span>
    </b-option>
  </b-select>
</template>

<script>
import { deepCopy, isNotEmpty } from '@/common/utils/assist'
import { getFields } from '@/api/data-manage/res-info.api'

export default {
  name: 'ItemCtrl',
  inject: ['ConfigRoot'],
  props: {
    value: {
      type: Object,
      default() {
        return {
          fieldName: '',
          value: '',
          type: 'val'
        }
      }
    },
    paramType: {
      type: String,
      default: 'string'
    }
  },
  data() {
    return {
      current: {},
      options: []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.current = val ? deepCopy(val) : {
          fieldName: '',
          value: '',
          type: 'val'
        }
      },
      immediate: true
    }
  },
  methods: {
    handleChange(val) {
      this.current.fieldName = this.current.value = val
      this.emitValue()
    },
    emitValue() {
      this.$emit('input', this.current)
      this.$emit('on-change', this.current)
    }
  },
  created() {
    if (isNotEmpty(this.ConfigRoot.resource.resourceKey)) {
      getFields(this.ConfigRoot.resource.resourceKey).then(resp => {
        let options = resp.data || []
        this.options = options
          .filter(i => i.dataType === this.paramType && i.fieldName.indexOf('person_id') === -1)
          .map(i => ({ id: i.id, fieldTitle: i.fieldTitle, fieldName: i.fieldName }))
      })
    }
  }
}
</script>
