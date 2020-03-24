// 分析内容相关请求
import request, { requestPost } from '../request'

/* 获取主题列表 */
export function getThemeTree() {
  return request({
    url: '/da/theme/allList',
    method: 'get'
  })
}

/* 获取内容类型 */
export function getContentType() {
  return request({
    url: '/da/enum/contentType',
    method: 'get'
  })
}

/* 获取内容子类型 */
export function getChartType() {
  return request({
    url: '/da/enum/chartType',
    method: 'get'
  })
}

/* 获取接口列表 */
export function getApiList() {
  return request({
    url: '/da/api/list',
    method: 'get'
  })
}

/* 获取所有内容列表 */
export function getContentList(query) {
  const data = new URLSearchParams()
  data.append('size', query.size)
  data.append('page', query.page - 1)
  data.append('name', query.name)
  data.append('code', query.code)
  data.append('themeCode', query.themeCode)
  return request({
    url: '/da/content/search',
    method: 'get',
    params: data
  })
}

/* 新增内容信息 */
export function createContent(content) {
  return requestPost('/da/content/create', {
    name: content.name,
    code: content.code,
    describe: content.describe,
    themeCode: content.themeCode,
    apiId: content.apiId,
    toggle: content.toggle,
    data: content.data,
    category: content.type[0] || '',
    subCategory: content.type[1] || null
  })
}

/* 修改内容信息 */
export function modifyContent(content) {
  return requestPost('/da/content/modify', {
    id: content.id,
    name: content.name,
    code: content.code,
    describe: content.describe,
    themeCode: content.themeCode,
    apiId: content.apiId,
    toggle: content.toggle,
    data: content.data,
    category: content.type[0] || '',
    subCategory: content.type[1] || null
  })
}

export function changeStatus(content) {
  let params = {
    id: content.id,
    toggleType: content.toggle
  }
  return requestPost('/da/content/changeToggle', params)
}

/* 删除分析内容 */
export function removeContent(content) {
  return requestPost('/da/content/remove', { id: content.id })
}

/* 批量打开 */
export function batchOn(ids) {
  return request({
    url: '/da/content/batchOn',
    method: 'post',
    data: ids
  })
}

/* 批量关闭 */
export function batchOff(ids) {
  return request({
    url: '/da/content/batchOff',
    method: 'post',
    data: ids
  })
}
