<template>
  <!--节点选择 for switching-scheme -->
  <div>
    <div flex>
      <b-input :value="current" placeholder="选择填充" :disabled="disabledBtn" readonly clearable @on-clear="handleClear"
               flex-box="1"></b-input>
      <div v-if="!disabledBtn">
        <b-button type="primary" v-waves @click="handleShowModal"
                  style="font-size: 12px;height: 36px;" size="">
          选择
        </b-button>
      </div>
    </div>
    <b-modal v-model="dialogFormVisible" title="选择节点" width="860" class="layout-inner" :mask-closable="false">
      <div>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="节点名称">
            <b-input v-model="listQuery.nodeName" clearable size="small"></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <!--节点类型-->
          <template v-slot:nodeType="scope">{{ nodeTypeMap[scope.row.nodeType] }}</template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="primary" size="mini" plain @click="chooseOne(scope.row)">
              选择
            </b-button>
          </template>
        </b-table>
      </div>
      <div slot="footer">
        <!--下方分页器-->
        <b-page :total="total" show-sizer
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { getExchangeNodeList } from '../../../../../api/data-manage/switching-node.api'
  import { getExchangeNodeType } from '../../../../../api/enum.api'

  export default {
    name: 'NodeChoose',
    mixins: [commonMixin, permission],
    props: {
      value: {
        type: String,
        default: ''
      },
      defaultName: {
        type: String,
        default: ''
      },
      nodeType: {
        type: String,
        default: ''
      },
      disabledBtn: {
        type: Boolean,
        default: false
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
    data() {
      return {
        dialogFormVisible: false,
        listQuery: {
          nodeName: '', // 名称
          nodeType: ''
        },
        columns: [
          { title: '节点名称', key: 'nodeName' },
          { title: '节点编码', key: 'nodeCode', align: 'center', width: 180 },
          { title: '节点类型', slot: 'nodeType', align: 'center' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        current: '',
        nodeTypeMap: {}
      }
    },
    created() {
      this.getEnum()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          nodeName: '', // 名称
          nodeType: this.nodeType
        }
        this.handleFilter()
      },
      handleShowModal() {
        this.dialogFormVisible = true
        this.resetQuery()
      },
      chooseOne(item) {
        this.current = item.nodeName
        this.$emit('on-select', { code: item.nodeCode, name: item.nodeName })
        this.dialogFormVisible = false
      },
      // 清空时触发调用
      handleClear() {
        this.$emit('on-select', { code: '', name: '' })
      },
      // 通用枚举
      getEnum() {
        // 数据源类型枚举
        getExchangeNodeType().then(res => {
          if (res.status === 200) {
            this.nodeTypeMap = res.data.data
          }
        })
      },
      // 查询所有数据源信息
      searchList() {
        this.setListData()
        getExchangeNodeList(this.listQuery).then(response => {
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
