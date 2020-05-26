/**
 * @author haodongdong
 * @description 系统管理下数据配置相关接口
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
