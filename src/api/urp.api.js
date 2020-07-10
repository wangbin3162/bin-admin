import request from './request'

/* 首页查询联合奖惩相关数量 */
export function getUrpCounts() {
  let memoCount = request.get('/api/urpAnalysis/memoCount')
  let jlCount = request.get('/api/urpAnalysis/jlCount')
  let cfCount = request.get('/api/urpAnalysis/cfCount')
  let departCount = request.get('/api/urpAnalysis/departCount')
  let measureCount = request.get('/api/urpAnalysis/measureCount')
  let requests = [memoCount, jlCount, cfCount, departCount, measureCount]
  return new Promise((resolve, reject) => {
    Promise.all(requests).then(res => {
      resolve({
        count1: res[0].data.code === '0' ? res[0].data.data : '',
        count2: res[1].data.code === '0' ? res[1].data.data : '',
        count3: res[2].data.code === '0' ? res[2].data.data : '',
        count4: res[3].data.code === '0' ? res[3].data.data : '',
        count5: res[4].data.code === '0' ? res[4].data.data : ''
      })
    }).catch(error => reject(new Error(error.message || '条数统计获取失败')))
  })
}

/* 模糊查询主体列表 */
export function getUrpList(query) {
  return request({
    url: '/api/urpService/list',
    method: 'post',
    data: {
      keyword: query.keyword,
      type: query.type
    }
  })
}

/* 备忘录列表 */
export function getMemoList(query) {
  return request({
    url: '/api/urpMemo/search',
    method: 'get',
    params: {
      memoName: query.memoName,
      memoType: query.memoType,
      page: query.page - 1,
      size: query.size
    }
  })
}

/* 备忘录详情 */
export function getMemoDetail(memoId) {
  return request({
    url: 'api/urpService/memoDetail',
    method: 'get',
    params: { memoId }
  })
}

/* 执行记录总览 */
export function getListResultCount() {
  return request({
    url: 'api/urpService/history',
    method: 'get'
  })
}

/* 惩戒激励记录列表 */
export function getListResult(query) {
  return request({
    url: 'api/urp/listResult/search',
    method: 'get',
    params: {
      name: query.name,
      idCode: query.idCode,
      page: query.page - 1,
      size: query.size
    }
  })
}

/* 获取备注列表 */
export function getRemarkList(query) {
  return request({
    url: 'api/urpService/remarks',
    method: 'get',
    params: {
      subjectId: query.subjectId,
      page: query.page - 1,
      size: query.size
    }
  })
}

/* 修改备注 */
export function remarkEdit(remark) {
  return request({
    url: 'api/urpService/remarkEdit',
    method: 'post',
    data: {
      subjectId: remark.subjectId,
      optType: remark.optType,
      remark: remark.remark,
      level: remark.level,
      id: remark.id,
      isShare: remark.isShare
    }
  })
}

/* 撤销记录 */
export function cancelResult(obj) {
  let { recordId, cancelReason } = obj
  return request({
    url: '/api/urpService/cancel',
    method: 'post',
    data: {
      recordId, cancelReason
    }
  })
}

/* 查询执行反馈详情 */
export function getFeedbackDetail(query) {
  let apis = [getSubjectDetail(query), getUrpMeasures(query)]
  return new Promise((resolve, reject) => {
    Promise.all(apis).then(res => {
      resolve({
        detail: res[0].data.code === '0' ? res[0].data.data.detail : null,
        memos: res[1].data.code === '0' ? res[1].data.data.memos : []
      })
    }).catch(error => reject(new Error(error.message || '查询执行反馈详情失败')))
  })
}

/* 执行反馈接口 */
export function doFeedback(query) {
  let { id, memoId, explain, measureIds } = query
  return request({
    url: 'api/urpService/feedback',
    method: 'post',
    data: { id, memoId, requestSource: '1', explain, measureIds }
  })
}

/* 查询主体信息 */
export function getSubjectDetail(obj) {
  let { subjectId, type } = obj
  return request({
    url: 'api/urpService/subjectDetail',
    method: 'post',
    data: {
      subjectId, type
    }
  })
}

/* 获取奖惩措施 */
function getUrpMeasures(query) {
  let { subjectId, type, memoType, refId } = query
  return request({
    url: 'api/urpService/query',
    method: 'post',
    data: { subjectId, type, memoType, refId }
  })
}

/* 打印 */
export function print(recordId) {
  return request({
    url: '/api/urpService/print',
    method: 'post',
    responseType: 'blob',
    params: { recordId }
  })
}
