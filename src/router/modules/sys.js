/**
 * 系统管理路由
 */
export default [
  {
    path: 'dept',
    name: 'Dept',
    component: () => import(/* webpackChunkName: "org" */ '../../pages/sys/org/Dept'),
    meta: { title: '部门管理' }
  },
  {
    path: 'user',
    name: 'User',
    component: () => import(/* webpackChunkName: "org" */ '../../pages/sys/org/User'),
    meta: { title: '用户管理' }
  },
  {
    path: 'menu',
    name: 'Menu',
    component: () => import(/* webpackChunkName: "auth" */ '../../pages/sys/auth/Menu'),
    meta: { title: '菜单管理' }
  },
  {
    path: 'role',
    name: 'Role',
    component: () => import(/* webpackChunkName: "auth" */ '../../pages/sys/auth/Role'),
    meta: { title: '角色管理' }
  },
  {
    path: 'sysLog',
    name: 'SysLog',
    component: () => import(/* webpackChunkName: "logs" */ '../../pages/sys/logs/SysLog'),
    meta: { title: '系统日志' }
  },
  {
    path: 'dict',
    name: 'Dict',
    component: () => import(/* webpackChunkName: "setting" */ '../../pages/sys/setting/Dict'),
    meta: { title: '字典管理' }
  },
  {
    path: 'paramType',
    name: 'ParamType',
    component: () => import(/* webpackChunkName: "setting" */ '../../pages/sys/setting/ParamType'),
    meta: { title: '类别管理' }
  },
  {
    path: 'paramSetting',
    name: 'ParamSetting',
    component: () => import(/* webpackChunkName: "setting" */ '../../pages/sys/setting/ParamSetting'),
    meta: { title: '参数设置' }
  }
]
