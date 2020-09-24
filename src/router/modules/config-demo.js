export default [
  {
    path: 'FormDemo',
    name: 'FormDemo',
    component: () => import('../../pages/demo/form/FormDemo'),
    meta: { title: '动态表单' }
  },
  {
    path: 'FormMaking',
    name: 'FormMaking',
    component: () => import('../../pages/demo/form-making/FormMaking'),
    meta: { title: '表单设计' }
  },
  {
    path: 'ChartsConfig',
    name: 'ChartsConfig',
    component: () => import('../../pages/demo/charts-config'),
    meta: { title: '图表配置' }
  },
  {
    path: 'FlowConfig',
    name: 'FlowConfig',
    component: () => import('../../pages/demo/flow-config'),
    meta: { title: '流程配置' }
  }
]
