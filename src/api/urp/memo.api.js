/* 备忘录管理 */
import request from '../request'

/* 备忘录列表 */
export function getMemoList(query) {
  return request({
    url: '/api/urpMemo/search',
    method: 'get',
    params: {
      memoName: query.memoName,
      memoType: query.memoType,
      memoStatus: query.memoStatus,
      page: query.page - 1,
      size: query.size
    }
  })
}

/* 新增 */
export function createMemo(memo) {
  return request({
    url: '/api/urpMemo/create',
    method: 'post',
    data: {
      memoName: memo.memoName,
      memoType: memo.memoType,
      unionNum: memo.unionNum,
      memoStatus: memo.memoStatus,
      fileCode: memo.fileCode,
      signDate: memo.signDate,
      initiateDept: memo.initiateDept,
      initiateDeptName: memo.initiateDeptName,
      departs: memo.departs,
      measures: memo.measures
    }
  })
}

/* 修改 */
export function modifyMemo(memo) {
  return request({
    url: '/api/urpMemo/modify',
    method: 'post',
    data: {
      id: memo.id,
      memoName: memo.memoName,
      memoType: memo.memoType,
      unionNum: memo.unionNum,
      memoStatus: memo.memoStatus,
      fileCode: memo.fileCode,
      signDate: memo.signDate,
      initiateDept: memo.initiateDept,
      initiateDeptName: memo.initiateDeptName,
      departs: memo.departs,
      measures: memo.measures
    }
  })
}

/* 删除 */
export function removeMemo(memo) {
  return request({
    url: '/api/urpMemo/remove',
    method: 'post',
    params: {
      id: memo.id
    }
  })
}

/* 备忘录部门树列表（修改界面已选择的联合部门树) */
export function getModifyUrpDeparts(memoId) {
  return request({
    url: '/api/urpMemo/departs',
    method: 'get',
    params: { memoId }
  })
}

/* 根据备忘录和部门查询对应的措施列表 memoId 可选 不填表示新增时的列表 */
export function deptMeasuresMap(memoId) {
  return request({
    url: '/api/urpMemo/measures',
    method: 'get',
    params: { memoId }
  })
}

/* 批量接收 */
export function receiveAll(memoId) {
  return request({
    url: '/api/urpMemo/receiveAll',
    method: 'post',
    params: { memoId }
  })
}
