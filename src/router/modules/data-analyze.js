/**
 * 数据分析路由
 */
import layout from '../../layout'

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
      name: 'DaContent',
      component: () => import(/* webpackChunkName: "analysis" */ '../../pages/data-analyze/DaContent'),
      meta: { title: '分析内容' }
    },
    {
      path: 'fileClassify',
      name: 'FileClassify',
      component: () => import(/* webpackChunkName: "analysis" */ '../../pages/data-analyze/FileClassify'),
      meta: { title: '档案分类' }
    }
  ]
}
