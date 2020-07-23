export default [
  {
    path: '/content/index',
    name: 'Content',
    component: () => import(/* webpackChunkName: "Content" */ '../pages/content'),
    meta: { title: '新闻动态' }
  }
]
