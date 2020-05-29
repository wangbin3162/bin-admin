<template>
  <div style="width: 100%;">
    <div flex="box:last cross:center">
      <b-input :value="value" placeholder="选择接口标识" readonly clearable @on-clear="handleClear"/>
      <b-button type="primary" @click="handleShowModal" plain>选择</b-button>
    </div>
    <b-modal v-model="dialogFormVisible" title="选择接口标识" append-to-body :body-styles="{padding:0}">
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading" size="small" max-height="350">
        <template v-slot:action="{row}">
          <b-button type="text" @click="chooseOne(row)">选择</b-button>
        </template>
      </b-table>
      <div slot="footer">
        <!--下方分页器-->
        <b-button @click="dialogFormVisible = false">关闭</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { urpServiceList } from '../../../api/urp/memo-mapping.api'

  export default {
    name: 'IfcTagSelect',
    mixins: [commonMixin, permission],
    props: {
      value: { // 存储id
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogFormVisible: false,
        columns: [
          { title: '标识名称', key: 'name' },
          { title: '操作', slot: 'action', width: 100 }
        ]
      }
    },
    methods: {
      // 打开弹窗
      handleShowModal() {
        this.dialogFormVisible = true
        this.searchList()
      },
      // 清空时触发调用
      handleClear() {
        this.$emit('input', '')
      },
      // 选择一个
      chooseOne(row) {
        this.$emit('input', row.name)
        this.dialogFormVisible = false
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        urpServiceList().then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.data.data.list.map(i => ({ name: i })),
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>
