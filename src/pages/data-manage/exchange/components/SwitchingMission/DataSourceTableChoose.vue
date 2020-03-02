<template>
  <!--数据源库表信息 for SwitchingMission.vue -->
  <div>
    <div flex="box:last">
      <b-input v-model="current" placeholder="选择填充" readonly clearable
               @on-clear="handleClear"></b-input>
      <b-button type="primary" @click="handleShowModal"
                style="padding: 10px;margin-left: 0;font-size: 12px;">
        选择
      </b-button>
    </div>
    <b-modal v-model="dialogFormVisible" title="选择交换方案" width="860" class="layout-inner" :mask-closable="false">
      <div>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="primary" size="mini" plain @click="chooseOne(scope.row)" v-waves>
              选择
            </b-button>
          </template>
        </b-table>
      </div>
      <div slot="footer">
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import { getTables, getTablesFields } from '../../../../../api/data-manage/data-source.api'

  export default {
    name: 'DataSourceTableChoose',
    mixins: [commonMixin],
    props: {
      value: {
        type: String,
        default: ''
      },
      dsId: {
        type: String,
        required: true
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
    data() {
      return {
        dialogFormVisible: false,
        columns: [
          { title: '表名', key: 'name' },
          { title: '评论', key: 'comment' },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ],
        current: ''
      }
    },
    methods: {
      handleShowModal() {
        if (!this.dsId || this.dsId.length === 0) {
          this.$message({ type: 'danger', content: '没有选择方案' })
          return
        }
        this.dialogFormVisible = true
        this.searchList()
      },
      chooseOne(item) {
        this.current = item.name
        getTablesFields(this.dsId, item.name).then(res => {
          this.$emit('input', item.name)
          this.$emit('on-change', res.data)
        }).catch(() => {
          this.$emit('input', item.name)
          this.$emit('on-change', [])
        })
        this.dialogFormVisible = false
      },
      // 清空时触发调用
      handleClear() {
        this.current = ''
        this.$emit('input', '')
        this.$emit('on-change', [])
      },
      // 查询所有数据源信息
      searchList() {
        this.setListData()
        getTables(this.dsId).then(response => {
          if (response.data.code === '0') {
            this.setListData({
              list: response.data,
              total: response.data.length
            })
          } else {
            this.$message({ type: 'danger', content: response.data.message })
            this.dialogFormVisible = false
          }
        })
      }
    }
  }
</script>
