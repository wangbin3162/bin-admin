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
    },
    {
      path: 'modelCount',
      name: 'ModelCount',
      component: {
        render: h => {
          return h('router-view')
        }
      },
      meta: {
        title: '模型计算'
      },
      children: [
        {
          path: 'legal',
          name: 'Legal',
          component: () => import(/* webpackChunkName: "Legal" */ '../../pages/credit-rating/model-count/legal'),
          meta: {
            title: '法人'
          }
        },
        {
          path: 'natural',
          name: 'Natural',
          component: () => import(/* webpackChunkName: "Natural" */ '../../pages/credit-rating/model-count/natural'),
          meta: {
            title: '自然人'
          }
        }
      ]
    }
  ]
}
