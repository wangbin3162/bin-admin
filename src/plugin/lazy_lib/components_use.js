/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 *
 * 当需要更多组件依赖时，在该文件加入即可
 */

import Vue from 'vue'
import {
  Dropdown, DropdownMenu, DropdownItem,
  Menu, Submenu, MenuItem, MenuItemGroup,
  Form, FormItem, Button, ColorPicker, Select, Option, Input,
  Table, TableColumn, Pagination,
  Row, Col, Tree, Loading, Notification, Alert
} from 'element-ui'

// element-ui 局部引用
// 下拉菜单
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
// 菜单
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
// 表单
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(ColorPicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
// 表格分页
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
// 行、列树结构
Vue.use(Row)
Vue.use(Col)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Loading.directive)
Vue.prototype.$notify = Notification
