// 通知公告相关api接口
import request from '../request'
import Qs from 'qs'

/**
 * @typedef {Object} SiperVisionDynamic 监管动态
 * @property {string} objectId 主体id
 * @property {string} objectName 主体名称
 * @property {string} resourceName 资源名称
 * @property {number} count 新增条数
 * @property {string} createDate 创建日期
 * @property {number} objectType 主体类型，1：自然人 2：法人
 */

 /**
  * @typedef {Object} personClass 主体信息
  * @property {string} id 主体id
  * @property {string} supervision 是否监管，0 未监管 1 监管
  * @property {string} redBlack 红黑名单状态 0 黑名单 1 红名单 空 无红黑名单
  * @property {string} [comp_name] 企业名称
  * @property {string} [highlight] 企业名是否高亮
  * @property {string} [clrq] 成立日期
  * @property {string} [zczb] 注册资本
  * @property {string} [fddbr] 法定代表人
  * @property {string} [name] 自然人名称
  * @property {string} [id_sfz] 身份证信息
  * @property {string} [id_code] 身份号码
  */

/**
 * @author haodongdong
 * @description 获取监管动态列表，此接口后端未分页
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

/**
 * @author haodongdong
 * @description 首页搜索接口，获取主体列表
 * @param {Object} query 查询对象
 * @param {string} query.q 查询的关键字
 * @param {number} query.type 查询类型，1：自然人 2：法人
 * @param {number} query.size 分页大小
 * @param {number} query.page 当前页
 * @returns {Promise}
 */
export async function getPersonClassList (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgDocs/search',
        method: 'get',
        params: {
          q: query.q,
          type: query.type,
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
