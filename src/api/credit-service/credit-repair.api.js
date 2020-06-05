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

// 信用修复申请接口-------------------------

/**
 * @author haodongdong
 * @description 获取信用修复申请列表
 * @param {*} query
 * @returns Promise
 */
export async function getRepairApplyList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairFlow/applyList',
        method: 'get',
        params: {
          resourceName: query.resourceName,
          name: query.name,
          status: query.status,
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
 * @description 获取所有申请目录列表
 * @param {*} query
 * @returns Promise
 */
export async function getAllDirConfig() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairDirConfig/configList',
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
 * @description 获取修复记录JSON数据
 * @param {*} resourceKey
 * @param {*} recordId
 * @returns Promise
 */
export async function getRecordData(resourceKey, recordId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairFlow/getRecordData',
        method: 'get',
        params: {
          resourceKey,
          recordId
        }
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
 * @description 信用修复申请
 * @param {*} params
 * @returns Promise
 */
export async function repairApply(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = new FormData()

      Object.keys(params).forEach(key => {
        if (key !== 'attachment') {
          data.append(key, params[key])
        } else { // attachment 为File数组
          for (const file of params[key]) {
            data.append(key, file, file.name)
          }
        }
      })

      const res = await request({
        url: '/api/service/repairFlow/apply',
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
 * @description 删除信用修复申请
 * @param {*} params
 * @returns Promise
 */
export async function deleteRepairApply(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairFlow/remove',
        method: 'get',
        params: { id }
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
 * @description 获取信用修复申请详情
 * @param {*} id
 * @returns Promise
 */
export async function getRepairApplyDetail(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairFlow/detail',
        method: 'get',
        params: { id }
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
 * @description 信用修复申请书下载
 * @param {*} query
 * @returns Promise
 */
export async function downLoadTemplate() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/service/repairFlow/template',
        responseType: 'blob',
        method: 'get'
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
