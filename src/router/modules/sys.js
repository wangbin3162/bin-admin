import layout from '../../layout'

// 容器组件
const Wrap = {
  render: h => {
    return h('router-view')
  }
}

export default {
  path: '/sys',
  component: layout,
  redirect: 'noRedirect',
  meta: { title: '系统管理', icon: 'ios-flower' },
  children: [
    {
      path: 'auth',
      component: Wrap,
      redirect: { name: 'Menu' },
      meta: { title: '授权管理', icon: 'ios-ribbon' },
      children: [
        {
          path: 'menu',
          name: 'Menu',
          component: () => import(/* webpackChunkName: "auth" */ '../../pages/sys/auth/Menu'),
          meta: { title: '菜单管理' }
        },
        {
          path: 'role',
          name: 'Role',
          component: () => import(/* webpackChunkName: "auth" */ '../../pages/sys/auth/Role'),
          meta: { title: '角色管理' }
        }
      ]
    }
  ]
}
