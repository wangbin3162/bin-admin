<template>
  <div>
    <div flex="main:justify cross:center">
      <h3>栏目信息</h3>

      <div class="section-btn">
        <template v-for="btn in btnList">
          <b-tooltip :content="btn.tip" placement="top-start" :key="btn.icon">
            <b-button type="text" :icon="btn.icon" :disabled="btn.icon === 'loading'"
              text-color="info" :icon-style="{fontSize: btn.size}"
              @click="openEditSectionHandler(btn.type)">
            </b-button>
          </b-tooltip>
        </template>
      </div>
    </div>

    <b-tree :data="treeData" @on-select-change="treeNodeSelectHandler"></b-tree>

    <edit-section v-model="openEditSection"
      @add-success="addSuccessHandler"
      @update-success="updateSuccessHandler"
      :optType="optType"
      :parentNode="parentNode"
      :editData="curNode">
    </edit-section>
  </div>
</template>

<script>
  import { getSectionRoots, getSectionChildren, removeSection } from '../../../../api/cms/news-mgmt.api'
  import EditSection from './EditSection'

  /**
   * @typedef {import('../../../../api/cms/cms.api').Section} Section
   */

  export default {
    name: 'SectionTree',
    components: {
      EditSection
    },
    data () {
      return {
        btnList: [
          { icon: 'ios-sync', type: 'r', tip: '刷新', size: '21px' },
          { icon: 'ios-create', type: 'u', tip: '编辑', size: '22px' },
          { icon: 'ios-trash', type: 'd', tip: '删除', size: '22px' },
          { icon: 'ios-add', type: 'c', tip: '添加', size: '24px' }
        ],
        treeData: [],
        curNode: null, // 当前选中的树节点
        parentNode: null, // 当前选中节点的父节点
        openEditSection: false, // 用于EditSection组件打开关闭
        optType: 'c' // EditSection组件的操作类型 u 编辑 d 删除 c 创建
      }
    },
    created () {
      this.getSectionRoots()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取栏目根节点
       */
      async getSectionRoots () {
        this.$set(this.btnList[0], 'icon', 'loading')
        try {
          const res = await getSectionRoots()
          this.treeData = this.buildTree(res)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '请求失败', desc: error })
        }
        this.$set(this.btnList[0], 'icon', 'ios-sync')
      },

      /**
       * @author haodongdong
       * @description 如果父节点没子节点的话，根据栏目父节点id获取子节点，然后追加至父节点。
       * @param {string} pNode 父节点id
       * @returns {Promise<Section[]>} 返回处理后的父节点
       */
      async appendSectionChildren (pNode) {
        return new Promise(async (resolve, reject) => {
          try {
            if (pNode.children.length === 0) { // 没有子节点的话则请求
              this.$set(pNode, 'loading', true)
              const res = await getSectionChildren(pNode.id)
              if (res.length > 0) pNode.expand = true
              pNode.children = this.buildTree(res)
            }
            resolve(pNode)
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '请求失败', desc: error })
            reject(error)
          }
          this.$delete(pNode, 'loading')
        })
      },

      /**
       * @author haodongdong
       * @description 删除栏目的函数，会进行是否可以删除的判读
       */
      async removeSection () {
        if (this.curNode) {
          if (this.curNode.children && this.curNode.children.length) {
            this.$alert.warning({
              title: '提示',
              content: '请删除子栏目后再删除当前栏目。'
            })
          } else {
            this.$confirm({
              title: '删除',
              content: `确定要删除【${this.curNode.title}】吗？`,
              loading: true,
              okType: 'danger',
              onOk: async () => {
                try {
                  await removeSection(this.curNode.id)
                  this.removeTreeNode(this.curNode.id)
                  this.$message({ type: 'success', content: '操作成功' })
                } catch (error) {
                  console.error(error)
                  this.$notice.danger({ title: '操作错误', desc: error })
                }
                this.$modal.remove()
              }
            })
          }
        } else {
          this.$alert.warning({
            title: '提示',
            content: '请先选择要删除的栏目。'
          })
        }
      },

      /**
       * @author haodongdong
       * @description 栏目信息操作按钮的回调函数，根据传递的参数，或删除或打开编辑弹框。
       * @param {string} type 操作类型，u 编辑 d 删除 c 创建。
       */
       openEditSectionHandler (type) {
        this.optType = type
        if (type === 'c') {
          this.openEditSection = true
        }
        if (type === 'u') {
          if (this.curNode) {
            this.openEditSection = true
          } else {
            this.$alert.warning({ title: '提示', content: '请选择栏目后编辑。' })
          }
        }
        if (type === 'd') {
          this.removeSection()
        }
        if (type === 'r') {
          this.getSectionRoots()
          // TODO: 刷新按钮需要改变节点选中状态
        }
      },

      /**
       * @author haodongdong
       * @description b-tree组件节点选中状态改变的回调，用于更新全局唯一选中的节点curNode与父节点parentNode，并发送栏目改变事件。
       * @param {Section[]} nodes 多选时，已选择的节点数组
       * @param {Section} curNode 当前点击的节点
       */
      async treeNodeSelectHandler (nodes, curNode) {
        const colId = curNode.selected ? curNode.id : ''
        this.$emit('section-change', colId)

        if (curNode.selected) {
          curNode = await this.appendSectionChildren(curNode)
          this.curNode = curNode
          this.parentNode = this.findParentNode(this.treeData, curNode.id)
        } else {
          this.curNode = null
          this.parentNode = null
        }
      },

      /**
       * @author haodongdong
       * @description EditSection组件添加成功的回调
       * @param {Section} section 成功提交的栏目对象
       */
      addSuccessHandler (section) {
        section = this.buildTree([section])[0]
        this.addTreeNode(section)
      },

      /**
       * @author haodongdong
       * @description EditSection组件编辑成功的回调
       * @param {Section} section 成功更新的栏目对象
       */
      updateSuccessHandler (section) {
        section = this.buildTree([section])[0]
        this.curNode = section
        this.updateTreeNode(section)
      },

      /**
       * @author haodongdong
       * @description 根据子节点查父节点
       * @param {Section[]} tree 树结构数据
       * @returns {Section | null} 返回查找到的子节点的父节点，如果没查找到包含子节点的父节点则返回null
       */
      findParentNode (tree, nodeId) {
        for (const node of tree) {
          if (node.children && node.children.length) { // 如果节点存在子节点，则查找nodeId是否在子节点中
            const existSubNode = node.children.some(subNode => subNode.id === nodeId)
            if (existSubNode) {
              return node
            } else { // 如果不在子节点中，则继续递归遍历子节点
              return this.findParentNode(node.children, nodeId)
            }
          }
        }
        return null
      },

      /**
       * @author haodongdong
       * @description 构建b-tree使用的树结构数据
       * @param {Section[]} sections 接口获取的栏目节点数据
       * @return {Section[]} 返回构建后的树结构
       */
      buildTree (sections) {
        sections.forEach((node, index) => {
          node.title = node.colName
          node.children = node.children === undefined ? [] : node.children
          node.expand = node.expand === undefined ? false : node.expand
          node.selected = node.selected === undefined ? false : node.selected
        })
        return sections
      },

      /**
       * @author haodongdong
       * @description 删除树节点
       * @param {string} 树节点id
       */
      removeTreeNode (id) {
        let tree = []
        const parentNode = this.findParentNode(this.treeData, id)
        if (parentNode) {
          tree = parentNode.children
        } else {
          tree = this.treeData
        }
        const index = tree.findIndex(treeNode => treeNode.id === id)
        tree.splice(index, 1)
      },

      /**
       * @author haodongdong
       * @description 添加树节点
       * @param {Section} node 树节点
       */
      addTreeNode (node) {
        let tree = []
        if (this.curNode) {
          this.curNode.children.push(node)
          this.curNode.expand = true
          this.sortTreeNode(this.curNode.children)
        } else {
          this.treeData.push(node)
          this.sortTreeNode(this.treeData)
        }
      },

      /**
       * @author haodongdong
       * @description 更新树节点
       * @param {Section} node
       */
      updateTreeNode (node) {
        let tree = []
        const parentNode = this.findParentNode(this.treeData, node.id)
        if (parentNode) {
          tree = parentNode.children
        } else {
          tree = this.treeData
        }
        const index = tree.findIndex(treeNode => treeNode.id === node.id)
        tree.splice(index, 1, node)
        this.sortTreeNode(tree)
      },

      /**
       * @author haodongdong
       * @description 用于树的排序
       * @param {Section[]} tree
       */
      sortTreeNode (tree) {
        tree.sort((a, b) => {
          return a.colSort - b.colSort
        })
      }
    }
  }
</script>
