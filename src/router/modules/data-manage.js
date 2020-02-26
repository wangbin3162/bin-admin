import layout from '../../layout'

// 容器组件
const Wrap = {
  render: h => {
    return h('router-view')
  }
}

// 数据治理
export default {
  path: '/dataManage',
  component: layout,
  redirect: 'noRedirect',
  meta: { title: '数据治理', icon: 'ios-bookmarks' },
  children: [
    {
      path: 'res',
      component: Wrap,
      redirect: { name: 'Classify' },
      meta: { title: '资源管理', icon: 'ios-flask' },
      children: [
        {
          path: 'classify',
          name: 'Classify',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/res/Classify'),
          meta: { title: '资源类目' }
        },
        {
          path: 'metadata',
          name: 'Metadata',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/res/Metadata'),
          meta: { title: '元信息' }
        },
        {
          path: 'resInfo',
          name: 'ResInfo',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/res/ResInfo'),
          meta: { title: '资源信息' }
        }
      ]
    }
  ]
}
