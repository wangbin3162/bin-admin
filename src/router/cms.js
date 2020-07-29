export default [
  {
    path: '/news',
    name: 'News',
    component: () => import(/* webpackChunkName: "News" */ '../pages/cms/news'),
    meta: { title: '新闻动态' }
  },
  {
    path: '/news/detail',
    name: 'NewsDetail',
    component: () => import(/* webpackChunkName: "NewsDetail" */ '../pages/cms/news/Detail'),
    meta: { title: '新闻详情' }
  },
  {
    path: '/notice',
    name: 'Notice',
    component: () => import(/* webpackChunkName: "Notice" */ '../pages/cms/notice'),
    meta: { title: '通知公告' }
  }
]
