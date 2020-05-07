// 用户管理相关请求
import request from '../request'

/**
 * @author haodongdong
 * @description 获取等级标准列表。
 * @param { object } query 查询参数
 * @returns Promise
 */
export async function getLevelStandardList (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/rating/search',
        method: 'get',
        params: {
          ratingName: query.ratingName,
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
 * @description 创建等级标准
 * @param {*} params 新增form数据
 * @returns Promise
 */
export async function createLevelStandard (params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/rating/create',
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
 * @description 编辑等级标准
 * @param {*} params 编辑后的form数据
 * @returns Promise
 */
export async function updateLevelStandard (params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/rating/modify',
        method: 'post',
        data: {
          id: params.id,
          ratingName: params.ratingName,
          ratingCode: params.ratingCode,
          ratingDesc: params.ratingDesc
        }
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
 * @description 删除等级标准
 * @param {*} id
 * @returns Promise
 */
export async function deleteLevelStandard (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/rating/remove',
        method: 'post',
        params: { id }
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
 * @description 根据id获取等级评分标准列表
 * @param {*} id
 * @returns Promise
 */
export async function queryByRankId (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/ratingDetail/queryByRankId',
        method: 'get',
        params: {
          ratingId: id
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
 * @description 保存设置评分标准数据
 * @param {*} params
 * @returns Promise
 */
export async function batchSave (params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/ratingDetail/batchSave',
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
