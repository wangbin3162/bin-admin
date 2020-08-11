export default [
  {
    path: '/creditSupervision',
    name: 'CreditSupervision',
    component: () => import(/* webpackChunkName: "CreditSupervision" */ '@/pages/credit-supervision'),
    meta: { title: '信用监管' }
  }
]
