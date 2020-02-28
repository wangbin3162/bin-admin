import layout from '../../layout'

export default {
  path: '/tableDemo',
  component: layout,
  redirect: { name: 'container' },
  meta: { title: '表格示例', icon: 'md-grid' },
  children: [
    {
      path: 'tableDemo',
      name: 'TableDemo',
      component: () => import('../../pages/demo/table/TableDemo'),
      meta: { title: '综合表格' }
    }
  ]
}
