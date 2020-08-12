export default [
  {
    path: '/creditSupervision',
    name: 'CreditSupervision',
    component: () => import(/* webpackChunkName: "CreditSupervision" */ '@/pages/credit-supervision/home'),
    meta: { title: '信用监管' }
  },
  {
    path: '/mySupervision',
    name: 'MySupervision',
    component: () => import(/* webpackChunkName: "MySupervision" */ '@/pages/credit-supervision/my-supervision'),
    meta: { title: '我的监管' }
  }
]
