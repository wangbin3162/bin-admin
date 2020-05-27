<template>
  <!--联合部门编辑-->
  <b-modal v-model="editModal" title="联合部门编辑" width="840">
    <div flex="box:mean" style="border: 1px solid #d9d9d9;">
      <div style="border-right: 1px solid #d9d9d9;">
        <div style="padding: 10px; border-bottom: 1px solid #d9d9d9;">联合部门</div>
        <div class="p10" style="max-height: 400px;overflow: auto;">
          <b-tree :data="departTree" lock-select show-checkbox check-strictly check-directly
                  @on-check-change="handleCheckChange"/>
        </div>
      </div>
      <div>
        <div style="padding: 10px; border-bottom: 1px solid #d9d9d9;">
          已选部门<span style="color: #f5222d;">({{ checkedCount }})</span>
        </div>
        <div class="p10" style="max-height: 400px;overflow: auto;">
          <b-tree :data="departCheckedData" lock-select empty-text="没有已选部门"/>
        </div>
      </div>
    </div>
    <div slot="footer">
      <b-button @click="editModal = false">关 闭</b-button>
      <b-button type="primary" @click="handleSave">保 存</b-button>
    </div>
  </b-modal>
</template>

<script>
  import { getDeptTree } from '../../../api/urp/urp-depart.api'
  import { typeOf } from '../../../common/utils/assist'

  export default {
    name: 'UnionDeptCfg',
    data() {
      return {
        editModal: false,
        initDeparts: [], // 原始的联合部门树结构，
        departTree: [], // 树组件需要格式化后的数据
        departCheckedData: [], // 勾选的树结构数据，用于保存至已勾选处
        checkedCount: 0 // 已勾选的部门总和
      }
    },
    created() {
      this.initTree()
    },
    methods: {
      // 编辑联合部门(已选择的部门树结构)
      open(readyDeparts) {
        this.readyDeparts = this.tiledReadyDeparts(readyDeparts) // 已选择的部门树结构平铺
        this.editModal = true
        // 打开时需要mapper映射初始化一次
        if (this.initDeparts.length > 0) {
          this.departTree = [this.treeMapper(this.initDeparts[0])]
        }
      },
      handleSave() {
        this.editModal = false
        // 已勾选的数组和已选部门总数量
        this.$emit('on-save', this.departCheckedData, this.checkedCount)
      },
      // 平铺树结构
      tiledReadyDeparts(readyDeparts) {
        let all = []
        const mapper = (node) => {
          all.push([node.id, {
            id: node.id,
            title: node.title,
            departLevel: node.departLevel,
            departId: node.departId,
            checked: node.checked // 这里后面加入已选的平铺id来判断
          }])
          if (node.children) {
            node.children.forEach(item => {
              mapper(item)
            })
          }
        }
        readyDeparts.forEach(item => {
          mapper(item)
        })
        return all
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
        let readyDepartsMap = new Map(this.readyDeparts)
        return {
          id: node.id,
          title: node.text,
          departLevel: node.departLevel,
          departId: node.departId,
          checked: readyDepartsMap.has(node.id), // 已选的平铺id来判断是否是勾选过的
          expand: true,
          children: (node.children && node.children.map(this.treeMapper)) || []
        }
      },
      // 勾选复选框时触发条件
      handleCheckChange(checkList, current) {
        this.checkedCount = checkList.length
        // 每次勾选后，筛选过滤checked=true的新型树结构
        this.departCheckedData = this.checkedTreeMapper()
      },
      // 筛选已勾选的联合部门树
      checkedTreeMapper() {
        let checkedTree = []
        let mapper = node => {
          if (node.checked) { // 如果被勾选了，则递归继续添加
            let child = []
            if (node.children) {
              node.children.forEach(item => {
                // ======根据返回是否是对象判断当前节点是不是被选中==== //
                let map = mapper(item)
                if (typeOf(map) === 'object') {
                  child.push(map)
                } else {
                  map.forEach(i => {
                    child.push(i)
                  })
                }
              })
            }
            return {
              id: node.id,
              title: node.title,
              departLevel: node.departLevel,
              departId: node.departId,
              checked: node.checked, // 这里后面加入已选的平铺id来判断
              expand: true,
              children: child
            }
          } else {
            let child = []
            if (node.children) {
              node.children.forEach(item => {
                // ======根据返回是否是对象判断当前节点是不是被选中==== //
                let map = mapper(item)
                if (typeOf(map) === 'object') {
                  child.push(map)
                } else {
                  map.forEach(i => {
                    child.push(i)
                  })
                }
              })
            }
            return child
          }
        }
        this.departTree.forEach(topNode => {
          let map = mapper(topNode)
          if (typeOf(map) === 'object') {
            checkedTree.push(map)
          } else {
            map.forEach(node => {
              checkedTree.push(node)
            })
          }
        })
        return checkedTree
      }
    }
  }
</script>
