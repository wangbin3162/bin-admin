<template>
  <div style="width: 100%;">
    <div flex="box:last">
      <b-input :value="defaultName" placeholder="选择模板" readonly clearable
               @on-clear="handleClear"></b-input>
      <b-button type="primary" plain @click="handleShowModal">选择</b-button>
    </div>
    <b-modal v-model="dialogFormVisible" title="选择业务模板" width="800" class="layout-inner"
             :body-styles="{padding:0}" :mask-closable="false" stop-remove-scroll>
      <v-table-wrap style="padding: 0;">
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="模板名称" :span="8">
            <b-input v-model.trim="listQuery.tempName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="模板编码" :span="8">
            <b-input v-model.trim="listQuery.tempCode" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
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
import commonMixin from '@/common/mixins/mixin'
import permission from '@/common/mixins/permission'
import * as api from '@/api/excavate-analyze/excavate-cfg.api'
import { deepCopy } from '@/common/utils/assist'

export default {
  name: 'DataSourceSelect',
  mixins: [commonMixin, permission],
  inject: ['ConfigRoot'],
  props: {
    value: {
      type: String,
      default: ''
    },
    defaultName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listQuery: {
        tempCode: '',
        tempName: ''
      },
      columns: [
        { type: 'index', width: 50, align: 'center' },
        { title: '模板名称', key: 'tempName' },
        { title: '模板编码', key: 'tempCode' },
        { title: '模板操作', slot: 'action', width: 130, align: 'center' }
      ],
      treeData: [],
      template: null,
      dialogFormVisible: false
    }
  },
  created() {
    this.resetTemplate()
  },
  methods: {
    handleShowModal() {
      this.dialogFormVisible = true
      this.resetQuery()
    },
    // 清空时触发调用
    handleClear() {
      this.current = ''
      this.$emit('input', '')
      this.$emit('on-clear', [])
    },
    // filter-Bar:重置查询条件
    resetQuery() {
      this.listQuery = {
        page: 1,
        size: 10,
        tempName: '',
        tempCode: ''
      }
      this.searchList()
    },
    // 选择一个对象
    chooseOne(temp) {
      // this.current = temp.tempName
      this.$emit('input', temp.id)
      this.$emit('on-select', deepCopy(temp))
      this.dialogFormVisible = false
    },
    // 重置对象
    resetTemplate() {
      this.template = {
        id: '',
        tempName: '',
        tempCode: '',
        tempType: this.currentTreeNode ? this.currentTreeNode.code : '',
        tempSource: '',
        tempDesc: ''
      }
      this.params = []
    },
    // 查询所有列表
    searchList() {
      this.setListData()
      api.businessTemplateList(this.listQuery).then(response => {
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
