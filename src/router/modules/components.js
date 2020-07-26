import layout from '../../layout'

export default {
  path: '/components',
  component: layout,
  redirect: { name: 'JsonEditorDemo' },
  meta: { title: '内置组件', icon: 'ios-cube' },
  children: [
    {
      path: 'editor',
      name: 'editorDemo',
      component: () => import('../../pages/demo/components/editorDemo'),
      meta: { title: '代码编辑器' }
    },
    {
      path: 'chart',
      name: 'ChartDemo',
      component: () => import('../../pages/demo/components/ChartDemo'),
      meta: { title: '图表容器' }
    }
  ]
}
