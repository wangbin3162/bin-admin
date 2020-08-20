/**
 * @author zhengyu
 * @description 关系图数据
 */
import request from '@/api/request'

/**
 * @description 获取关系图数据
 * @param {string} objectId 主体id
 * @param {string} objectName 主体名称
 * @param {string} type 主体类别 '1' 法人 '2' 自然人
 * @returns {Promise<any>}
 */
export async function getRelationData (objectId, objectName, type) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgDocs/graphDisplay',
        method: 'get',
        params: {
          objectId,
          objectName,
          type
        }
      })
      if (res.data.code === '0') {
        resolve(res.data.data)
      } else {
        reject(res.data.message)
      }
    } catch (error) {
      reject(error)
    }
  })
}
