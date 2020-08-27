/**
 * 挖掘分析配置
 */

export default [
  {
    path: 'excavateCfg',
    name: 'ExcavateCfg',
    component: () => import(/* webpackChunkName: "excavate" */ '../../pages/excavate-analyze/excavate-cfg'),
    meta: { title: '挖掘配置' }
  }
]
