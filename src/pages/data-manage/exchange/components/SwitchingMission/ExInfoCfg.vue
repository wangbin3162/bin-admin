<template>
  <!--任务配置明细组件 for SwitchingMission.vue -->
  <b-collapse-wrap title="任务配置明细" collapse>
    <b-form :model="current" :rules="ruleValidate" label-position="top">
      <b-row :gutter="20">
        <b-col span="6">
          <b-form-item label="模板名称" prop="templateName">
            <b-input v-model="current.templateName" @on-change="emitValue"></b-input>
          </b-form-item>
        </b-col>
        <b-col span="6">
          <b-form-item label="标题行" prop="titleRow">
            <b-input v-model="current.titleRow" @on-change="emitValue"></b-input>
          </b-form-item>
        </b-col>
        <b-col span="6">
          <b-form-item label="起始行" prop="begRow">
            <b-input v-model="current.begRow" @on-change="emitValue"></b-input>
          </b-form-item>
        </b-col>
        <b-col span="6">
          <b-form-item label="起始列" prop="begCol">
            <b-input v-model="current.begCol" @on-change="emitValue"></b-input>
          </b-form-item>
        </b-col>
      </b-row>
      <b-form-item label="文件描述" prop="templateFile">
        <b-input v-model="current.templateFile" @on-change="emitValue"></b-input>
      </b-form-item>
    </b-form>
  </b-collapse-wrap>
</template>

<script>
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }
  export default {
    name: 'ExInfoCfg',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        current: {
          begCol: '0',
          begRow: '1',
          templateFile: '',
          templateName: '',
          titleRow: '0'
        },
        ruleValidate: {
          templateFile: [requiredRule],
          templateName: [requiredRule],
          titleRow: [requiredRule],
          begRow: [requiredRule],
          begCol: [requiredRule]
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          this.current = JSON.parse(val)
        },
        immediate: true
      }
    },
    methods: {
      // 更新model value
      emitValue() {
        const str = JSON.stringify(this.current)
        this.$emit('input', str)
        this.$emit('on-change', str)
      }
    }
  }
</script>
