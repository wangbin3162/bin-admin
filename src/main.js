import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Dropdown, DropdownMenu, DropdownItem,
  Menu, Submenu, MenuItem, MenuItemGroup,
  Form, FormItem, Button, ColorPicker, Select, Option, Input,
  Table, TableColumn, Pagination,
  Row, Col, Tree, Loading, Notification
} from 'element-ui'
// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
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
Vue.use(Loading.directive)
Vue.prototype.$notify = Notification
// bin-ui引用
Vue.use(BinUI)
// 全局通信
Vue.prototype.$EventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
