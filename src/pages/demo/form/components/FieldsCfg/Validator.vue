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
      <b-dropdown>
        <a href="javascript:void(0)">
          一般规则
          <b-icon name="ios-arrow-down"></b-icon>
        </a>
        <b-dropdown-menu slot="list">
          <b-dropdown-item @click.native="setRules(RULE.length)">长度</b-dropdown-item>
          <b-dropdown-item @click.native="setRules(RULE.email)">邮箱</b-dropdown-item>
          <b-dropdown-item @click.native="setRules(RULE.phone)">手机号码</b-dropdown-item>
          <b-dropdown-item @click.native="setRules(RULE.idCode)">身份证号</b-dropdown-item>
          <b-dropdown-item @click.native="setRules(RULE.regexp)">正则匹配</b-dropdown-item>
        </b-dropdown-menu>
      </b-dropdown>
      <b-divider type="vertical"/>
      <b-dropdown>
        <a href="javascript:void(0)" :style="{ color: '#fa8c16' }">
          信息项规则
          <b-icon name="ios-arrow-down"></b-icon>
        </a>
        <b-dropdown-menu slot="list">
          <b-dropdown-item @click.native="setRules(RULE.unifiedCode)">统一社会信用代码</b-dropdown-item>
          <b-dropdown-item @click.native="setRules(RULE.orgInstCode)">组织机构代码</b-dropdown-item>
          <b-dropdown-item @click.native="setRules(RULE.regNo)">工商注册号</b-dropdown-item>
        </b-dropdown-menu>
      </b-dropdown>
    </div>
    <!--必填项参数-->
    <div class="params" v-if="rulesObj[RULE.required]">
      <div class="title">
        <span class="param-tip">规则名：</span>
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">必填项</b-tag>
      </div>
      <b-row class-name="info" :gutter="10">
        <b-col span="24">
          <span class="param-tip">错误提示：</span>
          <b-input v-model.trim="rulesObj[RULE.required].message" size="mini"
                   @on-change="emitParamsToValue"/>
        </b-col>
      </b-row>
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.required].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
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
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">长度参数</b-tag>
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
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.length].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
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
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">邮箱参数</b-tag>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.email].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.email].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
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
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">手机号码</b-tag>
      </div>
      <div class="info">
        <span class="param-tip">错误提示：</span>
        <b-input v-model.trim="rulesObj[RULE.phone].message" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.phone].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
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
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">身份证</b-tag>
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
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.idCode].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
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
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">正则匹配</b-tag>
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
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.regexp].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
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
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">统一社会...</b-tag>
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
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.unifiedCode].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
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
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">组织机构...</b-tag>
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
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.orgInstCode].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
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
        <b-tag type="primary" no-border :tag-style="{padding:'3px 5px',margin:'0'}">工商注册号</b-tag>
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
      <div class="trigger">
        <span class="param-tip">触发事件：</span>
        <b-input v-model.trim="rulesObj[RULE.regNo].trigger" size="mini"
                 @on-change="emitParamsToValue"/>
      </div>
      <div class="delete">
        <b-popover confirm title="确认删除此项吗?" width="170" style="margin-top: 16px;"
                   @on-ok="removeRules(RULE.regNo)">
          <span class="remove">
            <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
          </span>
        </b-popover>
      </div>
    </div>
    <div v-show="showReal">
      <b-alert>{{value}}</b-alert>
      <!--<b-code-editor :value="JSON.stringify(rulesObj,null,2)" readonly/>-->
    </div>
  </div>
</template>

<script>
  import VToggleShow from '../../../../../components/VToggleShow/index'
  import { RULE } from './validator.cfg'

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
              console.log('=======update value=======') // 调试，可禁用
              let map = []
              Object.keys(rules).forEach(key => {
                map.push([key, rules[key]])
                console.log(key, rules[key]) // 调试，可禁用
              })
              this.checkRules = new Map(map)
              console.log('=======update value end=======') // 调试，可禁用
              // 再根据是否包含必填校验判断
              this.isRequired = this.checkRules.has(RULE.required)
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
        if (this.checkRules.has(RULE.required)) {
          this.setRules(RULE.required)
        }
      }
    },
    methods: {
      // 增加校验，即增加默认参数配置
      setRules(ruleType) {
        if (this.checkRules.has(ruleType) && ruleType !== RULE.required) {
          this.$message({ type: 'warning', content: '已有同名规则，无需重复添加' })
          return
        }
        switch (ruleType) {
          case RULE.required:
            this.checkRules.set(ruleType, {
              message: `${this.fieldTitle}必填`,
              ...this.normalCfg
            })
            break
          case RULE.length:
            this.checkRules.set(ruleType, {
              min: Infinity,
              max: Infinity,
              message: '长度必须在指定的范围内',
              ...this.normalCfg
            })
            break
          case RULE.email:
            this.checkRules.set(ruleType, {
              message: '邮箱格式不正确',
              ...this.normalCfg
            })
            break
          case RULE.phone:
            this.checkRules.set(ruleType, {
              message: '手机号格式不正确',
              ...this.normalCfg
            })
            break
          case RULE.idCode:
            this.checkRules.set(ruleType, {
              ignoreCase: true,
              message: '身份证格式不正确',
              ...this.normalCfg
            })
            break
          case RULE.regexp:
            this.checkRules.set(ruleType, {
              regexp: '',
              message: '正则表达式不匹配',
              ...this.normalCfg
            })
            break
          case RULE.unifiedCode:
            this.checkRules.set(ruleType, {
              ignoreCase: true,
              message: '统一社会信用代码格式不正确',
              ...this.normalCfg
            })
            break
          case RULE.orgInstCode:
            this.checkRules.set(ruleType, {
              ignoreCase: true,
              message: '组织机构代码格式不正确',
              ...this.normalCfg
            })
            break
          case RULE.regNo:
            this.checkRules.set(ruleType, {
              ignoreCase: true,
              message: '工商注册号格式不正确',
              ...this.normalCfg
            })
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
          this.setRules(RULE.required)
        } else {
          console.log('remove required')
          this.removeRules(RULE.required)
        }
      },
      // 刷新重载rules
      refreshRule() {
        this.checkRules.clear()
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
    .params {
      display: flex;
      border-radius: 2px;
      border: 1px solid #eee;
      margin-bottom: 5px;
      padding: 4px;
      .title {
        flex: 0 0 75px;
        width: 75px;
      }
      .number {
        flex: 0 0 100px;
        width: 100px;
        padding-right: 10px;
      }
      .info {
        flex: auto;
      }
      .trigger {
        flex: 0 0 110px;
        width: 110px;
        padding-left: 10px;
      }
      .delete {
        flex: 0 0 30px;
        width: 30px;
        text-align: center;
      }
    }
    .param-tip {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
    }
    .remove {
      cursor: pointer;
    }
  }
</style>
