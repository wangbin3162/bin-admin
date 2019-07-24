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
    }
  ]
}
