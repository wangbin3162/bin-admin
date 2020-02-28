// 系统日志管理相关请求
import request from '../request'

/* 获取模板列表(树) */
export function getTemplateTree() {
  return request({
    url: '/da/innerTemplate/allList',
    method: 'get'
  })
}

/* 获取所有列表 */
export function getInnerTemplateList(query) {
  return request.get('/da/innerTemplate/search', {
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

/* 新增内置模板 */
export function createInnerTemp(item) {
  const data = {
    tempName: item.tempName,
    tempCode: item.tempCode,
    tempType: item.tempType,
    tempSource: item.tempSource,
    tempDesc: item.tempDesc,
    fields: item.fields
  }
  return request({
    url: '/da/innerTemplate/add',
    method: 'post',
    data
  })
}

/* 删除内置模板 */
export function handleRemove(item) {
  return request({
    url: '/da/innerTemplate/remove',
    method: 'post',
    params: {
      id: item.id
    }
  })
}

/* 删除模板参数 */
export function removeParam(item) {
  return request({
    url: '/da/templateParam/remove',
    method: 'post',
    params: {
      id: item.id
    }
  })
}

/* 修改字典项 */
export function modifyInnerTemplate(item) {
  const data = {
    id: item.id,
    name: item.name,
    code: item.code,
    describe: item.describe
  }
  return request({
    url: '/da/theme/modifyDaTheme',
    method: 'post',
    data
  })
}
