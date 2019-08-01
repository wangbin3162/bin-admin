import layout from '../../layout/layout'

export default {
  path: '/tableDemo',
  component: layout,
  redirect: { name: 'container' },
  meta: { title: '表格示例', icon: 'md-grid' },
  children: [
    {
      path: 'tableDemo',
      name: 'TableDemo',
      component: () => import('../../views/demo/table/demo'),
      meta: { title: '表格示例1' }
    }
  ]
}
