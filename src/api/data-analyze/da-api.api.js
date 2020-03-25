// api管理
import request from '../request'

/* 获取所有列表 */
export function getApiList(query) {
  return request.get('/da/api/list', {
    params: {
      size: query.size,
      page: query.page - 1,
      name: query.name,
      code: query.code,
      sort: 'createDate,desc'
    }
  })
}

/* 获取明细 */
export function getApiDetail(id) {
  return request.get('/da/api/daApiDetail', {
    params: {
      id: id
    }
  })
}

/* 新增api */
export function createApi(item) {
  return request({
    url: '/da/api/addDaApi',
    method: 'post',
    data: {
      name: item.name,
      type: item.type,
      url: item.url,
      describe: item.describe,
      tempId: item.tempId,
      sql: item.sql,
      recordType: item.recordType,
      daParameters: item.daParameters
    }
  })
}

/* 修改api */
export function modifyApi(item) {
  return request({
    url: '/da/api/modifyDaApi',
    method: 'post',
    data: {
      id: item.id,
      name: item.name,
      type: item.type,
      url: item.url,
      describe: item.describe,
      tempId: item.tempId,
      sql: item.sql,
      recordType: item.recordType,
      daParameters: item.daParameters
    }
  })
}

/* 删除api */
export function removeApi(item) {
  return request({
    url: '/da/api/removeDaApi',
    method: 'post',
    params: {
      id: item.id
    }
  })
}
