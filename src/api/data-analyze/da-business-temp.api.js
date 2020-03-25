// 系统日志管理相关请求
import request from '../request'

/* 获取模板列表(树) */
export function getTemplateTree() {
  return request({
    url: 'api/confType/tree',
    method: 'get',
    params: {
      typeCode: 'outer_template_type'
    }
  })
}

/* 获取所有列表 */
export function getBusinessTemplateList(query) {
  return request.get('/da/businessTemplate/search', {
    params: {
      size: query.size,
      page: query.page - 1,
      tempCode: query.tempCode,
      tempName: query.tempName,
      tempType: query.tempType,
      sort: 'createDate,desc'
    }
  })
}

/* 删除内置模板 */
export function removeBusinessTemp(item) {
  return request({
    url: '/da/businessTemplate/remove',
    method: 'post',
    params: {
      id: item.id
    }
  })
}

/* 查询模板详情  */
export function getBusinessTempDetail(id) {
  return request({
    url: '/da/businessTemplate/detail',
    method: 'get',
    params: { id }
  })
}

/* 新增内置模板 */
export function createBusinessTemp(template, params) {
  return request({
    url: '/da/businessTemplate/add',
    method: 'post',
    data: {
      tempName: template.tempName,
      tempCode: template.tempCode,
      tempType: template.tempType,
      tempSource: template.tempSource,
      tempDesc: template.tempDesc,
      fields: params
    }
  })
}

/* 修改模板 */
export function modifyBusinessTemplate(template, params) {
  return request({
    url: '/da/businessTemplate/modify',
    method: 'post',
    data: {
      id: template.id,
      tempName: template.tempName,
      tempType: template.tempType,
      tempSource: template.tempSource,
      tempDesc: template.tempDesc,
      fields: params
    }
  })
}

/* 请求响应类型枚举 */
export function getRespTypeEnum() {
  return request({
    url: '/da/enum/respType',
    method: 'get'
  })
}

/* 请求数据类型枚举 */
export function getDataTypeEnum() {
  return request({
    url: '/da/enum/dataType',
    method: 'get'
  })
}

/* 查询响应树信息列表 */
export function getRespTree(bizId) {
  return request({
    url: '/da/bizResp/searchTree',
    method: 'get',
    params: {
      bizId, isAll: false
    }
  })
}

/* 2.7.6分页查询业务响应数据 */
export function getRespList(id, query) {
  return request({
    url: '/da/bizResp/search',
    method: 'get',
    params: {
      parentId: id,
      bizId: query.bizId,
      size: query.size,
      page: query.page - 1
    }
  })
}

/* 添加单条响应 */
export function addResp(response) {
  return request({
    url: '/da/bizResp/create',
    method: 'post',
    params: {
      bizId: response.bizId,
      parentId: response.parentId,
      keyName: response.keyName,
      keyAlias: response.keyAlias,
      keyPath: response.keyPath,
      respKind: response.respKind,
      dataType: response.dataType,
      memo: response.memo,
      orderNo: response.orderNo
    }
  })
}

/* 批量添加响应 */
export function batchAddResp(list) {
  return request({
    url: '/da/bizResp/batchAdd',
    method: 'post',
    data: list
  })
}

/* 修改单条响应 */
export function modifyResp(response) {
  return request({
    url: '/da/bizResp/modify',
    method: 'post',
    params: {
      bizId: response.bizId,
      id: response.id,
      parentId: response.parentId,
      keyName: response.keyName,
      keyAlias: response.keyAlias,
      keyPath: response.keyPath,
      respKind: response.respKind,
      dataType: response.dataType,
      memo: response.memo,
      orderNo: response.orderNo
    }
  })
}

/* 修改单条响应 */
export function removeResp(id) {
  return request({
    url: '/da/bizResp/remove',
    method: 'post',
    params: {
      id
    }
  })
}
