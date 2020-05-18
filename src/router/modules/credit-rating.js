import layout from '../../layout'

// 数据分析
export default {
  path: '/creditRating',
  component: layout,
  redirect: 'noRedirect',
  meta: {
    title: '信用评级',
    icon: 'ios-create'
  },
  children: [
    {
      path: 'indexVar',
      name: 'IndexVar',
      component: () => import(/* webpackChunkName: "IndexVar" */ '../../pages/credit-rating/index-var'),
      meta: {
        title: '指标变量'
      }
    },
    {
      path: 'indexManage',
      name: 'IndexManage',
      component: () => import(/* webpackChunkName: "IndexManage" */ '../../pages/credit-rating/index-manage'),
      meta: {
        title: '指标管理'
      }
    },
    {
      path: 'levelStandard',
      name: 'LevelStanDard',
      component: () => import(/* webpackChunkName: "LevelStanDard" */ '../../pages/credit-rating/level-standard'),
      meta: {
        title: '等级标准'
      }
    },
    {
      path: 'ratingModel',
      name: 'RatingModel',
      component: () => import(/* webpackChunkName: "RatingModel" */ '../../pages/credit-rating/rating-model'),
      meta: {
        title: '评级模型'
      }
    }
  ]
}
