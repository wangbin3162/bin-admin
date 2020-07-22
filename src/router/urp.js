export default [
  {
    path: '/urp/index',
    name: 'UrpIndex',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/UrpIndex'),
    meta: { title: '联合奖惩首页' }
  },
  {
    path: '/urp/feedback',
    name: 'Feedback',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/Feedback'),
    meta: { title: '执行反馈' }
  },
  {
    path: '/urp/print',
    name: 'UrpPrint',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/UrpPrint'),
    meta: { title: '联合奖惩反馈单' }
  },
  {
    path: '/urp/memoList',
    name: 'MemoList',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/MemoList'),
    meta: { title: '联合奖惩备忘录' }
  },
  {
    path: '/urp/memoDetail',
    name: 'MemoDetail',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/MemoDetail'),
    meta: { title: '联合奖惩备忘录详情' }
  },
  {
    path: '/urp/listResult',
    name: 'ListResult',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/ListResult'),
    meta: { title: '联合奖惩执行记录' }
  },
  {
    path: '/urp/remarkList',
    name: 'RemarkList',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/RemarkList'),
    meta: { title: '备注列表' }
  }
]
