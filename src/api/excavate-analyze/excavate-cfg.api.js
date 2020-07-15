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
  return request({
    url: '/api/wj/wjConditionConfig/fields',
    method: 'get',
    params: {
      resKey: resourceKey
    }
  })
}

/* 批量新增 */
export function addConditions(conditions) {
  return request({
    url: '/api/wj/wjConditionConfig/batchAdd',
    method: 'post',
    data: conditions
  })
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
    method: 'post',
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
