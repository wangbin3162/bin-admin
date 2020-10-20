<template>
  <b-form-item label="校验">
    <div class="validate-block">
      <div class="rules-actions">
        <b-checkbox v-if="hasProperty('required')"
                    v-model="data.options.required"
                    @change="requiredChange"
                    style="width: auto;">
          必填
        </b-checkbox>
        <b-dropdown @click="setRules">
          <b-button type="text">
            静态规则
            <b-icon name="ios-arrow-down"></b-icon>
          </b-button>
          <b-dropdown-menu slot="list">
            <b-dropdown-item name="$length">长度</b-dropdown-item>
            <b-dropdown-item name="$email">邮箱</b-dropdown-item>
            <b-dropdown-item name="$phone">手机号码</b-dropdown-item>
            <b-dropdown-item name="$idCode">身份证号</b-dropdown-item>
            <b-dropdown-item name="$regexp">正则匹配</b-dropdown-item>
          </b-dropdown-menu>
        </b-dropdown>
        <b-divider type="vertical"/>
        <b-dropdown @click="setRules">
          <b-button type="text">
            动态规则
            <b-icon name="ios-arrow-down"></b-icon>
          </b-button>
          <b-dropdown-menu slot="list">
            <b-dropdown-item name="$conditionRequired">条件必填</b-dropdown-item>
            <b-dropdown-item name="$conditionNotRequired">条件必不填</b-dropdown-item>
            <b-dropdown-item name="$conditionNotBe">条件不为某值</b-dropdown-item>
            <b-dropdown-item name="$notSame">值不等于</b-dropdown-item>
            <b-dropdown-item name="$timeBound">日期区间</b-dropdown-item>
          </b-dropdown-menu>
        </b-dropdown>
        <b-divider type="vertical"/>
        <b-button type="text" @click="clearRules">清除校验</b-button>
      </div>
      <rules-label label="自定义错误提示" type="message-input" v-if="data.options.required">
        <b-input v-model.trim="data.rules[0].message" size="small" placeholder="请输入错误提示" clearable/>
      </rules-label>
    </div>
    <draggable tag="div" :list="data.rules" class="validate-block"
               v-bind="{ group:'rules', ghostClass:'ghost',handle: '.drag-item' ,animation:200}">
      <template v-for="(rule,index) in data.rules">
        <div :key="index" class="rules-item drag-li" v-if="rule.name!=='$required'">
          <div class="title-wrap">
            <div class="title-label">
              <i class="drag-item iconfont icon-ios-options"></i>
              {{ ruleNameMap[rule.name] }}
            </div>
            <b-button @click="removeRules(index)" type="text" text-color="danger">
              <b-icon name="ios-remove-circle-outline" :size="20"></b-icon>
            </b-button>
          </div>
          <div class="params">
            <div class="info" v-if="rule.name==='$length'">
              <rules-label label="最小值" type="inline">
                <b-input-number v-model="data.rules[index].min" size="small"/>
              </rules-label>
              <rules-label label="最大值" type="inline">
                <b-input-number v-model="data.rules[index].max" size="small"/>
              </rules-label>
            </div>
            <div class="info" v-if="rule.name==='$idCode'">
              <rules-label label="前置字段" type="inline">
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model="data.rules[index].preField" size="small" placeholder="前置字段"/>
              </rules-label>
              <rules-label label="忽略大小写" type="inline">
                <b-switch v-model="data.rules[index].ignoreCase" size="small"/>
              </rules-label>
            </div>
            <rules-label label="正则规则" type="message-input" v-if="rule.name==='$regexp'">
              <b-input v-model="data.rules[index].regexp" size="small" placeholder="正则规则(字符格式)"/>
            </rules-label>
            <!--条件必填/条件必不填-->
            <div class="info" v-if="rule.name==='$conditionRequired'||rule.name==='$conditionNotRequired'">
              <rules-label label="前置字段" type="inline">
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="data.rules[index].preField" size="small"/>
              </rules-label>
              <rules-label label="前置字段值" type="inline">
                <b-input v-model.trim="data.rules[index].preFieldValue" size="small"/>
              </rules-label>
            </div>
            <!--条件不为某值-->
            <div class="info" v-if="rule.name==='$conditionNotBe'">
              <rules-label label="前置字段" type="inline">
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="data.rules[index].preField" size="small"/>
              </rules-label>
              <rules-label label="前置字段值" type="inline">
                <b-input v-model.trim="data.rules[index].preFieldValue" size="small"/>
              </rules-label>
              <rules-label label="不是某值" type="inline">
                <b-input v-model.trim="data.rules[index].notValue" size="small"/>
              </rules-label>
            </div>
            <!--值不能相同-->
            <div class="info" v-if="rule.name==='$notSame'">
              <rules-label label="前置字段" type="inline">
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="data.rules[index].preField" size="small"/>
              </rules-label>
            </div>
            <!--日期区间-->
            <div class="info" v-if="rule.name==='$timeBound'">
              <rules-label label="比较模式" type="inline" tip="当前输入值在前">
                <b-select v-model="data.rules[index].compareMode" size="small" style="width: 88px;">
                  <b-option value="gt">&gt;</b-option>
                  <b-option value="ge">&ge;</b-option>
                  <b-option value="lt">&lt;</b-option>
                  <b-option value="le">&le;</b-option>
                </b-select>
              </rules-label>
              <rules-label label="比较对象" type="inline" tip="输入$now、yyyy-MM-dd或字段名">
                <div flex>
                  <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                           v-model.trim="data.rules[index].time" size="small"/>
                  <b-button size="small" @click="data.rules[index].time='$now'" style="margin-left: -1px;">此刻</b-button>
                </div>
              </rules-label>
            </div>
            <!--通用错误提示-->
            <rules-label label="自定义错误提示" type="message-input">
              <b-input v-model.trim="data.rules[index].message" size="small" placeholder="请输入错误提示" clearable/>
            </rules-label>
          </div>
        </div>
      </template>
    </draggable>
  </b-form-item>
</template>

<script>
import Draggable from 'vuedraggable'
import RulesLabel from '@/components/FormMaking/components/RulesLabel'

export default {
  name: 'RulesSetting',
  components: { RulesLabel, Draggable },
  props: ['data'],
  data() {
    return {
      ruleNameMap: {
        '$required': '必填项',
        '$length': '长度参数',
        '$email': '邮箱参数',
        '$phone': '手机号码',
        '$idCode': '身份证',
        '$regexp': '正则匹配',
        '$conditionRequired': '条件必填',
        '$conditionNotRequired': '条件必不填',
        '$conditionNotBe': '条件不为某值',
        '$notSame': '值不能相同',
        '$timeBound': '日期区间'
      }
    }
  },
  computed: {
    dataOptions() {
      return Object.keys(this.data.options)
    },
    // 默认配置模块
    normalCfg() {
      return {
        type: ['number', 'rate', 'slider'].indexOf(this.data.type) > -1 ? 'number' : 'string',
        trigger: ['input', 'textarea'].indexOf(this.data.type) > -1 ? 'blur' : 'change'
      }
    }
  },
  methods: {
    // 必填项改变事件
    requiredChange(value) {
      if (value) {
        this.data.rules.unshift({
          name: '$required',
          message: `${this.data.name}必填`,
          ...this.normalCfg
        })
      } else {
        this.data.rules.shift()
      }
    },
    // 增加校验，即增加默认参数配置
    setRules(ruleType) {
      if (this.hasSame(ruleType)) {
        this.$message({ type: 'warning', content: '已有同名规则，无需重复添加' })
        return
      }
      switch (ruleType) {
        case '$length':
          this.data.rules.push({
            name: ruleType,
            min: 0,
            max: 100,
            message: '长度必须在指定的范围内',
            ...this.normalCfg
          })
          break
        case '$email':
          this.data.rules.push({
            name: ruleType,
            message: '邮箱格式不正确',
            ...this.normalCfg
          })
          break
        case '$phone':
          this.data.rules.push({
            name: ruleType,
            message: '手机号格式不正确',
            ...this.normalCfg
          })
          break
        case '$idCode':
          this.data.rules.push({
            name: ruleType,
            preField: '',
            message: '身份证格式不正确',
            ignoreCase: true,
            ...this.normalCfg
          })
          break
        case '$regexp':
          this.data.rules.push({
            name: ruleType,
            regexp: '',
            message: '正则表达式不匹配',
            ...this.normalCfg
          })
          break
        case '$conditionRequired':
          this.data.rules.push({
            name: ruleType,
            preField: '',
            preFieldValue: '',
            message: '当前字段在前置字段条件达成下必填',
            ...this.normalCfg
          })
          break
        case '$conditionNotRequired':
          this.data.rules.push({
            name: ruleType,
            preField: '',
            preFieldValue: '',
            message: '当前字段在前置字段条件达成下不可填写',
            ...this.normalCfg
          })
          break
        case '$conditionNotBe':
          this.data.rules.push({
            name: ruleType,
            preField: '',
            preFieldValue: '',
            notValue: '',
            message: '当前字段在前置字段条件达成下不能为某值',
            ...this.normalCfg
          })
          break
        case '$notSame':
          this.data.rules.push({
            name: ruleType,
            preField: '',
            message: '不能和前置字段值相同',
            ...this.normalCfg
          })
          break
        case '$timeBound':
          this.data.rules.push({
            name: ruleType,
            time: '$now',
            compareMode: 'gt',
            message: '日期不符合区间设置',
            ...this.normalCfg
          })
          break
        default:
          break
      }
    },
    // 判断是否是5个特殊信息项，返回是否存在相同类似条件
    hasSame(name) {
      let infoItems = ['$regexp', '$conditionRequired', '$conditionNotRequired', '$conditionNotBe', '$notSame', '$timeBound']
      if (infoItems.indexOf(name) > -1) { // 特殊信息项，则可以配置多个
        return false
      } else {
        return this.data.rules.findIndex(item => item.name === name) >= 0
      }
    },
    // 清除校验
    clearRules() {
      this.data.options.required = false
      this.data.rules = []
    },
    // 移除某个类型的校验
    removeRules(index) {
      this.data.rules.splice(index, 1)
    },
    // 是否存在options属性
    hasProperty(property) {
      return this.dataOptions.indexOf(property) >= 0
    },
    // 拖拽字段名称塞入事件
    allowDrop(e) {
      e.preventDefault()
    },
    onDrop(e, index) {
      if (this.data.rules[index].hasOwnProperty('preField')) {
        this.data.rules[index].preField = e.dataTransfer.getData('index')
      }
      if (this.data.rules[index].hasOwnProperty('time')) {
        this.data.rules[index].time = e.dataTransfer.getData('index')
      }
      e.preventDefault()
    }
  }
}
</script>
