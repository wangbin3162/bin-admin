import layout from '../../layout/index'

export default {
  path: '/formDemo',
  component: layout,
  redirect: { name: 'FormCfg' },
  meta: { title: '表单配置', icon: 'ios-today', roles: false },
  children: [
    {
      path: 'formCfg',
      name: 'FormCfg',
      component: () => import('../../pages/demo/form/FormDemo'),
      meta: { title: '信息项配置(实验)', roles: false }
    }
  ]
}
