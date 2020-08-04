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

/**
 * @author haodongdong
 * @description 分析内容、响应配置获取左侧树
 * @param {string} id 分析内容记录的id
 * @returns {Promise}
 */
export async function queryLeftRespInfos (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/contentApi/queryLeftRespInfos',
        method: 'get',
        params: { contentId: id }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 获取多接口模板参数，测试模块使用。
 * @param {string} id 分析内容记录的id
 * @returns {Promise}
 */
export async function getMultiInterfaceTemplateParam (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/api/details',
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

/**
 * @author haodongdong
 * @description 响应配置内测试接口
 * @param {string} contentId 分析内容id
 * @param {Array} daExecuteDtos 接口相关参数对象数组，包含apiId、接口参数
 * @returns {Promise}
 */
export async function executeTest (contentId, daExecuteDtos) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/content/execute',
        method: 'post',
        params: {
          contentId
        },
        data: daExecuteDtos
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 更新配置映射接口
 * @param {string} contentId 分析内容id
 * @param {Array} mappingFields 信息项映射配置对象数组
 * @returns {Promise}
 */
export async function updateInfoItemMap (contentId, mappingFields) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/contentApi/batchModify',
        method: 'post',
        params: {
          contentId
        },
        data: mappingFields
      })

      if (res.data.successful) {
        resolve()
      } else {
        reject(res.data.message)
      }
    } catch (error) {
      reject(error)
    }
  })
}
