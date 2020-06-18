// 信用档案查询相关接口文件
import request from './request'

/**
 * 信用档案查询原因
 */
export function queryReason() {
  return request({
    url: '/api/docs/queryByGroupCode?groupCode=queryReason',
    method: 'get'
  })
}

/**
 * 获取查询结果列表
 */
export function getSearchList(listQuery) {
  return request({
    url: '/api/docs/search',
    method: 'get',
    params: {
      q: listQuery.q,
      type: listQuery.type,
      page: listQuery.page - 1,
      size: listQuery.size
    }
  })
}

/**
 * 根据id和类型查询档案详情
 */
export function getDetail(id, type, reason) {
  return request({
    url: '/api/docs/detail',
    method: 'get',
    params: {
      id, type, reason
    }
  })
}

/**
 * 获取正负面信息统计次数
 */
export function getPnAggs(personId, type) {
  return request({
    url: '/api/docs/pn/aggs',
    method: 'get',
    params: {
      personId, type
    }
  })
}

/**
 * 自然人、法人或其他组织正负面信息资源统计接口
 */
export function getPnStat(personId, type, pnType) {
  return request({
    url: '/api/docs/pn/stat',
    method: 'get',
    params: {
      personId, type, pnType
    }
  })
}

/**
 * 获取7大类别tab
 */
export function getAggs(personId, type, categoryType) {
  return request({
    url: '/api/docs/aggs',
    method: 'get',
    params: {
      personId, type, categoryType
    }
  })
}

/**
 * 指定类别下的资源信息接口
 */
export function getClassifyStat(personId, type, classifyCode, categoryType) {
  return request({
    url: '/api/docs/classify/stat',
    method: 'get',
    params: {
      personId, type, classifyCode, categoryType
    }
  })
}

/**
 * 获取资源信息列表
 */
export function getQueryList(listQuery, categoryType) {
  return request({
    url: '/api/docs/query/list',
    method: 'get',
    params: {
      personId: listQuery.personId,
      resourceKey: listQuery.resourceKey,
      type: listQuery.type,
      page: listQuery.page - 1,
      size: listQuery.size,
      categoryType: categoryType
    }
  })
}

/**
 * 获取资源信息列表详情
 */
export function getQueryDetail(id, resourceKey, type, categoryType) {
  return request({
    url: '/api/docs/query/detail',
    method: 'get',
    params: {
      id, resourceKey, type, categoryType
    }
  })
}

/**
 * 法人或其他组织法定代表人所属公司列表查询接口
 */
export function getCompList(fddbr, type) {
  return request({
    url: '/api/docs/compList',
    method: 'get',
    params: {
      fddbr, type
    }
  })
}

/**
 * 统计企业股权接口
 */
export function getStockRightStat(personId) {
  return request({
    url: '/api/docs/stockRightStat',
    method: 'get',
    params: {
      personId
    }
  })
}

/**
 * 资源信息查询日志接口
 */
export function getQueryLogs(personId, page) {
  return request({
    url: '/api/docs/query/log',
    method: 'get',
    params: {
      personId,
      page: page - 1,
      size: 5
    }
  })
}

/**
 * 下载信用报告
 */
export function downloadPdf(personId, personClass) {
  return request({
    url: '/api/eval/pdf/create',
    method: 'post',
    responseType: 'blob',
    data: {
      personId,
      personClass
    }
  })
}
