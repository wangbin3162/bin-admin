// 节点管理
import request from '../request'

/* 分页查询节点信息 */
export function getExchangeNodeList(query) {
  return request({
    url: '/api/dir/exchange/node/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      nodeName: query.nodeName,
      nodeType: query.nodeType
    }
  })
}

/* 查询节点详情信息 */
export function getNodeDetail(id) {
  return request({
    url: '/api/dir/exchange/node/detail',
    method: 'get',
    params: {
      id
    }
  })
}

/* 获取默认节点 */
export function getDefaultNode() {
  return request({
    url: '/api/dir/exchange/node/default',
    method: 'get'
  })
}

/* 增加数据源信息 */
export function createNode(node) {
  return request({
    url: '/api/dir/exchange/node/create',
    method: 'post',
    params: {
      nodeName: node.nodeName,
      nodeCode: node.nodeCode,
      nodeType: node.nodeType,
      nodeDesc: node.nodeDesc,
      infoSource: node.infoSource
    }
  })
}

/* 修改类目信息 */
export function modifyNode(node) {
  // 修改时不能更换父级和类目编码
  return request({
    url: '/api/dir/exchange/node/modify',
    method: 'post',
    params: {
      id: node.id,
      nodeName: node.nodeName,
      nodeCode: node.nodeCode,
      nodeType: node.nodeType,
      nodeDesc: node.nodeDesc,
      infoSource: node.infoSource
    }
  })
}

/* 删除类目 */
export function removeNode(id) {
  return request({
    url: '/api/dir/exchange/node/delete',
    method: 'post',
    params: {
      id
    }
  })
}
