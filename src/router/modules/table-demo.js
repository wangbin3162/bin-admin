import layout from '../../layouts'

export default {
  path: '/tableDemo',
  component: layout,
  redirect: { name: 'container' },
  meta: { title: '表格示例', icon: 'md-grid' },
  children: [
    {
      path: 'tableDemo',
      name: 'TableDemo',
      component: () => import('../../pages/demo/table/TabelDemo'),
      meta: { title: '表格示例1' }
    }
  ]
}
