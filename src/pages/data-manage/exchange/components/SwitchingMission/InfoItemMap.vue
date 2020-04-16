<template>
  <!--信息项映射 for SwitchingMission.vue -->
  <div>
    <div class="info-item-map">
      <!--源资源-->
      <div class="source-res">
        <b-tag type="primary" style="margin-bottom: 5px;">源资源</b-tag>
        <b-table :columns="columns1" :data="fields1" highlight-row max-height="475" size="small"
                 ref="sourceTable"
                 @on-row-click="handleSourceClick">
          <template #name="{row}">
            <span :title="row.desc">{{ row.name }}</span>
          </template>
        </b-table>
        <div>{{currentRow1}}</div>
      </div>
      <!--目标资源-->
      <div class="target-res">
        <b-tag type="danger" style="margin-bottom: 5px;">目标资源</b-tag>
        <b-table :columns="columns2" :data="fields2" highlight-row max-height="475" size="small"
                 @on-current-change="handleCurrentChange2">
          <template #name="{row}">
            <span :title="row.desc">{{ row.name }}</span>
          </template>
        </b-table>
        <div>{{currentRow2}}</div>
      </div>
      <!--操作-->
      <div class="ctrl">
        <b-button plain type="primary" style="width: 95%;margin: 0 0 5px 0;"
                  @click="autoMap">
          自动映射
        </b-button>
        <b-button plain type="primary" style="width: 95%;margin: 0;" @click="handleAdd">
          移 动
          <b-icon name="ios-arrow-round-forward"/>
        </b-button>
      </div>
      <!--映射关系-->
      <div class="map-res">
        <b-tag type="success" style="margin-bottom: 5px;">映射关系</b-tag>
        <b-table :columns="columns3" :data="itemMaps" max-height="475" size="small">
          <template #targetName="{row}">
            <span :title="row.desc">{{ row.targetName }}</span>
          </template>
          <template v-slot:defaultValue="scope">
          </template>
          <template v-slot:action="{row,index}">
            <b-icon name="ios-remove-circle-outline" size="20" :style="{...colorDanger,cursor:'pointer'}"
                    @click.native="cancelOneMap(row)"/>&nbsp;
            <b-tooltip content="字典项" theme="light" style="padding-top: 3px;"
                       v-if="itemMaps[index].type === 'SELECT'">
              <b-icon name="ios-options" size="20" :style="{...colorPrimary,cursor:'pointer'}"
                      @click.native="editDict(row)"/>
            </b-tooltip>&nbsp;
          </template>
        </b-table>
      </div>
    </div>
    <!--添加字典项配置弹窗-->
    <b-modal v-model="dialogFormVisible" width="800" title="配置映射">
      <template>
        <div style="padding: 0 140px 5px 5px;" flex="box:mean">
          <span class="mr-15">源值</span><span>目标值</span>
        </div>
        <div flex="box:last" v-for="item in dictMaps" :key="item.sourceKey" class="mb-5">
          <b-input class="mr-10" v-model="item.sourceKey"
                   placeholder="请输入键"></b-input>
          <b-input v-model="item.sourceValue"
                   placeholder="请输入值"></b-input>
          <!--操作栏-->
          <div style="width: 140px;padding:4px 0 0 10px; text-align: center;">
            <b-button type="danger" icon="ios-remove-circle" transparent
                      @click="removeBufferRow(item)">移除
            </b-button>
          </div>
        </div>
        <div class="pt-20">
          <b-button type="primary" icon="ios-add-circle-outline"
                    plain @click="addBufferRow">
            添加配置
          </b-button>
        </div>
      </template>
      <div slot="footer">
        <b-button @click="dialogFormVisible = false">取 消</b-button>
        <b-button type="primary" @click="confSave">确 定</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import { deepCopy } from '../../../../../common/utils/assist'

  export default {
    name: 'InfoItemMap',
    mixins: [commonMixin],
    props: {
      value: {
        type: String,
        default: ''
      },
      oneList: {
        type: Array,
        default() {
          return []
        }
      },
      twoList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          try {
            this.itemMaps = val.length > 0 ? JSON.parse(val) : []
          } catch (e) {
            this.itemMaps = []
          }
        },
        immediate: true
      },
      oneList: {
        handler(val) {
          this.fields1 = []
          val.forEach(item => {
            if (this.itemMaps.length > 0) {
              let notIn = this.itemMaps.every(current => current.sourceName !== item.name)
              if (notIn) { // name不在itemMaps中
                this.fields1.push(item)
              }
            } else {
              this.fields1.push(item)
            }
          })
        },
        immediate: true
      },
      twoList: {
        handler(val) {
          this.fields2 = []
          val.forEach(item => {
            if (this.itemMaps.length > 0) {
              let notIn = this.itemMaps.every(current => current.targetName !== item.name)
              if (notIn) { // name不在itemMaps中
                this.fields2.push(item)
              }
            } else {
              this.fields2.push(item)
            }
          })
        },
        immediate: true
      }
    },
    data() {
      return {
        columns1: [
          { title: '信息项', slot: 'name' }
        ],
        columns2: [
          { title: '信息项', slot: 'name' },
          {
            title: '是否必填',
            render: (h, params) => {
              return h('span', params.row.required ? '是' : '否')
            },
            width: 88,
            align: 'center'
          }
        ],
        columns3: [
          { title: '源信息项', key: 'sourceName', width: 150 },
          { title: '目标信息项', slot: 'targetName', width: 150 },
          { title: '默认值', slot: 'defaultValue' },
          { title: '操作', slot: 'action', width: 90 }
        ],
        fields1: [],
        fields2: [],
        itemMaps: [],
        dictMaps: [
          { sourceKey: '', sourceValue: '' }
        ],
        conf: {},
        dialogFormVisible: false, // 编辑页是否显示
        currentRow1Index: -1, // 第一个表格选中的行索引
        currentRow1: null, // 第一个表格选中的行
        currentRow2: null // 第2个表格选中的行
      }
    },
    methods: {
      editDict(row) {
        this.resetDictMaps()
        this.conf = { ...row }
        if (this.itemMaps[this.conf._index].dictMap) {
          this.dictMaps = this.itemMaps[this.conf._index].dictMap
        }
        this.openDialog('create')
      },
      // 打开窗口
      openDialog(status) {
        this.dialogFormVisible = true
        this.dialogStatus = status
      },
      // 添加一行选项
      addBufferRow() {
        this.dictMaps.push({ sourceKey: '', sourceValue: '' })
      },
      // 删除一行
      removeBufferRow(item) {
        let index = this.dictMaps.indexOf(item)
        this.dictMaps.splice(index, 1)
      },
      // 保存配置
      confSave() {
        let arr = this.dictMaps.map((item) => {
          return {
            sourceKey: item.sourceKey,
            sourceValue: item.sourceValue
          }
        })
        this.itemMaps[this.conf._index].dictMap = this.dictMaps
        this.itemMaps[this.conf._index].dict = arr
        this.dialogFormVisible = false
      },
      // 添加一个映射
      handleAdd() {
        if (!this.currentRow2) {
          this.$message({ type: 'danger', content: '目标资源必须选择！' })
          return
        }
        // 拼接一条新数据至映射数组
        this.itemMaps.push({
          sourceName: this.currentRow1 ? this.currentRow1.name : '',
          targetName: this.currentRow2.name,
          type: this.currentRow2.type,
          desc: this.currentRow2.desc,
          dictMap: '',
          dict: ''
        })
        // 移除前两个表格中的对应数据
        this.removeTableRow()
        // 更新响应值
        this.emitValue()
      },
      // 取消一个映射
      cancelOneMap(row) {
        // 显示恢复至两个表格
        this.unshiftTable(row.sourceName, row.targetName)
        // 移除我自己
        this.itemMaps.splice(row._index, 1)
        // 更新响应值
        this.emitValue()
      },
      // 自动映射
      autoMap() {
        this.$confirm({
          title: '确定执行自动映射吗？',
          content: '执行自动映射会取消已添加的映射。',
          loading: true,
          onOk: () => {
            // 清空自动映射
            this.itemMaps = []
            // 自动映射时以targetSource为基础即以fields2集合做遍历，并对fields1集合逐一匹配，如有名称相同的则push至右侧映射列表
            for (let i = 0; i < this.twoList.length; i++) {
              let target = this.twoList[i]
              for (let j = 0; j < this.oneList.length; j++) {
                let source = this.oneList[j]
                if (source.name === target.name) {
                  let index1 = this.fields1.findIndex(i => i.name === source.name)
                  let index2 = this.fields2.findIndex(i => i.name === target.name)
                  // 拼接一条新数据至映射数组
                  this.itemMaps.push({
                    sourceName: source.name,
                    targetName: target.name,
                    type: target.type,
                    desc: target.desc,
                    dictMap: '',
                    dict: ''
                  })
                  // 移除两个匹配项
                  if (index1 !== -1) {
                    this.fields1.splice(index1, 1)
                  }
                  if (index2 !== -1) {
                    this.fields2.splice(index2, 1)
                  }
                }
              }
            }
            this.$message({ type: 'success', content: '操作成功' })
            this.$modal.remove()
            // 更新响应值
            this.emitValue()
          }
        })
      },
      // 移除两个表格的选中项
      removeTableRow() {
        if (this.currentRow1) {
          let index1 = this.fields1.findIndex(i => i.name === this.currentRow1.name)
          this.fields1.splice(index1, 1)
          this.currentRow1 = null
        }
        if (this.currentRow2) {
          let index2 = this.fields2.findIndex(i => i.name === this.currentRow2.name)
          this.fields2.splice(index2, 1)
          // 清空两个缓存行
          this.currentRow2 = null
        }
      },
      // 取消映射后从顶部恢复两个项
      unshiftTable(sourceName, targetName) {
        let row1 = this.oneList.find(i => i.name === sourceName)
        let row2 = this.twoList.find(i => i.name === targetName)
        // 给顶部塞入（恢复）两个值
        if (row1) {
          this.fields1.unshift(row1)
        }
        if (row2) {
          this.fields2.unshift(row2)
        }
      },
      // 源资源行点击触发
      handleSourceClick(currentRow, index) {
        if (this.currentRow1Index !== index) {
          this.currentRow1Index = index
          this.currentRow1 = currentRow
          return
        }
        this.$refs.sourceTable.clearCurrentRow()
        this.currentRow1Index = -1
        this.currentRow1 = null
      },
      // 目标资源当前行改变
      handleCurrentChange2(currentRow) {
        this.currentRow2 = currentRow
      },
      // 重置对象
      resetDictMaps() {
        // this.dictMaps = [],
        // this.dictMaps.push({ sourceKey: '', sourceValue: '' }),
        this.conf = {}
      },
      // 更新响应值
      emitValue() {
        let arr = this.itemMaps.map((item, index) => {
          return {
            sourceName: item.sourceName,
            targetName: item.targetName,
            type: item.type,
            desc: item.desc,
            dictMap: item.dict,
            colNo: index
          }
        })
        // 将itemMaps视图数组映射和target是否所有必填字段都映射的状态返回
        // 是否存在必填项没有映射
        let hasRequired = this.fields2.reduce((total, current) => {
          return total || current.required
        }, false)
        this.$emit('on-change', JSON.stringify(arr), hasRequired)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .info-item-map {
    display: flex;
    .source-res {
      width: 230px;
      padding-right: 10px;
    }
    .target-res {
      width: 250px;
    }
    .ctrl {
      width: 120px;
      padding: 100px 10px 0;
    }
    .map-res {
      width: calc(100% - 600px);
    }
  }
</style>
