/**
 * @author zhengyu
 * @description 关系图数据
 */
import request from '@/api/request'
export async function getRelationData (word) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgDocs/graphDisplay?' + word,
        method: 'get'
      })
      resolve(res.data.data)
    } catch (error) {
      reject(error)
    }
  })
}
