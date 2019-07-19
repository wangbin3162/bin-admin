import layout from '../../layout/layout'

export default {
  path: '/nested',
  name: 'nested',
  redirect: 'noRedirect',
  meta: { title: '嵌套菜单', icon: 'ios-git-merge' },
  component: layout,
  children: [
    {
      path: 'menu1',
      component: () => import('../../views/nested/menu1/index'), // Parent router-view
      name: 'menu1',
      meta: { title: 'Menu1' },
      children: [
        {
          path: 'menu1-1',
          component: () => import('../../views/nested/menu1/menu1-1'),
          name: 'menu1-1',
          meta: { title: 'Menu1-1' }
        },
        {
          path: 'menu1-2',
          component: () => import('../../views/nested/menu1/menu1-2'),
          name: 'menu1-2',
          meta: { title: 'Menu1-2' },
          children: [
            {
              path: 'menu1-2-1',
              component: () => import('../../views/nested/menu1/menu1-2/menu1-2-1'),
              name: 'menu1-2-1',
              meta: { title: 'Menu1-2-1' }
            },
            {
              path: 'menu1-2-2',
              component: () => import('../../views/nested/menu1/menu1-2/menu1-2-2'),
              name: 'menu1-2-2',
              meta: { title: 'Menu1-2-2' }
            }
          ]
        },
        {
          path: 'menu1-3',
          component: () => import('../../views/nested/menu1/menu1-3'),
          name: 'menu1-3',
          meta: { title: 'Menu1-3' }
        }
      ]
    },
    {
      path: 'menu2',
      component: () => import('../../views/nested/menu2/index'),
      meta: { title: 'menu2' }
    }
  ]
}
