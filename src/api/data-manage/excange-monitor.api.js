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

/* 1.1.4分页查询交换任务列表 */
export function getExchangeList(query) {
  return request({
    url: '/api/dir/exchange/monitor/tasksByPlan',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      planId: query.planId,
      taskName: query.taskName,
      jobStatus: query.jobStatus
    }
  })
}

/* 1.1.5分页查询作业执行列表 */
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

/* 1.1.6获取作业执行明细 */
export function queryDirBatchInfo(jobId) {
  return request({
    url: '/api/dir/exchange/monitor/job',
    method: 'get',
    params: {
      jobId
    }
  })
}

/* 下载验证错误数据文件 */
export function downloadError(id) {
  return request({
    url: '/api/dir/exchange/monitor/downloadError',
    method: 'get',
    responseType: 'blob',
    params: { id }
  })
}

/* 下载重复性数据文件 */
export function downloadRepeat(id) {
  return request({
    url: '/api/dir/exchange/monitor/downloadRepeat',
    method: 'get',
    responseType: 'blob',
    params: { id }
  })
}

/* 1.1.7执行作业清理 */
export function clearJob(jobId) {
  return request({
    url: '/api/dir/exchange/monitor/clearJob',
    method: 'get',
    params: {
      jobId
    }
  })
}

/* 1.1.8执行作业重启 */
export function restartJob(jobId) {
  return request({
    url: '/api/dir/exchange/monitor/restartJob',
    method: 'get',
    params: {
      jobId
    }
  })
}

/* 1.1.9执行手动任务启动 */
export function startTask(taskId) {
  return request({
    url: '/api/dir/exchange/monitor/startTask',
    method: 'get',
    params: {
      taskId
    }
  })
}
