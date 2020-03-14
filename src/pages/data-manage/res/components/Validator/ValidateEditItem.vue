<template>
  <!--校验配置编辑编辑组件 for ResInfoItems.vue -->
  <div style="min-height: 300px;">
    <b-alert show-icon>编辑完校验项后可点击下方操作按钮保存至主配置列表</b-alert>
    <div class="mb-15">
      <span>验证规则：</span>
      <b-select style="width:200px" v-model="ruleType" @on-change="ruleTypeChange" >
        <b-option value="global" label="全局规则"></b-option>
        <b-option value="fields" label="信息项规则"></b-option>
      </b-select>&nbsp;
      <b-select style="width:200px" v-model="validateName" @on-change="handleChange" >
        <b-option v-for="validate in validateOptions" :key="validate.name"
                  :value="validate.name" :label="validate.title"></b-option>
      </b-select>&nbsp;
    </div>
    <b-table :columns="columns" :data="argsData"  disabled-hover>
      <template v-slot:value="scope">
        <b-switch v-if="typeOfCurrent(argsData[scope.index].value)==='boolean'"
                  v-model="argsData[scope.index].value"></b-switch>
        <b-input v-else v-model="argsData[scope.index].value" ></b-input>
      </template>
    </b-table>
    <div class="p15 t-center">
      <b-button type="primary"  @click="handleSubmit">{{ drawerTitle }}</b-button>
      <b-button  @click="$emit('on-close')">返回主面板</b-button>
    </div>
  </div>
</template>

<script>
  import {
    globalValidationOptions,
    fieldsValidationOptions,
    getArgsByFuncName,
    getRuleType, getObjByRules
  } from './validate.cfg'

  export default {
    name: 'ValidateEditItem',
    props: {
      drawerTitle: String
    },
    data() {
      return {
        columns: [
          { title: '参数', key: 'title', width: 150, tooltip: true },
          { title: '值', slot: 'value', width: 250 },
          { title: '说明', key: 'desc', tooltip: true }
        ],
        ruleType: 'global',
        validateName: '',
        argsData: []
      }
    },
    computed: {
      validateOptions() {
        return this.ruleType === 'global' ? globalValidationOptions : fieldsValidationOptions
      }
    },
    methods: {
      open(item) {
        this.ruleType = 'global'
        this.validateName = ''
        this.argsData = []
        if (item) {
          this.ruleType = getRuleType(item.name)
          this.validateName = item.name
          getArgsByFuncName(item.name, item.args).then(res => {
            this.argsData = res.data
          })
        }
      },
      // 校验类型改变事件
      ruleTypeChange() {
        this.argsData = []
      },
      // 校验规则名称改变事件
      handleChange(val) {
        if (val) {
          getArgsByFuncName(val).then(res => {
            this.argsData = res.data
          })
        }
      },
      // 判断当前类型值的类型
      typeOfCurrent(current) {
        return typeof current
      },
      handleSubmit() {
        getObjByRules(this.validateName, this.argsData).then(res => {
          this.$emit('on-save', res.data)
        })
      }
    }
  }
</script>
