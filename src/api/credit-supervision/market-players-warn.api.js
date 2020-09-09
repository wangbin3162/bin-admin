/**
 * @author haodongdong
 * @description 市场主体预警相关接口
 */
import request from '../request'
import Qs from 'qs'

/**
 * @author haodongdong
 * @description 获取市场主体预警列表
 * @param {Object} query 查询参数对象
 * @param {number} query.size 分页大小
 * @param {number} query.page 当前页
 * @returns {Promise<any>}
 */
export async function getMarketWarnList (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/warning/search',
        method: 'get',
        params: {
          size: query.size,
          page: query.page - 1
        }
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
