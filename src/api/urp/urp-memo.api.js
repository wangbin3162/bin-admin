/* 接收备忘录管理 */
import request from '../request'

/* 接收备忘录列表 */
export function getMemoList(query) {
  return request({
    url: '/api/urpMemo/searchReceive',
    method: 'get',
    params: {
      memoName: query.memoName,
      memoType: query.memoType,
      receiveStatus: query.receiveStatus,
      page: query.page - 1,
      size: query.size
    }
  })
}

/* 接收一个 */
export function receive(memoId, memoDepartId) {
  return request({
    url: '/api/urpMemo/receive',
    method: 'post',
    params: { memoId, memoDepartId }
  })
}
