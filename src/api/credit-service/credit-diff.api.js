/**
 * @author haodongdong
 * @description 信用服务 异议申请相关接口
 */
import request from '../request'

/**
 * @author haodongdong
 * @description 获取异议申请列表
 * @param {*} query
 * @returns Promise
 */
export async function getDiffAppList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/objectionFlow/applyList',
        method: 'get',
        params: {
          searchCode: query.searchCode,
          status: query.status,
          resourceKey: query.resourceKey,
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
 * @description 获取异议初审列表
 * @param {*} query
 * @returns Promise
 */
export async function getApproveList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/objectionFlow/approveList',
        method: 'get',
        params: {
          searchCode: query.searchCode,
          resourceKey: query.resourceKey,
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
 * @description 获取异议处理列表
 * @param {*} query
 * @returns Promise
 */
export async function getHandleList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/objectionFlow/dealList',
        method: 'get',
        params: {
          searchCode: query.searchCode,
          resourceKey: query.resourceKey,
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
 * @description 异议流程初审接口
 * @param {*} params
 * @returns Promise
 */
export async function approve(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/objectionFlow/approve',
        method: 'post',
        data: params
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
 * @description 异议流程处理接口
 * @param {*} params
 * @returns Promise
 */
export async function deal(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/objectionFlow/deal',
        method: 'post',
        data: params
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
 * @description 附件下载
 * @param {*} personClass
 * @returns Promise
 */
export async function attachmentDownload(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/attachment/download',
        responseType: 'blob',
        method: 'get',
        params: { id }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
