// 类目管理
import request from '../request'

/* 查询资源关联的部门信息 */
export function getSelectedDeptList(key) {
  return request({
    url: '/api/dir/depart/byResource',
    method: 'get',
    params: {
      resId: key
    }
  })
}

/* 查询部门关联的资源信息 */
export function getSelectedResList(key) {
  return request({
    url: '/api/dir/depart/byDepart',
    method: 'get',
    params: {
      departId: key
    }
  })
}

/* 查看部门详情 */
export function getIdDetail(query) {
  return request({
    url: '/api/dir/depart/byDepart',
    method: 'get',
    params: {
      id: query.id
    }
  })
}

/* 获取资源信息列表 */
export function getResInfoList(query) {
  return request({
    url: '/api/dir/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceCode: query.resourceCode,
      resourceName: query.resourceName,
      status: query.status,
      availableStatus: query.availableStatus,
      resProperty: query.resProperty
    }
  })
}

/* 获取资源信息列表 */
export function getRelateResInfoList(query) {
  return request({
    url: '/api/dir/depart/byDepart',
    method: 'get',
    params: {
      departId: query.departId
    }
  })
}

/* 获取部门未关联的资源信息列表 */
export function getNoRelateResInfoList(departId, dirClassifyId) {
  return request({
    url: '/api/dir/depart/noRelate',
    method: 'get',
    params: {
      departId: departId,
      dirClassifyId: dirClassifyId
    }
  })
}

/* 获取部门树 */
export function getDeptTree(departCode = '10000') {
  return request({
    url: '/management/depart/tree',
    method: 'get',
    params: {
      departCode: departCode
    }
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

/* 获取类目信息 */
export function getResClassifyTree(code = '') {
  return request({
    url: '/api/dir/classify/tree',
    method: 'get',
    params: {
      code: 'C'
    }
  })
}

/* 数源单位取消关联资源 */
export function postDisassociate(departId, resourceId) {
  return request({
    url: '/api/dir/depart/decResource',
    method: 'post',
    params: {
      departId,
      resourceId
    }
  })
}

/* 信源单位批量增加资源 */
export function postAddResources(departId, resourceList) {
  return request({
    url: '/api/dir/depart/addResources',
    method: 'post',
    params: {
      departId,
      resourceList
    }
  })
}

/* 资源部门分配 */
export function postAddDept(resId, departList) {
  return request({
    url: '/api/dir/depart/addDeparts',
    method: 'post',
    params: {
      resId,
      departList
    }
  })
}
