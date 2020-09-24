export default [
  {
    path: 'Error401',
    name: 'Error401',
    component: () => import('../../pages/error/Error401'),
    meta: { title: '异常页401' }
  },
  {
    path: 'Error403',
    name: 'Error403',
    component: () => import('../../pages/error/Error403'),
    meta: { title: '异常页403' }
  },
  {
    path: 'Error404',
    name: 'Error404',
    component: () => import('../../pages/error/Error404'),
    meta: { title: '异常页404' }
  },
  {
    path: 'Error500',
    name: 'Error500',
    component: () => import('../../pages/error/Error500'),
    meta: { title: '异常页500' }
  }
]
