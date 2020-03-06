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
