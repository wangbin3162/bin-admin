/**
 * @author haodongdong
 * @description 通知公告相关api接口
 * @module
 */
import request from '../request'

/**
 * @typedef {Object} Notice 通知对象
 * @property {string} [id] id
 * @property {string} type 通知类型
 * @property {string} title 标题
 * @property {string} content 内容
 * @property {File[]} files 附件
 * @property {string} validDate 过期时间
 * @property {string} remark 备注
 * @property {string} notifyStatus 通知状态
 */

/**
 * @author haodongdong
 * @description 查询栏目所有根节点
 * @returns {Promise<Section>}
 */
export async function getSectionRoots() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/roots',
        method: 'get',
        params: { sort: 'colSort,asc' }
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
