// 用户管理相关请求
import request from '../request'

/**
 * @description 获取等级标准列表。
 * @param { object } query 查询参数
 * @author haodongdong
 */
export function getLevelRatingList(query) {
  return request({
    url: '/management/user/search',
    method: 'get',
    params: {
      ratingName: query.ratingName,
      size: query.size,
      page: query.page - 1,
      sort: 'createDate,desc'
    }
  })
}
