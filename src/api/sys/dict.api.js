// 系统日志管理相关请求
import request from '../request'

/* 获取所有字典组列表 */
export function getDictGroupList(query) {
  return request({
    url: '/management/dict/group/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      groupName: query.groupName,
      groupCode: query.groupCode,
      sort: 'createDate,desc'
    }
  })
}

/* 新增字典组 */
export function createDictGroup(dict) {
  const data = {
    groupName: dict.groupName,
    groupCode: dict.groupCode,
    dictType: dict.dictType
  }
  return request({
    url: '/management/dict/group/create',
    method: 'post',
    data
  })
}

/* 修改字典组 */
export function modifyDictGroup(dict) {
  const data = {
    id: dict.id,
    groupName: dict.groupName,
    groupCode: dict.groupCode,
    dictType: dict.dictType
  }
  return request({
    url: '/management/dict/group/modify',
    method: 'post',
    data
  })
}

/* 删除字典组 */
export function removeDictGroup(dict) {
  return request({
    url: '/management/dict/group/remove',
    method: 'post',
    params: {
      id: dict.id
    }
  })
}

/* 字典组名称唯一 */
export function oneGroupName(dict) {
  return request({
    url: '/management/dict/group/checkNameExists',
    method: 'get',
    params: {
      id: dict.id || '',
      groupName: dict.groupName
    }
  })
}

/* 字典编码称唯一 */
export function oneGroupCode(dict) {
  return request({
    url: '/management/dict/group/checkCodeExists',
    method: 'get',
    params: {
      id: dict.id || '',
      groupCode: dict.groupCode
    }
  })
}

/* 获取所有字典项列表 */
export function getItemList(query) {
  const data = new URLSearchParams()
  data.append('size', query.size)
  data.append('page', query.page - 1)
  data.append('groupId', query.groupId)
  data.append('itemName', query.itemName)
  data.append('itemCode', query.itemCode)
  data.append('sort', 'sortNum,asc')
  data.append('sort', 'createDate,desc')
  return request({
    url: '/management/dict/item/search',
    method: 'get',
    params: data
  })
}

/* 新增字典项 */
export function createDictItem(item) {
  const data = {
    groupId: item.groupId,
    itemName: item.itemName,
    itemCode: item.itemCode,
    sortNum: item.sortNum
  }
  return request({
    url: '/management/dict/item/create',
    method: 'post',
    data
  })
}

/* 修改字典项 */
export function modifyDictItem(item) {
  const data = {
    id: item.id,
    itemName: item.itemName,
    itemCode: item.itemCode,
    sortNum: item.sortNum
  }
  return request({
    url: '/management/dict/item/modify',
    method: 'post',
    data
  })
}

/* 删除字典项 */
export function removeDictItem(item) {
  return request({
    url: '/management/dict/item/remove',
    method: 'post',
    params: {
      id: item.id
    }
  })
}

/* 字典项名称唯一 */
export function oneItemName(item) {
  return request({
    url: '/management/dict/item/checkNameExists',
    method: 'get',
    params: {
      id: item.id || '',
      groupId: item.groupId,
      itemName: item.itemName
    }
  })
}

/* 字典项编码唯一 */
export function oneItemCode(item) {
  return request({
    url: '/management/dict/item/checkCodeExists',
    method: 'get',
    params: {
      id: item.id || '',
      groupId: item.groupId,
      itemCode: item.itemCode
    }
  })
}
