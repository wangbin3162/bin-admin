export const ruleName = {
  required: '$required',
  length: '$length'
}

/**
 * 校验生成器对象根据不同类型的校验返回符合form-item类型的校验对象
 */
export const validatorBuild = {
  // 必填字段 opts: { message,trigger }
  $required: function (opts) {
    return { required: true, message: opts.message, trigger: opts.trigger }
  },
  // 长度 opts: { min,max,message,trigger }
  $length: function (opts) {
    return {
      validator: (rule, value, callback, source, options) => {
        console.log('===validator===')
        console.log(rule, value)
        console.log('===source===')
        console.log(source)
        console.log('===options===')
        console.log(options)
        let len = value.length
        if (len <= opts.max) {
          callback()
        } else {
          callback(new Error(opts.message))
        }
      },
      trigger: opts.trigger
    }
  },
  // 条件必填 opts: { preField, preFieldValue,message,trigger} obj:form
  $conditionRequired: function (opts, obj) {
    console.log(obj)
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        console.log(obj)
        let preField = obj[opts.preField]// 前置字段当前值
        let preFieldValue = opts.preFieldValue// 前置字段需要匹配的值
        console.log(preField, preFieldValue)
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
