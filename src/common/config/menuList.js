/**
 * default menu list
 */
export default [
  {
    name: 'components',
    title: '内置组件',
    icon: 'ios-cube',
    children: [
      { name: 'EditorDemo', title: '代码编辑器' },
      { name: 'ChartDemo', title: '图表容器' }
    ]
  },
  {
    name: 'table',
    title: '表格示例',
    icon: 'table',
    children: [
      { name: 'TableDemo', title: '综合表格' },
      { name: 'SheetDemo', title: '报表示例' }
    ]
  },
  {
    name: 'configDemo',
    title: '动态配置',
    icon: 'ios-create',
    children: [
      { name: 'FormDemo', title: '动态表单' },
      { name: 'FormMaking', title: '表单设计' },
      { name: 'ChartsConfig', title: '图表配置' },
      { name: 'FlowConfig', title: '流程配置' }
    ]
  },
  {
    name: 'nested',
    title: '嵌套菜单',
    icon: 'ios-git-merge',
    children: [
      {
        name: 'menu1',
        title: '菜单1',
        icon: 'ios-git-merge',
        children: [
          { name: 'menu1-1', title: '菜单1-1' },
          { name: 'menu1-2', title: '菜单1-2' },
          { name: 'menu1-3', title: '菜单1-3' }
        ]
      },
      { name: 'menu2', title: '菜单2' }
    ]
  }
]

/**
 * 静态的临时的menus，不受接口返回影响
 * @type {{children: [{name: string, title: string}], name: string, icon: string, title: string}[]}
 */
export const staticMenu = [
  {
    name: 'dynamicMenu',
    title: '动态菜单',
    icon: 'ios-aperture',
    children: [
      { name: 'Form/metadata_key_1234', title: '动态路由' }
    ]
  },
  {
    name: 'errorPage',
    title: '错误页面',
    icon: 'ios-warning',
    children: [
      { name: 'Error401', title: '异常页401' },
      { name: 'Error403', title: '异常页403' },
      { name: 'Error404', title: '异常页404' },
      { name: 'Error500', title: '异常页500' }
    ]
  }
]

/**
 * 组装menus菜单
 * @param menus 接口返回的menus
 */
export function getMenus(menus = []) {
  let temp = [{ name: 'index', title: '首页', icon: 'ios-home' }]
  return temp.concat(menus, staticMenu)
}
