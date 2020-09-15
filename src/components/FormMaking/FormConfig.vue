<template>
  <div v-if="show" class="form-config-container">
    <b-form :model="data" size="small" :label-width="80" :rules="rules" label-position="left"
            ref="formConfig">
      <cfg-group group-name="单据属性">
        <div class="form-config-item">
          <b-form-item label="单据名称" prop="formName">
            <b-input v-model="data.formName" size="small" clearable/>
          </b-form-item>
          <b-form-item label="单据编码" prop="formCode">
            <b-input v-model="data.formCode" size="small" clearable/>
          </b-form-item>
          <b-form-item label="单据类型" prop="formType">
            <b-radio-group v-model="data.formType" type="button" size="small">
              <b-radio label="base">基础单据</b-radio>
              <b-radio label="data">数据单据</b-radio>
            </b-radio-group>
          </b-form-item>
          <b-form-item label="单据表名" prop="formTable">
            <b-input v-model="data.formTable" size="small" clearable/>
          </b-form-item>
          <b-form-item label="单据描述" prop="formDesc">
            <b-input v-model="data.formDesc" size="small" clearable/>
          </b-form-item>
        </div>
      </cfg-group>
      <cfg-group group-name="表单样式">
        <div class="form-config-item">
          <b-form-item label="标签对齐">
            <b-radio-group v-model="data.labelPosition" size="small" type="button">
              <b-radio label="left">左对齐</b-radio>
              <b-radio label="right">右对齐</b-radio>
              <b-radio label="top">顶部对齐</b-radio>
            </b-radio-group>
          </b-form-item>
          <b-form-item label="标签宽度">
            <b-input-number v-model="data.labelWidth" :min="60" :max="200" :step="5" size="small"></b-input-number>
          </b-form-item>
          <b-form-item label="组件尺寸">
            <b-radio-group v-model="data.size" size="small" type="button">
              <b-radio label="large">大号</b-radio>
              <b-radio label="default">默认</b-radio>
              <b-radio label="small">小号</b-radio>
            </b-radio-group>
          </b-form-item>
        </div>
      </cfg-group>
    </b-form>
  </div>
</template>

<script>
import CfgGroup from './components/CfgGroup'

export default {
  name: 'FormConfig',
  components: { CfgGroup },
  props: ['data'],
  data() {
    return {
      rules: {
        formName: [{ required: true, message: '单据名称必填', trigger: 'blur' }],
        formCode: [{ required: true, message: '单据编码必填', trigger: 'blur' }],
        formType: [{ required: true, message: '单据类型必选', trigger: 'change' }],
        formTable: [{ required: true, message: '单据表名必填', trigger: 'blur' }],
        formDesc: [{ required: true, message: '单据描述必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    validatorForm() {
      return new Promise((resolve, reject) => {
        this.$refs.formConfig.validate(valid => {
          if (valid) {
            resolve(true)
          } else {
            reject(new Error('校验失败'))
          }
        })
      })
    }
  },
  computed: {
    show() {
      return !!(this.data && Object.keys(this.data).length > 0)
    }
  }
}
</script>
