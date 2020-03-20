// 元信息管理
import request from '../request'

/* 获取元信息列表 */
export function getMetadataList(query) {
  return request({
    url: '/api/dir/metadata/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      tableName: query.tableName, // 类目编码
      metadataName: query.metadataName,
      metadataCode: query.metadataCode,
      status: query.status,
      sort: 'metadataKey,desc'
    }
  })
}

/* 1.1.1查询多主体字段 */
export function queryMultiPersonFields() {
  return request({
    url: '/api/dir/metadata/queryMultiPersonFields',
    method: 'get'
  })
}

/* 获取主体类别树 */
export function getPersonClassTree() {
  return request({
    url: '/api/dir/classify/tree',
    method: 'get',
    params: {
      code: 'A'
    }
  })
}

/* 根据主体类别查询基础信息项 */
export function queryManageFields(personClass, classifyCode) {
  return request({
    url: '/api/dir/metadata/queryManageFields',
    method: 'get',
    params: {
      personClass, classifyCode
    }
  })
}

/* 中文名称是否唯一 */
export function oneMetaName(metadata) {
  return request({
    url: '/api/dir/metadata/checkMetaNameExists',
    method: 'get',
    params: {
      id: metadata.id || '',
      metadataName: metadata.metadataName,
      metadataKey: metadata.metadataKey
    }
  })
}

/* 英文名称是否唯一 */
export function oneTableName(metadata) {
  return request({
    url: '/api/dir/metadata/checkTableExists',
    method: 'get',
    params: {
      id: metadata.id || '',
      tableName: metadata.tableName
    }
  })
}

/* 检查信息项名称合法性 */
export function checkFieldName(personClass, fieldName) {
  return request({
    url: '/api/dir/metadata/field/checkFieldNameIllegal',
    method: 'get',
    params: {
      personClass,
      fieldName
    }
  })
}

/* 获取资源标识符 */
export function getBizKey() {
  return request({
    url: '/api/dir/metadata/getBizKey',
    method: 'get'
  })
}

/* 新增元信息 */
export function createMetadata(metadata) {
  // 过滤系统信息项,且不是多主体扩展项
  let fields = metadata.fields
    .filter(item => (!item.status || item.idsFlag))
    .map((item, index) => {
      return { ...item, fieldSort: index }
    })
  return request({
    url: '/api/dir/metadata/create',
    method: 'post',
    data: {
      metadataCode: metadata.metadataCode,
      tableName: metadata.tableName,
      metadataName: metadata.metadataName,
      personClass: metadata.personClass,
      metadataDesc: metadata.metadataDesc,
      metadataKey: metadata.metadataKey,
      idsFlag: metadata.idsFlag,
      versionNo: metadata.versionNo,
      fields: fields
    }
  })
}

/* 删除元信息 */
export function removeMetadata(metadata) {
  return request({
    url: '/api/dir/metadata/remove',
    method: 'post',
    params: {
      id: metadata.id
    }
  })
}

/* 修改元信息 */
export function modifyMetadata(metadata) {
  // 过滤系统信息项,且不是多主体扩展项
  let fields = metadata.fields
    .filter(item => (!item.status || item.idsFlag))
    .map((item, index) => {
      return { ...item, fieldSort: index }
    })
  return request({
    url: '/api/dir/metadata/modify',
    method: 'post',
    data: {
      id: metadata.id,
      metadataCode: metadata.metadataCode,
      tableName: metadata.tableName,
      metadataName: metadata.metadataName,
      personClass: metadata.personClass,
      metadataDesc: metadata.metadataDesc,
      metadataKey: metadata.metadataKey,
      idsFlag: metadata.idsFlag,
      fields: fields
    }
  })
}

/* 根据ID元信息fields */
export function getFieldsByID(id) {
  return request({
    url: '/api/dir/metadata/queryById',
    method: 'get',
    params: {
      id
    }
  })
}

/* 发布元信息 */
export function publishMetadata(metadata) {
  return request({
    url: '/api/dir/metadata/publish',
    method: 'post',
    params: {
      id: metadata.id
    }
  })
}

/* 检查信息项全局只能存在同一种数据类型 */
export function checkFieldTypeNotUnique(fieldName, fieldType) {
  return request({
    url: '/api/dir/metadata/field/checkFieldTypeNotUnique',
    method: 'get',
    params: {
      fieldName,
      fieldType
    }
  })
}
