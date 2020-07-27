<template>
  <div class="select-dict">
    <b-modal v-model="open"
      title="选择字典"
      width="850"
      :styles="{ top: '5%' }"
      :body-styles="{ padding: 0 }"
      footer-hide
      @on-visible-change="visibleChangeHandler">

      <v-table-wrap>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="字典名称">
            <b-input v-model.trim="listQuery.groupName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="字典编码">
            <b-input v-model.trim="listQuery.groupCode" placeholder="请输入" clearable></b-input>
          </v-filter-item>

          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">

          <template v-slot:dictType="{ row }">{{ dictTypeEnum[row.dictType] }}</template>

          <!--操作栏-->
          <template v-slot:action="{ row }">
            <b-button type="text" @click.stop="handleSelectBtn(row)">
              选择
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" :current.sync="listQuery.page" size="small"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>

    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import * as api from '../../../../api/sys/dict.api'
  import { getDictType } from '../../../../api/enum.api'

  export default {
    name: 'SelectDict',
    mixins: [commonMixin],
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        open: false,
        dictTypeEnum: {},
        listQuery: {
          groupName: '',
          groupCode: '',
          size: 10,
          page: 1
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字典编码', key: 'groupCode', width: 200 },
          { title: '字典名称', key: 'groupName' },
          { title: '字典类型', slot: 'dictType', width: 120, align: 'center' },
          { title: '操作', slot: 'action', width: 70 }
        ]
      }
    },
    watch: {
      value (newVal) {
        this.open = newVal
      },
      open (newVal) {
        this.$emit('input', newVal)
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
          this.getEnum()
          this.searchList()
        } else {
          this.list = []
          this.listQuery.groupName = ''
          this.listQuery.groupCode = ''
          this.listQuery.size = 10
          this.listQuery.page = 1
        }
      },

      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          groupName: '',
          groupCode: ''
        }
        this.handleFilter()
      },

      /**
       * @author haodongdong
       * @description 选择按钮回调
       * @param {Object} row 当前行数据
       */
      handleSelectBtn (row) {
        this.$emit('selected', this.$util.deepClone(row))
        this.open = false
      },

      /**
       * @author haodongdong
       * @description 获取枚举数据
       */
      getEnum() {
        getDictType().then(res => {
          if (res.status === 200) {
            this.dictTypeEnum = res.data.data
          }
        })
      },

      /**
       * @author haodongdong
       * @description 查询列表，重写mixin中searchList函数
       */
      searchList() {
        this.setListData()
        api.getDictGroupList(this.listQuery).then(response => {
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
