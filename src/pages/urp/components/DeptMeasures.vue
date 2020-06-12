<template>
  <div>
    <div class="dept-measures-wrap">
      <div class="depart">
        <div class="title" flex="main:justify">
          <span>联合部门&nbsp;<span
            style="color: #f5222d;font-weight: normal;font-size: 14px;">({{ unionDeptCount }})</span></span>
          <b-button type="text" @click="handleEditDept">编辑</b-button>
        </div>
        <div class="depart-inner">
          <b-tree :data="unionDeparts" @on-select-change="handTreeCurrentChange"/>
        </div>
      </div>
      <div class="measures">
        <div class="title">
          <span>处置措施</span>
        </div>
        <div class="measures-inner">
          <div v-for="(item,index) in currentMeasures" :key="item.id||index" class="item">
            <measure-checkbox v-model="currentMeasures[index].isUse" :item="item" v-if="filterMeasure === item.measureType"
                              @on-change="handleMeasureChange"/>
          </div>
          <b-empty v-show="currentMeasures.length===0">暂无处置措施</b-empty>
        </div>
      </div>
    </div>
    <!--    <div>-->
    <!--      <b-tag>平铺的部门列表</b-tag>-->
    <!--      {{ tiledDeparts }}-->
    <!--    </div>-->
    <!--    <div>-->
    <!--      <div>{{tiledMeasures}}</div>-->
    <!--      <b-code-editor class="mt-20" :value="JSON.stringify(unionDeparts,null,2)" readonly/>-->
    <!--    </div>-->
    <union-dept-cfg ref="unionDeptCfg" @on-save="handleSaveUnionDept"/>
  </div>
</template>

<script>
  import UnionDeptCfg from './UnionDeptCfg'
  import MeasureCheckbox from './MeasureCheckbox'
  import { removeMeasure } from '../../../api/urp/measure.api'

  export default {
    name: 'DeptMeasures',
    components: { MeasureCheckbox, UnionDeptCfg },
    props: {
      departs: {
        type: Array,
        default() {
          return []
        }
      },
      deptMeasures: { // 所有的部门处置措施映射列表
        type: Array,
        default() {
          return []
        }
      },
      memoType: { // 备忘录类型
        type: String
      }
    },
    data() {
      return {
        unionDeparts: [], // 联合部门，这里需要和所有部门处置措施列表绑定，以便后续进行操作修改
        unionDeptCount: 0,
        currentTreeNode: null, // 当前选择的联合部门
        tiledDeparts: [], // 平铺的部门
        tiledMeasures: [], // 平铺的措施列表
        measureTypeMap: { '1': 'P', '2': 'R' }
      }
    },
    computed: {
      // 部门-措施映射map
      deptMeasuresMap() {
        let arr = []
        this.deptMeasures.forEach(item => {
          arr.push([item.id, item.measures || []])
        })
        return new Map(arr)
      },
      // 当前节点的措施列表
      currentMeasures() {
        return this.currentTreeNode ? this.currentTreeNode.measures : []
      },
      // 已勾选的措施列表去重数组（用于递归判断子孙节点时进行取值）
      measuresNames() {
        let arr = this.tiledMeasures.map(item => item.measureName)
        return [...new Set(arr)]
      },
      filterMeasure() {
        return this.measureTypeMap[this.memoType]
      }
    },
    watch: {
      departs: {
        handler(val) {
          // 保存联合部门
          // 先清空
          this.currentTreeNode = null
          this.handleSaveUnionDept(val)
        },
        immediate: true
      }
    },
    created() {
    },
    methods: {
      // 树结构点击事件
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
      },
      // 措施点击改变事件
      handleMeasureChange(val, item) {
        if (val === '1') {
          this.addTiledMeasures(item)
        } else {
          this.removeTiledMeasures(item)
        }
      },
      // 添加已经勾选的措施列表，续判断是否存在
      addTiledMeasures(item) {
        let hasSame = this.tiledMeasures.findIndex(i => i.measureId === item.id) > -1
        if (!hasSame) {
          this.tiledMeasures.push({
            measureId: item.id,
            measureName: item.measureName,
            measureType: item.measureType
          })
          // 递归更新当前部门及子孙节点的措施选择
          this.changeChildrenMeasure(this.currentTreeNode, item)
          this.emitValue()
        }
      },
      // 移除已经勾选的措施列表，续判断是否存在
      removeTiledMeasures(item) {
        let index = this.tiledMeasures.findIndex(i => i.measureId === item.id)
        if (index > -1) {
          this.tiledMeasures.splice(index, 1)
          this.emitValue()
        }
      },
      // 传入node节点，更新其子集的选中
      changeChildrenMeasure(node, measure) {
        let child = node.children
        if (child) {
          child.forEach(item => {
            item.measures = item.measures.map(i => {
              if (this.measuresNames.indexOf(i.measureName) > -1 && measure.isUse === '1') {
                // 需要再额外添加一个缓存的处置措施
                this.addTiledMeasures(i)
                return { ...i, isUse: '1' }
              }
              return { ...i }
            })
            this.changeChildrenMeasure(item, measure)
          })
        }
      },
      // 编辑联合部门
      handleEditDept() {
        this.$refs.unionDeptCfg && this.$refs.unionDeptCfg.open(this.unionDeparts)
      },
      // 保存联合部门
      handleSaveUnionDept(departs, count) {
        // 填充带有措施的部门树
        this.unionDeparts = this.mapperWithMeasures(departs)
        // 如果没有选择任何部门 措施列表清空
        if (this.unionDeparts.length < 1) {
             this.currentTreeNode = null
        }
        // 填充平铺部门列表
        this.tiledDeparts = this.tiledReadyDeparts(departs)
        // 填充平铺措施列表
        this.tiledMeasures = this.tiledReadyMeasures()
        // 填充部门总数
        this.unionDeptCount = count || this.tiledDeparts.length
        if (this.unionDeparts.length > 0) {
          this.$set(this.unionDeparts[0], 'selected', true)
          this.currentTreeNode = this.unionDeparts[0]
        }
        this.emitValue()
      },
      emitValue() {
        this.$emit('on-change', this.tiledDeparts, this.tiledMeasures, this.unionDeptCount)
      },
      // 递归映射，用于追加部门对应的措施数组
      mapperWithMeasures(departs) {
        let newTree = []
        let mapper = node => {
          let cs = this.deptMeasuresMap.get(node.id).map(i => {
            return {
              id: i.id,
              measureName: i.measureName,
              departId: i.departId,
              isUse: i.isUse,
              measureType: i.measureType
            }
          })
          return {
            id: node.id,
            title: node.title || node.text,
            expand: node.expand || true,
            selected: false,
            children: (node.children && node.children.map(mapper)) || [],
            measures: cs
          }
        }
        departs.forEach(topNode => {
          newTree.push(mapper(topNode))
        })
        return newTree
      },
      // 平铺树结构
      tiledReadyDeparts(readyDeparts) {
        let all = []
        const mapper = (node) => {
          all.push({ departId: node.id, departName: node.title || node.text })
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
      // 循环遍历措施列表，将已勾选的措施填充值平铺 措施列表
      tiledReadyMeasures() {
        let arr = []
        this.deptMeasures.forEach(dept => {
          if (dept.measures) {
            dept.measures.forEach(measure => {
              if (measure.isUse === '1') {
                arr.push({
                  measureId: measure.id,
                  measureName: measure.measureName,
                  measureType: measure.measureType
                })
              }
            })
          }
        })
        return arr
      },
      // 清空已经选中的措施
      clearMeasures(memoType) {
          if (this.tiledMeasures.length > 0) {
            /* this.tiledMeasures.forEach((measure, index) => {
                 if (measure.measureType !== this.measureTypeMap[memoType]) {
                     this.tiledMeasures.splice(index, 1)
                 }
             })
              */
              this.tiledMeasures = []
          }
          this.unionDeparts.forEach((item) => {
              this.removeDeptMeasures(item, memoType)
          })
          this.emitValue()
      },
      // 根据备忘录类型解绑措施
      removeDeptMeasures(item, memoType) {
          if (item.measures) {
              item.measures.forEach((measure) => {
                  if (measure.measureType !== this.measureTypeMap[memoType]) {
                      measure.isUse = '0'
                  }
              })
          }
          if (item.children) {
              item.children.forEach(item => {
                  this.removeDeptMeasures(item, memoType)
              })
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
      min-width: 300px;
      border-right: 1px solid #d9d9d9;
      &-inner {
        padding: 15px;
      }
    }
    .measures {
      flex: auto;
      &-inner {
        padding: 10px 20px;
        .item {
          line-height: 35px;
        }
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
