/**
 *  内容管理路由
 */
export default [
  {
    path: 'newsMgmt',
    name: 'NewsMgmt',
    component: () => import(/* webpackChunkName: "newsMgmt" */ '../../pages/cms/news-mgmt'),
    meta: { title: '新闻管理' }
  },
  {
    path: 'noticeMgmt',
    name: 'NoticeMgmt',
    component: () => import(/* webpackChunkName: "noticeMgmt" */ '../../pages/cms/notice-mgmt'),
    meta: { title: '通知公告' }
  }
]
