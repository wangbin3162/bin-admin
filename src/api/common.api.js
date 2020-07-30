// 一些通用api
import request from './request'
import Qs from 'qs'

/**
 * @author haodongdong
 * @description 通用？文件下载接口，目前用于信用报告配置图片回显
 * @param {string} id
 * @param {string} funName
 * @param {string} moduleName
 * @returns Promise
 */
export function fileDownLoad(id, funName, moduleName = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/comm/file/download',
        responseType: 'blob',
        method: 'get',
        params: {
          id,
          funName,
          moduleName
        }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
