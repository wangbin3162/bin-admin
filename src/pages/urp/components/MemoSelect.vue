<template>
  <div style="width: 100%;">
    <div flex="box:last cross:center">
      <b-input v-model="current" placeholder="选择备忘录" readonly clearable @on-clear="handleClear"/>
      <b-button type="primary" @click="handleShowModal" plain>选择</b-button>
    </div>
    <b-modal v-model="dialogFormVisible" title="选择备忘录" width="840" append-to-body
             :mask-closable="false" :body-styles="{padding:0}">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="备忘录名称">
            <b-input v-model.trim="listQuery.memoName" placeholder="请输入" clearable/>
          </v-filter-item>
          <v-filter-item title="备忘录类型">
            <b-select v-model="listQuery.memoType" placeholder="全部" clearable>
              <b-option v-for="(val,key) in memoTypeMap" :key="key" :value="key">{{ val }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <template v-slot:memoType="{row}">{{ memoTypeMap[row.memoType] }}</template>
          <template v-slot:memoStatus="{row}">{{ memoStatusMap[row.memoStatus] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button type="text" @click="chooseOne(row)">选择</b-button>
          </template>
        </b-table>
      </v-table-wrap>
      <div slot="footer">
        <!--下方分页器-->
        <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getMemoList } from '../../../api/urp/memo.api'

  export default {
    name: 'MemoSelect',
    mixins: [commonMixin, permission],
    props: {
      value: { // 存储id
        type: String,
        default: ''
      },
      defaultName: { // 显示名称
        type: String,
        default: ''
      }
    },
    data() {
      return {
        current: '', // 显示名称
        dialogFormVisible: false,
        listQuery: {
          memoName: '',
          memoType: '',
          memoStatus: '1'
        },
        memoTypeMap: { '1': '惩戒', '2': '激励' },
        memoStatusMap: { '0': '通报', '1': '实施', '2': '过期' },
        columns: [
          { title: '备忘录名称', key: 'memoName', tooltip: true },
          { title: '备忘录类型', slot: 'memoType', align: 'center', width: 120 },
          { title: '发起部门', key: 'initiateDeptName' },
          { title: '联合部门数', key: 'unionNum', align: 'center', width: 120 },
          { title: '备忘录状态', slot: 'memoStatus', align: 'center', width: 120 },
          { title: '操作', slot: 'action', width: 100 }
        ]
      }
    },
    watch: {
      defaultName: {
        handler(val) {
          this.current = val
        },
        immediate: true
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          memoName: '',
          memoType: '',
          memoStatus: '1'
        }
        this.handleFilter()
      },
      // 打开弹窗
      handleShowModal() {
        this.dialogFormVisible = true
        this.resetQuery()
      },
      // 清空时触发调用
      handleClear() {
        this.current = ''
        this.$emit('input', '')
        this.$emit('on-change', { id: '', memoName: '' })
      },
      // 选择一个
      chooseOne(row) {
        this.current = row.memoName
        this.$emit('input', row.id)
        this.$emit('on-change', { id: row.id, memoName: row.memoName })
        this.dialogFormVisible = false
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        getMemoList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>
