<template>
  <div class="validator-wrap">
    <div class="mb-10">
      <b-row :gutter="15">
        <b-col span="12" v-if="$slots.default">
          <slot></slot>
        </b-col>
        <b-col :span="$slots.default?12:24">
          <div style="width: 100%;line-height:32px;" flex="main:justify">
            <span>校验: </span>
            <div>
              <b-tooltip content="初始化校验"
                         style="margin: 0 10px;">
                <b-button type="text" icon="ios-refresh" text-color="#666"
                          :icon-style="{fontSize:'20px'}"
                          @click="refreshRule"/>
              </b-tooltip>
              <b-tooltip content="恢复修改前校验">
                <b-button type="text" icon="ios-git-pull-request" text-color="#666"
                          :icon-style="{fontSize:'20px'}"
                          @click="reload"/>
              </b-tooltip>
              <v-toggle-show v-model="showReal" show-text="显示调试" hide-text="隐藏调试"/>
            </div>
          </div>
          <div style="width: 100%;line-height:32px;">
            <b-checkbox v-model="isRequired" @on-change="requiredChange" :disabled="required==='Y'">必填项</b-checkbox>
            <b-divider type="vertical"/>
            <b-dropdown @on-click="setRules">
              <b-button type="text">
                静态规则
                <b-icon name="ios-arrow-down"></b-icon>
              </b-button>
              <b-dropdown-menu slot="list">
                <b-dropdown-item :name="RULE.length">长度</b-dropdown-item>
                <b-dropdown-item :name="RULE.email">邮箱</b-dropdown-item>
                <b-dropdown-item :name="RULE.phone">手机号码</b-dropdown-item>
                <b-dropdown-item :name="RULE.regexp">正则匹配</b-dropdown-item>
                <b-dropdown-item :name="RULE.idCode">身份证号</b-dropdown-item>
                <b-dropdown-item :name="RULE.unifiedCode">统一社会信用代码</b-dropdown-item>
                <b-dropdown-item :name="RULE.orgInstCode">组织机构代码</b-dropdown-item>
                <b-dropdown-item :name="RULE.regNo">工商注册号</b-dropdown-item>
              </b-dropdown-menu>
            </b-dropdown>
            <b-divider type="vertical"/>
            <b-dropdown @on-click="setRules">
              <b-button type="text">
                动态规则
                <b-icon name="ios-arrow-down"></b-icon>
              </b-button>
              <b-dropdown-menu slot="list">
                <b-dropdown-item :name="RULE.conditionRequired">条件必填</b-dropdown-item>
                <b-dropdown-item :name="RULE.conditionNotRequired">条件必不填</b-dropdown-item>
                <b-dropdown-item :name="RULE.conditionNotBe">条件不为某值</b-dropdown-item>
                <b-dropdown-item :name="RULE.notSame">值不等于</b-dropdown-item>
                <b-dropdown-item :name="RULE.timeBound">日期区间</b-dropdown-item>
              </b-dropdown-menu>
            </b-dropdown>
          </div>
        </b-col>
      </b-row>
    </div>
    <!--校验模块内容-->
    <draggable v-model="checkRulesArr"
               v-bind="{ group:'rules', animation: 200, ghostClass:'ghost', handle:'.rules-drag' }"
               @end="onDragEnd">
      <transition-group name="fade" tag="div" class="rules-list">
        <div v-for="(rule,index) in checkRulesArr" :key="index">
          <div class="params">
            <div class="title">
              <span class="param-tip">规则名：</span>
              <b-tag :type="ruleStyle(rule.name)" no-border class="rules-drag"
                     :tag-style="{padding:'3px',margin:'0',width:'100%'}">
                {{ ruleNameMap[rule.name] }}
              </b-tag>
            </div>
            <!--必填项参数-->
            <template v-if="rule.name===RULE.required">
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--长度参数-->
            <template v-if="rule.name===RULE.length">
              <div class="number">
                <span class="param-tip">最小值：</span>
                <b-input-number v-model="checkRulesArr[index].min" size="small" @on-change="emitValue"/>
              </div>
              <div class="number">
                <span class="param-tip">最大值：</span>
                <b-input-number v-model="checkRulesArr[index].max" size="small" @on-change="emitValue"/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--邮箱参数-->
            <template v-if="rule.name===RULE.email">
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--手机号码-->
            <template v-if="rule.name===RULE.phone">
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--正则匹配-->
            <template v-if="rule.name===RULE.regexp">
              <div class="info">
                <b-row :gutter="10">
                  <b-col span="12">
                    <span class="param-tip">正则规则：</span>
                    <b-input v-model.trim="checkRulesArr[index].regexp" size="small" placeholder="需输入字符格式"
                             @on-change="emitValue" clearable/>
                  </b-col>
                  <b-col span="12">
                    <span class="param-tip">错误提示：</span>
                    <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
                  </b-col>
                </b-row>
              </div>
            </template>
            <!--身份证-->
            <template v-if="rule.name===RULE.idCode">
              <div class="number">
                <b-tooltip content="为空时独立校验">
                  <span class="param-tip">前置字段：</span>
                </b-tooltip>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="checkRulesArr[index].preField" size="small" @on-change="emitValue"/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="number" style="padding-left: 10px;">
                <span class="param-tip">忽略大小写：</span>
                <b-switch v-model="checkRulesArr[index].ignoreCase" size="small" @on-change="emitValue"/>
              </div>
            </template>
            <!--统一社会信用代码-->
            <template v-if="rule.name===RULE.unifiedCode">
              <div class="number">
                <b-tooltip content="为空时独立校验">
                  <span class="param-tip">前置字段：</span>
                </b-tooltip>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="checkRulesArr[index].preField" size="small" @on-change="emitValue"/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="number" style="padding-left: 10px;">
                <span class="param-tip">忽略大小写：</span>
                <b-switch v-model="checkRulesArr[index].ignoreCase" size="small" @on-change="emitValue"/>
              </div>
            </template>
            <!--组织机构代码-->
            <template v-if="rule.name===RULE.orgInstCode">
              <div class="number">
                <b-tooltip content="为空时独立校验">
                  <span class="param-tip">前置字段：</span>
                </b-tooltip>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="checkRulesArr[index].preField" size="small" @on-change="emitValue"/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="number" style="padding-left: 10px;">
                <span class="param-tip">忽略大小写：</span>
                <b-switch v-model="checkRulesArr[index].ignoreCase" size="small" @on-change="emitValue"/>
              </div>
            </template>
            <!--工商注册号-->
            <template v-if="rule.name===RULE.regNo">
              <div class="number">
                <b-tooltip content="为空时独立校验">
                  <span class="param-tip">前置字段：</span>
                </b-tooltip>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model="checkRulesArr[index].preField" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="number" style="padding-left: 10px;">
                <span class="param-tip">忽略大小写：</span>
                <b-switch v-model="checkRulesArr[index].ignoreCase" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--条件必填-->
            <template v-if="rule.name===RULE.conditionRequired">
              <div class="number">
                <span class="param-tip">前置字段：</span>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="checkRulesArr[index].preField" size="small"
                         @on-change="emitValue" clearable/>
              </div>
              <div class="number">
                <span class="param-tip">前置字段值：</span>
                <b-input v-model.trim="checkRulesArr[index].preFieldValue" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--条件必不填-->
            <template v-if="rule.name===RULE.conditionNotRequired">
              <div class="number">
                <span class="param-tip">前置字段：</span>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="checkRulesArr[index].preField" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="number">
                <span class="param-tip">前置字段值：</span>
                <b-input v-model.trim="checkRulesArr[index].preFieldValue" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--条件不为某值-->
            <template v-if="rule.name===RULE.conditionNotBe">
              <div class="number">
                <span class="param-tip">前置字段：</span>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="checkRulesArr[index].preField" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="number">
                <span class="param-tip">前置字段值：</span>
                <b-input v-model.trim="checkRulesArr[index].preFieldValue" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="number">
                <span class="param-tip">不是某值：</span>
                <b-input v-model.trim="checkRulesArr[index].notValue" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--值不能相同-->
            <template v-if="rule.name===RULE.notSame">
              <div class="number">
                <span class="param-tip">前置字段：</span>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="checkRulesArr[index].preField" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <!--日期区间-->
            <template v-if="rule.name===RULE.timeBound">
              <div class="number">
                <span class="param-tip">比较模式：</span>
                <b-select v-model="checkRulesArr[index].compareMode" size="small" @on-change="emitValue">
                  <b-option value="gt">&gt;</b-option>
                  <b-option value="ge">&ge;</b-option>
                  <b-option value="lt">&lt;</b-option>
                  <b-option value="le">&le;</b-option>
                </b-select>
              </div>
              <div class="number">
                <b-tooltip content="$now/yyyy-MM-dd/preField">
                  <span class="param-tip">比较值/字段：</span>
                </b-tooltip>
                <b-input @drop.native="onDrop($event,index)" @dragover.native="allowDrop($event)"
                         v-model.trim="checkRulesArr[index].time" size="small" @on-change="emitValue" clearable/>
              </div>
              <div class="info">
                <span class="param-tip">错误提示：</span>
                <b-input v-model.trim="checkRulesArr[index].message" size="small" @on-change="emitValue" clearable/>
              </div>
            </template>
            <div class="delete">
              <b-button type="text" text-color="#f5222d" @click="removeRules(index)"
                        :disabled="required==='Y'&&rule.name===RULE.required">
                <b-icon name="ios-remove-circle-outline" size="22"/>
              </b-button>
            </div>
          </div>
        </div>
      </transition-group>
    </draggable>
    <div v-if="showReal">
      <b-tag type="success" size="small">实际存储对象</b-tag>
      <b-ace-editor :value="JSON.stringify(checkRulesArr,null,2)" readonly height="240"/>
    </div>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import VToggleShow from '../VToggleShow/index'
  import { RULE, ruleNameMap } from './cfg-util'
  import { typeOf } from '../../../common/utils/assist'

  export default {
    name: 'Validator',
    components: { VToggleShow, Draggable },
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
      },
      originalRules: { // 存储原始配置校验参数
        type: Object
      },
      dataLength: Number
    },
    data() {
      return {
        showReal: false,
        isRequired: false,
        rulesObj: null,
        checkRulesArr: [] // 校验二维数组，用于push校验数据
      }
    },
    computed: {
      RULE() {
        return RULE
      },
      ruleNameMap() {
        return ruleNameMap
      },
      triggerType() {
        return ['TEXT', 'TEXTAREA'].indexOf(this.controlType) > -1 ? 'blur' : 'change'
      },
      // 默认配置模块
      normalCfg() {
        return {
          type: this.dataType === 'number' ? 'number' : 'string',
          trigger: this.triggerType
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          try {
            const rules = JSON.parse(val)
            // this.rulesObj = rules
            if (rules.rules) { // 旧的格式
              this.$log.warning('旧格式重置')
              this.refreshRule()
            } else {
              if (typeOf(rules) === 'array') {
                this.checkRulesArr = rules
                // console.log('=======update value=======') // 调试，可禁用
                // console.log(this.checkRulesArr)
                // console.log('=======update value end=======') // 调试，可禁用
              } else {
                this.refreshRule()
              }
              // 再根据是否包含必填校验判断
              this.isRequired = this.hasRequired()
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
          this.setRules(RULE.required)
        }
      }
    },
    methods: {
      // 增加校验，即增加默认参数配置
      setRules(ruleType) {
        if (ruleType === RULE.required && this.hasRequired()) {
          return
        }
        if (this.hasSame(ruleType)) {
          this.$message({ type: 'warning', content: '已有同名规则，无需重复添加' })
          return
        }
        switch (ruleType) {
          case RULE.required:
            this.checkRulesArr.unshift({
              name: ruleType,
              message: `${this.fieldTitle}必填`,
              ...this.normalCfg
            })
            break
          case RULE.length:
            this.checkRulesArr.push({
              name: ruleType,
              min: Infinity,
              max: Infinity,
              message: '长度必须在指定的范围内',
              ...this.normalCfg
            })
            break
          case RULE.email:
            this.checkRulesArr.push({
              name: ruleType,
              message: '邮箱格式不正确',
              ...this.normalCfg
            })
            break
          case RULE.phone:
            this.checkRulesArr.push({
              name: ruleType,
              message: '手机号格式不正确',
              ...this.normalCfg
            })
            break
          case RULE.regexp:
            this.checkRulesArr.push({
              name: ruleType,
              regexp: '',
              message: '正则表达式不匹配',
              ...this.normalCfg
            })
            break
          case RULE.idCode:
            this.checkRulesArr.push({
              name: ruleType,
              preField: 'id_type',
              message: '身份证格式不正确',
              ignoreCase: true,
              ...this.normalCfg
            })
            break
          case RULE.unifiedCode:
            this.checkRulesArr.push({
              name: ruleType,
              preField: 'id_type',
              message: '统一社会信用代码格式不正确',
              ignoreCase: true,
              ...this.normalCfg
            })
            break
          case RULE.orgInstCode:
            this.checkRulesArr.push({
              name: ruleType,
              preField: 'id_type',
              message: '组织机构代码格式不正确',
              ignoreCase: true,
              ...this.normalCfg
            })
            break
          case RULE.regNo:
            this.checkRulesArr.push({
              name: ruleType,
              preField: 'id_type',
              message: '工商注册号格式不正确',
              ignoreCase: true,
              ...this.normalCfg
            })
            break
          case RULE.conditionRequired:
            this.checkRulesArr.push({
              name: ruleType,
              preField: '',
              preFieldValue: '',
              message: '当前字段在前置字段条件达成下必填',
              ...this.normalCfg
            })
            break
          case RULE.conditionNotRequired:
            this.checkRulesArr.push({
              name: ruleType,
              preField: '',
              preFieldValue: '',
              message: '当前字段在前置字段条件达成下不可填写',
              ...this.normalCfg
            })
            break
          case RULE.conditionNotBe:
            this.checkRulesArr.push({
              name: ruleType,
              preField: '',
              preFieldValue: '',
              notValue: '',
              message: '当前字段在前置字段条件达成下不能为某值',
              ...this.normalCfg
            })
            break
          case RULE.notSame:
            this.checkRulesArr.push({
              name: ruleType,
              preField: '',
              message: '不能和前置字段值相同',
              ...this.normalCfg
            })
            break
          case RULE.timeBound:
            this.checkRulesArr.push({
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
        this.emitValue()
      },
      // 移除某个类型的校验
      removeRules(index) {
        this.checkRulesArr.splice(index, 1)
        this.emitValue()
      },
      // 必填项改变操作
      requiredChange(val) {
        if (val) {
          // console.log('set required')
          this.setRules(RULE.required)
        } else {
          this.checkRulesArr = this.checkRulesArr.filter(item => item.name !== RULE.required)
          this.emitValue()
        }
      },
      // 重载校验信息
      reload() {
        if (this.originalRules) {
          this.$emit('input', this.originalRules[this.fieldName])
          this.$emit('on-change', this.originalRules[this.fieldName])
        }
      },
      // 刷新重载rules
      refreshRule() {
        this.checkRulesArr = []
        if (this.required === 'Y') {
          this.setRules(RULE.required)
          this.addLengthRule()
        } else {
          this.addLengthRule()
          this.emitEmptyValue()
        }
      },
      // 根据数据类型自动添加长度校验
      addLengthRule() {
        if (this.dataType === 'string') {
          this.checkRulesArr.push({
            name: RULE.length,
            min: null,
            max: this.dataLength,
            message: '长度必须在指定的范围内',
            ...this.normalCfg
          })
        }
      },
      // 更新model value
      emitValue() {
        const rules = JSON.stringify(this.checkRulesArr)
        this.$emit('input', rules)
        this.$emit('on-change', rules)
      },
      // 更新空值
      emitEmptyValue() {
        const empty = JSON.stringify([])
        this.$emit('input', empty)
        this.$emit('on-change', empty)
      },
      // 枚举拖拽结束
      onDragEnd(event) {
        let { oldIndex, newIndex } = event
        if (oldIndex !== newIndex) {
          this.emitValue()
        }
      },
      // ======checkRulesArr 数组判断函数========== //
      hasRequired() {
        let same = this.hasSameNameItem(RULE.required)
        return !!same
      },
      // 是否有相同名称的校验项存在
      hasSameNameItem(name) {
        return this.checkRulesArr.find(item => item.name === name)
      },
      // 判断是否是5个特殊信息项，返回是否存在相同类似条件
      hasSame(name) {
        let infoItems = [RULE.regexp, RULE.conditionRequired, RULE.conditionNotRequired, RULE.conditionNotBe, RULE.notSame, RULE.timeBound]
        if (infoItems.indexOf(name) > -1) { // 特殊信息项，则可以配置多个
          return false
        } else {
          return !!this.hasSameNameItem(name)
        }
      },
      ruleStyle(name) {
        return ['$conditionRequired', '$conditionNotRequired', '$conditionNotBe', '$notSame', '$timeBound'].indexOf(name) > -1 ? 'success' : 'primary'
      },
      allowDrop(e) {
        e.preventDefault()
      },
      onDrop(e, index) {
        if (this.checkRulesArr[index].hasOwnProperty('preField')) {
          this.checkRulesArr[index].preField = e.dataTransfer.getData('index')
        }
        if (this.checkRulesArr[index].hasOwnProperty('time')) {
          this.checkRulesArr[index].time = e.dataTransfer.getData('index')
        }
        this.emitValue()
        e.preventDefault()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .validator-wrap {
    width: 100%;
    margin-bottom: 16px;
    .params {
      display: flex;
      border-radius: 2px;
      border: 1px dashed #eee;
      margin-bottom: 8px;
      padding: 4px 0;
      .title {
        flex: 0 0 110px;
        width: 110px;
        padding: 0 4px;
      }
      .number {
        flex: 0 0 100px;
        width: 100px;
        padding-right: 5px;
      }
      .info {
        flex: auto;
      }
      .trigger {
        flex: 0 0 85px;
        width: 85px;
        padding-left: 5px;
      }
      .delete {
        flex: 0 0 30px;
        width: 30px;
        padding-top: 22px;
        text-align: center;
      }
    }
    .param-tip {
      display: inline-block;
      width: 100%;
      color: rgba(0, 0, 0, 0.65);
    }
    .rules-list {
      .rules-drag {
        cursor: move;
      }
      .ghost {
        position: relative;
        font-size: 0;
        border: 1px dashed #1089ff;
        height: 58px;
        margin-bottom: 8px;
        &::after {
          position: absolute;
          content: '';
          background: #fff;
          display: block;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
</style>
