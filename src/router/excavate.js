export default [
  {
    path: '/excavate',
    name: 'Excavate',
    component: () => import(/* webpackChunkName: "excavate" */ '../pages/excavate'),
    meta: { title: '挖掘分析页' }
  }
]
