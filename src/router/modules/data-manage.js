/**
 * 数据治理路由
 */
export default [
  {
    path: 'classify',
    name: 'Classify',
    component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/res/Classify'),
    meta: { title: '资源类目' }
  },
  {
    path: 'metadata',
    name: 'Metadata',
    component: () => import(/* webpackChunkName: "resource" */ '../../pages/data-manage/res/Metadata'),
    meta: { title: '元信息' }
  },
  {
    path: 'resInfo',
    name: 'ResInfo',
    component: () => import(/* webpackChunkName: "resource" */ '../../pages/data-manage/res/ResInfo'),
    meta: { title: '资源信息' }
  },
  {
    path: 'resDir',
    name: 'ResDir',
    component: () => import(/* webpackChunkName: "resource" */ '../../pages/data-manage/res/ResDir'),
    meta: { title: '资源目录' }
  },

  {
    path: 'dataSource',
    name: 'DataSource',
    component: () => import(/* webpackChunkName: "exchange" */ '../../pages/data-manage/exchange/DataSource'),
    meta: { title: '数据源管理' }
  },
  {
    path: 'switchingNode',
    name: 'SwitchingNode',
    component: () => import(/* webpackChunkName: "exchange" */ '../../pages/data-manage/exchange/SwitchingNode'),
    meta: { title: '节点管理' }
  },
  {
    path: 'switchingScheme',
    name: 'SwitchingScheme',
    component: () => import(/* webpackChunkName: "exchange" */ '../../pages/data-manage/exchange/SwitchingScheme'),
    meta: { title: '交换方案' }
  },
  {
    path: 'switchingMission',
    name: 'SwitchingMission',
    component: () => import(/* webpackChunkName: "exchange" */ '../../pages/data-manage/exchange/SwitchingMission'),
    meta: { title: '交换任务' }
  },

  {
    path: 'exchangeMonitor',
    name: 'ExchangeMonitor',
    component: () => import(/* webpackChunkName: "dataExchange" */ '../../pages/data-manage/data-exchange/ExchangeMonitor'),
    meta: { title: '交换监控' }
  },
  {
    path: 'gather',
    name: 'Gather',
    component: () => import(/* webpackChunkName: "dataExchange" */ '../../pages/data-manage/data-exchange/Gather'),
    meta: { title: '我的采集' }
  },
  {
    path: 'esExchange',
    name: 'EsExchange',
    component: () => import(/* webpackChunkName: "dataExchange" */ '../../pages/data-manage/data-exchange/es-exchange'),
    meta: { title: 'ES交换' }
  }
]
