<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="业务类型">
            <b-select v-model="listQuery.bizType" clearable>
              <b-option v-for="(value,key) in logTypeMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="请求方法">
            <b-select v-model="listQuery.requestMethod" clearable>
              <b-option v-for="(value,key) in methodTypeMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="时间">
            <b-date-picker type="daterange" placeholder="选择日期"
                           ref="datePickerRange" separator=" ~ "
                           @on-change="dateChange"></b-date-picker>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:bizType="{row}">{{ logTypeMap[row.bizType] }}</template>
          <template v-slot:responseStatus="{row}">
            <b-tag :type="row.responseStatus==='0'?'success':'danger'" no-border dot
                   :tag-style="{background:'transparent',color:'rgba(0,0,0,.65)'}">
              {{ row.responseStatus==='0'?'成功':'失败' }}
            </b-tag>
          </template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button type="text" @click="handleCheck(row)">
              查看
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" title="日志详情" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <div style="padding: 8px 8px 0;">
            <b-row>
              <b-col span="12">
                <v-simple-label label="业务类型">{{ logTypeMap[log.bizType] }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="操作用户">{{ log.requestUsername }}</v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="24">
                <v-simple-label label="业务内容">{{ log.bizContent }}</v-simple-label>
              </b-col>
            </b-row>
            <b-divider/>
            <b-row>
              <b-col span="12">
                <v-simple-label label="响应时间">
                  {{ $isNotEmpty(log.responseTime)?log.responseTime+'/毫秒':'' }}
                </v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="响应状态">
                  <b-tag :type="log.responseStatus==='0'?'success':'danger'" no-border dot
                         :tag-style="{background:'transparent',color:'rgba(0,0,0,.65)'}">
                    {{ log.responseStatus==='0'?'成功':'失败' }}
                  </b-tag>
                </v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <v-simple-label label="客户端">{{ log.httpUserAgent }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="远程地址">{{ log.clientIp }}</v-simple-label>
              </b-col>
            </b-row>
            <b-divider/>
            <b-row>
              <b-col span="12">
                <v-simple-label label="请求地址">{{ log.url }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="请求方法">{{ methodTypeMap[log.requestMethod] }}</v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <v-simple-label label="请求时间">{{ log.requestTime }}</v-simple-label>
              </b-col>
              <b-col span="12">
                <v-simple-label label="内容长度">{{ log.requestLength }}</v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="24">
                <v-simple-label label="请求内容">{{ log.requestText }}</v-simple-label>
              </b-col>
            </b-row>
          </div>
        </b-collapse-wrap>
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/analyze-engine/da-log.api'

  export default {
    name: 'UseLog',
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          requestMethod: '',
          bizType: '',
          startDateTime: '',
          endDateTime: ''
        },
        logTypeMap: {},
        methodTypeMap: {},
        columns: [
          { type: 'index', width: 70, align: 'center' },
          { title: '业务类型', slot: 'bizType' },
          { title: '业务内容', key: 'bizContent' },
          { title: '远程地址', key: 'clientIp' },
          { title: '用户名', key: 'requestUsername' },
          { title: '状态', slot: 'responseStatus', width: 150, align: 'center' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        log: null
      }
    },
    created() {
      this.resetLog()
      this.getEnum()
      this.searchList()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          requestMethod: '',
          bizType: '',
          startDateTime: '',
          endDateTime: ''
        }
        // 清空日期范围
        this.$refs.datePickerRange && this.$refs.datePickerRange.handleClear()
      },
      // 时间改变事件
      dateChange(date) {
        // 给开始和结束时间设置值
        this.listQuery.startDateTime = this.$isNotEmpty(date[0]) ? `${date[0]} 00:00:00` : ''
        this.listQuery.endDateTime = this.$isNotEmpty(date[1]) ? `${date[1]} 23:59:59` : ''
      },
      // 查看按钮事件
      handleCheck(row) {
        this.log = { ...row }
        console.log(this.log)
        this.openEditPage('check')
      },
      // 重置对象
      resetLog() {
        this.log = {
          id: '',
          bizType: '',
          bizContent: '',
          clientIp: '',
          httpUserAgent: '',
          requestLength: '',
          requestMethod: '',
          requestText: '',
          requestTime: '',
          requestUsername: '',
          responseStatus: '',
          responseTime: '',
          url: ''
        }
      },
      // 获取枚举
      getEnum() {
        Promise.all([api.getLogType(), api.getMethodType()]).then(resp => {
          if (resp[0].data.code === '0' && resp[1].data.code === '0') {
            this.logTypeMap = resp[0].data.data
            this.methodTypeMap = resp[1].data.data
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getLogList(this.listQuery).then(response => {
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
