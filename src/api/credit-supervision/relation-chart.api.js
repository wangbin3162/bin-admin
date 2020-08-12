/**
 * @author zhengyu
 * @description 关系图数据
 */
import request from './request'
import store from '@/store'
export async function relationChart () {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/docs/graphDisplay?personId=e46c7c4a47d74ef59042b6584da2e232&personClass=FO&personName=上海大米网络科技有限公司',
        method: 'get'
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
