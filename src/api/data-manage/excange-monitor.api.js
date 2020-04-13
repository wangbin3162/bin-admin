/* 获取交换配置树 */
import request from '../request'

/* 1.1.1获取交换配置方案树 */
export function getExchangePlanTree() {
  return request({
    url: '/api/dir/exchange/monitor/planTree',
    method: 'get'
  })
}

/* 1.1.2获取全局方案运行概览分析 */
export function getExchangeAnalysis(code, id) {
  return request({
    url: '/api/dir/exchange/analysis/' + (code === 'root' ? 'all' : 'plan'),
    method: 'get',
    params: {
      planId: code === 'root' ? null : id
    }
  })
}

/* 查询自动归集列表 */
export function getExchangeList(query) {
  return request({
    url: '/api/dir/exchange/monitor/tasksByPlan',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      planId: query.planId,
      taskName: query.taskName,
      availableStatus: query.availableStatus
    }
  })
}

/* 查询执行记录列表列表 */
export function getJobsByTask(query) {
  return request({
    url: '/api/dir/exchange/monitor/jobsByTask',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      taskId: query.taskId,
      createDate: query.dateRange[0] || '',
      finishDate: query.dateRange[1] || '',
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
