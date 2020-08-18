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
 * @param {number} query.size 分页大小
 * @param {number} query.page 当前页
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
          page: query.page - 1
        }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
