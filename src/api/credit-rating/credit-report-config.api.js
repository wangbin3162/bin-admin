/**
 * @author haodongdong
 * @description 系统管理下数据配置下信用报告配置相关接口
 */
import request from '../request'

/**
 * @author haodongdong
 * @description 获取信用报告配置列表
 * @param {*} query
 * @returns Promise
 */
export async function getCreditReportList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/search',
        method: 'get',
        params: {
          reportName: query.reportName,
          reportType: query.reportType,
          personClass: query.personClass,
          reportDefault: query.reportDefault,
          size: query.size,
          page: query.page - 1
          // sort: 'createDate,desc'
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
 * @description 创建信用报告
 * @param {*} query
 * @returns Promise
 */
export async function createCreditReport(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/create',
        method: 'post',
        data: params
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
 * @description 更新信用报告
 * @param {*} query
 * @returns Promise
 */
export async function updateCreditReport(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/modify',
        method: 'post',
        data: params
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
 * @description 删除信用报告
 * @param {*} query
 * @returns Promise
 */
export async function deleteCreditReport(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/remove',
        method: 'post',
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

/**
 * @author haodongdong
 * @description 启用禁用
 * @param {*} query
 * @returns Promise
 */
export async function changeStatus(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/changeStatus',
        method: 'post',
        params: {
          id
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
 * @description 设为默认
 * @param {*} query
 * @returns Promise
 */
export async function setDefault(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/changeSysDefault',
        method: 'post',
        params: {
          id
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
 * @description 获取信用报告配置的信息类列表
 * @param {*} query
 * @returns Promise
 */
export async function getInfoClassList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/category/search',
        method: 'get',
        params: {
          configId: query.configId,
          category: query.category,
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
 * @description 根据resourceKey获取资源详情
 * @param {*} resourceKey
 * @returns Promise
 */
export async function getResourceDetail(resourceKey) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/detailByResourceKey',
        method: 'get',
        params: {
          resourceKey
        }
      })
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
 * @description 获取信息类详情
 * @param {*} resourceKey
 * @returns Promise
 */
export async function getInfoClassDetaiil(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/category/detail',
        method: 'get',
        params: {
          id
        }
      })
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
 * @description 创建信息类
 * @param {*} query
 * @returns Promise
 */
export async function createInfoClass(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/category/create',
        method: 'post',
        data: params
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
 * @description 修改信息类
 * @param {*} query
 * @returns Promise
 */
export async function updateInfoClass(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/category/modify',
        method: 'post',
        data: params
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
 * @description 删除信息类信息类
 * @param {*} query
 * @returns Promise
 */
export async function deleteInfoClass(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/eval/report/category/remove',
        method: 'post',
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
