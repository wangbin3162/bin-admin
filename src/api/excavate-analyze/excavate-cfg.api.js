// 挖掘配置
import request from '../request'
import { getClassifyTree } from '../data-manage/classify.api'

/* 获取资源信息列表 */
export function getResInfoList(query) {
  return request({
    url: '/api/wj/wjChartsConfig/searchRes',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceName: query.resourceName,
      resourceCode: query.resourceCode,
      hasConfig: query.hasConfig
    }
  })
}

/* 条件配置列表查询接口 */
export function getConditionConfigList(query) {
  return request({
    url: '/api/wj/wjConditionConfig/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceKey: query.resourceKey,
      fieldTitle: query.fieldTitle
    }
  })
}

/* 获取其中一个资源的所有字段 */
export function getFields(resourceKey) {
  return new Promise(resolve =>
    request({ url: '/api/dir/items', method: 'get', params: { resourceKey } })
      .then(resp => {
        let fields = resp.data || []
        console.log(fields)
        // 过滤 person_id 获取原始列数组
        let filterFields = fields.filter(item => {
          return item.fieldName.indexOf('_id') === -1 &&
            item.status === 'use' &&
            oneOf(item.controlType, ['TEXT', 'SELECT', 'DATE', 'DATE_TIME', 'MULTIPLE_SELECT '])
        })
        resolve(filterFields)
      })
      .catch(() => {
        resolve([])
      })
  )
}

/* 条件配置更新接口 */
export function modifyCondition(config) {
  return request({
    url: '/api/wj/wjConditionConfig/modify',
    method: 'post',
    data: config
  })
}

/* 1.1.5条件配置删除接口 */
export function removeCondition(id) {
  return request({
    url: '/api/wj/wjConditionConfig/remove',
    method: 'get',
    params: { id }
  })
}

/* 获取主体分类树 */
export function getPersonClassTree() {
  return getClassifyTree('A')
}

/* 获取资源性质树 */
export function getResPropertyTree() {
  return getClassifyTree('B')
}

/* 获取资源性质树 */
export function getTypeTree() {
  return getClassifyTree('C')
}

// 判断数组是否包含一个值
function oneOf(value, validList) {
  return validList.indexOf(value) > -1
}
