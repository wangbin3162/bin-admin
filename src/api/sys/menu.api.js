// 部门管理相关请求
import request from '../request'

/* 获取菜单树 */
export function getMenuTree() {
  return request({
    url: '/management/function/tree',
    method: 'get'
  })
}

/* 获取权限菜单树 */
export function getMenuByAuth() {
  return request({
    url: '/management/function/treeByAuthorize',
    method: 'get'
  })
}

/* 获取所有菜单列表 */
export function getMenuList(query) {
  const data = new URLSearchParams()
  data.append('size', query.size)
  data.append('page', query.page - 1)
  data.append('menuName', query.menuName)
  data.append('delFlag', query.delFlag)
  data.append('parentId', query.parentId)
  data.append('sort', 'sortNum,asc')
  data.append('sort', 'createDate,desc')
  return request({
    url: '/management/function/search',
    method: 'get',
    params: data
  })
}

/* 新增菜单信息 */
export function createMenu(menu) {
  return request({
    url: '/management/function/create',
    method: 'post',
    data: {
      parentId: menu.parentId,
      name: menu.name,
      type: menu.type,
      url: menu.url,
      icon: menu.icon,
      path: menu.path,
      sortNum: menu.sortNum,
      permissions: menu.permissions
    }
  })
}

/* 获取菜单详情 */
export function getMenuDetail(id) {
  return request({
    url: '/management/function/show',
    method: 'get',
    params: { id }
  })
}

/* 修改菜单信息 */
export function modifyMenu(menu) {
  return request({
    url: '/management/function/modify',
    method: 'post',
    data: {
      id: menu.id,
      parentId: menu.parentId,
      name: menu.name,
      type: menu.type,
      url: menu.url,
      icon: menu.icon,
      path: menu.path,
      sortNum: menu.sortNum,
      permissions: menu.permissions
    }
  })
}

/* 删除菜单 */
export function removeMenu(menu) {
  return request({
    url: '/management/function/remove',
    method: 'post',
    params: {
      id: menu.id
    }
  })
}

/* 启用禁用菜单信息 */
export function changeDelFlag(menu) {
  let data = [menu.id]
  return request({
    url: '/management/function/changeDelFlag',
    method: 'post',
    data,
    params: {
      yn: menu.delFlag
    }
  })
}

/* 同一父菜单下菜单名称是否唯一 */
export function oneMenuName(menu) {
  return request({
    url: '/management/function/checkMenuNameExists',
    method: 'get',
    params: {
      id: menu.id || '',
      menuName: menu.name,
      parentId: menu.parentId
    }
  })
}
