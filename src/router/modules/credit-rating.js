/**
 * 信用评级路由
 */

export default [
  {
    path: 'indexVar',
    name: 'IndexVar',
    component: () => import(/* webpackChunkName: "indexVar" */ '../../pages/credit-rating/index-var'),
    meta: { title: '指标变量' }
  },
  {
    path: 'indexManage',
    name: 'IndexManage',
    component: () => import(/* webpackChunkName: "indexManage" */ '../../pages/credit-rating/index-manage'),
    meta: { title: '指标管理' }
  },
  {
    path: 'levelStandard',
    name: 'LevelStandard',
    component: () => import(/* webpackChunkName: "levelStandard" */ '../../pages/credit-rating/level-standard'),
    meta: { title: '等级标准' }
  },
  {
    path: 'ratingModel',
    name: 'RatingModel',
    component: () => import(/* webpackChunkName: "ratingModel" */ '../../pages/credit-rating/rating-model'),
    meta: { title: '评级模型' }
  },

  {
    path: 'legal',
    name: 'Legal',
    component: () => import(/* webpackChunkName: "legal" */ '../../pages/credit-rating/model-count/legal'),
    meta: { title: '法人和其他组织' }
  },
  {
    path: 'natural',
    name: 'Natural',
    component: () => import(/* webpackChunkName: "natural" */ '../../pages/credit-rating/model-count/natural'),
    meta: { title: '自然人' }
  },

  {
    path: 'creditReport',
    name: 'CreditReport',
    component: () => import(/* webpackChunkName: "creditReport" */ '../../pages/credit-rating/credit-report-config'),
    meta: { title: '信用报告配置' }
  }
]
