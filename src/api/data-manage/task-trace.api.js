// 自动归集
import request from '../request'

/* 查询自动归集列表 */
export function getAutoCollectList(query) {
  return request({
    url: '/api/batch/db/searchAutoCollect',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceName: query.resourceName,
      cfgName: query.cfgName,
      availableStatus: query.availableStatus
    }
  })
}

/* 查询执行记录列表列表 */
export function getDirBatchList(query) {
  return request({
    url: '/api/batch/db/searchDirBatch',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceKey: query.resourceKey,
      cfgDetailId: query.cfgDetailId,
      beginTime: query.dateRange[0] || '',
      endTime: query.dateRange[1] || '',
      status: query.jobStatus
    }
  })
}

/* 分页查询执行记录详情 */
export function queryDirBatchInfo(batchInfoId, cfgDetailId) {
  return request({
    url: '/api/batch/db/queryDirBatchInfo',
    method: 'get',
    params: {
      batchInfoId,
      cfgDetailId
    }
  })
}

/* 下载批处理错误数据 */
export function downloadError(id) {
  return request({
    url: '/api/batch/db/downloadError',
    method: 'get',
    responseType: 'blob',
    params: { id }
  })
}
