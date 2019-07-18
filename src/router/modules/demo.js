import layout from '../../layout/layout'

export default {
  path: '/demo',
  name: 'demo',
  redirect: 'noRedirect',
  meta: { title: '演示案例', icon: 'icon-ios-apps' },
  component: layout,
  children: [
    { path: 'demo1', component: () => import('../../views/demo/page1'), name: 'demo1', meta: { title: 'demo1' } },
    { path: 'demo2', component: () => import('../../views/demo/page2'), name: 'demo2', meta: { title: 'demo2' } },
    { path: 'demo3', component: () => import('../../views/demo/page3'), name: 'demo3', meta: { title: 'demo3' } }
  ]
}
