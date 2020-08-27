/**
 * 数据分析路由
 */

export default [
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
    path: 'analyze',
    name: 'Analyze',
    component: () => import(/* webpackChunkName: "analyze" */ '../../pages/data-analyze/theme-sample/Analyze'),
    meta: { title: '采集分析' }
  },
  {
    path: 'collectAnalysis',
    name: 'CollectAnalysis',
    component: () => import(/* webpackChunkName: "collectAnalysis" */ '../../pages/data-analyze/theme-sample/CollectAnalysis'),
    meta: { title: '归集分析' }
  },
  {
    path: 'ratingAnalysis',
    name: 'RatingAnalysis',
    component: () => import(/* webpackChunkName: "ratingAnalysis" */ '../../pages/data-analyze/theme-sample/RatingAnalysis'),
    meta: { title: '评级分析' }
  }
]
