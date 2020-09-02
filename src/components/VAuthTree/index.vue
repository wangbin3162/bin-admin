<template>
  <div :class="prefixCls">
    <tree-node
      v-for="(item, i) in stateTree"
      :key="i"
      :data="item"
      visible
      :show-checkbox="showCheckbox"
      :children-key="childrenKey">
    </tree-node>
    <div v-if="!stateTree.length">
      <b-empty>{{ emptyText }}</b-empty>
    </div>
  </div>
</template>

<script>
import TreeNode from './Node.vue'
import Emitter from 'bin-ui/src/mixins/emitter'

const prefixCls = 'auth-tree'
export default {
  name: 'VAuthTree',
  mixins: [Emitter],
  components: { TreeNode },
  provide() {
    return { TreeInstance: this }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    checkDirectly: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    childrenKey: {
      type: String,
      default: 'children'
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      stateTree: this.data,
      flatState: []
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.stateTree = this.data
        this.flatState = this.compileFlatState()
        this.rebuildTree()
      }
    }
  },
  methods: {
    compileFlatState() { // 每个结点都有一个关系父结点/子结点
      let keyCounter = 0
      let childrenKey = this.childrenKey
      const flatTree = []

      function flattenChildren(node, parent) {
        node.nodeKey = keyCounter++
        flatTree[node.nodeKey] = { node: node, nodeKey: node.nodeKey }
        if (typeof parent !== 'undefined') {
          flatTree[node.nodeKey].parent = parent.nodeKey
          flatTree[parent.nodeKey][childrenKey].push(node.nodeKey)
        }

        if (node[childrenKey]) {
          flatTree[node.nodeKey][childrenKey] = []
          node[childrenKey].forEach(child => flattenChildren(child, node))
        }
      }

      this.stateTree.forEach(rootNode => {
        flattenChildren(rootNode)
      })
      return flatTree
    },
    updateTreeUp(nodeKey) {
      const parentKey = this.flatState[nodeKey].parent
      if (typeof parentKey === 'undefined' || this.checkStrictly) return

      const node = this.flatState[nodeKey].node
      const parent = this.flatState[parentKey].node
      if (node.checked === parent.checked && node.indeterminate === parent.indeterminate) return // no need to update upwards

      if (node.checked === true) {
        this.$set(parent, 'checked', parent[this.childrenKey].every(node => node.checked))
        this.$set(parent, 'indeterminate', !parent.checked)
      } else {
        this.$set(parent, 'checked', false)
        this.$set(parent, 'indeterminate', parent[this.childrenKey].some(node => node.checked || node.indeterminate))
      }
      this.updateTreeUp(parentKey)
    },
    rebuildTree() { // only called when `data` prop changes
      const checkedNodes = this.getCheckedNodes()
      checkedNodes.forEach(node => {
        this.updateTreeDown(node, { checked: true })
        // propagate upwards
        const parentKey = this.flatState[node.nodeKey].parent
        if (!parentKey && parentKey !== 0) return
        const parent = this.flatState[parentKey].node
        const childHasCheckSetter = typeof node.checked !== 'undefined' && node.checked
        if (childHasCheckSetter && parent.checked !== node.checked) {
          this.updateTreeUp(node.nodeKey) // update tree upwards
        }
      })
    },
    /* public API */
    getCheckedNodes() {
      return this.flatState.filter(obj => obj.node.checked).map(obj => obj.node)
    },
    /* public API */
    getCheckedAndIndeterminateNodes() {
      return this.flatState.filter(obj => (obj.node.checked || obj.node.indeterminate)).map(obj => obj.node)
    },
    updateTreeDown(node, changes = {}) {
      if (this.checkStrictly) return

      for (let key in changes) {
        this.$set(node, key, changes[key])
      }
      if (node[this.childrenKey]) {
        node[this.childrenKey].forEach(child => {
          this.updateTreeDown(child, changes)
        })
      }
    },
    handleCheck({ checked, nodeKey }) {
      const node = this.flatState[nodeKey].node
      this.$set(node, 'checked', checked)
      this.$set(node, 'indeterminate', false)

      this.updateTreeUp(nodeKey) // propagate up
      this.updateTreeDown(node, { checked, indeterminate: false }) // reset `indeterminate` when going down

      this.$emit('on-check-change', this.getCheckedNodes(), node)
    }
  },
  created() {
    this.flatState = this.compileFlatState()
    this.rebuildTree()
  },
  mounted() {
    this.$on('on-check', this.handleCheck)
    this.$on('toggle-expand', node => this.$emit('on-toggle-expand', node))
  }
}
</script>

<style lang="stylus">
.auth-tree {
  position: relative;
  border: 1px solid #d6d6d6;
  border-bottom: none;
  font-size: 14px;
  color: rgba(0, 0, 0, .65);
  &:after {
    content: ''
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #d6d6d6;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      padding: 0;
      outline: none;
      margin: 0;
    }
  }

  &-title {
    cursor: pointer;
    margin: 0;
    padding: 0 6px;
    line-height: 20px;
    vertical-align: middle;
    transition: all .2s ease-in-out;
  }

  &-arrow {
    cursor: pointer;
    width: 14px;
    text-align: center;
    margin-right: 6px;
    .icon-ios-arrow-forward {
      position: relative;
      top: -1px;
      transition: transform .2s ease-in-out;
      font-size: 16px;
      vertical-align: middle;
    }
    &-open {
      .icon-ios-arrow-forward {
        transform: rotateZ(90deg) translateZ(0);
      }
    }
    &-disabled {
      cursor: not-allowed;
    }
  }
  &-node {
    display: flex;
    align-items: center;
    height: auto;
    padding: 8px;
    background: #fafafa;
    transition: .25s;
    white-space: nowrap;
    &-node {
      position relative;
      font-size: 14px;
      background: #fafafa;
      &:before {
        content: ''
        position: absolute;
        top: -1px;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #d6d6d6;
      }
      &:after {
        content: ''
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #d6d6d6;
      }
      &:hover {
        background-color: #f2f8ff !important;
      }
    }
    &-bottom {
      background: #fff;
      .auth-tree-arrow {
        display: none;
      }
    }
  }
  .bin-checkbox-wrapper {
    margin-right: 1px;
    line-height: 1.5715;
  }
  .bin-empty-normal {
    margin: 18px 0;
    .bin-empty-description {
      padding-bottom: 20px;
    }
  }
}
.auth-tree-bottom-wrap {
  display: block;
  width: 100%;
  > .auth-tree-node.auth-tree-node-bottom {
    display: inline-block;
    padding: 10px 0 10px 10px;
    &:hover {
      color: #0d85ff;
    }
  }
}
</style>
