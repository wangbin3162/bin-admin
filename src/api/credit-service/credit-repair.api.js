/**
 * @author haodongdong
 * @description 信用服务 信用修复相关接口
 */
import request from '../request'

/**
 * @author haodongdong
 * @description 获取信用目录列表
 * @param {*} query
 * @returns Promise
 */
export async function getDirConfigList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairDirConfig/search',
        method: 'get',
        params: {
          resourceName: query.resourceName,
          tableName: query.tableName,
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
 * @description 创建信用目录配置
 * @param {*} id
 * @returns Promise
 */
export async function createDirConfig(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairDirConfig/create',
        method: 'post',
        data: {
          resourceName: params.resourceName,
          resourceKey: params.resourceKey,
          tableName: params.tableName,
          configType: params.configType,
          bz: params.bz
        }
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
 * @description 更新信用目录配置
 * @param {*} id
 * @returns Promise
 */
export async function updateDirConfig(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairDirConfig/modify',
        method: 'post',
        data: {
          id: params.id,
          resourceName: params.resourceName,
          resourceKey: params.resourceKey,
          tableName: params.tableName,
          configType: params.configType,
          bz: params.bz
        }
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
 * @description 删除信用目录配置
 * @param {*} id
 * @returns Promise
 */
export async function deleteDirConfig(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairDirConfig/remove',
        method: 'get',
        params: { id }
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
