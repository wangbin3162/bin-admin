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
 * @property {boolean} isTop 是否置顶
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
 * @param {sting} id 通知对象id
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

/**
 * @author haodongdong
 * @description 设置置顶
 * @param {string} id 通知对象id
 * @param {boolean} isTop
 * @returns {Promise<viod>}
 */
export async function setTop(id, isTop) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/top',
        method: 'post',
        data: { id, isTop }
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
 * @description 设置通知状态
 * @param {string} id 通知对象id
 * @param {string} notifyStatus 通知状态
 * @returns {Promise<viod>}
 */
export async function setStatus(id, notifyStatus) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/notifyStatus',
        method: 'post',
        data: { id, notifyStatus }
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
 * @description 通知公告附件上传接口
 * @param {File} file
 * @returns {Promise<void>}
 */
export function UploadNotifyFile(file) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = new FormData()
      data.append('attachment', file)

      const res = await request({
        url: 'api/cms/cmsNotify/uploadNotify',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: data
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
 * @description 通知公告附件删除接口
 * @param {string} attachmentId 附件id
 * @returns {Promise<void>}
 */
export function removeNotifyFile(attachmentId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/deleteNotifyFile',
        method: 'post',
        params: { attachmentId }
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
