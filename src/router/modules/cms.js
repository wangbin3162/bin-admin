/**
 * @author haodongdong
 * @description 内容管理路由
 */
import layout from '../../layout'

export default {
  path: '/cms',
  component: layout,
  redirect: 'noRedirect',
  meta: {
    title: '内容管理',
    icon: 'ios-create'
  },
  children: [
    {
      path: 'newsMgmt',
      name: 'NewsMgmt',
      component: () => import(/* webpackChunkName: "NewsMgmt" */ '../../pages/cms/news-mgmt'),
      meta: {
        title: '新闻管理'
      }
    },
    {
      path: 'noticeMgmt',
      name: 'NoticeMgmt',
      component: () => import(/* webpackChunkName: "NoticeMgmt" */ '../../pages/cms/notice-mgmt'),
      meta: {
        title: '通知公告'
      }
    }
  ]
}
