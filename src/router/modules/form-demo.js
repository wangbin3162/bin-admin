import layout from '../../layout'

export default {
  path: '/formDemo',
  component: layout,
  redirect: { name: 'FormCfg' },
  meta: { title: '表单配置', icon: 'ios-today' },
  children: [
    {
      path: 'formCfg',
      name: 'FormCfg',
      component: () => import('../../pages/demo/form/FormDemo'),
      meta: { title: '动态表单配置' }
    }
  ]
}
