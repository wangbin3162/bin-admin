import layout from '../../layout'

// 数据分析
export default {
  path: '/creditService',
  component: layout,
  redirect: 'noRedirect',
  meta: {
    title: '信用服务',
    icon: 'ios-filing'
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

      ]
    }
  ]
}
