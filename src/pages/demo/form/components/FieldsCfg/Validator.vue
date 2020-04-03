<template>
  <div class="validator-wrap">
    <div style="width: 100%;line-height:32px;" flex="main:justify">
      <span>校验: </span>
      <div>
        <b-popover
          confirm width="200"
          title="确定重载校验配置吗?"
          ok-text="是" cancel-text="否"
          @on-ok="refreshRule">
          <b-icon name="ios-refresh" style="vertical-align: -1px;cursor: pointer;"/>
        </b-popover>
        <v-toggle-show v-model="showReal" show-text="显示实际值" hide-text="隐藏实际值"/>
      </div>
    </div>
    <div class="mb-15">
      <b-checkbox v-model="isRequired" @on-change="requiredChange">必填项</b-checkbox>&nbsp;&nbsp;
    </div>
    <div v-show="showReal">
      <b-alert>{{value}}</b-alert>
      <!--<b-code-editor :value="JSON.stringify(rulesObj,null,2)" readonly/>-->
    </div>
  </div>
</template>

<script>
  import VToggleShow from '../../../../../components/VToggleShow/index'
  import { ruleName } from './validator'

  export default {
    name: 'Validator',
    components: { VToggleShow },
    props: {
      value: {
        type: String
      },
      fieldName: { // 字段名称，用于配置前值字段约束
        type: String
      },
      fieldTitle: { // 字段标题，用于配置必填项提示
        type: String
      },
      required: { // 配置项类型，用于判断是否是必填项
        type: String
      },
      controlType: { // 控件类型，用于判断trigger 类型，blur or change
        type: String
      },
      dataType: { // 数据类型，用于判断校验器的输入类型
        type: String
      }
    },
    data() {
      return {
        showReal: true,
        isRequired: false,
        rulesObj: null,
        checkRules: new Map() // 最终的格式化rules map 存储校验映射
      }
    },
    computed: {
      triggerType() {
        return ['TEXT', 'TEXTAREA'].indexOf(this.controlType) > -1 ? 'blur' : 'change'
      }
    },
    watch: {
      value: {
        handler(val) {
          try {
            const rules = JSON.parse(val)
            this.rulesObj = rules
            if (rules.rules) { // 旧的格式
              this.$log.warning('旧格式重置')
              this.refreshRule()
            } else {
              console.log('=======update value=======') // 调试，可禁用
              let map = []
              Object.keys(rules).forEach(key => {
                map.push([key, rules[key]])
                console.log(key, rules[key]) // 调试，可禁用
              })
              this.checkRules = new Map(map)
              console.log('=======update value end=======') // 调试，可禁用
              // 再根据是否包含必填校验判断
              this.isRequired = this.checkRules.has(ruleName.required)
            }
          } catch (e) {
            this.$log.danger('非标准json初始化')
            this.refreshRule()
          }
        },
        immediate: true
      },
      required(val) { // 根据是否是核心项来设置是否是必填
        if (val === 'Y') {
          this.isRequired = true
          this.setRules(ruleName.required)
        }
      },
      fieldTitle() {
        if (this.checkRules.has(ruleName.required)) {
          this.setRules(ruleName.required)
        }
      }
    },
    methods: {
      // add rules
      setRules(ruleType) {
        switch (ruleType) {
          case ruleName.required:
            this.checkRules.set(ruleType,
              { required: true, message: `${this.fieldTitle}必填`, trigger: this.triggerType }
            )
            break
          case ruleName.length:
            this.checkRules.set(ruleType,
              { max: 10, message: '长度范围不合法', trigger: this.triggerType }
            )
            break
          default:
            break
        }
        this.emitValue()
      },
      removeRules(ruleType) {
        if (this.checkRules.has(ruleType)) {
          this.checkRules.delete(ruleType)
        }
        this.emitValue()
      },
      // 必填项改变操作
      requiredChange(val) {
        if (val) {
          console.log('set required')
          this.setRules(ruleName.required)
        } else {
          console.log('remove required')
          this.removeRules(ruleName.required)
        }
      },
      // 刷新重载rules
      refreshRule() {
        this.checkRules.clear()
        if (this.required) {
          this.setRules(ruleName.required)
        } else {
          this.emitEmptyValue()
        }
      },
      // 更新model value
      emitValue() {
        this.rulesObj = this.formatRules(this.checkRules)
        const rules = JSON.stringify(this.rulesObj)
        this.$emit('input', rules)
        this.$emit('on-change', rules)
      },
      emitEmptyValue() {
        const empty = JSON.stringify({})
        this.$emit('input', empty)
        this.$emit('on-change', empty)
      },
      // checkRulesToObj
      formatRules(mapObj) {
        let obj = {}
        for (let [k, v] of mapObj) {
          obj[k] = v
        }
        return obj
      }
    }
  }
</script>

<style scoped lang="stylus">
  .validator-wrap {
    width: 100%;
    margin-bottom: 16px;
  }
</style>
