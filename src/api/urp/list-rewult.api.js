/* 惩戒激励记录 */
import request from '../request'

/* 惩戒激励记录列表 */
export function getListResult(query) {
  return request({
    url: 'api/urp/listResult/search',
    method: 'get',
    params: {
      name: query.name,
      idCode: query.idCode,
      memoId: query.memoId,
      page: query.page - 1,
      size: query.size
    }
  })
}
