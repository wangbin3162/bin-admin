import layout from '../../layout/index'

export default {
  path: '/formDemo',
  component: layout,
  redirect: { name: 'FormCfg' },
  meta: { title: '资源管理(测试)', icon: 'ios-today', roles: true },
  children: [
    {
      path: 'formCfg',
      name: 'FormCfg',
      component: () => import('../../pages/demo/form/FormDemo'),
      meta: { title: '动态表单(测试)', roles: false }
    },
    {
      path: 'resInfo2',
      name: 'ResInfo2',
      component: () => import('../../pages/data-manage/res/ResInfo2'),
      meta: { title: '资源信息(测试)', roles: true }
    },
    {
      path: 'gather2',
      name: 'Gather2',
      component: () => import('../../pages/data-manage/data-exchange/Gather2'),
      meta: { title: '我的采集(新)', roles: true }
    }
  ]
}
