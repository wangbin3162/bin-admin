// 数据源管理
import request from '../request'

/* 3.8.3 分页查询数据源信息 */
export function getDataSourceList(query) {
  return request({
    url: '/api/dir/exchange/ds/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      dataSourceName: query.dataSourceName,
      dbType: query.dbType
    }
  })
}

/* 3.8.4 查询数据源详情信息 */
export function linkCheck(ds) {
  return request({
    url: '/api/dir/exchange/ds/check',
    method: 'post',
    params: {
      dbName: ds.dbName,
      dbType: ds.dbType,
      driverClass: ds.driverClass,
      host: ds.host,
      port: ds.port,
      userName: ds.userName,
      password: ds.password
    }
  })
}

/* 3.8.4 查询数据源详情信息 */
export function getDsDetail(id) {
  return request({
    url: '/api/dir/exchange/ds/detail',
    method: 'get',
    params: {
      id
    }
  })
}

/* 3.8.1 增加数据源信息 */
export function createDs(ds) {
  return request({
    url: '/api/dir/exchange/ds/create',
    method: 'post',
    params: {
      dataSourceName: ds.dataSourceName,
      dbName: ds.dbName,
      dbType: ds.dbType,
      driverClass: ds.driverClass,
      host: ds.host,
      port: ds.port,
      userName: ds.userName,
      password: ds.password
    }
  })
}

/* 修改类目信息 */
export function modifyDs(ds) {
  // 修改时不能更换父级和类目编码
  return request({
    url: '/api/dir/exchange/ds/modify',
    method: 'post',
    params: {
      id: ds.id,
      dataSourceName: ds.dataSourceName,
      dbName: ds.dbName,
      dbType: ds.dbType,
      driverClass: ds.driverClass,
      host: ds.host,
      port: ds.port,
      userName: ds.userName,
      password: ds.password
    }
  })
}

/* 删除类目 */
export function removeDs(id) {
  return request({
    url: '/api/dir/exchange/ds/delete',
    method: 'post',
    params: {
      id
    }
  })
}

/* 3.8.6 获取数据源库表列表信息 */
export function getTables(dsId) {
  return request({
    url: '/api/dir/exchange/ds/getTables',
    method: 'get',
    params: {
      dsId
    }
  })
}

/* 3.8.7 获取数据源库表字段列表信息 */
export function getTablesFields(dsId, tableName) {
  return request({
    url: '/api/dir/exchange/ds/getColumns',
    method: 'get',
    params: {
      dsId, tableName
    }
  })
}
