<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="主体名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable/>
          </v-filter-item>
          <v-filter-item title="主体编码">
            <b-input v-model.trim="listQuery.idCode" placeholder="请输入" clearable/>
          </v-filter-item>
          <!--<v-filter-item title="备忘录"></v-filter-item>-->
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:action="{row}">
            <b-button type="text" @click="handleCheck(row)">查看</b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <div>
          <v-key-label label="备忘录名称">{{ record.memoName }}</v-key-label>
          <v-key-label label="主体名称">{{ record.name }}</v-key-label>
          <v-key-label label="证件号码">{{ record.idCode }}</v-key-label>
          <v-key-label label="统一社会信用代码">{{ record.unifiedCode }}</v-key-label>
          <v-key-label label="组织机构代码">{{ record.orgInstCode }}</v-key-label>
          <v-key-label label="工商注册号">{{ record.regNo }}</v-key-label>
          <v-key-label label="反馈时间">{{ record.feedbackDate }}</v-key-label>
         <!-- <v-key-label label="反馈来源">{{ record.feedbackSource }}</v-key-label>-->
          <v-key-label label="措施内容" is-bottom>{{ record.measureContent}}</v-key-label>
        </div>
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getListResult } from '../../../api/urp/list-rewult.api'
  import { Decode, MaskCode } from '../../../common/utils/secret'
  import { oneOf } from 'bin-ui/src/utils/util'

  export default {
    name: 'ListResult',
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          name: '',
          idCode: '',
          memoId: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '备忘录名称', key: 'memoName' },
          { title: '主体名称', key: 'name', align: 'center' },
          { title: '证件号码', key: 'idCode', align: 'center', width: 200 },
          { title: '统一社会信用代码', key: 'unifiedCode', align: 'center', width: 200 },
          { title: '组织机构代码', key: 'orgInstCode', align: 'center', width: 200 },
          { title: '工商注册号', key: 'regNo', align: 'center', width: 200 },
          { title: '操作', slot: 'action', width: 100 }
        ],
        record: null
      }
    },
    created() {
      this.resetRecord()
      this.resetQuery()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          idCode: '',
          memoId: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        this.record = { ...row }
        this.openEditPage('check')
      },
      // 重置对象
      resetRecord() {
        this.record = {
          id: '',
          memoName: '',
          name: '',
          idCode: '',
          unifiedCode: '',
          orgInstCode: '',
          feedbackDate: '',
          feedbackSource: '',
          measureContent: ''
        }
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        getListResult(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: this.decodeAndMaskFormat(response.data.rows || [], true),
              total: response.data.total
            })
          }
        })
      },
      // =======解码掩码函数======== //
      decodeAndMaskFormat(arr, mask = false) {
        let newArr = []
        arr.forEach(item => {
          let tmp = { ...item }
          if (tmp.personClass === 'ZRP') { // 自然人需要将idCode解码并掩码显示
            let str = tmp.idCode
            tmp.idCode = MaskCode(Decode(str), 'ID_CODE')
          }
          newArr.push(tmp)
        })
        return newArr
      }
    }
  }
</script>
