// 参数类型
import request from '../request'

/* 获取参数类型树 */
export function getTypeTree(typeCode) {
  return request({
    url: '/management/confType/tree',
    method: 'get',
    params: {
      typeCode: typeCode
    }
  })
}

/* 获取所有类别列表 */
export function getTypeList(query) {
  return request({
    url: '/management/confType/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      typeName: query.typeName,
      typeCode: query.typeCode,
      parentId: query.parentId,
      sort: 'sortNum,asc'
    }
  })
}

/* 新增类别信息 */
export function createType(type) {
  return request({
    url: '/management/confType/create',
    method: 'post',
    data: {
      parentId: type.parentId,
      typeName: type.typeName,
      typeCode: type.typeCode,
      sortNum: type.sortNum,
      desc: type.desc
    }
  })
}

/* 修改类别信息 */
export function modifyType(type) {
  return request({
    url: '/management/confType/modify',
    method: 'post',
    data: {
      id: type.id,
      parentId: type.parentId,
      typeName: type.typeName,
      typeCode: type.typeCode,
      sortNum: type.sortNum,
      desc: type.desc
    }
  })
}

/* 删除类别 */
export function removeType(type) {
  return request({
    url: '/management/confType/remove',
    method: 'post',
    params: {
      id: type.id
    }
  })
}

/* 类别名称是否唯一 */
export function oneTypeName(type) {
  return request({
    url: '/management/confType/checkTypeName',
    method: 'get',
    params: {
      id: type.id || '',
      typeName: type.typeName
    }
  })
}

/* 类别编码是否唯一 */
export function oneTypeCode(type) {
  return request({
    url: '/management/confType/checkTypeCode',
    method: 'get',
    params: {
      id: type.id || '',
      typeCode: type.typeCode
    }
  })
}
