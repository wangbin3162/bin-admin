/**
 * @author wang bin
 * @description 对象拷贝等相关辅助函数
 */

/**
 * @function 辅助判断精准类型函数
 * @param {*} obj
 * @returns [type]
 */
export function typeOf(obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

/**
 * @function 深拷贝函数
 * @param {*} data
 * @returns [object,array]
 */
export function deepCopy(data) {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

/**
 * @function 安全判断各类型为空的情况
 * @param {*} data
 * @returns boolean
 */
export function isEmpty(data) {
  let type = typeOf(data)
  // 先额外判断一下数组和对象的为空情况
  switch (type) {
    case 'array':
      return data.length === 0
    case 'object':
      return JSON.stringify(data) === '{}'
    case 'number':
      return false
    default:
      // 其余情况转换boolean 返回，主要是 null,undefined,'',,NaN,false,都表示空
      return !data
  }
}

/**
 * @function 安全判断各类型不为空
 * @param {*} data
 * @returns boolean
 */
export function isNotEmpty(data) {
  return !isEmpty(data)
}
