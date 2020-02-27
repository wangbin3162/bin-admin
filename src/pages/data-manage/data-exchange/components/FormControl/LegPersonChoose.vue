<template>
  <!--法人选择框 for form-control -->
  <div flex>
    <b-input v-model="current" :placeholder="placeholder" readonly clearable @on-clear="handleClear"></b-input>
    <b-button type="primary" v-waves @click="handleShowModal"
              style="padding: 10px;margin-left: 4px;font-size: 12px;">
      选择法人
    </b-button>
    <!--选择法人弹窗 for ResInfo.vue -->
    <b-modal v-model="dialogFormVisible" title="选择法人" width="860" class="layout-inner" :mask-closable="false">
      <v-table-layout>
        <!--查询条件-->
        <v-filter-bar slot="filter">
          <v-filter-item title="名称" width="230px">
            <b-input v-model.trim="listQuery.compName" size="small" placeholder="输入名称" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table slot="table" :columns="columns" :data="list" :loading="listLoading"
                 stripe max-height="360" ref="table" :width="820" size="small">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="primary" size="mini" plain @click="chooseOne(scope.row)" v-waves>
              选择
            </b-button>
          </template>
        </b-table>
      </v-table-layout>
      <div slot="footer" class="t-right">
        <!--下方分页器-->
        <b-page slot="pager" :total="total" show-sizer
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { getLegList } from '../../../../../api/dir/gather.api'

  export default {
    name: 'LegPersonChoose',
    mixins: [commonMixin, permission],
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        listQuery: {
          compName: '' // 名称
        },
        columns: [
          { title: '名称', key: 'compName' },
          { title: '证件类型', key: 'idTypeName' },
          { title: '证件类型', key: 'idCode' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        current: ''
      }
    },
    watch: {
      value: {
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
          compName: '' // 名称
        }
        this.handleFilter()
      },
      handleShowModal() {
        this.dialogFormVisible = true
        this.resetQuery()
      },
      chooseOne(item) {
        this.$emit('on-select-leg', {
          id: item.id,
          compName: item.compName,
          idType: item.idType,
          idCode: item.idCode
        })
        this.dialogFormVisible = false
      },
      // 清空时触发调用
      handleClear() {
        this.$emit('on-select-leg', {
          id: '',
          compName: '',
          idType: '',
          idCode: ''
        })
      },
      // 查询所有法人列表
      searchList() {
        this.setListData()
        getLegList(this.listQuery).then(response => {
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
