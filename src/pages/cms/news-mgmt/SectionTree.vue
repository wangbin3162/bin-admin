<template>
  <div>
    <div flex="main:justify cross:center">
      <h3>栏目信息</h3>

      <div class="section-btn">
        <template v-for="btn in [
            { icon: 'ios-create', type: 'u', tip: '编辑', size: '22px'},
            { icon: 'ios-trash', type: 'd', tip: '删除', size: '22px'},
            { icon: 'ios-add', type: 'c', tip: '添加', size: '24px'}
          ]">
          <b-tooltip :content="btn.tip" placement="top-start" :key="btn.icon">
            <b-button type="text" :icon="btn.icon"
              text-color="info" :icon-style="{fontSize: btn.size}"
              @click="openEditSectionHandler(btn.type)">
            </b-button>
          </b-tooltip>
        </template>
      </div>
    </div>

    <b-tree :data="treeData" :load-data="loadDataHandler" @on-select-change="treeNodeSelectHandler"></b-tree>

    <edit-section v-model="openEditSection"
      @success="successHandler"
      :optType="optType"
      :editData="curNode">
    </edit-section>
  </div>
</template>

<script>
  import { getSectionRoots, getSectionChildren, removeSection } from '../../../api/cms/cms.api'
  import EditSection from './EditSection'

  /**
   * @typedef {import('../../../api/cms/cms.api').Section} Section
   */

  export default {
    name: 'SectionTree',
    components: {
      EditSection
    },
    data () {
      return {
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
        try {
          const res = await getSectionRoots()
          this.treeData = this.buildTree(res)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '请求失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description 根据栏目父节点id获取子节点
       * @param {string} pid 父节点id
       * @returns {Promise<Section[]>}
       */
      async getSectionChildren (pid) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await getSectionChildren(pid)
            resolve(this.buildTree(res))
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '请求失败', desc: error })
            reject(error)
          }
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
              content: '确定要删除当前栏目吗？',
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
        if (type === 'c' || type === 'u') {
          this.openEditSection = true
        }
        if (type === 'd') {
          this.removeSection()
        }
      },

      /**
       * @author haodongdong
       * @description b-tree组件异步加载回调
       * @param {Section} node 当前节点
       * @param {Function} resolve 异步请求完成后加载节点的回调函数
       */
      async loadDataHandler (node, resolve) {
        try {
          const res = await this.getSectionChildren(node.id)
          resolve(res)
        } catch (error) {
          resolve([])
        }
      },

      /**
       * @author haodongdong
       * @description b-tree组件节点选中状态改变的回调，用于更新全局唯一选中的节点curNode
       * @param {Section[]} nodes 多选时，已选择的节点数组
       * @param {Section} curNode 当前点击的节点
       */
      treeNodeSelectHandler (nodes, curNode) {
        console.log(curNode)
        if (curNode.selected) {
          this.curNode = curNode
        } else {
          this.curNode = null
        }
      },

      /**
       * @author haodongdong
       * @description EditSection组件编辑成功的回调
       * @param {Section} section 成功提交的栏目对象
       */
      successHandler (section) {
        section = this.buildTree([section])[0]
        this.addTreeNode(section)
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
          node.children = []
          node.expand = false
          node.loading = false
          node.selected = false
        })
        return sections
      },

      /**
       * @author haodongdong
       * @description 删除树节点
       * @param {string} 树节点id
       */
      removeTreeNode (id) {
        const parentNode = this.findParentNode(this.treeData, id)
        if (parentNode) {
          const index = parentNode.children.findIndex(node => node.id === id)
          parentNode.children.splice(index, 1)
          parentNode.expand = false
        } else {
          const index = this.treeData.findIndex(node => node.id === id)
          this.treeData.splice(index, 1)
        }
      },

      /**
       * @author haodongdong
       * @description 添加树节点
       * @param {Section} node 树节点
       */
      addTreeNode (node) {
        if (this.curNode) {
          this.curNode.children.push(node)
          this.curNode.expand = true
        } else {
          this.treeData.push(node)
        }
      }
    }
  }
</script>
