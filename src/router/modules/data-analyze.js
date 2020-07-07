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
    },
    {
      path: 'themeSample',
      name: 'ThemeSample',
      component: {
        render: h => {
          return h('router-view')
        }
      },
      meta: { title: '主题案例' },
      children: [
        {
          path: 'analyze',
          name: 'Analyze',
          component: () => import(/* webpackChunkName: "themeSample" */ '../../pages/data-analyze/theme-sample/Analyze'),
          meta: { title: '采集分析' }
        },
        {
          path: 'collectAnalysis',
          name: 'CollectAnalysis',
          component: () => import(/* webpackChunkName: "CollectAnalysis" */ '../../pages/data-analyze/theme-sample/CollectAnalysis'),
          meta: { title: '归集分析' }
        },
        {
          path: 'ratingAnalysis',
          name: 'RatingAnalysis',
          component: () => import(/* webpackChunkName: "RatingAnalysis" */ '../../pages/data-analyze/theme-sample/RatingAnalysis'),
          meta: { title: '评级分析' }
        }
      ]
    }
  ]
}
