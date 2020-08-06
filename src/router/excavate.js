export default [
  {
    path: '/excavate',
    name: 'Excavate',
    component: () => import(/* webpackChunkName: "excavate" */ '../pages/excavate'),
    meta: { title: '挖掘分析-首页' }
  },
  {
    path: '/excavate/render',
    name: 'RenderPage',
    component: () => import(/* webpackChunkName: "excavate" */ '../pages/excavate/RenderPage'),
    meta: { title: '挖掘分析-详情' }
  }
]
