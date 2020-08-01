/**
 * 分析引擎路由
 */
import layout from '../../layout'

export default {
  path: '/analyzeEngine',
  component: layout,
  redirect: 'DaTheme',
  meta: { title: '分析引擎', icon: 'ios-globe' },
  children: [
    {
      path: 'daInnerTemplate',
      name: 'DaInnerTemplate',
      component: () => import(/* webpackChunkName: "analyzeEngine" */ '../../pages/analyze-engine/DaInnerTemplate'),
      meta: { title: '内置模板' }
    },
    {
      path: 'daBusinessTemplate',
      name: 'DaBusinessTemplate',
      component: () => import(/* webpackChunkName: "analyzeEngine" */ '../../pages/analyze-engine/DaBusinessTemplate'),
      meta: { title: '业务模板' }
    },
    {
      path: 'daApi',
      name: 'DaApi',
      component: () => import(/* webpackChunkName: "analyzeEngine" */ '../../pages/analyze-engine/DaApi'),
      meta: { title: '接口管理' }
    },
    {
      path: 'useLog',
      name: 'UseLog',
      component: () => import(/* webpackChunkName: "analyzeEngine" */ '../../pages/analyze-engine/UseLog'),
      meta: { title: '调用日志' }
    }
  ]
}
