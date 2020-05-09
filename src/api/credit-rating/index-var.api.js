/**
 * @author haodongdong
 * @description 信用评级下指标变量相关请求
 */

 import request from '../request'

 /**
  * @author haodongdong
  * @description 获取指标变量列表
  * @param {*} query
  * @returns Promise
  */
 export async function getIndexVarList (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/var/search',
        method: 'get',
        params: {
          varName: query.varName,
          varType: query.varType,
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
 * @description 获取指标变量详情
 * @param {*} id
 * @returns Promise
 */
export async function getIndexVarDetail (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/var/detail',
        method: 'get',
        params: { id }
      })
      console.log(res)
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
 * @description 创建指标变量
 * @param {*} params
 * @returns Promise
 */
export async function createIndexVar (params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/var/create',
          method: 'post',
          data: params
      })
      if (res.data.successful) {
        resolve([true, undefined])
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
 * @description 删除指标变量
 * @param {*} id
 * @returns Promise
 */
export async function deleteIndexVar (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/var/remove',
        method: 'post',
        params: { id }
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
 * @description 修改指标变量
 * @param {*} params
 * @returns Promise
 */
export async function updateIndexVar (params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/var/modify',
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
