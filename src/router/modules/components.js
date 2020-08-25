export default [
  {
    path: 'editorDemo',
    name: 'EditorDemo',
    component: () => import('../../pages/demo/components/EditorDemo'),
    meta: { title: '代码编辑器' }
  },
  {
    path: 'chartDemo',
    name: 'ChartDemo',
    component: () => import('../../pages/demo/components/ChartDemo'),
    meta: { title: '图表组件' }
  }
]
