export default [
  {
    path: '/content/index',
    name: 'Content',
    component: () => import(/* webpackChunkName: "Content" */ '../pages/content'),
    meta: { title: '新闻动态' }
  },
  {
    path: '/content/detail',
    name: 'ContentDetail',
    component: () => import(/* webpackChunkName: "ContentDetail" */ '../pages/content/Detail'),
    meta: { title: '新闻详情' }
  }
]
