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
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
