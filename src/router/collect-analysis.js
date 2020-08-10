export default [
  {
    path: '/collectAnalysis',
    name: 'CollectAnalysis',
    component: () => import(/* webpackChunkName: "NoticeDetail" */ '../pages/collect-analysis'),
    meta: { title: '归集分析' }
  }
]
