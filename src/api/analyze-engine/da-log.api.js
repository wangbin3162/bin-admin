// 调用日志
import request from '../request'

// 业务类型枚举
export function getLogType() {
  return request.get('/da/enum/logType')
}

// 请求方法类型枚举
export function getMethodType() {
  return request.get('/da/enum/methodType')
}

/* 获取所有列表 */
export function getLogList(query) {
  return request.get('/da/log/search', {
    params: {
      size: query.size,
      page: query.page - 1,
      requestMethod: query.requestMethod,
      bizType: query.bizType,
      startDateTime: query.startDateTime,
      endDateTime: query.endDateTime
    }
  })
}
