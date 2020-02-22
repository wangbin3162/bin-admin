// 角色管理相关请求
import request from '../request'

/* 获取所有角色列表 */
export function getRoleList(query) {
  return request({
    url: '/management/role/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      name: query.name,
      code: query.code,
      sort: 'createDate,desc'
    }
  })
}

/* 新增角色信息 */
export function createRole(role) {
  return request({
    url: '/management/role/create',
    method: 'post',
    data: {
      name: role.name,
      code: role.code,
      roleType: role.roleType,
      desc: role.desc,
      parentId: role.parentId
    }
  })
}

/* 修改角色信息 */
export function modifyRole(role) {
  return request({
    url: '/management/role/modify',
    method: 'post',
    data: {
      id: role.id,
      name: role.name,
      code: role.code,
      desc: role.desc,
      roleType: role.roleType,
      parentId: role.parentId
    }
  })
}

/* 删除角色 */
export function removeRole(role) {
  return request({
    url: '/management/role/remove',
    method: 'post',
    params: {
      id: role.id
    }
  })
}

/* 角色名称唯一 */
export function oneRoleName(role) {
  return request({
    url: '/management/role/checkNameExists',
    method: 'get',
    params: {
      id: role.id || '',
      roleName: role.name
    }
  })
}

/* 角色编码唯一 */
export function oneRoleCode(role) {
  return request({
    url: '/management/role/checkCodeExists',
    method: 'get',
    params: {
      id: role.id || '',
      roleCode: role.code
    }
  })
}

/* 获取权限树 */
export function getFuncTree() {
  return request({
    url: '/management/function/tree',
    method: 'get'
  })
}

/* 分页查询权限列表 */
export function getFuncList(query) {
  return request({
    url: '/management/role/function/queryFunctions',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      roleId: query.roleId,
      functionId: query.functionId,
      name: query.name,
      sort: 'sortNum'
    }
  })
}

/* 批量授权 */
export function createAuth(roleId, functionIds) {
  return request({
    url: '/management/role/function/batchCreate',
    method: 'post',
    data: functionIds, // id的数组
    params: {
      roleId: roleId
    }
  })
}

/* 批量取消授权 */
export function removeAuth(roleId, functionIds) {
  return request({
    url: '/management/role/function/batchRemove',
    method: 'post',
    data: functionIds, // id的数组
    params: {
      roleId: roleId
    }
  })
}
