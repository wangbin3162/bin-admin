<template>
  <b-modal v-model="chooseDialog" title="选择角色">
      <div flex="cross:center">
        <span style="width: 70px;">角色名称</span>
        <b-input v-model.trim="listQuery.name" size="small" placeholder="角色名称" style="width: 280px;">
          <b-icon name="ios-search" slot="suffix" @click.native="handleFilter" style="cursor: pointer;"></b-icon>
        </b-input>
      </div>
      <b-divider align="left">角色列表</b-divider>
      <b-button v-for="item in list" :key="item.id" round plain
                :disabled="noAdmin&&item.code==='ROLE_ADMIN'" size="small"
                :type="item.roleType==='I'?'primary':'warning'"
                style="margin:0 5px 5px 0;"
                @click="chooseOne(item)">{{item.name}}
      </b-button>
    <div slot="footer" class="t-center">
      <!--下方分页器-->
      <b-page :total="total" size="small" @on-change="handleCurrentChange"></b-page>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/role.api'

  export default {
    name: 'RoleChoose',
    mixins: [commonMixin, permission],
    props: {
      noAdmin: Boolean
    },
    data() {
      return {
        listQuery: {
          name: ''
        },
        chooseDialog: false
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
        api.getRoleList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 选中一个角色
      chooseOne(item) {
        this.chooseDialog = false
        this.$emit('on-choose', { id: item.id, name: item.name, code: item.code })
      }
    }
  }
</script>
