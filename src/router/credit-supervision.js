export default [
  {
    path: '/creditSupervision',
    name: 'CreditSupervision',
    component: () => import(/* webpackChunkName: "CreditSupervision" */ '@/pages/credit-supervision/home'),
    meta: { title: '信用监管' }
  },
  {
    path: '/creditSupervision/marketPlayersWarn',
    name: 'MarketPlayersWarn',
    component: () => import(/* webpackChunkName: "MarketPlayersWarn" */ '@/pages/credit-supervision/market-players-warn'),
    meta: { title: '市场主体预警' }
  },
  {
    path: '/creditSupervision/industryBlackList',
    name: 'IndustryBlackList',
    component: () => import(/* webpackChunkName: "IndustryBlackList" */ '@/pages/credit-supervision/industry-black-list'),
    meta: { title: '行业黑名单排行' }
  },
  {
    path: '/creditSupervision/mySupervision',
    name: 'MySupervision',
    redirect: '/CreditSupervision/mySupervision/MS',
    component: () => import(/* webpackChunkName: "MySupervision" */ '@/pages/credit-supervision/my-supervision'),
    meta: { title: '我的监管' },
    children: [
      {
        path: 'MS',
        name: 'MS',
        component: () => import(/* webpackChunkName: "MS" */ '@/pages/credit-supervision/my-supervision/market'),
        meta: { title: '市场主体监管' }
      },
      {
        path: 'KP',
        name: 'KP',
        component: () => import(/* webpackChunkName: "KP" */ '@/pages/credit-supervision/my-supervision/focus-crowd'),
        meta: { title: '重点人群监管' }
      },
      {
        path: 'IA',
        name: 'IA',
        component: () => import(/* webpackChunkName: "IA" */ '@/pages/credit-supervision/my-supervision/focus-scope'),
        meta: { title: '重点领域监管' }
      },
      {
        path: 'KI',
        name: 'KI',
        component: () => import(/* webpackChunkName: "KI" */ '@/pages/credit-supervision/my-supervision/focus-industry'),
        meta: { title: '重点行业监管' }
      }
    ]
  }
]
