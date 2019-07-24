/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 *
 * 当需要更多组件依赖时，在该文件加入即可
 */

import Vue from 'vue'
import {
  Menu, Submenu, MenuItem, MenuItemGroup,
  Table, TableColumn, Loading
} from 'element-ui'

// element-ui 局部引用
// 菜单
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
// 表格分页
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Loading.directive)
