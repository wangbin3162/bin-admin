// 交换方案管理
import request from '../request'

/* 交换配置方案树 */
export function getExchangeTree() {
  return request({
    url: '/api/dir/exchange/tree',
    method: 'get'
  })
}

/* 查询交换方案列表 */
export function getSchemeList(query) {
  return request({
    url: '/api/dir/exchange/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      cfgName: query.cfgName,
      flowDirection: query.flowDirection,
      changeType: query.changeType,
      status: query.status,
      transmitKind: query.transmitKind
    }
  })
}

/* 启用禁用方案 */
export function changeStatus(scheme) {
  return request({
    url: '/api/dir/exchange/modifyDetail',
    method: 'post',
    params: {
      id: scheme.id,
      status: scheme.status
    }
  })
}

/* 增加方案信息 */
export function createScheme(scheme) {
  return request({
    url: '/api/dir/exchange/create',
    method: 'post',
    params: {
      cfgName: scheme.cfgName,
      cfgCode: scheme.cfgCode,
      flowDirection: scheme.flowDirection,
      exchangeType: scheme.exchangeType,
      transmitKind: scheme.transmitKind,
      source: scheme.source,
      target: scheme.target,
      cronStr: scheme.cronStr
    }
  })
}

/* 修改方案信息 */
export function modifyScheme(scheme) {
  return request({
    url: '/api/dir/exchange/modify',
    method: 'post',
    params: {
      id: scheme.id,
      cfgName: scheme.cfgName,
      cfgCode: scheme.cfgCode,
      flowDirection: scheme.flowDirection,
      exchangeType: scheme.exchangeType,
      transmitKind: scheme.transmitKind,
      source: scheme.source,
      target: scheme.target,
      cronStr: scheme.cronStr
    }
  })
}

/* 删除方案 */
export function removeScheme(id) {
  return request({
    url: '/api/dir/exchange/delete',
    method: 'post',
    params: {
      id
    }
  })
}
