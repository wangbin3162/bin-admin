/**
 * @author haodongdong
 * @description 信用评级下评级模型相关接口
 */
import request from '../request'

/**
 * @author haodongdong
 * @description 获取类目树
 * @returns Promise
 */
export async function getIndexManageTree() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/classify/tree',
        method: 'get',
        params: { code: 'C' }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 获取指标管理列表
 * @param {*} query
 * @returns Promise
 */
export async function getIndexManageList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/index/search',
        method: 'get',
        params: {
          indexName: query.indexName,
          indexKind: query.indexKind,
          bizType: query.bizType,
          size: query.size,
          page: query.page - 1,
          sort: 'createDate,desc'
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
 * @description 获取指标管理详情
 * @param {*} query
 * @returns Promise
 */
export async function getIndeManageDetail(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/index/detail',
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
 * @description 创建或更新指标管理
 * @param {*} params
 * @returns Promise
 */
export async function saveAndUpdate(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/index/saveAndUpdate',
        method: 'post',
        data: params
      })
      if (res.data.successful) {
        resolve([true])
      } else {
        resolve([false, res.data.message])
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 删除指标
 * @param {*} params
 * @returns Promise
 */
export async function deleteIndexManage(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/index/remove',
        method: 'post',
        params: { id }
      })
      console.log(res)
      if (res.data.successful) {
        resolve([true])
      } else {
        resolve([false, res.data.message])
      }
    } catch (error) {
      reject(error)
    }
  })
}
