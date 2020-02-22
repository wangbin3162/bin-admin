<template>
  <page-header-wrap>
    <v-table-wrap>
      <!--树结构-->
      <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
              @on-select-change="handTreeCurrentChange"></b-tree>
      <!--查询条件-->
      <v-filter-bar>
        <v-filter-item title="菜单名称">
          <b-input v-model.trim="listQuery.menuName" size="small" placeholder="请输入菜单名称" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="禁用状态">
          <b-switch size="large" v-model="listQuery.delFlag" :true-value="ENUM.Y" :false-value="ENUM.N"
                    @on-change="handleFilter">
            <span slot="open">显示</span>
            <span slot="close">隐藏</span>
          </b-switch>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--操作栏-->
      <v-table-tool-bar>
        <b-button v-if="canCreate" type="primary"
                  v-waves size="small" icon="ios-add"
                  @click="handleCreate">新增
        </b-button>
      </v-table-tool-bar>
      <!--中央表格-->
      <b-table slot="table" :columns="columns" :data="list" :loading="listLoading" ref="table" :width="treeTableWidth">
        <template v-slot:name="scope">
          <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.name }}</a>
        </template>
        <!--菜单类型-->
        <template v-slot:type="scope">
          <b-tag>
            {{ menuTypeMap[scope.row.type] }}
          </b-tag>
        </template>
        <!--状态-->
        <template v-slot:delFlag="scope">
          <b-switch v-model="scope.row.delFlag" :true-value="ENUM.N" :false-value="ENUM.Y"
                    inactive-color="#ff4949" size="large"
                    @on-change="handleChangeDelFlag(scope.row)">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </b-switch>
        </template>
        <!--操作栏-->
        <template v-slot:action="scope">
          <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
          <b-button :disabled="canModify && scope.row.delFlag===ENUM.Y"
                    type="text" @click="handleModify(scope.row)">
            修改
          </b-button>
          <!--是否有删除键-->
          <template v-if="canRemove && scope.row.delFlag===ENUM.Y">
            <b-divider type="vertical"></b-divider>
            <b-button type="text" style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
          </template>
        </template>
      </b-table>
      <!--下方分页器-->
      <b-page slot="pager" :total="total" show-sizer
              @on-change="handleCurrentChange"
              @on-page-size-change="handleSizeChange"></b-page>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/menu.api'
  import { getYn, getMenuType } from '../../../api/enum.api'
  import { validateRoutePath, requireRule } from '../../../common/utils/validate'
  import { deepCopy } from '../../../common/utils/assist'

  export default {
    name: 'Menu',
    mixins: [commonMixin, permission],
    data() {
      const checkMenuPath = (rule, value, callback) => {
        if (value && validateRoutePath(value)) {
          callback(new Error('请输入正确的菜单路由(如:/ace ; /ace/menu)'))
        }
        callback()
      }
      return {
        listQuery: {
          menuName: '',
          parentId: '', // 父菜单id
          delFlag: 'N'
        },
        treeData: [],
        columns: [
          { title: '菜单名称', slot: 'name' },
          { title: '前端路由', key: 'path' },
          { title: '菜单类型', slot: 'type', width: 95, align: 'center' },
          { title: '排序编号', key: 'sortNum', width: 95, align: 'center' },
          { title: '状态', slot: 'delFlag', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        menu: null,
        ruleValidate: {
          name: [requireRule],
          path: [requireRule, { validator: checkMenuPath, trigger: 'blur' }]
        },
        ynMap: { 'N': '否', 'Y': '是' }, // 默认值这里Y是可以删除，可删除状态及为禁用
        menuTypeMap: { '1': '功能菜单', '2': '目录菜单', '3': '动作菜单' },
        TYPE: { FUN: '1', DIR: '2', ACT: '3' }
      }
    },
    computed: {
      ENUM() {
        return { N: 'N', Y: 'Y' } // 常量比对键值对
      }
    },
    created() {
      this.getYnEnum()
      this.getMenuTypeEnum()
      this.resetMenu()
      this.initTree()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        this.currentTreeNode = node
        this.listQuery.parentId = node.id
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          this.menu.parentId = node.id
        }
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          menuName: '',
          delFlag: this.ENUM.N,
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetMenu()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetMenu()
        this.menu = deepCopy({ ...this.menu, ...row })
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck(row) {
        this.menu = { ...row }
        this.openEditPage('check')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let menu = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前菜单吗？`,
          loading: true,
          onOk: () => {
            api.removeMenu(menu).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.searchList()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let tmp = this.menu.permissions.filter(i => i.name.length > 0 && i.path.length > 0)
            this.menu.permissions = deepCopy(tmp)
            let fun = this.dialogStatus === 'create' ? api.createMenu : api.modifyMenu
            fun(this.menu).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogFormVisible = false
                this.$message({ type: 'success', content: '操作成功' })
                this.initTree()
              } else {
                this.$message({ type: 'error', content: res.data.message })
              }
            })
          }
        })
      },
      // 单个启用禁用
      handleChangeDelFlag(row) {
        let menu = { ...row }
        api.changeDelFlag(menu).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            this.initTree()
          } else {
            this.$message({ type: 'danger', content: '操作失败' })
          }
        })
      },
      /* [动作菜单操作相关] */
      // 初始化4个基本动作菜单
      initPermissions() {
        debugger
        // 创建时动作缓存初始化4个动作
        this.menu.permissions = [
          { id: '', name: '新增', path: 'create', url: '', type: this.TYPE.ACT },
          { id: '', name: '更新', path: 'modify', url: '', type: this.TYPE.ACT },
          { id: '', name: '查询', path: 'search', url: '', type: this.TYPE.ACT },
          { id: '', name: '删除', path: 'remove', url: '', type: this.TYPE.ACT }
        ]
      },
      // 添加一行选项
      addBufferRow() {
        if (this.checkBufferValueNotEmpty()) {
          this.menu.permissions.push({ id: '', name: '', path: '', url: '', type: this.TYPE.ACT })
        } else {
          this.$message({ content: '名称和前端路径必填', type: 'danger' })
        }
      },
      // 删除一行
      removeBufferRow(item, index) {
        if (item.id.length === 0) {
          this.menu.permissions.splice(index, 1)
        } else {
          let menu = { ...item }
          this.$confirm({
            title: '警告',
            content: `删除此行可能会移除授权关联，确认删除嘛？`,
            loading: true,
            onOk: () => {
              api.removeMenu(menu).then(res => {
                if (res.data.code === '0') {
                  this.$message({ type: 'success', content: '操作成功' })
                  this.$modal.remove()
                  this.menu.permissions.splice(index, 1)
                } else {
                  this.$modal.remove()
                  this.$message({ type: 'danger', content: res.data.message })
                }
              })
            }
          })
        }
      },
      // 检查bufferValue中的值是否都不为空
      checkBufferValueNotEmpty() {
        return this.menu.permissions.every(item => item.path.length > 0 && item.name.length > 0)
      },
      // 是否是只读的动作
      permissionReadOnly(per) {
        return ['create', 'modify', 'search', 'remove'].includes(per)
      },
      /* [数据接口] */
      // 重置对象
      resetMenu() {
        this.menu = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          name: '',
          sortNum: 0,
          url: '',
          type: this.TYPE.FUN, // 默认只创建功能菜单
          path: '',
          permissions: []
        }
      },
      // 通用枚举
      getYnEnum() {
        getYn().then(res => {
          if (res.status === 200) {
            this.ynMap = res.data.data
          }
        })
      },
      // 菜单类型
      getMenuTypeEnum() {
        getMenuType().then(res => {
          if (res.status === 200) {
            this.menuTypeMap = res.data.data
          }
        })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getMenuTree().then(response => {
          const tree = response.data.data
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree ? this.treeMapper(tree) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            // 如果没有当前选中节点则初始化为第一个选中
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              // 这里要注意，扩展响应式属性需要这么写
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.parentId = this.currentTreeNode.id
            this.handleFilter()
          }
        })
      },
      // 树节点格式化mapper
      treeMapper(node, parentId) {
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
          title: node.menuName, // 返回值不同
          parents: parents, // 配合级联展开时使用
          selected: isSelect,
          expand: isExpand, // 先全部打开,后再进行比对关闭
          children: child
        }
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        api.getMenuList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>
