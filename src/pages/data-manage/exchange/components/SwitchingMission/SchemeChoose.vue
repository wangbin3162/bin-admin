<template>
  <!--方案选择 for SwitchingMission.vue -->
  <div>
    <div flex="box:last">
      <b-input v-model="current" placeholder="选择填充" readonly clearable @on-clear="handleClear"></b-input>
      <b-button type="primary" @click="handleShowModal" style="padding: 10px;margin-left: 0;font-size: 12px;">
        选择
      </b-button>
    </div>
    <b-modal v-model="dialogFormVisible" title="选择交换方案" width="860" class="layout-inner" :mask-closable="false">
      <div>
        <!--查询条件-->
        <v-filter-bar slot="filter">
          <v-filter-item title="方案名称">
            <b-input v-model="listQuery.cfgName" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table slot="table" :columns="columns" :data="list" :loading="listLoading"
                 stripe max-height="360" ref="table" :width="820" size="small">
          <template v-slot:flowDirection="scope">{{ flowDirectionMap[scope.row.flowDirection] }}</template>
          <template v-slot:changeType="scope">{{ exchangeTypeMap[scope.row.changeType] }}</template>
          <template v-slot:transmitKind="scope">{{ transmitKindMap[scope.row.transmitKind] }}</template>
          <template v-slot:status="scope">
            <span v-if="scope.row.status==='Y'" style="color:#48c9b0;">启用</span>
            <span v-else style="color:#e91e63;">禁用</span>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="primary" size="mini" plain @click="chooseOne(scope.row)">
              选择
            </b-button>
          </template>
        </b-table>
      </div>
      <div slot="footer" class="t-right">
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { getSchemeList } from '../../../../../api/data-manage/switching-scheme.api'

  export default {
    name: 'SchemeChoose',
    mixins: [commonMixin, permission],
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
          cfgName: '',
          flowDirection: '',
          changeType: '',
          status: '',
          transmitKind: 'DB_DB'
        },
        columns: [
          { title: '交换方案名称', key: 'cfgName', width: 150, tooltip: true },
          { title: '信息流向', slot: 'flowDirection', align: 'center' },
          { title: '交换类型', slot: 'changeType', align: 'center' },
          { title: '传输方式', slot: 'transmitKind', align: 'center' },
          { title: '信息源', key: 'nameSource' },
          { title: '目标系统', key: 'nameTarget' },
          { title: '状态', slot: 'status', width: 60, align: 'center' },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ],
        current: '',
        flowDirectionMap: { COLLECT: '归集', SUBMIT: '上报', SHARE: '共享' }, // 信息流向
        exchangeTypeMap: { MANUAL: '人工交换', AUTO: '自动交换' }, // 交换类型
        transmitKindMap: { FILE: '上传文件', FTP: '文件传输', DB_DB: '库对库' }, // 传输方式
        exchangeStatusMap: { Y: '启用', N: '禁用' }
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          cfgName: '',
          flowDirection: '',
          changeType: '',
          status: '',
          transmitKind: 'DB_DB'
        }
        this.handleFilter()
      },
      handleShowModal() {
        this.dialogFormVisible = true
        this.resetQuery()
      },
      chooseOne(item) {
        this.$emit('input', item.id)
        this.$emit('on-change', {
          id: item.id,
          cfgName: item.cfgName,
          cfgCode: item.cfgCode,
          flowDirection: item.flowDirection
        })
        this.dialogFormVisible = false
      },
      // 清空时触发调用
      handleClear() {
        this.current = ''
        this.$emit('input', '')
        this.$emit('on-change', { id: '', cfgName: '', cfgCode: '', flowDirection: '' })
      },
      // 查询所有数据源信息
      searchList() {
        this.setListData()
        getSchemeList(this.listQuery).then(response => {
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
