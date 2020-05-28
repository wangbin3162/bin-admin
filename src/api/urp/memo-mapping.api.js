/* 接收备忘录管理 */
import request from '../request'

/* 接收备忘录列表 */
export function getMemoMappingList(query) {
  return request({
    url: '/api/urp/memoMapping/search',
    method: 'get',
    params: {
      memoName: query.memoName,
      resourceName: query.memoType,
      page: query.page - 1,
      size: query.size
    }
  })
}

/* 增加映射 */
export function createMemo(mapping) {
  return request({
    url: '/api/urp/memoMapping/create',
    method: 'post',
    data: {
      memoId: mapping.memoId,
      memoName: mapping.memoName,
      resourceKey: mapping.resourceKey,
      resourceName: mapping.resourceName,
      personClass: mapping.personClass,
      ifcTagName: mapping.ifcTagName,
      isSys: mapping.isSys
    }
  })
}

/* 修改映射 */
export function modifyMemo(mapping) {
  return request({
    url: '/api/urp/memoMapping/modify',
    method: 'post',
    data: {
      id: mapping.id,
      memoId: mapping.memoId,
      memoName: mapping.memoName,
      resourceKey: mapping.resourceKey,
      resourceName: mapping.resourceName,
      personClass: mapping.personClass,
      ifcTagName: mapping.ifcTagName,
      isSys: mapping.isSys
    }
  })
}

/* 删除映射 */
export function removeMapping(id) {
  return request({
    url: '/api/urp/memoMapping/remove',
    method: 'post',
    params: {
      id
    }
  })
}
