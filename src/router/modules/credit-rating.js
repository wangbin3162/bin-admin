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
    }
  ]
}
