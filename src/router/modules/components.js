import layout from '../../views/layout/layout'

export default {
  path: '/components',
  component: layout,
  redirect: { name: 'container' },
  meta: { title: '公共组件', icon: 'ios-apps' },
  children: [
    {
      path: 'container',
      name: 'container',
      component: () => import('../../pages/demo/components/Container'),
      meta: { title: '容器组件', icon: 'ios-filing' }
    }
  ]
}
