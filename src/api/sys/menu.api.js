// 部门管理相关请求
import request from '../request'

/* 获取菜单树 */
export function getMenuTree() {
  return request({
    url: '/management/function/tree',
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
      path: menu.path,
      sortNum: menu.sortNum,
      permissions: menu.permissions
    }
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
