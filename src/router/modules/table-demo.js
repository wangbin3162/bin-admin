export default [
  {
    path: 'TableDemo',
    name: 'TableDemo',
    component: () => import('../../pages/demo/table/TableDemo'),
    meta: { title: '表格示例' }
  },
  {
    path: 'SheetDemo',
    name: 'SheetDemo',
    component: () => import('../../pages/demo/table/SheetDemo'),
    meta: { title: '报表渲染' }
  }
]
