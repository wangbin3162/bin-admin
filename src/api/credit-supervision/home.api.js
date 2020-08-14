// 通知公告相关api接口
import request from '../request'
import Qs from 'qs'

/**
 * @typedef {Object} SiperVisionDynamic
 * @property {string} objectId 主体id
 * @property {string} objectName 主体名称
 * @property {string} resourceName 资源名称
 * @property {number} count 新增条数
 * @property {string} createDate 创建日期
 * @property {number} objectType 主体类型，1：自然人 2：法人
 */

/**
 * @author haodongdong
 * @description 获取监管动态列表
 * @param {number} month 查询月数 默认6
 * @returns {Promise<SiperVisionDynamic[]>}
 */
export async function getSupervisionDynamicList (month = 6) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgDocs/searchDynamic',
        method: 'get',
        params: { month }
      })
      if (res.data.successful) {
        resolve(res.data.data)
      } else {
        reject(new Error(res.data.message))
      }
    } catch (error) {
      reject(error)
    }
  })
}
