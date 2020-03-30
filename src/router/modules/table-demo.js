import layout from '../../layout'

export default {
  path: '/tableDemo',
  component: layout,
  redirect: { name: 'TableDemo' },
  meta: { title: '表格示例', icon: 'table' },
  children: [
    {
      path: 'tableDemo',
      name: 'TableDemo',
      component: () => import('../../pages/demo/table/TableDemo'),
      meta: { title: '综合表格' }
    }
  ]
}
