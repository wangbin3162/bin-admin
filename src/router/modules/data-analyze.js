import layout from '../../layout'

// 数据治理
export default {
  path: '/dataAnalyze',
  component: layout,
  redirect: 'DaTheme',
  meta: { title: '数据分析', icon: 'ios-analytics' },
  children: [
    {
      path: 'analyze',
      name: 'Analyze',
      component: () => import(/* webpackChunkName: "analysis" */ '../../pages/data-analyze/Analyze'),
      meta: { title: '采集分析' }
    },
    {
      path: 'daTheme',
      name: 'DaTheme',
      component: () => import(/* webpackChunkName: "analysis" */ '../../pages/data-analyze/DaTheme'),
      meta: { title: '分析主题' }
    },
    {
      path: 'daContent',
      name: 'daContent',
      component: () => import(/* webpackChunkName: "analysis" */ '../../pages/data-analyze/DaContent'),
      meta: { title: '分析内容' }
    },
    {
      path: 'daApi',
      name: 'DaApi',
      component: () => import(/* webpackChunkName: "analysis" */ '../../pages/data-analyze/DaApi'),
      meta: { title: '接口管理' }
    },
    {
      path: 'daInnerTemplate',
      name: 'DaInnerTemplate',
      component: () => import(/* webpackChunkName: "analysis" */ '../../pages/data-analyze/DaInnerTemplate'),
      meta: { title: '内置模板' }
    },
    {
      path: 'daBusinessTemplate',
      name: 'DaBusinessTemplate',
      component: () => import(/* webpackChunkName: "analysis" */ '../../pages/data-analyze/DaBusinessTemplate'),
      meta: { title: '业务模板' }
    }
  ]
}
