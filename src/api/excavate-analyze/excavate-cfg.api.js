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

/* 1.2.1图表配置列表接口 */
export function chartsCfgShow(resourceKey) {
  return request({
    url: '/api/wj/wjChartsConfig/show',
    method: 'get',
    params: {
      resKey: resourceKey
    }
  })
}

/* 图表配置批量新增修改接口 */
export function chartsCfgAddOrModify(dataList) {
  return request({
    url: '/api/wj/wjChartsConfig/batchAddOrModify',
    method: 'post',
    data: dataList
  })
}

/* 1.2.3业务模板分页查询接口 */
export function businessTemplateList(query) {
  return request({
    url: '/da/businessTemplate/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      tempName: query.resourceName,
      tempCode: query.resourceCode,
      tempType: 'wj_analysis'
    }
  })
}

/* 1.2.4业务模板查询模板详情接口 */
export function businessTemplateDetail(id) {
  return request({
    url: '/da/businessTemplate/detail',
    method: 'get',
    params: {
      id
    }
  })
}

