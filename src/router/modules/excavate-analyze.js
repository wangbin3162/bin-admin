/**
 * 挖掘分析配置
 */
import layout from '../../layout'

export default {
  path: '/excavateAnalyze',
  component: layout,
  redirect: 'noRedirect',
  meta: { title: '挖掘分析', icon: 'ios-stats' },
  children: [
    {
      path: 'excavateCfg',
      name: 'ExcavateCfg',
      component: () => import(/* webpackChunkName: "excavate" */ '../../pages/excavate-analyze/excavate-cfg'),
      meta: { title: '挖掘配置' }
    }
  ]
}
