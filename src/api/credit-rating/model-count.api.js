/**
 * @author haodongdong
 * @description 信用评级下模型计算相关接口
 */
import request, {
  appendFormData,
  requestPostFormData
} from '../request'

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
 * @description 分页查询(自然人)
 * @param {*} query
 * @returns Promise
 */
export async function getNaturalList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/cal/result/nat/search',
        method: 'get',
        params: {
          name: query.name,
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
 * @description 详情内信用信息
 * @param {*} resultId
 * @returns Promise
 */
export async function getCreditInfo(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/cal/resultDetail/search',
        method: 'get',
        params: {
          resultId: query.id,
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
 * @description 重新计算
 * @param {*} params
 * @returns Promise
 */
export async function reCount(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/cal/result/reCalc',
        method: 'post',
        data: params
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
 * @description 模板下载
 * @param {*} personClass
 * @returns Promise
 */
export async function templateDownload(personClass) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/cal/result/template/download',
        responseType: 'blob',
        method: 'get',
        params: {
          personClass
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
 * @description 模板上传计算
 * @param {*} params
 * @returns Promise
 */
export async function templateCount(params) {
  return new Promise(async (resolve, reject) => {
    const url = '/api/eval/cal/result/template/import'

    let data = new FormData()

    appendFormData(data, 'personClass', params.personClass)
    appendFormData(data, 'modelId', params.modelId)
    appendFormData(data, 'uploadFile', params.uploadFile)

    try {
      const res = await requestPostFormData(url, data)
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
 * @description 导出PDF
 * @returns Promise
 */
export async function exportPDF(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/pdf/create',
        responseType: 'blob',
        method: 'post',
        data: {
          personId: params.personId,
          configId: params.configId,
          modelName: params.modelName,
          maskCode: params.maskCode
        }

      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
