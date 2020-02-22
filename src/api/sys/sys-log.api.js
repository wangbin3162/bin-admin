// 系统日志管理相关请求
import request from '../request'

/* 获取所有列表 */
export function getLogList(query) {
  return request.get('/management/log/search', {
    params: {
      size: query.size,
      page: query.page - 1,
      operateName: query.operateName,
      sort: 'operateDate,desc'
    }
  })
}
