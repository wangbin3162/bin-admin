import { deepCopy } from '../../../common/utils/assist'
import { checkIdCard, verifyOrgNo, verifyRegNo, verifyUnifiedCode } from '../../../common/utils/validate'

/**
 * 校验枚举值
 */
export const RULE = {
  required: '$required',
  length: '$length',
  email: '$email',
  phone: '$phone',
  idCode: '$idCode',
  regexp: '$regexp',
  unifiedCode: '$unifiedCode',
  orgInstCode: '$orgInstCode',
  regNo: '$regNo',
  conditionRequired: '$conditionRequired',
  conditionNotRequired: '$conditionNotRequired',
  conditionNotBe: '$conditionNotBe',
  notSame: '$notSame'
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
  // 统一社会信用代码 opts: { ignoreCase,message,trigger }
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
  // 组织机构代码 opts: { ignoreCase,message,trigger }
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
  // 工商注册号 opts: { ignoreCase,message,trigger }
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
        if ((preField == null && typeof preFieldValue === 'undefined') ||
          (preField && (preField === preFieldValue || (preField.length === 0 && typeof preFieldValue === 'undefined')))
        ) {
          if (value.length > 0) {
            callback(new Error(opts.message))
          }
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
        if ((preField && (preField === preFieldValue))) {
          if (value !== null && value === opts.notValue) {
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
        if ((preField && (preField === value))) {
          callback(new Error(opts.message))
        }
        callback()
      },
      trigger: opts.trigger
    }
  }
}

/**
 * 根据传入字符判断是字典值还是枚举值
 * @param valid
 */
export function getValidValue(valid) {
  // 缓存数组，如是枚举值则返回一个数组
  if (valid && valid.length > 0) { // 如果不为空则去初始化数组
    const index = valid.indexOf(';')
    if (index > -1) { // 如有;则为枚举型
      let ret = []
      let names = valid.slice(0, index).split('/')
      let codes = valid.slice(index + 1).split('/')
      for (let i = 0; i < codes.length; i++) {
        ret.push({ code: codes[i], name: names[i] })
      }
      return {
        type: 'enum',
        data: ret
      }
    } else {
      let dict = valid.split('/')
      // 如果是字典值，则
      return {
        type: 'dict',
        code: dict[1],
        name: dict[0]
      }
    }
  }
  return {
    type: 'enum',
    data: []
  }
}

/**
 * 初始化动态菜单列表
 * @param fields
 */
export async function initFormList(fields) {
  let dynamicForm = deepCopy(fields)
  try {
    let promises = fields.map((item) => initItemsByValidValue(item.validValue))
    let results = await Promise.all(promises)
    for (let i = 0; i < fields.length; i++) {
      dynamicForm[i]['validOptions'] = results[i]
    }
  } catch (e) {
    console.warn(e)
  }
  return dynamicForm
}

/**
 * 初始化options选项
 * 根据有效值是枚举值还是字典值判断
 * @param valid
 */
export async function initItemsByValidValue(valid) {
  let optionsObj = getValidValue(valid)
  let ret = []
  if (optionsObj.type === 'enum') {
    ret = optionsObj.data
  } else if (optionsObj.type === 'dict') {
    // 根据code查询字典项 先注释掉返回空
    // await getDictItems(optionsObj.code).then(res => {
    //   if (res.data.code === '0') {
    //     ret = res.data.data
    //   }
    // })
  }
  return ret
}

/**
 * 根据checkRules获取实际form-item需要的rules
 * @param checkRules
 * @param sourceObj
 */
export function checkRulesToFormRules(checkRules, sourceObj) {
  let ret = []
  try {
    const rules = JSON.parse(checkRules)
    if (rules.rules) { // 旧的格式
      // console.log('旧的格式')
      return ret
    } else {
      Object.keys(rules).forEach(key => {
        // 获取名称和参数后调用返回实际rules
        // console.log(key,rules[key])
        let rule = validatorBuild[key](rules[key], sourceObj)
        ret.push(rule)
      })
      return ret
    }
  } catch (e) {
    console.warn('checkRules 不是标准json')
    console.log(checkRules)
  }
}
