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
 * @property {string} files 附件id的字符串数组
 * @property {string} validDate 过期时间
 * @property {string} remark 备注
 * @property {string} notifyStatus 通知状态
 */

/**
 * @author haodongdong
 * @description 获取所有通知
 * @param {Object} query 查询参数
 * @param {string} query.title 通知标题
 * @param {number} query.size 分页尺寸
 * @param {number} query.page 当前页数
 * @returns {Promise<Notice>}
 */
export async function getNoticeList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/search',
        method: 'get',
        params: {
          title: query.title,
          type: query.type,
          notifyStatus: query.notifyStatus,
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

/**
 * @author haodongdong
 * @description 创建通知
 * @param {Notice} notice 通知对象
 * @returns {Promise<Notice>}
 */
export async function createNotice(notice) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/create',
        method: 'post',
        data: notice
      })
      if (res.data.successful) {
        resolve()
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
 * @description 修改通知
 * @param {Notice} notice 通知对象
 * @returns {Promise<Notice>}
 */
export async function updateNotice(notice) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/modify',
        method: 'post',
        data: notice
      })
      if (res.data.successful) {
        resolve()
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
 * @description 删除通知
 * @param {Notice} id 通知对象id
 * @returns {Promise<Notice>}
 */
export async function removeNotice(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/remove',
        method: 'post',
        data: { id }
      })
      if (res.data.successful) {
        resolve()
      } else {
        reject(new Error(res.data.message))
      }
    } catch (error) {
      reject(error)
    }
  })
}