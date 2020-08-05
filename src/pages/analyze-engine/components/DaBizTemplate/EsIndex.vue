<template>
  <b-checkbox-group v-model="list" @on-change="handleChange">
    <b-checkbox v-for="(val,key) in indexMap" :key="key"
                :label="key">{{ val }}
    </b-checkbox>
  </b-checkbox-group>
</template>

<script>
  import { getEsIndex } from '../../../../api/analyze-engine/da-business-temp.api'

  export default {
    name: 'EsIndex',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        list: [],
        indexMap: {}
      }
    },
    created() {
      // 获取索引映射
      getEsIndex().then(resp => {
        if (resp.data.code === '0') {
          this.indexMap = resp.data.data
        }
      })
    },
    watch: {
      value: {
        handler(val) {
          if (val === '') {
            this.list = []
          } else {
            this.list = val.split(',')
          }
        },
        immediate: true
      }
    },
    methods: {
      handleChange(checked) {
        this.$emit('input', checked.join(','))
      }
    }
  }
</script>
