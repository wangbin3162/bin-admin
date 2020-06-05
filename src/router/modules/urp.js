/**
 * 联合奖惩路由
 */
import layout from '../../layout'

// 容器组件
const Wrap = {
  render: h => {
    return h('router-view')
  }
}

export default {
  path: '/urp',
  component: layout,
  redirect: 'noRedirect',
  meta: { title: '联合奖惩', icon: 'ios-medal' },
  children: [
    {
      path: 'measure',
      name: 'Measure',
      component: () => import(/* webpackChunkName: "urp" */ '../../pages/urp/Measure'),
      meta: { title: '奖惩措施' }
    },
    {
      path: 'memo',
      component: Wrap,
      redirect: { name: 'Memo' },
      meta: { title: '备忘录管理' },
      children: [
        {
          path: 'memo',
          name: 'Memo',
          component: () => import(/* webpackChunkName: "urp" */ '../../pages/urp/memo/Memo'),
          meta: { title: '备忘录管理' }
        },
        {
          path: 'urpMemo',
          name: 'UrpMemo',
          component: () => import(/* webpackChunkName: "urp" */ '../../pages/urp/memo/UrpMemo'),
          meta: { title: '接收备忘录' }
        },
        {
          path: 'memoMapping',
          name: 'MemoMapping',
          component: () => import(/* webpackChunkName: "urp" */ '../../pages/urp/memo/MemoMapping'),
          meta: { title: '备忘录映射' }
        }
      ]
    },
    {
      path: 'record',
      component: Wrap,
      redirect: { name: 'Memo' },
      meta: { title: '执行记录' },
      children: [
        {
          path: 'listResult',
          name: 'ListResult',
          component: () => import(/* webpackChunkName: "urp" */ '../../pages/urp/record/ListResult'),
          meta: { title: '惩戒激励记录' }
        }
      ]
    },
    {
      path: 'urpDepart',
      name: 'UrpDepart',
      component: () => import(/* webpackChunkName: "urp" */ '../../pages/urp/UrpDepart'),
      meta: { title: '实施单位' }
    }
  ]
}
