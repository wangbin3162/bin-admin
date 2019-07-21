<template>
  <ul class="tree-ul">
    <li class="tree-li">
      <span class="tree-expand" @click="handleExpand">
        <span v-if="data.children && data.children.length && !data.expand">
          <b-icon name="md-arrow-dropright"></b-icon>
        </span>
        <span v-if="data.children && data.children.length && data.expand">
          <b-icon name="md-arrow-dropdown"></b-icon>
        </span>
      </span>
      <b-checkbox v-if="showCheckbox" :value="data.checked" @on-change="handleCheck"></b-checkbox>
      <span>{{ data.title }}</span>
      <template v-if="data.expand">
        <tree-node v-for="(item, index) in data.children"
                   :key="index" :data="item" :show-checkbox="showCheckbox"
        ></tree-node>
      </template>
    </li>
  </ul>
</template>

<script>
  import { findComponentUpward } from 'bin-ui/src/utils/util'

  export default {
    name: 'TreeNode',
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      showCheckbox: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      tree () {
        return findComponentUpward(this, 'BinTree')
      }
    },
    watch: {
      'data.children': {
        handler (data) {
          if (data) {
            const checkedAll = !data.some(item => !item.checked)
            this.$set(this.data, 'checked', checkedAll)
          }
        },
        deep: true
      }
    },
    methods: {
      handleCheck (checked) {
        this.updateTreeDown(this.data, checked)

        if (this.tree) {
          this.tree.emitEvent('on-check-change', this.data)
        }
      },
      updateTreeDown (data, checked) {
        this.$set(data, 'checked', checked)

        if (data.children && data.children.length) {
          data.children.forEach(item => {
            this.updateTreeDown(item, checked)
          })
        }
      },
      handleExpand () {
        this.$set(this.data, 'expand', !this.data.expand)
        if (this.tree) {
          this.tree.emitEvent('on-toggle-expand', this.data)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .tree-ul, .tree-li {
    list-style: none;
    padding-left: 10px;
  }
  .tree-expand {
    cursor: pointer;
  }
</style>
