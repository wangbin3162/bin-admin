import { deepCopy } from '../../../../../common/utils/assist'
import { ruleName, validatorBuild } from './validator.cfg'

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
