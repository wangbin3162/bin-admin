/**
 * 数据治理路由
 */
import layout from '../../layout'

// 容器组件
const Wrap = {
  render: h => {
    return h('router-view')
  }
}

// 数据治理
export default {
  path: '/dataManage',
  component: layout,
  redirect: 'noRedirect',
  meta: { title: '数据治理', icon: 'ios-bookmarks' },
  children: [
    {
      path: 'res',
      component: Wrap,
      redirect: { name: 'Classify' },
      meta: { title: '资源管理', icon: 'ios-flask' },
      children: [
        {
          path: 'classify',
          name: 'Classify',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/res/Classify'),
          meta: { title: '资源类目' }
        },
        {
          path: 'metadata',
          name: 'Metadata',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/res/Metadata'),
          meta: { title: '元信息' }
        },
        {
          path: 'resInfo',
          name: 'ResInfo',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/res/ResInfo'),
          meta: { title: '资源信息' }
        },
        {
          path: 'resDir',
          name: 'ResDir',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/res/ResDir'),
          meta: { title: '资源目录' }
        }
      ]
    },
    {
      path: 'exchange',
      component: Wrap,
      redirect: { name: 'DataSource' },
      meta: { title: '交换配置', icon: 'ios-git-compare' },
      children: [
        {
          path: 'dataSource',
          name: 'DataSource',
          component: () => import(/* webpackChunkName: "exchange" */ '../../pages/data-manage/exchange/DataSource'),
          meta: { title: '数据源管理' }
        },
        {
          path: 'switchingNode',
          name: 'SwitchingNode',
          component: () => import(/* webpackChunkName: "exchange" */ '../../pages/data-manage/exchange/SwitchingNode'),
          meta: { title: '节点管理' }
        },
        {
          path: 'switchingScheme',
          name: 'SwitchingScheme',
          component: () => import(/* webpackChunkName: "exchange" */ '../../pages/data-manage/exchange/SwitchingScheme'),
          meta: { title: '交换方案' }
        },
        {
          path: 'switchingMission',
          name: 'SwitchingMission',
          component: () => import(/* webpackChunkName: "exchange" */ '../../pages/data-manage/exchange/SwitchingMission'),
          meta: { title: '交换任务' }
        }
      ]
    },
    {
      path: 'dataExchange',
      component: Wrap,
      redirect: { name: 'Gather' },
      meta: { title: '数据交换', icon: 'ios-briefcase' },
      children: [
        {
          path: 'exchangeMonitor',
          name: 'ExchangeMonitor',
          component: () => import(/* webpackChunkName: "collection" */ '../../pages/data-manage/data-exchange/ExchangeMonitor'),
          meta: { title: '交换监控' }
        },
        {
          path: 'gather',
          name: 'Gather',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/data-exchange/Gather'),
          meta: { title: '我的采集' }
        },
        {
          path: 'collectAnalysis',
          name: 'CollectAnalysis',
          component: () => import(/* webpackChunkName: "res" */ '../../pages/data-manage/data-exchange/CollectAnalysis'),
          meta: { title: '归集分析' }
        }
      ]
    }
  ]
}
