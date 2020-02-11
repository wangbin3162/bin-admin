import layout from '../../views/layout/index'

export default {
  path: '/errorPage',
  component: layout,
  redirect: { name: 'error404' },
  meta: { title: '错误页面', icon: 'ios-warning' },
  children: [
    {
      path: 'error401',
      name: 'error401',
      component: () => import('../../views/error/401'),
      meta: { title: '无权限错误' }
    },
    {
      path: 'error403',
      name: 'error403',
      component: () => import('../../views/error/403'),
      meta: { title: '登录超时' }
    },
    {
      path: 'error404',
      name: 'error404',
      component: () => import('../../views/error/404'),
      meta: { title: '页面未找到' }
    }, {
      path: 'error500',
      name: 'error500',
      component: () => import('../../views/error/500'),
      meta: { title: '服务器错误' }
    }
  ]
}
