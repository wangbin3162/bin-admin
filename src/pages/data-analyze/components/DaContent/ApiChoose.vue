<template>
  <b-modal v-model="chooseDialog" title="选择接口" width="500px" min-height="400px">
    <b-table :columns="columns" :data="list">
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button type="text" @click="handleChoose(scope.row)" v-waves>
          选择
        </b-button>
      </template>
    </b-table>
    <div slot="footer" class="t-center">
      <!--下方分页器-->
      <b-page :total="total" size="small" @on-change="handleCurrentChange"></b-page>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import * as api from '../../../../api/dir/da-content.api'

  export default {
    name: 'ApiChoose',
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          name: ''
        },
        chooseDialog: false,
        columns: [
          { title: '接口名称', key: 'name', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ],
        list: []
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
        api.getApiList().then(response => {
          this.list = response.data.data
        })
      },
      // 选中一个角色
      handleChoose(item) {
        this.chooseDialog = false
        this.$emit('on-choose', { id: item.id, name: item.name })
      }
    }
  }
</script>
