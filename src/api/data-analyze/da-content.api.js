// 分析内容相关请求
import request, { requestPost } from '../request'

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

/* 获取所有内容列表 */
export function getContentList(query) {
  return request({
    url: '/da/content/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      name: query.name,
      code: query.code,
      themeCode: query.themeCode
    }
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
    unit: content.unit,
    mappingFields: content.mappingFields,
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
    unit: content.unit,
    mappingFields: content.mappingFields,
    subCategory: content.type[1] || null
  })
}

/* 内容详情 */
export function getContentDetail(id) {
  return request.get('/da/content/detail', { params: { id } })
}

/* 改变状态 */
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

/* 内容接口测试 */
export function testContent(themeCode, contentCode, params) {
  return request({
    url: `da/data/${themeCode}/${contentCode}`,
    method: 'get',
    params
  })
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

/**
 * @author haodongdong
 * @description 分析内容，信息项映射组件内使用，查询配置的相应信息
 * @param {string} id 分析内容记录的id
 * @returns {Promise}
 */
export async function queryRespInfos (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/contentApi/queryRespInfos',
        method: 'get',
        params: { contentId: id }
      })
      if (res.data.successful) {
        resolve(res.data.data)
      } else {
        reject(res.data.message)
      }
    } catch (error) {
      reject(error)
    }
  })
}
