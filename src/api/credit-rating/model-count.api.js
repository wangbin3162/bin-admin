/**
 * @author haodongdong
 * @description 信用评级下模型计算相关接口
 */
import request from '../request'

/**
 * @author haodongdong
 * @description 获取评级模型列表
 * @param {*} personClass
 * @returns Promise
 */
export async function getModelList(personClass) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/queryModelList',
        method: 'get',
        params: {
          personClass
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
 * @description 分页查询(法人)
 * @param {*} query
 * @returns Promise
 */
export async function getLegalList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/cal/result/leg/search',
        method: 'get',
        params: {
          compName: query.compName,
          modelId: query.modelId,
          levelCode: query.levelCode,
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
 * @description 分页查询(法人)
 * @param {*} query
 * @returns Promise
 */
export async function getNatualList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/cal/result/leg/search',
        method: 'get',
        params: {
          compName: query.compName,
          modelName: query.modelName,
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
