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
