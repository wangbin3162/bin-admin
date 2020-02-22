// 部门管理相关请求
import request from '../request'

/* 获取部门树 */
export function getDeptTree() {
  return request({
    url: '/management/depart/tree',
    method: 'get'
  })
}

/* 获取所有部门列表 */
export function getDeptList(query) {
  const data = new URLSearchParams()
  data.append('size', query.size)
  data.append('page', query.page - 1)
  data.append('departName', query.departName)
  data.append('status', query.status)
  data.append('parentId', query.parentId)
  data.append('sort', 'sortNum,asc')
  data.append('sort', 'createDate,desc')
  return request({
    url: '/management/depart/search',
    method: 'get',
    params: data
  })
}

/* 新增部门信息 */
export function createDept(depart) {
  return request({
    url: '/management/depart/create',
    method: 'post',
    data: {
      parentId: depart.parentId,
      departName: depart.departName,
      departKind: depart.departKind,
      regionId: depart.regionId,
      sortNum: depart.sortNum,
      unifiedCode: depart.unifiedCode,
      fullName: depart.fullName,
      remark: depart.remark
    }
  })
}

/* 修改部门信息 */
export function modifyDept(depart) {
  return request({
    url: '/management/depart/modify',
    method: 'post',
    data: {
      id: depart.id,
      parentId: depart.parentId,
      departName: depart.departName,
      departKind: depart.departKind,
      regionId: depart.regionId,
      sortNum: depart.sortNum,
      unifiedCode: depart.unifiedCode,
      fullName: depart.fullName,
      remark: depart.remark
    }
  })
}

/* 启用禁用部门信息 */
export function changeStatus(depart) {
  let data = [depart.id]
  return request({
    url: '/management/depart/changeStatus',
    method: 'post',
    data,
    params: {
      status: depart.status
    }
  })
}

/* 删除部门信息 */
export function removeDepart(depart) {
  return request({
    url: '/management/depart/remove',
    method: 'post',
    params: {
      id: depart.id
    }
  })
}

/* 部门名称是否唯一 */
export function oneDeptName(depart) {
  return request({
    url: '/management/depart/checkDepartName',
    method: 'get',
    params: {
      id: depart.id || '',
      departName: depart.departName,
      parentId: depart.parentId
    }
  })
}

/* 部门编码是否唯一 */
export function oneDeptCode(depart) {
  return request({
    url: '/management/depart/checkDepartCode',
    method: 'get',
    params: {
      id: depart.id || '',
      departCode: depart.departCode
    }
  })
}

/* 统一社会信用代码是否唯一 */
export function oneDeptUnified(depart) {
  return request({
    url: '/management/depart/checkUnifiedCode',
    method: 'get',
    params: {
      id: depart.id || '',
      unifiedCode: depart.unifiedCode
    }
  })
}

/* 下载部门模板 */
export function downloadDepartTemplate() {
  return request.get('/management/depart/downloadDepartTemplate', {
    responseType: 'blob'
  })
}
