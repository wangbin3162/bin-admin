/**
 * default menu list
 */
export default [
  {
    name: 'Sys',
    title: '系统管理',
    icon: 'ios-flower',
    children: [
      {
        name: 'Org',
        title: '组织管理',
        icon: 'ios-people',
        children: [
          { name: 'Dept', title: '部门管理', icon: '' },
          { name: 'User', title: '用户管理', icon: '' }
        ]
      },
      {
        name: 'Auth',
        title: '授权管理',
        icon: 'ios-ribbon',
        children: [
          { name: 'Menu', title: '菜单管理', icon: '' },
          { name: 'Role', title: '角色管理', icon: '' }
        ]
      },
      {
        name: 'Logs',
        title: '日志审计',
        icon: 'ios-clipboard',
        children: [
          { name: 'SysLog', title: '系统日志', icon: '' }
        ]
      },
      {
        name: 'Setting',
        title: '系统设置',
        icon: 'ios-settings',
        children: [
          { name: 'Dict', title: '字典管理', icon: '' },
          { name: 'ParamType', title: '类别管理', icon: '' },
          { name: 'ParamSetting', title: '参数设置', icon: '' }
        ]
      }
    ]
  },
  {
    name: 'DataManage',
    title: '数据治理',
    icon: 'ios-bookmarks',
    children: [
      {
        name: 'Resource',
        title: '资源管理',
        icon: 'ios-flask',
        children: [
          { name: 'Classify', title: '资源类目' },
          { name: 'Metadata', title: '元信息' },
          { name: 'ResInfo', title: '资源信息' },
          { name: 'ResDir', title: '资源目录' }
        ]
      },
      {
        name: 'Exchange',
        title: '交换配置',
        icon: 'ios-git-compare',
        children: [
          { name: 'DataSource', title: '数据源管理' },
          { name: 'SwitchingNode', title: '节点管理' },
          { name: 'SwitchingScheme', title: '交换方案' },
          { name: 'SwitchingMission', title: '交换任务' }
        ]
      },
      {
        name: 'DataExchange',
        title: '数据交换',
        icon: 'ios-briefcase',
        children: [
          { name: 'ExchangeMonitor', title: '交换监控' },
          { name: 'Gather', title: '我的采集' },
          { name: 'EsExchange', title: 'ES交换' }
        ]
      }
    ]
  },
  {
    name: 'AnalyzeEngine',
    title: '分析引擎',
    icon: 'ios-globe',
    children: [
      { name: 'DaApi', title: '接口管理' },
      { name: 'DaInnerTemplate', title: '内置模板' },
      { name: 'DaBusinessTemplate', title: '业务模板' },
      { name: 'UseLog', title: '调用日志' }
    ]
  },
  {
    name: 'DataAnalyze',
    title: '数据分析',
    icon: 'ios-analytics',
    children: [
      { name: 'DaTheme', title: '分析主题' },
      { name: 'DaContent', title: '分析内容' },
      { name: 'FileClassify', title: '档案分类' },
      {
        name: 'ThemeSample',
        title: '主题案例',
        children: [
          { name: 'Analyze', title: '采集分析' },
          { name: 'CollectAnalysis', title: '归集分析' },
          { name: 'RatingAnalysis', title: '评级分析' }
        ]
      }
    ]
  },
  {
    name: 'ExcavateAnalyze',
    title: '挖掘分析',
    icon: 'ios-stats',
    children: [
      { name: 'ExcavateCfg', title: '挖掘配置' }
    ]
  },
  {
    name: 'Urp',
    title: '联合奖惩',
    icon: 'ios-medal',
    children: [
      { name: 'Measure', title: '奖惩措施' },
      {
        name: 'MemoManager',
        title: '备忘录管理',
        children: [
          { name: 'Memo', title: '备忘录管理' },
          { name: 'UrpMemo', title: '接收备忘录' },
          { name: 'MemoMapping', title: '备忘录映射' }
        ]
      },
      {
        name: 'Record',
        title: '执行记录',
        children: [
          { name: 'ListResult', title: '惩戒激励记录' }
        ]
      },
      { name: 'UrpDepart', title: '实施单位' }
    ]
  },
  {
    name: 'CreditRating',
    title: '信用评级',
    icon: 'ios-create',
    children: [
      { name: 'IndexVar', title: '指标变量' },
      { name: 'IndexManage', title: '指标管理' },
      { name: 'LevelStandard', title: '等级标准' },
      { name: 'RatingModel', title: '评级模型' },
      {
        name: 'ModelCount',
        title: '模型计算',
        children: [
          { name: 'Legal', title: '法人和其他组织' },
          { name: 'Natural', title: '自然人' }
        ]
      },
      { name: 'CreditReport', title: '信用报告配置' }
    ]
  },
  {
    name: 'CreditService',
    title: '信用服务',
    icon: 'ios-journal',
    children: [
      {
        name: 'CreditDiff',
        title: '信用异议',
        children: [
          { name: 'DiffApp', title: '异议申请' },
          { name: 'DiffApprove', title: '异议初审' },
          { name: 'DiffHandle', title: '异议处理' }
        ]
      },
      {
        name: 'CreditRepair',
        title: '信用修复',
        children: [
          { name: 'DirConfig', title: '信用目录配置' },
          { name: 'RepairApply', title: '信用修复申请' },
          { name: 'RepairAudit', title: '信用修复审核' },
          { name: 'FocusRoster', title: '重点关注名单' }
        ]
      },
      { name: 'RedBlackListRemove', title: '红黑名单解除' }
    ]
  },
  {
    name: 'Cms',
    title: '内容管理',
    icon: 'ios-tv',
    children: [
      { name: 'NewsMgmt', title: '新闻管理' },
      { name: 'NoticeMgmt', title: '通知公告' }
    ]
  }
]

/**
 * 静态的临时的menus，不受接口返回影响
 * @type {{children: [{name: string, title: string}], name: string, icon: string, title: string}[]}
 */
export const staticMenu = []

/**
 * 组装menus菜单
 * @param menus 接口返回的menus
 */
export function getMenus(menus = []) {
  let temp = [{ name: 'index', title: '首页', icon: 'ios-home' }]
  return temp.concat(menus, staticMenu)
}
