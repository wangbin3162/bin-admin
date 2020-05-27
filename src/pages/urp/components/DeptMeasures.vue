<template>
  <div class="dept-measures-wrap">
    <div class="depart">
      <div class="title" flex="main:justify">
        <span>联合部门</span>
        <b-button type="text" @click="handleEditDept">编辑</b-button>
      </div>
      <div class="depart-inner">联合部门tree</div>
    </div>
    <div class="measures">
      <div class="title">
        <span>处置措施</span>
      </div>
      <div class="measures-inner">处置措施内容</div>
    </div>
    <!--联合部门编辑-->
    <b-modal v-model="editModal" title="联合部门编辑">
      <b-tree :data="departTree" lock-select show-checkbox/>
      <b-code-editor :value="JSON.stringify(departTree,null,2)" readonly/>
      <div slot="footer">
        <b-button @click="editModal = false">关 闭</b-button>
        <b-button type="primary">保 存</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { getDeptTree } from '../../../api/urp/urp-depart.api'

  export default {
    name: 'DeptMeasures',
    props: {
      departs: {
        type: Array,
        default() {
          return []
        }
      },
      deptMeasuresMap: { // 所有的部门处置措施映射列表
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        editModal: false,
        initDeparts: [], // 原始的联合部门树结构，
        departTree: [] // 树组件需要格式化后的数据
      }
    },
    watch: {},
    created() {
      this.initTree()
    },
    methods: {
      // 编辑联合部门
      handleEditDept() {
        this.editModal = true
        // 打开时需要mapper映射初始化一次
        if (this.initDeparts.length > 0) {
          this.departTree = [this.treeMapper(this.initDeparts[0])]
          this.$set(this.departTree[0], 'expand', true)
        }
      },
      // tree:初始化树结构
      initTree() {
        this.initDeparts = []
        // 请求响应返回树结构
        getDeptTree().then(response => {
          this.initDeparts = response.data.data || [] // 缓存初始化树结构数组
        })
      },
      // 默认的初始化联合部门递归树
      treeMapper(node) {
        return {
          id: node.id,
          title: node.text,
          departLevel: node.departLevel,
          departId: node.departId,
          checked: false, // 这里后面加入已选的平铺id来判断
          expand: false,
          children: (node.children && node.children.map(this.treeMapper)) || []
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .dept-measures-wrap {
    display: flex;
    border: 1px solid #d9d9d9;
    .depart {
      width: 300px;
      border-right: 1px solid #d9d9d9;
      &-inner {
        padding: 15px;
      }
    }
    .measures {
      flex: auto;
      &-inner {
        padding: 15px;
      }
    }
    .title {
      padding: 10px 15px;
      font-size: 16px;
      font-weight: bold;
      background: #fafafa;
      border-bottom: 1px solid #eeeeee;
    }
  }
</style>
