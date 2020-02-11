export default {
  data () {
    return {
      tableWrapWidth: 0,
      currentTreeNode: null,
      filterOpened: false, // 查询列表是否打开
      listQuery: { // 查询通用条件,组件内部的可删除
        size: 10,
        page: 1
      },
      total: 0, // 当前页面显示的总数据,
      list: [], // 当前页面显示的数据列表
      listLoading: false, // 列表加载状态
      btnLoading: false, // 按钮加载状态
      dialogFormVisible: false, // 编辑页是否显示
      dialogStatus: '' // 编辑页显示状态[create,check,modify]
    }
  },
  computed: {
    editTitle () {
      const map = {
        check: '查看',
        modify: '修改',
        create: '新增'
      }
      return map[this.dialogStatus] || '标题'
    },
    isCheck () {
      return this.dialogStatus === 'check'
    },
    isEdit () {
      return this.dialogStatus === 'create' || this.dialogStatus === 'modify'
    },
    tableWidth () {
      // 没有树结构的表格宽度= wrap -15*2 - 20*2
      return this.tableWrapWidth - 70
    },
    treeTableWidth () {
      // 包含树结构的表格宽度= wrap -15*2 - 20*2 -200
      return this.tableWrapWidth - 270
    },
    lockTreeSelect () {
      return this.dialogStatus === 'check' || this.dialogStatus === 'modify'
    }
  },
  mounted () {
    this.$EventBus.$on('/layout/resize', this._resizeTable)
  },
  watch: {
    dialogFormVisible (val) {
      if (!val) {
        this.dialogStatus = ''
      }
    }
  },
  methods: {
    // 1.监听窗口变化重置表格最大高度
    _resizeTable (width) {
      this.tableWrapWidth = width
      this.$refs.table && this.$refs.table.handleResize()
    },
    // 树节点格式化mapper
    treeMapper (node, parentId) {
      // 当前id
      const currentId = node.id
      let parents = parentId ? parentId.split(',') : []
      parents.push(currentId)
      let child = []
      if (node.children) {
        node.children.forEach(item => {
          child.push(this.treeMapper(item, parents.join(',')))
        })
      }
      // 是否是选中状态
      let isSelect = this.currentTreeNode ? this.currentTreeNode.id === currentId : false
      // 是否是展开状态，根据当前选择的节点中的parents数组来判定自身和父级的展开状态
      let isExpand = this.currentTreeNode ? this.currentTreeNode.parents.includes(currentId) : false
      return {
        id: node.id,
        title: node.text,
        parents: parents, // 配合级联展开时使用
        selected: isSelect,
        expand: isExpand, // 先全部打开,后再进行比对关闭
        children: child
      }
    },
    // 设置列表数据
    setListData (obj) {
      if (obj) {
        this.list = obj.list
        this.total = obj.total
        this.listLoading = false
      } else {
        this.list = []
        this.listLoading = true
      }
    },
    // 打开编辑页面
    openEditPage (status) {
      this.dialogStatus = status
      this.dialogFormVisible = true
      this.$refs.form && this.$refs.form.resetFields()
    },
    // 弹窗取消
    handleCancel () {
      this.dialogFormVisible = false
    },
    // 组件内部overwrite
    searchList () {
      console.error('searchList need overwrite (from mixin)')
    },
    // 查询条件查询
    handleFilter () {
      this.listQuery.page = 1
      this.searchList()
    },
    // 分页大小事件 */
    handleSizeChange (size) {
      this.listQuery.page = 1
      this.listQuery.size = size
      this.searchList()
    },
    // 分页跳转事件 */
    handleCurrentChange (page) {
      this.listQuery.page = page
      this.searchList()
    }
  }
}
