<template>
  <div flex style="width:100%;">
    <b-input v-model="current" placeholder="选择接口" readonly clearable
             @on-clear="handleClear"></b-input>
    <b-button type="primary" @click="open" plain
              style="flex:0 0 auto;margin-left:0;font-size: 12px;">选择
    </b-button>
    <b-modal v-model="chooseDialog" title="选择接口" width="500px" min-height="400px">
      <b-table :columns="columns" :data="list" size="small">
        <template v-slot:type="{row}">{{typeMap[row.type]}}</template>
        <!--操作栏-->
        <template v-slot:action="scope">
          <b-button type="text" @click="handleChoose(scope.row)">
            选择
          </b-button>
        </template>
      </b-table>
      <div slot="footer" class="t-center">
        <b-page :total="total" :current.sync="listQuery.page"
                @on-change="handleCurrentChange"></b-page>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import { getApiList } from '../../../../api/analyze-engine/da-api.api'

  export default {
    name: 'ApiChoose',
    mixins: [commonMixin, permission],
    data() {
      return {
        typeMap: {
          SQL: '关系型数据库',
          URL: '接口服务',
          TEMPLATE: '分析模板'
        },
        listQuery: {
          name: ''
        },
        chooseDialog: false,
        columns: [
          { title: '接口名称', key: 'name' },
          { title: '接口类型', slot: 'type' },
          { title: '操作', slot: 'action', align: 'center', width: 120 }
        ],
        list: [],
        current: ''
      }
    },
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
    methods: {
      open() {
        this.chooseDialog = true
        this.listQuery.name = ''
        this.searchList()
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        getApiList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 选中一个
      handleChoose(item) {
        this.current = item.name
        this.chooseDialog = false
        this.$emit('input', item.id)
        this.$emit('on-change', { id: item.id, name: item.name })
      },
      // 清空时触发调用
      handleClear() {
        this.current = ''
        this.$emit('input', '')
        this.$emit('on-change', { id: '', name: '' })
      }
    }
  }
</script>
