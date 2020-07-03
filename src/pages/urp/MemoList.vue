<template>
  <urp-layout>
    <div class="urp-main-detail">
      <urp-header normal></urp-header>
      <div class="list-result-wrap">
        <b-breadcrumb separator-icon="ios-arrow-forward">
          <b-breadcrumb-item :to="{ path: '/urp/index' }">首页</b-breadcrumb-item>
          <b-breadcrumb-item>联合奖惩备忘录</b-breadcrumb-item>
        </b-breadcrumb>
        <v-table-wrap>
          <!--查询条件-->
          <v-filter-bar @keyup-enter="handleFilter">
            <v-filter-item title="备忘录名称">
              <b-input v-model.trim="listQuery.memoName" placeholder="请输入" clearable/>
            </v-filter-item>
            <v-filter-item title="备忘录类型">
              <b-select v-model="listQuery.memoType" placeholder="全部" clearable>
                <b-option v-for="(val,key) in memoTypeMap" :key="key" :value="key">{{ val }}</b-option>
              </b-select>
            </v-filter-item>
            <!--添加查询按钮位置-->
            <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
          </v-filter-bar>
          <!--中央表格-->
          <b-table :columns="columns" :data="list" :loading="listLoading">
            <template v-slot:memoType="{row}">
              <b-tag :type="memoTypeStyleMap[row.memoType]" no-border dot color="#666">
                {{ memoTypeMap[row.memoType] }}
              </b-tag>
            </template>
            <template v-slot:memoStatus="{row}">{{ memoStatusMap[row.memoStatus] }}</template>
            <template v-slot:action="{row}">
              <b-button type="text" @click="handleCheck(row)">查看</b-button>
            </template>
          </b-table>
          <!--下方分页器-->
          <b-page :total="total" show-total show-sizer :current.sync="listQuery.page"
                  @on-change="handleCurrentChange"
                  @on-page-size-change="handleSizeChange"></b-page>
        </v-table-wrap>
      </div>
    </div>
  </urp-layout>
</template>

<script>
  import UrpLayout from './components/UrpLayout'
  import UrpHeader from './components/UrpHeader'
  import mixin from '../../common/mixins/mixin'
  import { getMemoList } from '../../api/urp.api'

  export default {
    name: 'memoList',
    mixins: [mixin],
    components: { UrpHeader, UrpLayout },
    data() {
      return {
        listQuery: {
          memoName: '',
          memoType: ''
        },
        columns: [
          { title: '备忘录名称', key: 'memoName', tooltip: true },
          { title: '备忘录类型', slot: 'memoType', align: 'center', width: 150 },
          { title: '发起部门', key: 'initiateDeptName' },
          { title: '联合部门数', key: 'unionNum', align: 'center', width: 120 },
          { title: '备忘录状态', slot: 'memoStatus', align: 'center', width: 120 },
          { title: '签署日期', key: 'signDate', align: 'center', width: 120 },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ],
        memoTypeMap: { '1': '惩戒', '2': '激励' },
        memoTypeStyleMap: { '1': 'primary', '2': 'danger' },
        memoStatusMap: { '0': '通报', '1': '实施', '2': '过期' }
      }
    },
    created() {
      this.resetQuery()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          memoName: '',
          memoType: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        this.$router.push({ path: '/urp/memoDetail', query: { id: row.id } })
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        getMemoList(this.listQuery).then(response => {
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
