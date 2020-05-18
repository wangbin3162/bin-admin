/**
 * @author haodongdong
 * @description 信用评级下评级模型相关接口
 */
import request from '../request'

/**
 * @author haodongdong
 * @description 获取主题类别树
 * @returns Promise
 */
export async function getSubjectTypeTree(code = 'A') {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/classify/tree',
        method: 'get',
        params: { code }
      })
      if (res.data.code === '0') { // 不是标准的restful，200中还可能包含接口错误。
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
 * @description 获取评级模型列表
 * @param {*} query
 * @returns Promise
 */
export async function getRatingModelList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/search',
        method: 'get',
        params: {
          modelName: query.modelName,
          // bizType: query.bizType,
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
 * @description 获取评级模型详情
 * @param {*} query
 * @returns Promise
 */
export async function getRatingModeDetail(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/detail',
        method: 'get',
        params: { id }
      })
      if (res.data.code === '0') {
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
 * @description 创建评级模型
 * @param {*} params
 * @returns Promise
 */
export async function createRatingModel(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/create',
        method: 'post',
        data: params
      })
      if (res.data.code === '0') {
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
export async function deleteRatingModel(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/remove',
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
