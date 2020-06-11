import request from '../request'

/* 获取部门树 */
export function getDeptTree() {
  return request({
    url: '/api/urpDepart/tree',
    method: 'get'
  })
}

/* 获取所有部门列表 */
export function getDeptList(query) {
  return request({
    url: '/api/urpDepart/search',
    method: 'get',
    params: {
      parentId: query.parentId,
      name: query.name,
      page: query.page - 1,
      size: query.size
    }
  })
}

/* 新增部门信息 */
export function createDept(depart) {
  return request({
    url: '/api/urpDepart/create',
    method: 'post',
    data: {
      parent: depart.parentId,
      departId: depart.id,
      name: depart.departName,
      departLevel: depart.departLevel,
      fullName: depart.fullName
    }
  })
}

/* 删除部门信息 */
export function removeDepart(depart) {
  return request({
    url: '/api/urpDepart/remove',
    method: 'post',
    params: {
      id: depart.id
    }
  })
}
