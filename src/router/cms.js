export default [
  {
    path: '/news/index',
    name: 'News',
    component: () => import(/* webpackChunkName: "News" */ '../pages/cms/news'),
    meta: { title: '新闻动态' }
  },
  {
    path: '/news/detail',
    name: 'NewsDetail',
    component: () => import(/* webpackChunkName: "News" */ '../pages/cms/news/Detail'),
    meta: { title: '新闻详情' }
  }
]
