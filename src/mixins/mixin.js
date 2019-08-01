export default {
  data () {
    return {
      filterOpened: false, // 查询列表是否打开
      listQuery: { // 查询通用条件,组件内部的可删除
        size: 10,
        page: 1
      },
      total: 0, // 当前页面显示的总数据,
      list: [], // 当前页面显示的数据列表
      listLoading: false, // 列表加载状态
      dialogFormVisible: false, // 编辑页是否显示
      dialogStatus: '' // 编辑页显示状态[update,create,check]
    }
  },
  filters: {
    statusFilter (status) {
      const map = {
        ENABLED: '启用',
        DISABLED: '禁用'
      }
      return map[status]
    },
    statusStyleFilter (status) {
      const map = {
        ENABLED: 'success',
        DISABLED: 'danger',
        HIDDEN: 'warning',
        DELETED: 'danger',
        DRAFT: 'info',
        PUBLISHED: 'success',
        Y: 'success',
        N: 'danger'
      }
      return map[status]
    }
  },
  methods: {
    /**
     * 一、mixin中公共方法都以下划线为前缀区分是自身还是公共方法
     */
    // 2.3分页事件 hank 组件内部overwrite
    searchList () {
      console.error('searchList need overwrite (from mixin)')
    },
    // 2.4查询条件查询
    handleFilter () {
      this.listQuery.page = 1
      this.searchList()
    }
  }
}
