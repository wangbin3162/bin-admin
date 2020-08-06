// 类目管理
import request from '../request'

/**
 * @author haodongdong
 * @description 获取资源信息树
 * @param {string} code
 */
export async function getClassifyTree(code) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/classify/tree',
        method: 'get',
        params: {
          code
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
