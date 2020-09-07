<template>
  <div class="select-class-info">
    <b-modal v-model="open"
      title="选择类别信息"
      width="1050"
      :body-styles="{ padding: 0 }"
      footer-hide
      @on-visible-change="visibleChangeHandler">

      <div>
        <v-table-wrap>
          <!--查询条件-->
          <v-filter-bar @keyup-enter="handleFilter">
            <v-filter-item title="类别名称">
              <b-input v-model.trim="listQuery.typeName" placeholder="请输入" clearable></b-input>
            </v-filter-item>
            <v-filter-item title="类别编码">
              <b-input v-model.trim="listQuery.typeCode" placeholder="请输入" clearable></b-input>
            </v-filter-item>
            <!--添加查询按钮位置-->
            <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
          </v-filter-bar>
          <!--中央表格-->
          <b-table :columns="columns" :data="list" :loading="listLoading">
            <!--操作栏-->
            <template v-slot:action="{ row }">
              <b-button type="text" @click.stop="handleSelectBtn(row)">
                选择
              </b-button>
            </template>
          </b-table>
          <!--下方分页器-->
          <b-page :total="total" show-sizer :current.sync="listQuery.page"
            @on-change="handleCurrentChange"
            @on-page-size-change="handleSizeChange">
          </b-page>
        </v-table-wrap>
      </div>

    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '@/common/mixins/mixin'
  import permission from '@/common/mixins/permission'
  import * as api from '@/api/sys/param-type.api'

  export default {
    name: 'SelectClassInfo',
    mixins: [commonMixin, permission],
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        open: this.value,
        listQuery: {
          typeName: '',
          typeCode: '',
          parentId: 'pre_ncloud_sys_conf_type_10000'
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '类别名称', key: 'typeName' },
          { title: '类别编码', key: 'typeCode' },
          { title: '完整编码', key: 'route' },
          { title: '排序编号', key: 'sortNum', align: 'center', width: 100 },
          { title: '描述', key: 'desc', tooltip: true },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      visibleChangeHandler (visible) {
        if (visible) {
          this.init()
        } else {
          this.list = []
        }
      },

      init () {
        this.searchList()
      },

      resetQuery() {
        this.listQuery.typeCode = ''
        this.listQuery.typeName = ''
        this.listQuery.size = ''
        this.listQuery.page = ''
        this.handleFilter()
      },

      // 查询所有列表
      searchList() {
        this.setListData()
        api.getTypeList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },

      /**
       * @author haodongdong
       * @description 选择按钮回调
       * @param {Object} row 当前行数据
       */
      handleSelectBtn (row) {
        this.$emit('selected', row)
        this.open = false
      }
    }
  }
</script>
