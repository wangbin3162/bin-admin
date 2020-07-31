// 通知公告相关api接口
import request from '../request'
import Qs from 'qs'

 /**
 * @typedef {Object} Notice 通知对象
 * @property {string} [id] id
 * @property {string} type 通知类型
 * @property {string} title 标题
 * @property {string} content 内容
 * @property {string} files 附件id的字符串数组
 * @property {string} validDate 过期时间
 * @property {string} remark 备注
 * @property {boolean} isTop 是否置顶
 * @property {string} notifyStatus 通知状态
 */

/**
 * @author haodongdong
 * @description 获取所有通知
 * @param {Object} query 查询参数
 * @param {string} [query.title] 通知标题
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
          // notifyStatus: query.notifyStatus,
          notifyStatus: 'PUBLISHED',
          size: query.size,
          page: query.page - 1,
          sort: 'isTop,desc'
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
 * @description 获取通知详情
 * @param {string} id 通知id
 * @returns {Promise<Notice>}
 */
export async function getNoticeDetail(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/detail',
        method: 'get',
        params: { id }
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
 * @description 获取未读通知数量
 * @returns {Promise<number>}
 */
export async function getUnreadNum () {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/userReadModify',
        method: 'post'
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
 * @description 更新用户读取通知时间
 * @returns {Promise}
 */
export async function updateUserReadNotice () {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/unread',
        method: 'get'
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
