import {
  checkIdCard,
  validateURL,
  verifyOrgNo,
  verifyRegNo,
  verifyUnifiedCode
} from '../../../../../common/utils/validate'
import { deepCopy } from '../../../../../common/utils/assist'

/* base 基本数据参数及全局规则，以下四个属性需根据名称一一对应 */

/**
 * 校验函数映射，根据存储的校验字符名称取对应的基本参数映射
 * @type {{$conditionNotBe: (function(*, *, *): {args: {preField: {name: string, title: string, value: (args.preField|{name, title, value, desc}), desc: string}, message: {default: string, name: string, title: string, value: *, desc: string}, notValue: {name: string, title: string, value: (args.notValue|{name, title, value, desc}), desc: string}, preFieldValue: {name: string, title: string, value: (args.preFieldValue|{name, title, value, desc}), desc: string}}, types: string[], name: string, title: string, desc: string}), $required: (function(*, *, *): {args: {message: {default: string, name: string, title: string, value: *, desc: string}}, types: string[], name: string, title: string, desc: string}), $length: (function(*, *, *): {args: {min: {name: string, title: string, value: *, desc: string}, max: {name: string, title: string, value: *, desc: string}, imin: {name: string, title: string, value: (args.imin|{name, title, value, desc}), desc: string}, imax: {name: string, title: string, value: (args.imax|{name, title, value, desc}), desc: string}, message: {default: string, name: string, title: string, value: *, desc: string}}, types: string[], name: string, title: string, desc: string}), $conditionRequired: (function(*, *, *): {args: {preField: {name: string, title: string, value: (args.preField|{name, title, value, desc}), desc: string}, message: {default: string, name: string, title: string, value: *, desc: string}, preFieldValue: {name: string, title: string, value: (args.preFieldValue|{name, title, value, desc}), desc: string}}, types: string[], name: string, title: string, desc: string}), $conditionNotRequired: (function(*, *, *): {args: {preField: {name: string, title: string, value: (args.preField|{name, title, value, desc}), desc: string}, message: {default: string, name: string, title: string, value: *, desc: string}, preFieldValue: {name: string, title: string, value: (args.preFieldValue|{name, title, value, desc}), desc: string}}, types: string[], name: string, title: string, desc: string}), $notSame: (function(*, *, *): {args: {preField: {name: string, title: string, value: (args.preField|{name, title, value, desc}), desc: string}, message: {default: string, name: string, title: string, value: *, desc: string}}, types: string[], name: string, title: string, desc: string})}}
 */
const validationMaps = {
  // 必填字段
  $required: function (obj, value, opts) {
    return {
      name: '$required',
      title: '必填字段',
      types: ['ALL'],
      desc: '此字段值不允许为空。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}不可以为空',
          value: opts.message
        }
      }
    }
  },
  // 长度
  $length: function (obj, value, opts) {
    return {
      name: '$length',
      title: '长度',
      types: ['string', 'number', 'date'],
      desc: '长度必须在指定的范围内。',
      args: {
        min: {
          name: 'min',
          title: '至少（包含边界）',
          desc: '字符串最小长度，包含左边界值。',
          value: opts.min
        },
        imin: {
          name: 'imin',
          title: '至少（不包含边界）',
          desc: '字符串最小长度，不包含左边界值。',
          value: opts.imin
        },
        max: {
          name: 'max',
          title: '最多（包含边界）',
          desc: '字符串最大长度，包含右边界值。',
          value: opts.max
        },
        imax: {
          name: 'imax',
          title: '最多（不包含边界）',
          desc: '字符串最大长度，不包含右边界值。',
          value: opts.imax
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}长度必须在指定的范围内',
          value: opts.message
        }
      }
    }
  },
  // 数值类型
  $isNumber: function (obj, value, opts) {
    return {
      name: '$isNumber',
      title: '数值类型',
      types: ['number'],
      desc: '必须是有效的数值。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的数值',
          value: opts.message
        }
      }
    }
  },
  // 数值范围
  $numberRange: function (obj, value, opts) {
    return {
      name: '$numberRange',
      title: '数值范围',
      types: ['number'],
      desc: '值必须在指定的范围内。',
      args: {
        min: {
          name: 'min',
          title: '最小值（包含边界）',
          desc: '最小值，包含左边界值。',
          value: opts.min
        },
        imin: {
          name: 'imin',
          title: '最小值（不包含边界）',
          desc: '最小值，不包含左边界值。',
          value: opts.imin
        },
        max: {
          name: 'max',
          title: '最大值（包含边界）',
          desc: '最大值，包含右边界值。',
          value: opts.max
        },
        imax: {
          name: 'imax',
          title: '最大值（不包含边界）',
          desc: '最大值，不包含右边界值。',
          value: opts.imax
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}值必须在指定的范围内',
          value: opts.message
        }
      }
    }
  },
  // 数值格式（定点数）
  $decimal: function (obj, value, opts) {
    return {
      name: '$decimal',
      title: '数值格式（定点数）',
      types: ['number'],
      desc: '数值必须符合指定的位数及小数位。',
      args: {
        precision: {
          name: 'precision',
          title: '精度',
          desc: '数值的位数（含小数）',
          value: opts.precision
        },
        scale: {
          name: 'scale',
          title: '小数位',
          desc: '小数位',
          value: opts.scale
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}数值必须符合指定的位数及小数位。',
          value: opts.message
        }
      }
    }
  },
  // 字符集
  $charset: function (obj, value, opts) {
    return {
      name: '$charset',
      title: '字符集',
      types: ['string'],
      desc: '字符串只能由指定的字符集组成。',
      args: {
        charset: {
          name: 'charset',
          title: '字符集',
          desc: '字符串所包含的字符必须在指定的范围内',
          value: opts.charset
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}所包含的字符必须在指定的范围内',
          value: opts.message
        }
      }
    }
  },
  // 正则表达式
  $regexp: function (obj, value, opts) {
    return {
      name: '$regexp',
      title: '正则表达式',
      types: ['string', 'date'],
      desc: '必须匹配指定的正则表达式。',
      args: {
        regexp: {
          name: 'regexp',
          title: '正则表达式',
          desc: '字符串必须匹配指定的正则表达式',
          value: opts.regexp
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须匹配指定的正则表达式',
          value: opts.message
        }
      }
    }
  },
  // 标识符
  $token: function (obj, value, opts) {
    return {
      name: '$token',
      title: '标识符',
      types: ['string'],
      desc: '必须是有效的标识符。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的标识符',
          value: opts.message
        }
      }
    }
  },
  // 域名
  $domain: function (obj, value, opts) {
    return {
      name: '$domain',
      title: '域名',
      types: ['domain'],
      desc: '必须是有效的域名。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的域名',
          value: opts.message
        }
      }
    }
  },
  // 主机地址
  $hostname: function (obj, value, opts) {
    return {
      name: '$hostname',
      title: '主机地址',
      types: ['hostname'],
      desc: '必须是有效的主机地址。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的主机地址',
          value: opts.message
        }
      }
    }
  },
  // 邮箱地址
  $email: function (obj, value, opts) {
    return {
      name: '$email',
      title: '电子邮箱',
      types: ['string'],
      desc: '必须是有效的电子邮箱。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的电子邮箱',
          value: opts.message
        }
      }
    }
  },
  // URL
  $url: function (obj, value, opts) {
    return {
      name: '$url',
      title: 'URL',
      types: ['string'],
      desc: '必须是有效的URL。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的URL',
          value: opts.message
        }
      }
    }
  },
  // FILE
  $file: function (obj, value, opts) {
    return {
      name: '$file',
      title: 'FILE',
      types: ['string'],
      desc: '必须是有效的文件。',
      args: {
        extensions: {
          name: 'extensions',
          title: '文件后缀名',
          desc: '必须是有效的文件类型,例如: jpeg,png (以英文逗号分隔)',
          value: opts.extensions
        },
        max: {
          name: 'max',
          title: '文件最大值',
          desc: '文件不能超过设定的大小范围,例如: 100 (表示100KB)',
          value: opts.max
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的文件类型',
          value: opts.message
        }
      }
    }
  },
  // UUID
  $isId: function (obj, value, opts) {
    return {
      name: '$isId',
      title: 'UUID',
      types: ['uuid'],
      desc: '必须是有效的ID值。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的ID',
          value: opts.message
        }
      }
    }
  },
  // 条件必填
  $conditionRequired: function (obj, value, opts) {
    return {
      name: '$conditionRequired',
      title: '条件必填',
      types: ['ALL'],
      desc: '此字段值不允许为空。',
      args: {
        preField: {
          name: 'preField',
          title: '前置字段',
          desc: '填写前置字段对应的目录字段名称,例如CF_CFLBA',
          value: opts.preField
        },
        preFieldValue: {
          name: 'preFieldValue',
          title: '前置字段值',
          desc: '填写前置字段值,当前字段必填的条件',
          value: opts.preFieldValue
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}在前置字段条件达成下必填',
          value: opts.message
        }
      }
    }
  },
  // 条件必不填
  $conditionNotRequired: function (obj, value, opts) {
    return {
      name: '$conditionNotRequired',
      title: '条件必不填',
      types: ['ALL'],
      desc: '此字段值不可填写。',
      args: {
        preField: {
          name: 'preField',
          title: '前置字段',
          desc: '填写前置字段对应的目录字段名称,例如CF_CFLBA',
          value: opts.preField
        },
        preFieldValue: {
          name: 'preFieldValue',
          title: '前置字段值',
          desc: '填写前置字段值,当前字段不可填写',
          value: opts.preFieldValue
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}在前置字段条件达成下不可填写',
          value: opts.message
        }
      }
    }
  },
  // 条件不能为某值
  $conditionNotBe: function (obj, value, opts) {
    return {
      name: '$conditionNotBe',
      title: '条件不能为某值',
      types: ['ALL'],
      desc: '条件不能为某值。',
      args: {
        preField: {
          name: 'preField',
          title: '前置字段',
          desc: '填写前置字段对应的目录字段名称,例如CF_CFLBA',
          value: opts.preField
        },
        preFieldValue: {
          name: 'preFieldValue',
          title: '前置字段值',
          desc: '填写前置字段值,当前字段不可填写',
          value: opts.preFieldValue
        },
        notValue: {
          name: 'notValue',
          title: '不能是的值',
          desc: '前置条件达成时此处不能为指定的值',
          value: opts.notValue
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}在前置字段条件达成下不可填写',
          value: opts.message
        }
      }
    }
  },
  // 值不能相同
  $notSame: function (obj, value, opts) {
    return {
      name: '$notSame',
      title: '值不能相同',
      types: ['ALL'],
      desc: '字段值不能相同。',
      args: {
        preField: {
          name: 'preField',
          title: '前置字段',
          desc: '填写前置字段对应的目录字段名称,例如CF_CFLBA',
          value: opts.preField
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}和前置字段值不能相同',
          value: opts.message
        }
      }
    }
  },
  // 统一社会信用代码
  $unifiedCode: function (obj, value, opts) {
    return {
      name: '$unifiedCode',
      title: '统一社会信用代码',
      types: ['string'],
      desc: '必须是有效的统一社会信用代码。',
      args: {
        ignoreCase: {
          name: 'ignoreCase',
          title: '忽略大小写',
          desc: '验证时是否忽略大小写',
          'default': false,
          component: 'checkbox',
          value: opts.ignoreCase
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的统一社会信用代码',
          value: opts.message
        }
      }
    }
  },
  // 组织机构代码
  $orgInstCode: function (obj, value, opts) {
    return {
      name: '$orgInstCode',
      title: '组织机构代码',
      types: ['string'],
      desc: '必须是有效的组织机构代码。',
      args: {
        ignoreCase: {
          name: 'ignoreCase',
          title: '忽略大小写',
          desc: '验证时是否忽略大小写',
          'default': false,
          component: 'checkbox',
          value: opts.ignoreCase
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的组织机构代码',
          value: opts.message
        }
      }
    }
  },
  // 工商注册号
  $regNo: function (obj, value, opts) {
    return {
      name: '$regNo',
      title: '工商注册号',
      types: ['string'],
      desc: '必须是有效的工商注册号。',
      args: {
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的工商注册号',
          value: opts.message
        }
      }
    }
  },
  // 居民身份证号码
  $idCode: function (obj, value, opts) {
    return {
      name: '$idCode',
      title: '居民身份证号码',
      types: ['string'],
      desc: '必须是有效的居民身份证号码。',
      args: {
        ignoreCase: {
          name: 'ignoreCase',
          title: '忽略大小写',
          desc: '验证时是否忽略大小写',
          'default': true,
          component: 'checkbox',
          value: opts.ignoreCase
        },
        message: {
          name: 'message',
          title: '错误提示信息',
          desc: '验证未通过时的提示信息。可用${title}引用字段标题。',
          'default': '${title}必须是有效的居民身份证号码',
          value: opts.message
        }
      }
    }
  }
}

/**
 * 校验生成器对象根据不同类型的校验返回符合form-item类型的校验对象
 */
const validatorBuild = {
  // 必填字段
  $required: function (obj, value, opts) {
    return { required: true, message: opts.message, trigger: opts.trigger }
  },
  // 长度
  $length: function (obj, value, opts) {
    return {
      validator: (rule, value, callback) => {
        let len = value.length
        let min = parseInt(opts.min)
        let max = parseInt(opts.max)
        let imin = parseInt(opts.imin)
        let imax = parseInt(opts.imax)
        let result = (len === 0) ||
          ((isNaN(min) || len >= min) && (isNaN(max) || len <= max) &&
            (isNaN(imin) || len > imin) && (isNaN(imax) || len < imax))
        if (result) {
          callback()
        } else {
          callback(new Error(opts.message))
        }
      },
      trigger: opts.trigger
    }
  },
  // 数值类型
  $isNumber: function (obj, value, opts) {
    return {
      type: 'number',
      message: opts.message,
      trigger: opts.trigger,
      transform(value) {
        return Number(value)
      }
    }
  },
  // 数值范围
  $numberRange: function (obj, value, opts) {
    return {
      validator: (rule, value, callback) => {
        let num = Number(value)
        if (isNaN(num)) {
          callback(new Error('输入值不是数值类型'))
        }
        let min = Number(opts.min)
        let max = Number(opts.max)
        let imin = Number(opts.imin)
        let imax = Number(opts.imax)
        let result = value.length === 0 ||
          ((isNaN(min) || num >= min) && (isNaN(max) || num <= max) &&
            (isNaN(imin) || num > imin) && (isNaN(imax) || num < imax))
        if (!result) {
          callback(new Error(opts.message))
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 数值格式（定点数）
  $decimal: function (obj, value, opts) {
    return {
      validator: (rule, value, callback) => {
        let precision = Number(opts.precision)
        let scale = Number(opts.scale || 0)
        let len = precision - scale
        let regex = new RegExp('^([+-]?)' + (len > 0 ? '[0-9]{1,' + len + '}' : '0') + '(\\.[0-9]{0,' + scale + '})?$')
        let result = value.length === 0 || regex.test(value)
        if (!result) {
          callback(new Error(opts.message))
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 字符集
  $charset: function (obj, value, opts) {
    return {
      validator: (rule, value, callback) => {
        let result = value.length === 0 || new RegExp('^[' + opts.charset + ']*$', 'g').test(value)
        if (!result) {
          callback(new Error(opts.message))
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 正则表达式
  $regexp: function (obj, value, opts) {
    return { pattern: new RegExp(opts.regexp), message: opts.message, trigger: opts.trigger }
  },
  // 标识符
  $token: function (obj, value, opts) {
    return { pattern: /^[a-z_]([0-9a-z_]*)$/i, message: opts.message, trigger: opts.trigger }
  },
  // 域名
  $domain: function (obj, value, opts) {
    return { pattern: /^[0-9a-z_-]+(\.[0-9a-z_-]+)+$/i, message: opts.message, trigger: opts.trigger }
  },
  // 主机地址
  $hostname: function (obj, value, opts) {
    return { pattern: /^[0-9a-z_-]+(\.[0-9a-z_-]+)+$/i, message: opts.message, trigger: opts.trigger }
  },
  // 邮箱地址
  $email: function (obj, value, opts) {
    return { type: 'email', message: opts.message, trigger: opts.trigger }
  },
  // URL
  $url: function (obj, value, opts) {
    return {
      validator: (rule, value, callback) => {
        if (value.isNotEmpty()) {
          if (!validateURL(value)) {
            callback(new Error(opts.message))
          }
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // FILE
  $file: function (obj, value, opts) {
    return {
      validator: (rule, value, callback) => {
        if (value.isNotEmpty()) {
          callback()
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // UUID
  $isId: function (obj, value, opts) {
    return { pattern: /^[a-zA-Z0-9]{32}|[a-zA-Z0-9-]{36}$/, message: opts.message, trigger: opts.trigger }
  },
  // 条件必填
  $conditionRequired: function (obj, value, opts) {
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
  // 条件必不填
  $conditionNotRequired: function (obj, value, opts) {
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
          if (value.isNotEmpty()) {
            callback(new Error(opts.message))
          }
        }
        callback()
      },
      trigger: opts.trigger
    }
  },
  // 条件不能为某值
  $conditionNotBe: function (obj, value, opts) {
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
  // 值不能相同
  $notSame: function (obj, value, opts) {
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
  },
  // 统一社会信用代码
  $unifiedCode: function (obj, value, opts) {
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
  $orgInstCode: function (obj, value, opts) {
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
  $regNo: function (obj, value, opts) {
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
  // 居民身份证号码
  $idCode: function (obj, value, opts) {
    if (!obj) {
      return null
    }
    return {
      validator: (rule, value, callback) => {
        // 需判断证件类型值，这里要求配置校验规则时区分法人与自然人
        // 如果是法人类型表，切存在【法定代表人证件类型】字段则类型设置需要比对fddbrzjlx，
        // 这里也要求设置校验配置时，居民身份证类型需要选择自然人证件类型
        let type = obj['fddbrzjlx'] ? obj['fddbrzjlx'] : obj['id_type']
        let caseValue = opts.ignoreCase ? String(value).toUpperCase() : value
        let result = (value.length === 0 || type !== '1' || checkIdCard(caseValue))
        if (!result) callback(new Error(opts.message))
        callback()
      },
      trigger: opts.trigger
    }
  }
}

/**
 * 全局规则options
 */
export const globalValidationOptions = [
  { name: '$required', title: '必填字段' },
  { name: '$length', title: '长度' },
  { name: '$isNumber', title: '数值类型' },
  { name: '$numberRange', title: '数值范围' },
  { name: '$decimal', title: '数值格式（定点数）' },
  { name: '$charset', title: '字符集' },
  { name: '$regexp', title: '正则表达式' },
  { name: '$token', title: '标识符' },
  { name: '$domain', title: '域名' },
  { name: '$hostname', title: '主机地址' },
  { name: '$email', title: '邮箱地址' },
  { name: '$url', title: 'URL' },
  { name: '$file', title: 'FILE' },
  { name: '$isId', title: 'UUID' },
  { name: '$unifiedCode', title: '统一社会信用代码' },
  { name: '$orgInstCode', title: '组织机构代码' },
  { name: '$regNo', title: '工商注册号' },
  { name: '$idCode', title: '居民身份证号码' }
]

/**
 * 信息项规则options
 */
export const fieldsValidationOptions = [
  { name: '$conditionRequired', title: '条件必填' },
  { name: '$conditionNotRequired', title: '条件必不填' },
  { name: '$conditionNotBe', title: '条件不能为某值' },
  { name: '$notSame', title: '值不能相同' }
]

/* base end */

/**
 * json字符串数据格式化为集合
 * => 用于打开校验窗口时根据数据库返回json字符串后，格式化为数组列表
 * @param str
 * @returns {Promise<any>}
 */
export function jsonDataToList(str) {
  return new Promise(resolve => {
    let ret = []
    try {
      const obj = JSON.parse(str) // 将字符串转换为JSON对象 {"rules":["$required(obj,value,{"message":""})]}
      // 遍历rules
      obj.rules.forEach(func => {
        funcJsonToObj(func).then(res => {
          ret.push(res.data)
        })
      })
      resolve({ data: ret })
    } catch (e) {
      console.error(str)
      console.error('checkRules 不是标准的json格式字符串')
      resolve({ data: ret })
    }
  })
}

/**
 * 集合格式化为json字符串数据
 * => 用于校验弹窗提交时，将校验集合格式化为json字符串
 * @param list
 * @returns {string}
 */
export function listToJsonStr(list) {
  let rules = []
  list.forEach(item => {
    let str = item.name
    let args = item.args
    let opts = {}
    Object.keys(args).forEach(key => {
      let value = args[key].value
      if (value !== undefined) {
        opts[key] = value
      }
    })
    rules.push(`${str}(obj, value, ${JSON.stringify(opts)})`)
  })
  return JSON.stringify({ rules })
}

/**
 * json字符串数据格式化为formItem rules 校验数组
 * => 根据数据库存储校验字符，生成符合form-item的rules校验数组
 * @param item
 * @param currentStrip
 * @returns {[]}
 */
export function jsonDataToRules(item, currentStrip) {
  let rules = item.checkRules.replace(/\${title}/g, item.fieldTitle)
  let ret = []
  try {
    // 将字符串转换为JSON对象 {"rules":["$required(obj,value,{"message":""})]}
    const obj = JSON.parse(rules)
    // 遍历rules
    obj.rules.forEach(func => {
      // 获取函数名和opts参数
      let tmp = funcJsonToNameAndOpts(func)
      let funcValidator = validatorBuild[tmp.funcName]
      // 获取的opts拼接trigger触发方式
      let opts = { ...tmp.opts, trigger: getTriggerByCType(item.controlType) }
      if (item.controlType === 'NUMBER_TEXT') {
        opts.type = 'number'
      }
      // console.log(opts)
      if (funcValidator) {
        // console.log(funcValidator)
        let result = funcValidator(currentStrip, null, opts)
        if (result) {
          ret.push(result)
        }
      } else {
        console.error(`validatorBuild 不存在${tmp.funcName}校验函数`)
      }
    })
  } catch (e) {
    console.error('checkRules 不是标准的json格式字符串')
  }
  return ret
}

/**
 * 根据函数名获取对应的args对象，并转换成数组
 * => 用于选择校验类型下拉框时获取args列表
 * @param name 函数名
 * @param args 对应参数，可不填即为新增
 * @returns {Promise<any>}
 */
export function getArgsByFuncName(name, args) {
  return new Promise(resolve => {
    // 获取函数名
    let func = getFuncByName(name)
    // 根据传入的args来转换为调用的拼接json格式对象
    let argsJson = formatArgsObjToOpts(args)
    let arr = []
    if (func) {
      let argsObj = func(null, null, argsJson).args
      // 遍历argsObj对象，来转换为数组格式
      Object.keys(argsObj).forEach(key => {
        let obj = deepCopy(argsObj[key])
        if (typeof obj.value === 'undefined') {
          obj.value = typeof obj.default === 'undefined' ? '' : obj.default
        }
        arr.push(obj)
      })
    }
    resolve({ data: arr })
  })
}

/**
 * 根据验证规则获取对象
 * => 用于配置完毕args列表后提交
 * @param name 函数名
 * @param args 已修改的参数
 * @returns {Promise<any>}
 */
export function getObjByRules(name, args) {
  return new Promise(resolve => {
    // 获取函数名
    let func = getFuncByName(name)
    // 根据传入的args 数组来转换为调用的拼接json格式对象
    let argsJson = formatArgsListToOpts(args)
    if (func) {
      let data = func(null, null, argsJson)
      resolve({ data })
    }
  })
}

/**
 * util 根据函数名称获取校验类型
 * @param name 函数名称
 * @returns {string} 校验类型
 */
export function getRuleType(name) {
  return ['$conditionRequired', '$conditionNotRequired', '$conditionNotBe', '$notSame'].includes(name) ? 'fields' : 'global'
}

/**
 * util 根据控件类型获取校验trigger
 * @param type 控件类型
 * @returns {string} trigger 类型
 */
function getTriggerByCType(type) {
  // CHECKBOX: "复选框"
  // COMBO_BOX: "组合下拉框"
  // CROP_REP: "选择法人代表"
  // DATE: "日期"
  // DATE_TIME: "日期时间"
  // DEPART: "选择部门"
  // FILE_UPLOAD: "文件上传"
  // HIDDEN: "隐藏域"
  // INDEX: "评分指标"
  // LABEL: "文本标签"
  // LEG_PERSON: "选择法人"
  // LOWER_CASE: "小写文本"
  // NAT_OR_LEG_PERSON: "选择自然人或法人"
  // NAT_PERSON: "选择自然人"
  // NUMBER_TEXT: "数值文本框"
  // PASSWORD: "密码框"
  // RADIO: "单选框"
  // SELECT: "下拉框"
  // TEXT: "文本框"
  // TEXTAREA: "文本域"
  // UPPER_CASE: "大写文本"
  const blurArr = ['TEXT', 'UPPER_CASE', 'TEXTAREA', 'PASSWORD', 'LOWER_CASE']
  return blurArr.includes(type) ? 'blur' : 'change'
}

/**
 * util 根据函数名称获取函数
 * @param name
 * @returns {*}
 */
function getFuncByName(name) {
  return validationMaps[name]
}

/**
 * 根据函数字符串转换为函数名和opts
 * @param str
 * @returns {{funcName: *, opts}}
 */
function funcJsonToNameAndOpts(str) {
  // 获取函数名称
  let name = str.slice(0, str.indexOf('('))
  // 获取opts
  let optsStr = str.slice(str.indexOf('{'), str.lastIndexOf('}') + 1)
  let opts = {}
  try {
    opts = JSON.parse(optsStr)
  } catch (e) {
    console.error(optsStr)
    console.error('截取的opts 对象不是标准的json格式字符串')
  }
  return {
    funcName: name,
    opts: opts
  }
}

/**
 * 根据函数字符串转换为对象
 * @param str
 * @returns {Promise<any>}
 */
function funcJsonToObj(str) {
  return new Promise((resolve, reject) => {
    let tmp = funcJsonToNameAndOpts(str)
    let func = getFuncByName(tmp.funcName)
    let opts = tmp.opts
    if (func) {
      let data = func(null, null, opts)
      resolve({ data })
    } else {
      reject(new Error('函数名不存在'))
    }
  })
}

/**
 * format  转换args对象为调用opts对象
 * @param args 对象
 */
function formatArgsObjToOpts(args) {
  let opts = {}
  if (args) { // 这里需要判断是否有args对象，如没有表示新增选择校验类型
    Object.keys(args).forEach(key => {
      opts[key] = args[key].value
    })
  }
  return opts
}

/**
 * format 转换args 数组为调用opts对象
 * @param args 数组
 */
function formatArgsListToOpts(args) {
  let opts = {}
  args.forEach(item => {
    if (item.value !== undefined) {
      opts[item.name] = item.value
    }
  })
  return opts
}
