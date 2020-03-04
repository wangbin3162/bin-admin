// 类目管理
import request from '../request'

/* 获取类目树 */
export function getClassifyTree(code = '') {
  return request({
    url: '/api/dir/classify/tree',
    method: 'get',
    params: {
      code
    }
  })
}

/* 获取类目树 */
export function getClassifyList(query) {
  return request({
    url: '/api/dir/classify/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      classifyName: query.classifyName,
      classifyCode: query.classifyCode,
      parentId: query.parentId,
      sort: 'createDate,desc'
    }
  })
}

/* 新增类目信息 */
export function createClassify(classify) {
  return request({
    url: '/api/dir/classify/create',
    method: 'post',
    data: {
      parentId: classify.parentId,
      classifyName: classify.classifyName,
      classifyCode: classify.classifyCode,
      classifyDesc: classify.classifyDesc
    }
  })
}

/* 修改类目信息 */
export function modifyClassify(classify) {
  // 修改时不能更换父级和类目编码
  return request({
    url: '/api/dir/classify/modify',
    method: 'post',
    data: {
      id: classify.id,
      classifyName: classify.classifyName,
      classifyDesc: classify.classifyDesc
    }
  })
}

/* 删除类目 */
export function removeClassify(classify) {
  return request({
    url: '/api/dir/classify/remove',
    method: 'post',
    params: {
      id: classify.id
    }
  })
}

/* 类目名称是否唯一 */
export function oneClassifyName(classify) {
  return request({
    url: '/api/dir/classify/checkNameExists',
    method: 'get',
    params: {
      id: classify.id || '',
      classifyName: classify.classifyName,
      parentId: classify.parentId || ''
    }
  })
}

/* 类目编码是否唯一 */
export function oneClassifyCode(classify) {
  return request({
    url: '/api/dir/classify/checkCodeExists',
    method: 'get',
    params: {
      id: classify.id || '',
      classifyCode: classify.classifyCode,
      parentId: classify.parentId || ''
    }
  })
}
