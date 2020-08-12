/**
 * @author haodongdong
 * @description ES交换相关api
 */
import request from '../request'

/**
 * @author haodongdong
 * @description 获取资源信息树
 * @param {string} code
 * @returns {Promise}
 */
export async function getClassifyTree(code) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/classify/tree',
        method: 'get',
        params: {
          code
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
 * @description 获取ES交换右侧列表信息
 * @param {Object} query 查询参数对象
 * @param {string} query.resourceCode 左侧树编码
 * @param {string} [query.resourceName] 资源名称
 * @param {string} [query.esSyncStatus] 运行状态
 * @param {number} query.size 分页大小
 * @param {number} query.page 当前页
 * @returns {Promise}
 */
export async function getResourcesSyncResult(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/batch/es/resourcesSyncResult',
        method: 'get',
        params: {
          resourceCode: query.resourceCode,
          resourceName: query.jobName,
          esSyncStatus: query.esSyncStatus,
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
 * @description 根据resourceKey查询同步列表
 * @param {Object} query 查询参数对象
 * @param {string} query.resourceKey 资源key
 * @param {string} [query.createDate] 开始时间
 * @param {string} [query.finishDate] 结束时间
 * @param {string} [query.esSyncStatus] 运行状态
 * @param {number} query.size 分页大小
 * @param {number} query.page 当前页
 * @returns {Promise}
 */
export async function getSingleResourceResult(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/batch/es/singleResourceResult',
        method: 'get',
        params: {
          resourceKey: query.resourceKey,
          esSyncStatus: query.esSyncStatus,
          createDate: query.createDate,
          finishDate: query.finishDate,
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
 * @description 查询资源信息
 * @param {Object} query 查询参数对象
 * @param {string} query.resourceName 资源名称
 * @param {string} query.resourceCode 资源code
 * @param {string} query.status 资源状态
 * @param {string} query.availableStatus 是否可用
 * @param {string} query.resProperty 资源性质
 * @param {number} query.size 分页尺寸
 * @param {number} query.page 当前页
 * @returns {Promise}
 */
export function getResInfoList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/search',
        method: 'get',
        params: {
          size: query.size,
          page: query.page - 1,
          resourceCode: query.resourceCode,
          resourceName: query.resourceName,
          status: query.status,
          availableStatus: query.availableStatus,
          resProperty: query.resProperty,
          isOpen: query.isOpen || '',
          sort: 'resourceKey,desc'
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
 * @description 同步Es数据，时间参数传空字符串表示为全量、反之为增量。
 * @param {Object} param 参数对象
 * @param {string} [param.importId] 需要重启的任务记录id，可选参数
 * @param {string} param.isAll 是否选择全部资源 全部传 all 反之空字符串
 * @param {string[]} param.resourceKeys resourceKey 数组
 * @param {string} [param.beginDate] 开始时间字符串
 * @param {string} [param.endDate] 结束时间字符串
 * @returns {Promise}
 */
export async function syncESData(param) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/batch/es/syncBaseFullLoad',
        method: 'post',
        data: {
          importId: param.importId || null,
          isAll: param.isAll,
          resourceKeys: param.resourceKeys || null,
          beginDate: param.beginDate || '',
          endDate: param.endDate || ''
        }
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
