/**
 * @author haodongdong
 * @description 信用监管详情页相关接口
 */
import request from '../request'
import Qs from 'qs'

/**
 * @author haodongdong
 * @description 获取详情接口
 * @param {Object} query 查询参数对象
 * @param {string} query.id 主体id
 * @param {number} query.type 主体类型 1 法人 2 自然人
 * @returns {Promise<SiperVisionDynamic[]>}
 */
export async function getDetail (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgDocs/detail',
        method: 'get',
        params: query
      })
      if (res.data.code === '0') {
        resolve({
          mapping: res.data.mapping,
          data: res.data.data
        })
      } else {
        reject(new Error(res.data.message))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 获取近期动态接口
 * @param {Object} query 查询参数对象
 * @param {string} query.id 主体id
 * @param {number} query.type 主体类型 1 法人 2 自然人
 * @param {string} query.month 查询月数
 * @param {number} [query.size] 分页大小
 * @param {number} [query.page] 当前页
 * @returns {Promise<SiperVisionDynamic[]>}
 */
export async function getPersonDynamic (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgDocs/personDynamic',
        method: 'get',
        params: {
          id: query.id,
          type: query.type,
          month: query.month,
          size: query.size,
          page: query.page ? query.page - 1 : query.page
        }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 获取红黑名单信息或者重点领域信息
 * @param {Object} query 查询参数对象
 * @param {string} query.personId 主体id
 * @param {number} [query.jgType] 监管类型，不传则获取红黑名单信息
 * @returns {Promise<SiperVisionDynamic[]>}
 */
export async function getRedBlackOrFocusScope (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgDocs/searchByPageNew',
        method: 'get',
        params: {
          personId: query.personId,
          jgType: query.jgType || ''
        }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 获取资源信息详情
 * @param {string} id 主体id
 * @param {string} resourceKey 资源key
 * @param {string} type 主体类别
 * @param {string} [categoryType] 类别
 */
export async function getQueryDetail(id, resourceKey, type, categoryType = 'BASE') {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/docs/query/detail',
        method: 'get',
        params: {
          id, resourceKey, type, categoryType
        }
      })
      if (res.data.code === '0') {
        resolve({
          mapping: res.data.mapping,
          data: res.data.data
        })
      } else {
        reject(res.data.message)
      }
    } catch (error) {
      reject(error)
    }
  })
}
