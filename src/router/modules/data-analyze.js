import layout from '../../layout'

// 容器组件
const Wrap = {
  render: h => {
    return h('router-view')
  }
}

// 数据治理
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
    }
  ]
}
