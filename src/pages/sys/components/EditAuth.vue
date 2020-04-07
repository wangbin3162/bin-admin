<template>
  <!--编辑权限-->
  <page-header-wrap v-show="visible" show-close @on-close="close" :title="pageTitle">
    <v-edit-wrap>
      <v-auth-tree ref="authTree" :data="treeData" show-checkbox/>
      <!--保存提交-->
      <template slot="footer">
        <b-button @click="close">取 消</b-button>
        <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
      </template>
    </v-edit-wrap>
  </page-header-wrap>
</template>

<script>
  import * as api from '../../../api/sys/role.api'
  import VAuthTree from '../../../components/VAuthTree/index'

  export default {
    name: 'EditAuth',
    components: { VAuthTree },
    data() {
      return {
        visible: false,
        btnLoading: false,
        treeData: [],
        role: null,
        checkSet: new Set()
      }
    },
    computed: {
      pageTitle() {
        return `编辑权限 / ${this.role ? this.role.name : ''}`
      }
    },
    methods: {
      open(role) {
        this.role = { ...role }
        this.checkSet = new Set()
        // 查询成功时打开
        this.visible = true
        this.initTree()
      },
      close() {
        this.visible = false
        this.treeData = []
        this.$emit('on-close')
      },
      // 提交权限编辑
      handleSubmit() {
        let checkedList = this.$refs.authTree.getCheckedAndIndeterminateNodes()
        this.checkSet = new Set()
        checkedList.forEach(item => {
          this.checkSet.add(item.id)
        })
        this.btnLoading = true
        api.createAuth(this.role.id, [...this.checkSet]).then(res => {
          if (res.data.code === '0') {
            this.btnLoading = false
            this.$message({ type: 'success', content: '操作成功' })
          } else {
            this.btnLoading = false
            this.$notice.danger({ title: '操作错误', desc: res.data.message })
          }
        })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getFuncTree(this.role.id).then(response => {
          const tree = response.data.data || {}
          let data = this.treeMapper(tree, null, ['menuType'])
          this.treeData.push(data)
          console.log(this.treeData)
          // console.log([...this.checkSet])
        })
      },
      // 树节点格式化mapper
      treeMapper(node, parentId, keys = []) {
        // 当前id
        const currentId = node.id
        let parents = parentId ? parentId.split(',') : []
        parents.push(currentId)
        let child = []
        let nodeType = parentId ? ((node.children && node.children.length > 0) ? 'node' : 'bottom') : 'top'
        if (node.children) {
          node.children.forEach(item => {
            child.push(this.treeMapper(item, parents.join(','), keys))
          })
        }
        // 初始化已选中权限集合
        if (node.enabled) {
          this.checkSet.add(node.id)
        }
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
          nodeType,
          parents, // 配合级联展开时使用
          expand: false, // 先全部打开,后再进行比对关闭
          checked: node.enabled,
          children: child
        }
      }
    }
  }
</script>
