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
