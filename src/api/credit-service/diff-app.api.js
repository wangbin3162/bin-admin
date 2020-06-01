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
