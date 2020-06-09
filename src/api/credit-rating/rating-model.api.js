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
          personClass: query.personClass,
          modelStatus: query.modelStatus,
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
 * @description 更新评级模型
 * @param {*} params
 * @returns Promise
 */
export async function updateRatingModel(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/modify',
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
export async function deleteRatingModel(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/remove',
        method: 'post',
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
 * @description 启用禁用
 * @param {*} params
 * @returns Promise
 */
export async function setStatus(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/changeStatus',
        method: 'post',
        params: {
          id
        }
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
 * @description 设置缺省评级模型
 * @param {*} params
 * @returns Promise
 */
export async function setSysDefault(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/changeSysDefault',
        method: 'post',
        params: {
          id
        }
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
 * @description 克隆评级模型
 * @param {*} id
 * @returns Promise
 */
export async function cloneRatingModel(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/clone',
        method: 'post',
        params: {
          id
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

/**
 * @author haodongdong
 * @description 获取指标树
 * @returns Promise
 */
export async function getIndexModleTree(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/index/tree',
        method: 'get',
        params: {
          modelId: query.modelId,
          indexId: query.indexId,
          indexName: query.indexName,
          indexType: query.indexType
        }
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
 * @description 更新指标模型
 * @returns Promise
 */
export async function updatedIndexModel(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/index/createOrModify',
        method: 'post',
        data: params
      })
      if (res.data.successful) { // 不是标准的restful，200中还可能包含接口错误。
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
 * @description 删除指标模型
 * @returns Promise
 */
export async function deleteIndexModel(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/model/index/remove',
        method: 'post',
        params: { id }
      })
      if (res.data.successful) { // 不是标准的restful，200中还可能包含接口错误。
        resolve()
      } else {
        reject(new Error(res.data.message))
      }
    } catch (error) {
      reject(error)
    }
  })
}
