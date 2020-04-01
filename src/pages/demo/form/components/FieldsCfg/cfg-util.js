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
