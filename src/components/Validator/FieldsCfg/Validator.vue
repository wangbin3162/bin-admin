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
    <div class="mb-10">
      <b-checkbox v-model="isRequired" @on-change="requiredChange">必填项</b-checkbox>
      <b-divider type="vertical"/>
      <b-dropdown @on-click="setRules">
        <b-button type="text">
          一般规则
          <b-icon name="ios-arrow-down"></b-icon>
        </b-button>
        <b-dropdown-menu slot="list">
          <b-dropdown-item :name="RULE.length">长度</b-dropdown-item>
          <b-dropdown-item :name="RULE.email">邮箱</b-dropdown-item>
          <b-dropdown-item :name="RULE.phone">手机号码</b-dropdown-item>
          <b-dropdown-item :name="RULE.idCode">身份证号</b-dropdown-item>
          <b-dropdown-item :name="RULE.regexp">正则匹配</b-dropdown-item>
        </b-dropdown-menu>
      </b-dropdown>
      <b-divider type="vertical"/>
      <b-dropdown @on-click="setRules">
        <b-button type="text" text-color="warning">
          信息项规则
          <b-icon name="ios-arrow-down"></b-icon>
        </b-button>
        <b-dropdown-menu slot="list">
          <b-dropdown-item :name="RULE.unifiedCode">统一社会信用代码</b-dropdown-item>
          <b-dropdown-item :name="RULE.orgInstCode">组织机构代码</b-dropdown-item>
          <b-dropdown-item :name="RULE.regNo">工商注册号</b-dropdown-item>
          <b-dropdown-item :name="RULE.conditionRequired">条件必填</b-dropdown-item>
          <b-dropdown-item :name="RULE.conditionNotRequired">条件必不填</b-dropdown-item>
          <b-dropdown-item :name="RULE.conditionNotBe">条件不为某值</b-dropdown-item>
          <b-dropdown-item :name="RULE.notSame">值不等于</b-dropdown-item>
        </b-dropdown-menu>
      </b-dropdown>
    </div>
    <!--必填项参数-->
    <div class="params" v-if="rulesObj[RULE.required]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="primary" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">必填项</b-tag>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.required].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <!--      <div class="trigger">-->
      <!--        <span class="param-tip">触发事件：</span>-->
      <!--        <b-input v-model.trim="rulesObj[RULE.required].trigger" size="mini"-->
      <!--                 @on-change="emitParamsToValue"/>-->
      <!--      </div>-->
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.required)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--长度参数-->
    <div class="params" v-if="rulesObj[RULE.length]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="primary" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">长度参数</b-tag>
      </div>
      <div class="number">
        <span class="param-tip">最小值：</span>
        <b-input-number v-model="rulesObj[RULE.length].min" size="mini"
                        @on-change="emitParamsToValue"/>
      </div>
      <div class="number">
        <span class="param-tip">最大值：</span>
        <b-input-number v-model="rulesObj[RULE.length].max" size="mini"
                        @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.length].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.length)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--邮箱参数-->
    <div class="params" v-if="rulesObj[RULE.email]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="primary" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">邮箱参数</b-tag>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.email].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.email)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--手机号码-->
    <div class="params" v-if="rulesObj[RULE.phone]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="primary" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">手机号码</b-tag>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.phone].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.phone)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--身份证-->
    <div class="params" v-if="rulesObj[RULE.idCode]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="primary" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">身份证</b-tag>
      </div>
      <div class="number">
        <b-tooltip content="为空时独立校验">
          <span class="param-tip">前置字段：</span>
        </b-tooltip>
        <b-input v-model="rulesObj[RULE.idCode].preField" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.idCode].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="number" style="padding-left: 10px;">
        <span class="param-tip">忽略大小写：</span>
        <b-switch v-model="rulesObj[RULE.idCode].ignoreCase" size="small"
                  @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.idCode)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--正则匹配-->
    <div class="params" v-if="rulesObj[RULE.regexp]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="primary" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">正则匹配</b-tag>
      </div>
      <div class="info">
        <b-row :gutter="10">
          <b-col span="12">
            <span class="param-tip">正则规则：</span>
            <b-input v-model.trim="rulesObj[RULE.regexp].regexp" size="mini"
                     placeholder="需输入字符格式"
                     @on-change="emitParamsToValue"/>
          </b-col>
          <b-col span="12">
            <span class="param-tip">错误提示：</span>
            <b-input v-model.trim="rulesObj[RULE.regexp].message" size="mini"
                     @on-change="emitParamsToValue"/>
          </b-col>
        </b-row>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.regexp)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--统一社会信用代码-->
    <div class="params" v-if="rulesObj[RULE.unifiedCode]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="warning" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">社会信用代码</b-tag>
      </div>
      <div class="number">
        <b-tooltip content="为空时独立校验">
          <span class="param-tip">前置字段：</span>
        </b-tooltip>
        <b-input v-model="rulesObj[RULE.unifiedCode].preField" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.unifiedCode].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="number" style="padding-left: 10px;">
        <span class="param-tip">忽略大小写：</span>
        <b-switch v-model="rulesObj[RULE.unifiedCode].ignoreCase" size="small"
                  @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.unifiedCode)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--组织机构代码-->
    <div class="params" v-if="rulesObj[RULE.orgInstCode]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="warning" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">组织机构代码</b-tag>
      </div>
      <div class="number">
        <b-tooltip content="为空时独立校验">
          <span class="param-tip">前置字段：</span>
        </b-tooltip>
        <b-input v-model="rulesObj[RULE.orgInstCode].preField" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.orgInstCode].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="number" style="padding-left: 10px;">
        <span class="param-tip">忽略大小写：</span>
        <b-switch v-model="rulesObj[RULE.orgInstCode].ignoreCase" size="small"
                  @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.orgInstCode)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--工商注册号-->
    <div class="params" v-if="rulesObj[RULE.regNo]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="warning" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">工商注册号</b-tag>
      </div>
      <div class="number">
        <b-tooltip content="为空时独立校验">
          <span class="param-tip">前置字段：</span>
        </b-tooltip>
        <b-input v-model="rulesObj[RULE.regNo].preField" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.regNo].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="number" style="padding-left: 10px;">
        <span class="param-tip">忽略大小写：</span>
        <b-switch v-model="rulesObj[RULE.regNo].ignoreCase" size="small"
                  @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.regNo)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--条件必填-->
    <div class="params" v-if="rulesObj[RULE.conditionRequired]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="warning" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">条件必填</b-tag>
      </div>
      <div class="number">
        <span class="param-tip">前置字段：</span>
        <b-input v-model="rulesObj[RULE.conditionRequired].preField" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="number">
        <span class="param-tip">前置字段值：</span>
        <b-input v-model="rulesObj[RULE.conditionRequired].preFieldValue" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.conditionRequired].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.conditionRequired)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--条件必不填-->
    <div class="params" v-if="rulesObj[RULE.conditionNotRequired]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="warning" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">条件必不填</b-tag>
      </div>
      <div class="number">
        <span class="param-tip">前置字段：</span>
        <b-input v-model="rulesObj[RULE.conditionNotRequired].preField" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="number">
        <span class="param-tip">前置字段值：</span>
        <b-input v-model="rulesObj[RULE.conditionNotRequired].preFieldValue" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.conditionNotRequired].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.conditionNotRequired)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--条件不为某值-->
    <div class="params" v-if="rulesObj[RULE.conditionNotBe]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="warning" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">条件不为某值</b-tag>
      </div>
      <div class="number">
        <span class="param-tip">前置字段：</span>
        <b-input v-model="rulesObj[RULE.conditionNotBe].preField" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="number">
        <span class="param-tip">前置字段值：</span>
        <b-input v-model="rulesObj[RULE.conditionNotBe].preFieldValue" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="number">
        <span class="param-tip">不是某值：</span>
        <b-input v-model="rulesObj[RULE.conditionNotBe].notValue" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.conditionNotBe].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.conditionNotBe)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <!--值不能相同-->
    <div class="params" v-if="rulesObj[RULE.notSame]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="warning" no-border :tag-style="{padding:'3px',margin:'0',width:'100%'}">值不能相同</b-tag>
      </div>
      <div class="number">
        <span class="param-tip">前置字段：</span>
        <b-input v-model.trim="rulesObj[RULE.notSame].preField" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.notSame].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 18px;"
                   @on-ok="removeRules(RULE.notSame)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <div v-show="showReal">
      <b-tag type="success" size="small">实际存储对象</b-tag>
      <b-code-editor :value="JSON.stringify(rulesObj,null,2)" readonly/>
    </div>
  </div>
</template>

<script>
  import VToggleShow from '../VToggleShow/index'
  import { RULE } from './cfg-util'

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
        checkRulesArr: [], // 校验二维数组，用于push校验数据
        checkRulesMap: new Map() // 最终的格式化rules map 存储校验映射
      }
    },
    computed: {
      RULE() {
        return RULE
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
            this.rulesObj = rules
            if (rules.rules) { // 旧的格式
              this.$log.warning('旧格式重置')
              this.refreshRule()
            } else {
              // console.log('=======update value=======') // 调试，可禁用
              this.checkRulesArr = []
              Object.keys(rules).forEach(key => {
                this.checkRulesArr.push([key, rules[key]])
                // console.log(key, rules[key]) // 调试，可禁用
              })
              this.checkRulesMap = new Map(this.checkRulesArr)
              // console.log('=======update value end=======') // 调试，可禁用
              // // 再根据是否包含必填校验判断
              this.isRequired = this.checkRulesMap.has(RULE.required)
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
      },
      fieldTitle() {
        if (this.checkRulesMap.has(RULE.required)) {
          this.setRules(RULE.required)
        }
      }
    },
    methods: {
      // 增加校验，即增加默认参数配置
      setRules(ruleType) {
        if (this.checkRulesMap.has(ruleType) && ruleType !== RULE.required) {
          this.$message({ type: 'warning', content: '已有同名规则，无需重复添加' })
          return
        }
        switch (ruleType) {
          case RULE.required:
            this.checkRulesArr.unshift([ruleType, {
              message: `${this.fieldTitle}必填`,
              ...this.normalCfg
            }])
            break
          case RULE.length:
            this.checkRulesArr.push([ruleType, {
              min: Infinity,
              max: Infinity,
              message: '长度必须在指定的范围内',
              ...this.normalCfg
            }])
            break
          case RULE.email:
            this.checkRulesArr.push([ruleType, {
              message: '邮箱格式不正确',
              ...this.normalCfg
            }])
            break
          case RULE.phone:
            this.checkRulesArr.push([ruleType, {
              message: '手机号格式不正确',
              ...this.normalCfg
            }])
            break
          case RULE.idCode:
            this.checkRulesArr.push([ruleType, {
              preField: 'id_type',
              message: '身份证格式不正确',
              ignoreCase: true,
              ...this.normalCfg
            }])
            break
          case RULE.regexp:
            this.checkRulesArr.push([ruleType, {
              regexp: '',
              message: '正则表达式不匹配',
              ...this.normalCfg
            }])
            break
          case RULE.unifiedCode:
            this.checkRulesArr.push([ruleType, {
              preField: 'id_type',
              message: '统一社会信用代码格式不正确',
              ignoreCase: true,
              ...this.normalCfg
            }])
            break
          case RULE.orgInstCode:
            this.checkRulesArr.push([ruleType, {
              preField: 'id_type',
              message: '组织机构代码格式不正确',
              ignoreCase: true,
              ...this.normalCfg
            }])
            break
          case RULE.regNo:
            this.checkRulesArr.push([ruleType, {
              preField: 'id_type',
              message: '工商注册号格式不正确',
              ignoreCase: true,
              ...this.normalCfg
            }])
            break
          case RULE.conditionRequired:
            this.checkRulesArr.push([ruleType, {
              preField: '',
              preFieldValue: '',
              message: '当前字段在前置字段条件达成下必填',
              ...this.normalCfg
            }])
            break
          case RULE.conditionNotRequired:
            this.checkRulesArr.push([ruleType, {
              preField: '',
              preFieldValue: '',
              message: '当前字段在前置字段条件达成下不可填写',
              ...this.normalCfg
            }])
            break
          case RULE.conditionNotBe:
            this.checkRulesArr.push([ruleType, {
              preField: '',
              preFieldValue: '',
              notValue: '',
              message: '当前字段在前置字段条件达成下不能为某值',
              ...this.normalCfg
            }])
            break
          case RULE.notSame:
            this.checkRulesArr.push([ruleType, {
              preField: '',
              message: '不能和前置字段值相同',
              ...this.normalCfg
            }])
            break
          default:
            break
        }
        this.checkRulesMap = new Map(this.checkRulesArr)
        this.emitValue()
      },
      // 移除某个校验
      removeRules(ruleType) {
        if (this.checkRulesMap.has(ruleType)) {
          this.checkRulesMap.delete(ruleType)
        }
        this.emitValue()
      },
      // 必填项改变操作
      requiredChange(val) {
        if (val) {
          // console.log('set required')
          this.setRules(RULE.required)
        } else {
          // console.log('remove required')
          this.removeRules(RULE.required)
        }
      },
      // 刷新重载rules
      refreshRule() {
        this.checkRulesMap.clear()
        this.checkRulesArr = []
        if (this.required) {
          this.setRules(RULE.required)
        } else {
          this.emitEmptyValue()
        }
      },
      // 更新参数
      emitParamsToValue() {
        const rules = JSON.stringify(this.rulesObj)
        this.$emit('input', rules)
        this.$emit('on-change', rules)
      },
      // 更新model value
      emitValue() {
        this.rulesObj = this.formatRules(this.checkRulesMap)
        const rules = JSON.stringify(this.rulesObj)
        this.$emit('input', rules)
        this.$emit('on-change', rules)
      },
      // 更新空值
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
    .params {
      display: flex;
      border-radius: 2px;
      border: 1px solid #eee;
      margin-bottom: 5px;
      padding: 4px 0;
      .title {
        flex: 0 0 95px;
        width: 95px;
        padding: 0 4px;
      }
      .number {
        flex: 0 0 95px;
        width: 95px;
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
        text-align: center;
      }
    }
    .param-tip {
      display: inline-block;
      width: 100%;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
    }
    .remove {
      cursor: pointer;
    }
  }
</style>
