<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="异议编码">
            <b-input v-model="listQuery.searchCode" placeholder="请输入名称"></b-input>
          </v-filter-item>
           <v-filter-item title="数据类型">
            <b-select v-model="listQuery.resourceKey">
              <b-option v-for="item in resourceTypeOpt" :key="item.resourceKey"
                :value="item.resourceKey">{{ item.resourceName }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- table -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleCheck(row)">
              处理
            </b-button>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <!-- 审核组件 -->
    <handle
      v-if="isCheck"
      @close="handleCancel"
      @handle-done="searchList"
      :title="editTitle"
      :detail="detail">
    </handle>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import Handle from './Handle'
  import { MaskCode } from '../../../../common/utils/secret'
  import { getServiceDataType } from '../../../../api/enum.api'
  import { getHandleList } from '../../../../api/credit-service/credit-diff.api'

  export default {
    name: 'IndexVar',
    mixins: [commonMixin, permission],
    components: {
      Handle
    },
    data () {
      return {
        detail: null,
        resourceTypeOpt: [], // 数据(资源)类型
        listQuery: {
          searchCode: '',
          status: '',
          resourceKey: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '异议编码', key: 'searchCode' },
          { title: '申请人', key: 'applyUserName' },
          { title: '申请人身份证号码', key: 'idCode', width: 170 },
          // { title: '联系电话', key: 'phone' },
          { title: '数据类型', key: 'resourceName', ellipsis: true, tooltip: true },
          { title: '数源单位', key: 'sourceDeptName', ellipsis: true, tooltip: true },
          { title: '异议状态', key: 'status' },
          // { title: '申请日期', key: 'applyDate', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action' }
        ]
      }
    },
    computed: {
      statusEnum () { // 异议状态枚举
        return this.$store.state.creditDiff.statusEnum
      },
      dealResultEnum () { // 处理结果枚举
        return this.$store.state.creditDiff.dealResultEnum
      }
    },
    created () {
      this.getEnum()
      this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          searchCode: '',
          status: '',
          resourceKey: ''
        }
        this.searchList()
      },
      handleCheck (row) {
        this.detail = row
        this.openEditPage('check')
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getHandleList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
          this.list.forEach(item => {
            item.idCode = MaskCode(item.idCode, 'ID_CODE')
            item.status = this.statusEnum[item.status]
            item.dealResult = this.dealResultEnum[item.dealResult]
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      },
      // 获取所需的枚举值
      async getEnum () {
        try {
          const res = await getServiceDataType()
          this.resourceTypeOpt = res
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>
