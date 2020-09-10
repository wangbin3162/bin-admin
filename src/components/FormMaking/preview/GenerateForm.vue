<template>
  <div class="fm-style">
    <b-form ref="generateForm"
            :model="models" :rules="rules"
            :label-position="data.config.labelPosition"
            :label-width="data.config.labelWidth"
            :class="'form-'+data.config.size">

    </b-form>
  </div>
</template>

<script>
export default {
  name: 'GenerateForm',
  props: ['data', 'remote', 'value'],
  data() {
    return {
      models: {
        id: ''
      },
      rules: {}
    }
  },
  methods: {
    generateModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModel(item.list)
          })
        }
        if (['grid', 'divider'].indexOf(genList[i].type) < 0) {
          let value = ['number', 'rate', 'slider'].indexOf(genList[i].type) > -1 ? null : ''
          // 1、先根据filedName扩展form对象
          this.$set(this.models, genList[i].fieldName.toLowerCase(), value)
        }
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error('校验失败'))
          }
        })
      })
    },
    reset() {
      this.$refs.generateForm.resetFields()
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.generateModel(val.list)
        console.log(this.models)
        console.log(this.rules)
      },
      immediate: true
    }
  }
}
</script>
