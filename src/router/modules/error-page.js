import layout from '../../layout'

export default {
  path: '/errorPage',
  component: layout,
  redirect: { name: 'Error401' },
  meta: { title: '错误页面', icon: 'ios-warning' },
  children: [
    {
      path: 'error401',
      name: 'Error401',
      component: () => import('../../pages/error/Error500'),
      meta: { title: '异常页401' }
    },
    {
      path: 'error403',
      name: 'Error403',
      component: () => import('../../pages/error/Error403'),
      meta: { title: '异常页403' }
    },
    {
      path: 'error404',
      name: 'Error404',
      component: () => import('../../pages/error/Error404'),
      meta: { title: '异常页404' }
    },
    {
      path: 'error500',
      name: 'Error500',
      component: () => import('../../pages/error/Error500'),
      meta: { title: '异常页500' }
    }
  ]
}
