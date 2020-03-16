<template>
  <!--校验配置编辑编辑组件 for ResInfoItems.vue -->
  <b-modal v-model="chooseDialog" title="验证规则配置" width="860" class="layout-inner" :mask-closable="false">
    <div style="min-height: 300px;" v-show="status==='normal'">
      <!--控制栏-->
      <div class="mb-15">
        <b-button type="primary"  icon="ios-add-circle-outline" @click="handleCreate">添加规则</b-button>
      </div>
      <b-table :columns="columns" :data="totalData"  disabled-hover>
        <template v-slot:args="scope">
          <template v-for="(arg,key) in scope.row.args">
            <b-tag :key="key" v-if="arg.value && key !=='message'"
                   type="primary"  style="margin-right: 4px;">
              {{arg.title}}= {{ arg.value }}
            </b-tag>
          </template>
        </template>
        <!--操作栏-->
        <template v-slot:action="scope">
          <b-button type="text" @click="handleModify(scope.row,scope.index)">编辑</b-button>
          <b-divider type="vertical"></b-divider>
          <b-button type="text" text-color="danger" @click="handleRemove(scope.row,scope.index)">删除</b-button>
        </template>
      </b-table>
    </div>
    <!--新增修改校验配置项信息-->
    <validate-edit-item v-show="status==='edit'" ref="edit"
                        :drawer-title="drawerTitle"
                        @on-save="handleItemSave"
                        @on-close="status='normal'">
    </validate-edit-item>
    <div slot="footer">
      <b-button @click="chooseDialog = false">取 消</b-button>
      <b-button type="primary" @click="handleSubmit" :disabled="status === 'edit'">确 定</b-button>
    </div>
  </b-modal>
</template>

<script>
  import ValidateEditItem from './ValidateEditItem'
  import { jsonDataToList, listToJsonStr } from './validate.cfg'
  import { deepCopy } from '../../../../../common/utils/assist'

  export default {
    name: 'ValidateEdit',
    components: { ValidateEditItem },
    data() {
      return {
        columns: [
          { title: '规则', key: 'title', width: 120, tooltip: true },
          { title: '说明', key: 'desc', width: 200, tooltip: true },
          { title: '规则参数', slot: 'args' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ],
        totalData: [], // 实际操作的值
        chooseDialog: false,
        currentIndex: -1,
        status: 'normal', // normal edit 两种状态,默认显示
        drawerTitle: '新增验证规则'
      }
    },
    methods: {
      open(valid) {
        if (valid.length > 0) {
          jsonDataToList(valid).then(res => {
            this.totalData = res.data
          })
        }
        this.totalData = []
        this.chooseDialog = true
        this.status = 'normal'
      },
      handleCreate() {
        this.drawerTitle = '新增验证规则'
        this.status = 'edit'
        this.$refs.edit.open()
      },
      handleModify(row, index) {
        this.drawerTitle = '修改验证规则'
        this.currentIndex = index
        this.status = 'edit'
        this.$refs.edit.open(row)
      },
      handleRemove(row, index) {
        this.totalData.splice(index, 1) // 清除一个未保存的项
      },
      handleItemSave(item) {
        let func = this.drawerTitle === '新增验证规则' ? this.addOneRule : this.modifyOneRule
        func(item)
      },
      // 添加一个校验规则
      addOneRule(item) {
        this.totalData.push(item)
        this.status = 'normal'
      },
      // 修改一个校验规则
      modifyOneRule(item) {
        if (this.currentIndex !== -1) {
          let ret = deepCopy(this.totalData)
          ret[this.currentIndex] = item
          this.totalData = ret
          this.currentIndex = -1
        }
        this.status = 'normal'
      },
      handleSubmit() {
        let rules = listToJsonStr(this.totalData)
        this.chooseDialog = false
        this.$emit('on-save', rules)
      }
    }
  }
</script>
