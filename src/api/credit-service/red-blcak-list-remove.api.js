/**
 * @author haodongdong
 * @description 信用服务 红黑名单解除相关接口
 */
import request from '../request'

/**
 * @author haodongdong
 * @description 获取左侧树基本信息（返回值非树形结构）
 * @returns Promise
 */
export async function getLeftTreeNode() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/batchRelieve/getLeftTreeNode',
        method: 'get'
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
 * @description 根据resourceKey获取resource
 * @returns Promise
 */
export async function getResourceInfo(resourceKey) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/gather/getResourceInfo',
        method: 'get',
        params: { resourceKey }
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
 * @description 获取对应resourceKey的结果集
 * @returns Promise
 */
export async function getResourceList(query, keyValues, ops) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = {
        resourceKey: query.resourceKey,
        searchPage: {
          size: query.size,
          page: query.page - 1,
          sorts: [{
            property: 'create_date',
            direction: 'desc'
          }]
        }
      }
      if (keyValues) {
        data.keyValues = keyValues
      }
      if (ops) {
        data.ops = ops
      }
      const res = await request({
        url: '/api/dir/gather/search',
        method: 'post',
        data
      })
      if (res.data.successful !== undefined && !res.data.successful) {
        reject(new Error(res.data.message))
      } else {
        resolve(res.data)
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 根据resourceKey下载模板
 * @returns Promise
 */
export async function downloadTemplate(resourceKey) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/gather/download/template',
        method: 'get',
        responseType: 'blob',
        params: { resourceKey }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 根据resourceKey批量移除
 * @returns Promise
 */
export async function batchRemove(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = new FormData()
      data.append('resourceKey', params.resourceKey)
      data.append('uploadFile', params.uploadFile)

      const res = await request({
        url: '/api/service/batchRelieve/startRelieve',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data
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

/**
 * @author haodongdong
 * @description 获取批量解除记录列表
 * @param {Object} query 查询参数对象
 * @param {string} query.resourceKey 资源key
 * @param {string} query.beginTime 开始时间 yyyy-MM-dd
 * @param {string} query.endTime 结束时间 yyyy-MM-dd
 * @param {string} query.status 状态 COMPLETED FAILED RUNNING
 * @param {number} query.sizez 分页大小
 * @param {string} query.page 页数
 * @returns {Promise<void>}
 */
export async function exportList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/exchange/query/list',
        method: 'get',
        data: {
          resourceKey: query.resourceKey,
          beginTime: query.beginTime,
          endTime: query.endTime,
          status: query.status,
          size: query.size,
          page: query.page
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
 * @description 下载错误文件
 * @param {string} id 批量解除记录id
 * @returns {Promise<void>}
 */
export async function downloadFailFile(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/exchange/query/import/errorDownload',
        method: 'post',
        responseType: 'blob',
        params: { id }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
