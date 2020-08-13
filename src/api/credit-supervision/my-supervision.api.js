// 通知公告相关api接口
import request from '../request'
import Qs from 'qs'

/**
 * @author haodongdong
 * @description 获取类别树
 * @param {string} typeCode 类别编码，传递hydm获取行业代码树
 * @returns {Promise<any>}
 */
export async function getConTypeTree (typeCode) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/confType/tree',
        method: 'get',
        params: { typeCode }
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
 * @description 根据行业代码获取子类别列表
 * @param {Object} query 查询参数
 * @param {string} query.typeName 类别名称
 * @param {string} query.typeCode 类别编码
 * @param {number} query.size 分页大小
 * @param {string} query.page 当前页
 * @returns {Promise<any>}
 */
export async function getConTypeList (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/confType/search',
        method: 'get',
        params: {
          parentId: query.parentId,
          typeName: query.typeName,
          typeCode: query.typeCode,
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
