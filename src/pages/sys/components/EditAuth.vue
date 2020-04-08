<template>
  <!--编辑权限-->
  <page-header-wrap v-show="visible" show-close @on-close="close" :title="pageTitle">
    <v-edit-wrap>
      <b-alert>
        <div flex="main:justify cross:center">
          <div style="color:rgba(0,0,0,.85);font-size: 16px;">功能权限分配</div>
          <div v-if="role&&role.parentName">
            <span v-if="role&&role.parentName"
                  style="color:rgba(0,0,0,.65);margin-right:5px;">
              所属父角色:{{role.parentName}}
            </span>
            <b-button type="text" @click="handleClose">全部收起</b-button>
            <b-divider type="vertical"/>
            <b-button type="text" @click="handleExpand">全部展开</b-button>
          </div>
        </div>
      </b-alert>
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
        this.role = null
        this.$emit('on-close')
      },
      // 提交权限编辑
      handleSubmit() {
        let checkedList = this.$refs.authTree.getCheckedNodes()
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
          let data = this.treeMapper(tree, null)
          this.treeData.push(data)
          // console.log(this.treeData)
          // console.log([...this.checkSet])
        })
      },
      // 树节点格式化mapper
      treeMapper(node, parentId) {
        // 当前id
        const currentId = node.id
        let parents = parentId ? parentId.split(',') : []
        parents.push(currentId)
        let child = []
        let nodeType = parentId ? ((node.children && node.children.length > 0) ? 'node' : 'bottom') : 'top'
        if (node.children) {
          node.children.forEach(item => {
            child.push(this.treeMapper(item, parents.join(',')))
          })
          let isSecond = node.children.reduce((total, item) => item.menuType === '3', false)
          nodeType = isSecond ? 'second' : nodeType
        }
        // 初始化已选中权限集合
        if (node.enabled) {
          this.checkSet.add(node.id)
        }
        return {
          id: node.id,
          title: node.text,
          nodeType,
          menuType: node.menuType,
          parents, // 配合级联展开时使用
          expand: true, // 先全部打开,后再进行比对关闭
          checked: node.enabled,
          children: child
        }
      },
      // 全部收起事件
      handleClose() {
        let mapper = node => {
          let child = []
          if (node.children) {
            node.children.forEach(item => {
              child.push(mapper(item))
            })
          }
          return {
            ...node,
            expand: node.nodeType === 'second',
            children: child
          }
        }
        let data = mapper(this.treeData[0])
        this.treeData = []
        this.treeData.push(data)
      },
      // 全部展开事件
      handleExpand() {
        let mapper = node => {
          let child = []
          if (node.children) {
            node.children.forEach(item => {
              child.push(mapper(item))
            })
          }
          return {
            ...node,
            expand: true,
            children: child
          }
        }
        let data = mapper(this.treeData[0])
        this.treeData = []
        this.treeData.push(data)
      }
    }
  }
</script>
