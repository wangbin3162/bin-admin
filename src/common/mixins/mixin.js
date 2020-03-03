export default {
  data() {
    return {
      moduleName: '',
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
      dialogStatus: '' // 编辑页显示状态[create,check,modify] 默认状态为''
    }
  },
  computed: {
    editTitle() {
      const map = {
        check: this.moduleName + '详情',
        modify: '修改' + this.moduleName,
        create: '新增' + this.moduleName
      }
      return map[this.dialogStatus] || '标题'
    },
    isNormal() {
      return this.dialogStatus.length === 0
    },
    isCheck() {
      return this.dialogStatus === 'check'
    },
    isEdit() {
      return this.dialogStatus === 'create' || this.dialogStatus === 'modify'
    },
    lockTreeSelect() {
      return this.dialogStatus === 'check' || this.dialogStatus === 'modify'
    }
  },
  watch: {
    dialogStatus() {
      window.scrollTo(0, 0) // 触发伪装滚动更新
    }
  },
  methods: {
    // 树节点格式化mapper
    treeMapper(node, parentId, keys = []) {
      // 当前id
      const currentId = node.id
      let parents = parentId ? parentId.split(',') : []
      parents.push(currentId)
      let child = []
      if (node.children) {
        node.children.forEach(item => {
          child.push(this.treeMapper(item, parents.join(','), keys))
        })
      }
      // 是否是选中状态
      let isSelect = this.currentTreeNode ? this.currentTreeNode.id === currentId : false
      // 是否是展开状态，根据当前选择的节点中的parents数组来判定自身和父级的展开状态
      let isExpand = this.currentTreeNode ? this.currentTreeNode.parents.includes(currentId) : false
      // 扩展对象属性
      let obj = {}
      keys.forEach(key => {
        if (node[key]) {
          obj[key] = node[key]
        }
      })
      return {
        id: node.id,
        title: node.text,
        ...obj,
        parents: parents, // 配合级联展开时使用
        selected: isSelect,
        expand: isExpand, // 先全部打开,后再进行比对关闭
        children: child
      }
    },
    // options根据对象返回选项数组
    formatOptions(obj) {
      let ret = []
      Object.keys(obj).forEach(key => {
        ret.push({ value: key, label: obj[key] })
      })
      return ret
    },
    // 设置列表数据
    setListData(obj) {
      if (obj) {
        this.list = obj.list
        this.total = obj.total
        this.listLoading = false
      } else {
        this.listLoading = true
      }
    },
    // 打开编辑页面
    openEditPage(status) {
      this.dialogStatus = status
      this.$refs.form && this.$refs.form.resetFields()
    },
    // 弹窗取消
    handleCancel() {
      this.dialogStatus = ''
    },
    // 提交完毕事件
    submitDone(isSuccess) {
      this.dialogStatus = '' // 状态需要改回默认
      this.btnLoading = false // 按钮状态清空
      if (isSuccess) {
        this.$message({ type: 'success', content: '操作成功' })
      }
    },
    // 组件内部overwrite
    searchList() {
      console.error('searchList need overwrite (from mixin)')
    },
    // 查询条件查询
    handleFilter() {
      this.listQuery.page = 1
      this.searchList()
    },
    // 分页大小事件 */
    handleSizeChange(size) {
      this.listQuery.page = 1
      this.listQuery.size = size
      this.searchList()
    },
    // 分页跳转事件 */
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.searchList()
    }
  }
}
