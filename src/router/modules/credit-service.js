/**
 * 信用服务路由
 */
import layout from '../../layout'

export default {
  path: '/creditService',
  component: layout,
  redirect: 'noRedirect',
  meta: {
    title: '信用服务',
    icon: 'ios-journal'
  },
  children: [
    {
      path: 'creditDiff',
      name: 'CreditDiff',
      component: {
        render: h => {
          return h('router-view')
        }
      },
      meta: {
        title: '信用异议'
      },
      children: [
        {
          path: 'diffApp',
          name: 'DiffApp',
          component: () => import(/* webpackChunkName: "DiffApp" */ '../../pages/credit-service/credit-diff/diff-app'),
          meta: {
            title: '异议申请'
          }
        },
        {
          path: 'diffApprove',
          name: 'DiffApprove',
          component: () => import(/* webpackChunkName: "DiffApprove" */ '../../pages/credit-service/credit-diff/diff-approve'),
          meta: {
            title: '异议初审'
          }
        },
        {
          path: 'diffHandle',
          name: 'DiffHandle',
          component: () => import(/* webpackChunkName: "DiffHandle" */ '../../pages/credit-service/credit-diff/diff-handle'),
          meta: {
            title: '异议处理'
          }
        }
      ]
    },
    {
      path: 'creditRepair',
      name: 'CreditRepair',
      component: {
        render: h => {
          return h('router-view')
        }
      },
      meta: {
        title: '信用修复'
      },
      children: [
        {
          path: 'dirConfig',
          name: 'DirConfig',
          component: () => import(/* webpackChunkName: "DirConfig" */ '../../pages/credit-service/credit-repair/dir-config'),
          meta: {
            title: '信用目录配置'
          }
        },
        {
          path: 'repairApply',
          name: 'RepairApply',
          component: () => import(/* webpackChunkName: "RepairApply" */ '../../pages/credit-service/credit-repair/repair-apply'),
          meta: {
            title: '信用修复申请'
          }
        },
        {
          path: 'repairAudit',
          name: 'RepairAudit',
          component: () => import(/* webpackChunkName: "RepairAudit" */ '../../pages/credit-service/credit-repair/repair-audit'),
          meta: {
            title: '信用修复审核'
          }
        },
        {
          path: 'focusRoster',
          name: 'FocusRoster',
          component: () => import(/* webpackChunkName: "FocusRoster" */ '../../pages/credit-service/credit-repair/focus-roster'),
          meta: {
            title: '重点关注名单'
          }
        }
      ]
    },
    {
      path: 'redBlackListRemove',
      name: 'RedBlackListRemove',
      component: () => import(/* webpackChunkName: "RedBlackListRemove" */ '../../pages/credit-service/red-black-list-remove'),
      meta: {
        title: '红黑名单解除'
      }
    }
  ]
}
