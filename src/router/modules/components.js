import layout from '../../layout/layout'

export default {
  path: '/components',
  component: layout,
  redirect: { name: 'container' },
  meta: { title: '公共组件', icon: 'ios-apps' },
  children: [
    {
      path: 'container',
      name: 'container',
      component: () => import('../../views/demo/components/container'),
      meta: { title: '容器组件', icon: 'ios-filing' }
    },
    {
      path: 'table',
      name: 'table',
      component: () => import('../../views/demo/components/table'),
      meta: { title: '简易表格', icon: 'md-grid' }
    },
    {
      path: 'tree',
      name: 'tree',
      component: () => import('../../views/demo/components/tree'),
      meta: { title: '简单树', icon: 'ios-git-merge' }
    }
  ]
}
