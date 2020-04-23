<template>
  <collapse-transition :appear="appear">
    <ul :class="classes" v-if="data.nodeType&&data.nodeType!=='bottom'">
      <li>
        <div :class="nodeClass">
          <span :class="arrowClasses" @click="handleExpand">
          <b-icon v-if="showArrow" name="ios-arrow-forward"></b-icon>
        </span>
          <b-checkbox
            v-if="showCheckbox"
            :value="data.checked"
            :indeterminate="data.indeterminate"
            :disabled="data.disabled || data.disableCheckbox"
            @click.native.prevent="handleCheck"></b-checkbox>
          <span :class="titleClasses" @click.prevent="handleCheck">{{ data.title }}</span>
        </div>
        <template v-if="data.expand">
          <template v-if="children.length>0&&children[0].nodeType!=='bottom'">
            <tree-node
              :appear="appearByClickArrow"
              v-for="(item, i) in children"
              :key="i"
              :data="item"
              :show-checkbox="showCheckbox"
              :children-key="childrenKey">
            </tree-node>
          </template>
          <div v-else class="auth-tree-bottom-wrap">
            <div class="auth-tree-node auth-tree-node-bottom" v-for="(item, i) in children" :key="i">
              <b-checkbox
                v-if="showCheckbox"
                :value="item.checked"
                :indeterminate="item.indeterminate"
                :disabled="item.disabled || item.disableCheckbox"
                @click.native.prevent="handleCheckBottom(item)"></b-checkbox>
              <span :class="titleClasses" @click.prevent="handleCheckBottom(item)">{{ item.title }}</span>
            </div>
          </div>
        </template>
      </li>
    </ul>
  </collapse-transition>
</template>

<script>
  import CollapseTransition from 'bin-ui/src/components/base/collapse-transition'
  import Emitter from 'bin-ui/src/mixins/emitter'
  import { findComponentUpward } from 'bin-ui/src/utils/util'

  const prefixCls = 'auth-tree'

  export default {
    name: 'TreeNode',
    mixins: [Emitter],
    inject: ['TreeInstance'],
    components: { CollapseTransition },
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      },
      childrenKey: {
        type: String,
        default: 'children'
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      appear: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        prefixCls: prefixCls,
        appearByClickArrow: false
      }
    },
    computed: {
      nodeClass() {
        return [
          `${prefixCls}-node`,
          {
            [`${prefixCls}-node-${this.data.nodeType}`]: this.data.nodeType
          }
        ]
      },
      classes() {
        return [
          `${prefixCls}-children`
        ]
      },
      arrowClasses() {
        return [
          `${prefixCls}-arrow`,
          {
            [`${prefixCls}-arrow-disabled`]: this.data.disabled,
            [`${prefixCls}-arrow-open`]: this.data.expand
          }
        ]
      },
      titleClasses() {
        return [
          `${prefixCls}-title`
        ]
      },
      showArrow() {
        return (this.data[this.childrenKey] && this.data[this.childrenKey].length) || ('loading' in this.data && !this.data.loading)
      },
      node() {
        const Tree = findComponentUpward(this, 'VAuthTree')
        if (Tree) {
          // 将所有的 node（即flatState）和当前 node 都传递
          return [Tree.flatState, Tree.flatState.find(item => item.nodeKey === this.data.nodeKey)]
        } else {
          return []
        }
      },
      children() {
        return this.data[this.childrenKey]
      }
    },
    methods: {
      handleExpand() {
        const item = this.data
        if (item.disabled) return
        this.appearByClickArrow = true

        if (item[this.childrenKey] && item[this.childrenKey].length) {
          this.$set(this.data, 'expand', !this.data.expand)
          this.dispatch('VAuthTree', 'toggle-expand', this.data)
        }
      },
      handleCheck() {
        if (this.data.disabled) return
        const changes = {
          checked: !this.data.checked && !this.data.indeterminate,
          nodeKey: this.data.nodeKey
        }
        this.dispatch('VAuthTree', 'on-check', changes)
      },
      handleCheckBottom(item) {
        if (item.disabled) return
        const changes = {
          checked: !item.checked && !item.indeterminate,
          nodeKey: item.nodeKey
        }
        this.dispatch('VAuthTree', 'on-check', changes)
      }
    }
  }
</script>
