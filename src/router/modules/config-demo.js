export default [
  {
    path: 'formCfg',
    name: 'FormCfg',
    component: () => import('../../pages/demo/form/FormDemo'),
    meta: { title: '动态表单' }
  },
  {
    path: 'chartsConfig',
    name: 'ChartsConfig',
    component: () => import('../../pages/demo/charts-config'),
    meta: { title: '图表配置' }
  },
  {
    path: 'flowConfig',
    name: 'FlowConfig',
    component: () => import('../../pages/demo/flow-config'),
    meta: { title: '流程配置' }
  }
]
