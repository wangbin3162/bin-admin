import layout from '../../layout'

export default {
  path: '/configDemo',
  component: layout,
  redirect: { name: 'FormCfg' },
  meta: { title: '动态配置', icon: 'ios-create' },
  children: [
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
    }
  ]
}
