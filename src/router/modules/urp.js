/**
 * 联合奖惩路由
 */
export default [
  {
    path: 'measure',
    name: 'Measure',
    component: () => import(/* webpackChunkName: "measure" */ '../../pages/urp/Measure'),
    meta: { title: '奖惩措施' }
  },

  {
    path: 'memo',
    name: 'Memo',
    component: () => import(/* webpackChunkName: "memo" */ '../../pages/urp/memo/Memo'),
    meta: { title: '备忘录管理' }
  },
  {
    path: 'urpMemo',
    name: 'UrpMemo',
    component: () => import(/* webpackChunkName: "urpMemo" */ '../../pages/urp/memo/UrpMemo'),
    meta: { title: '接收备忘录' }
  },
  {
    path: 'memoMapping',
    name: 'MemoMapping',
    component: () => import(/* webpackChunkName: "memoMapping" */ '../../pages/urp/memo/MemoMapping'),
    meta: { title: '备忘录映射' }
  },

  {
    path: 'listResult',
    name: 'ListResult',
    component: () => import(/* webpackChunkName: "listResult" */ '../../pages/urp/record/ListResult'),
    meta: { title: '惩戒激励记录' }
  },

  {
    path: 'urpDepart',
    name: 'UrpDepart',
    component: () => import(/* webpackChunkName: "urpDepart" */ '../../pages/urp/UrpDepart'),
    meta: { title: '实施单位' }
  }
]
