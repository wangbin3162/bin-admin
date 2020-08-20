/**
 * @author haodongdong
 * @description 行业黑名单排名相关接口
 */
import request from '../request'
import Qs from 'qs'

/**
 * @author haodongdong
 * @description 获取行业黑名单排名列表
 * @param {Object} query 查询参数对象
 * @param {number} query.size 分页大小
 * @param {number} query.page 当前页
 * @returns {Promise<any>}
 */
export async function getIndustryBlackList (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/trade/search',
        method: 'get',
        params: {
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
