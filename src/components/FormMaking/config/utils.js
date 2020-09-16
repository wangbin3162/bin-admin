// 表单设计器所需的工具函数
import { isEmpty, isNotEmpty } from '@/common/utils/assist'
import { checkIdCard, validateDate } from '@/common/utils/validate'

export function getKey(prefix) {
  const key = Date.now() + '_' + Math.ceil(Math.random() * 99999)
  return prefix ? (prefix + '_' + key) : key
}

export function getUid(prefix) {
  const key = Date.now()
  return prefix ? (prefix + '_' + key) : key
}

// 字符串逗号分隔成数组
export function splitValue(value) {
  return value.length === 0 ? [] : value.split(',')
}

// 数组逗号拼接
export function joinValue(arr) {
  return isNotEmpty(arr) ? arr.join(',') : ''
}

/**
 * 校验生成器对象根据不同类型的校验返回符合form-item类型的校验对象
 */
export const validator = {
  // 必填字段 opts: { message,trigger,type}
  $required: function (opts) {
    return { required: true, message: opts.message, trigger: opts.trigger, type: opts.type }
  },
  // 长度 opts: { min,max,message,trigger,type }
  $length: function (opts) {
    return { min: opts.min, max: opts.max, message: opts.message, trigger: opts.trigger, type: opts.type }
  },
  // 邮箱 opts: { message,trigger }
  $email: function (opts) {
    return { type: 'email', message: opts.message, trigger: opts.trigger }
  },
  // 手机号 opts: { message,trigger }
  $phone: function (opts) {
    return { pattern: /^((0\d{2,3}-\d{7,8})|(1[35874]\d{9}))$/, message: opts.message, trigger: opts.trigger }
  },
  // 居民身份证号码 opts: { preField,ignoreCase,message,trigger }
  $idCode: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        // 需判断证件类型值，这里要求配置校验规则时区分法人与自然人
        let preField = obj[opts.preField]// 前置字段当前值
        // 判断前置字段不满足情况 字段名为空，字段值为空或者不等于目标值的时候，返回true
        let preFieldRule = (isNotEmpty(opts.preField) && preField !== 'N1')
        let caseValue = opts.ignoreCase ? String(value).toUpperCase() : value
        let result = (isEmpty(value) || preFieldRule || checkIdCard(caseValue))
        if (!result) callback(new Error(opts.message))
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 正则表达式  opts: { regexp,message,trigger }
  $regexp: function (opts) {
    return { pattern: new RegExp(opts.regexp), message: opts.message, trigger: opts.trigger }
  },
  // 条件必填 opts: { preField, preFieldValue,message,trigger} obj:form
  $conditionRequired: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        let preField = obj[opts.preField]// 前置字段当前值
        let preFieldValue = opts.preFieldValue// 前置字段需要匹配的值
        // console.log(preField, preFieldValue)
        if (
          (isEmpty(preField) && isEmpty(preFieldValue)) ||
          (preField === preFieldValue) ||
          (isEmpty(preFieldValue) && preField.toString() === preFieldValue) ||
          (isNotEmpty(preFieldValue) && preField.toString().includes(preFieldValue))
        ) {
          if (isEmpty(value)) callback(new Error(opts.message))
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 条件必不填 opts: { preField, preFieldValue,message,trigger} obj:form
  $conditionNotRequired: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        let preField = obj[opts.preField]// 前置字段当前值
        let preFieldValue = opts.preFieldValue// 前置字段需要匹配的值
        console.log(opts.preField + ':' + preField)
        console.log((preField.toString() === preFieldValue), (preField.toString().includes(preFieldValue)))
        if (
          (isEmpty(preField) && isEmpty(preFieldValue)) ||
          (preField === preFieldValue) ||
          (isEmpty(preFieldValue) && preField.toString() === preFieldValue) ||
          (isNotEmpty(preFieldValue) && preField.toString().includes(preFieldValue))
        ) {
          if (isNotEmpty(value)) callback(new Error(opts.message))
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 条件不能为某值 opts: { preField, preFieldValue,notValue,message,trigger} obj:form
  $conditionNotBe: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        let preField = obj[opts.preField]// 前置字段当前值
        let preFieldValue = opts.preFieldValue// 前置字段需要匹配的值
        if (
          (preField === preFieldValue) ||
          (isEmpty(preFieldValue) && preField.toString() === preFieldValue) ||
          (isNotEmpty(preFieldValue) && preField.toString().includes(preFieldValue))
        ) {
          if (value === opts.notValue || value.toString() === opts.notValue) {
            callback(new Error(opts.message))
          }
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 值不能相同 opts: { preField,message,trigger} obj:form
  $notSame: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        let preField = obj[opts.preField]// 前置字段当前值
        if ((preField && (preField.toString() === value)) || (preField === value)) {
          callback(new Error(opts.message))
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 日期区间验证 opts: { time, compareMode:{gt,ge,lt,le} ,message , trigger} obj:form
  $timeBound: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        if (isEmpty(value)) {
          callback()
          return
        }
        // 计算实际时间 // 获取实际时间，$now 当前时间，or 2099-01-01 or preField前置字段
        let otherTime
        if (opts.time === '$now') {
          otherTime = new Date()
          // console.log('time is $now')
        } else {
          if (validateDate(opts.time)) {
            // 转换2020-01-01 中划线，转换date时取东八区8点补全
            otherTime = new Date(opts.time.replace(/-/g, '/'))
            // console.log(otherTime)
            // console.log('time is date string')
          } else {
            let preField = obj[opts.time]// 前置字段当前值
            otherTime = validateDate(preField) ? new Date(preField.replace(/-/g, '/')) : null
            // console.log('time is field[' + opts.time + ']:' + preField)
          }
        }
        let mode = opts.compareMode // 比较模式
        let thisTime = new Date(value.replace(/-/g, '/'))
        let result = true // 校验结果
        if (otherTime) {
          switch (mode) {
            case 'gt':
              result = thisTime > otherTime
              break
            case 'ge':
              result = thisTime >= otherTime
              break
            case 'lt':
              result = thisTime < otherTime
              break
            case 'le':
              result = thisTime <= otherTime
              break
          }
        }
        if (!result) callback(new Error(opts.message))
        callback()
      },
      trigger: opts.trigger
    }
  }
}

/**
 * 根据rules获取实际form-item需要的rules
 * @param rules
 * @param sourceObj
 */
export function buildRules(rules, sourceObj) {
  return rules.map(rule => {
    return validator[rule.name](rule, sourceObj)
  })
}
