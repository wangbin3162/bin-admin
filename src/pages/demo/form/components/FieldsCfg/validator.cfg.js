import { checkIdCard, verifyOrgNo, verifyRegNo, verifyUnifiedCode } from '../../../../../common/utils/validate'

export const RULE = {
  required: '$required',
  length: '$length',
  email: '$email',
  phone: '$phone',
  idCode: '$idCode',
  regexp: '$regexp',
  unifiedCode: '$unifiedCode',
  orgInstCode: '$orgInstCode',
  regNo: '$regNo'
}

/**
 * 校验生成器对象根据不同类型的校验返回符合form-item类型的校验对象
 */
export const validatorBuild = {
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
  // 居民身份证号码 opts: { ignoreCase,message,trigger }
  $idCode: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        // 需判断证件类型值，这里要求配置校验规则时区分法人与自然人
        // 如果是法人类型表，切存在【法定代表人证件类型】字段则类型设置需要比对fddbrzjlx，
        // 这里也要求设置校验配置时，居民身份证类型需要选择自然人证件类型
        // let type = obj['fddbrzjlx'] ? obj['fddbrzjlx'] : obj['id_type']
        // let result = (value.length === 0 || type !== '1' || checkIdCard(caseValue))
        let caseValue = opts.ignoreCase ? String(value).toUpperCase() : value
        let result = (value.length === 0 || checkIdCard(caseValue))
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
  /* =========[信息项规则]=============== */
  // 统一社会信用代码
  $unifiedCode: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        // 需判断证件类型值，这里要求配置校验规则时区分法人与自然人，统一社会信用代码为1，工商注册号代码为2，组织机构代码为3
        let caseValue = opts.ignoreCase ? String(value).toUpperCase() : value
        let result = (value.length === 0 || obj['id_type'] !== '1' || value === '00000000000000000X' || verifyUnifiedCode(caseValue))
        if (!result) callback(new Error(opts.message))
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 组织机构代码
  $orgInstCode: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        // 需判断证件类型值，这里要求配置校验规则时区分法人与自然人，统一社会信用代码为1，工商注册号代码为2，组织机构代码为3
        let caseValue = opts.ignoreCase ? String(value).toUpperCase() : value
        let result = (value.length === 0 || obj['id_type'] !== '3' || verifyOrgNo(caseValue))
        if (!result) callback(new Error(opts.message))
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 工商注册号
  $regNo: function (opts, obj) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        // 需判断证件类型值，这里要求配置校验规则时区分法人与自然人，统一社会信用代码为1，工商注册号代码为2，组织机构代码为3
        let caseValue = opts.ignoreCase ? String(value).toUpperCase() : value
        let result = (value.length === 0 || obj['id_type'] !== '2' || verifyRegNo(caseValue))
        if (!result) callback(new Error(opts.message))
        callback()
      },
      trigger: opts.trigger
    }
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
        if ((preField == null && typeof preFieldValue === 'undefined') ||
          (preField && (preField === preFieldValue || (preField.length === 0 && typeof preFieldValue === 'undefined')))
        ) {
          if (value.length === 0) {
            callback(new Error(opts.message))
          }
        }
        callback()
      },
      trigger: opts.trigger
    }
  }
}
