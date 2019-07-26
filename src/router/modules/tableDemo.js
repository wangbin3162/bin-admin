import layout from '../../layout/layout'

export default {
  path: '/tableDemo',
  component: layout,
  redirect: { name: 'container' },
  meta: { title: '表格示例', icon: 'table' },
  children: [
    {
      path: 'demo1',
      name: 'demo1',
      component: () => import('../../views/demo/table/demo'),
      meta: { title: '表格示例1' }
    }
  ]
}
