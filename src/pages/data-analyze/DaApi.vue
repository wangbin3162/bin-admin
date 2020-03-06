<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="接口名称">
            <b-input v-model.trim="listQuery.name" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="接口类型">
            <b-select style="width:200px" v-model="listQuery.type" clearable>
              <b-option v-for="(value,key) in typeMap" :value="key" :key="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary"
                    v-waves size="small" icon="ios-add"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">修改</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" style="color:orange;">测试</b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <b-form :model="current" ref="form" :rules="ruleValidate" :label-width="130">
          <b-row>
            <b-col span="12">
              <b-form-item label="接口名称" prop="name">
                <b-input v-model="current.name" placeholder="请输入接口名称"></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="接口类型" prop="type">
                <b-select style="width:200px" v-model="current.type" @on-change="initType">
                  <b-option v-for="(value,key) in typeMap" :value="key" :key="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row v-if="current.type === 'SQL'">
            <b-col span="12">
              <b-form-item label="sql语句">
                <b-input v-model="current.sql" placeholder="请输入sql语句" type="textarea"></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row v-if="current.type === 'URL'">
            <b-col span="12">
              <b-form-item label="url">
                <b-input v-model="current.url" placeholder="请输入url"></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row v-if="current.type === 'TEMPLATE'">
            <b-col span="12">
              <b-form-item label="模板">
                <template-choose v-model="current.tempId"
                                 :default-name="tempName"></template-choose>
              </b-form-item>
            </b-col>
          </b-row>

          <b-row>
            <b-col span="12">
              <b-form-item label="接口描述" prop="describe">
                <b-input v-model="current.describe" placeholder="请输入接口描述" type="textarea"></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <!--<p>{{current}}</p>-->
        </b-form>
        <!--信息项-->
        <template slot="full">
          <div class="p15" flex="main:justify cross:center">
            <b-tag type="primary">新增参数信息</b-tag>
          </div>
          <!--信息项表格组件-->
          <daApi-Fields v-model="current.daParameters"
                        :data-type-options="dataTypeOptions"
          ></daApi-Fields>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <!--选择主题弹窗-->

  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/data-analyze/da-api.api'
  import {requiredRule} from '../../common/utils/validate'
  import {DaApiFields} from './components/DaApi'
  import TemplateChoose from './components/DaApi/TemplateChoose'
  import {getApiType} from '../../api/enum.api'
  import {getInnerTempDetail} from '../../api/data-analyze/da-inner-temp.api.js'

  export default {
    name: 'DaTheme',
    mixins: [commonMixin, permission],
    components: {DaApiFields, TemplateChoose},
    data() {
      const validateCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneCode(this.current).then(response => {
            if (response.data.code === '0') {
              callback()
            } else {
              callback(new Error('字典项编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        dialogFormVisible: false,
        tempName: '',
        moduleName: 'API',
        listQuery: {
          name: '',
          type: ''
        },
        columns: [
          {type: 'index', width: 50, align: 'center'},
          {title: '接口名称', key: 'name'},
          {title: '接口类型', key: 'type'},
          {title: '创建人', key: 'createName'},
          {title: '操作时间', key: 'createDate'},
          {title: '操作', slot: 'action', width: 180, align: 'center'}
        ],
        current: {},
        typeMap: {'0': 'sql', '1': 'url', '2': '模板'},
        dataTypeOptions: [
          {label: '字符型', value: 'string'},
          {label: '日期型', value: 'date'},
          {label: '数字型', value: 'number'},
          {label: '其他', value: 'object'}
        ],
        ruleValidate: {
          code: [requiredRule, {validator: validateCode, trigger: 'blur'}]
        }
      }
    },
    created() {
      this.searchList()
      this.resetCurrent()
      this.init()
    },
    methods: {
      initType(value){
        if (this.dialogStatus === 'create'){
          this.tempName =''
          this.current.tempId=''
          this.current.url =''
          this.current.sql =''
        }
      },
      init() {
        getApiType().then(res => {
          if (res.status === 200) {
            this.typeMap = res.data.data
          }
        })
      },
      handleChooseTheme(item) {
        this.current.tempId = item.id
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let theme = {...row}
        this.$confirm({
          title: '警告',
          content: `确实要删除接口吗？`,
          loading: true,
          onOk: () => {
            api.handleRemove(theme).then(res => {
              if (res.data.code === '0') {
                this.$message({type: 'success', content: '操作成功'})
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$message({type: 'danger', content: res.data.message})
              }
            })
          }
        })
      },
      // 新增按钮事件
      handleCreate() {
        this.resetCurrent()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetCurrent()
        this.current = {...this.current, ...row}
        api.getApiDetail(this.current.id).then(response => {
          this.current.daParameters = response.data.data
        })
        if (this.current.type === 'TEMPLATE') {
          getInnerTempDetail(this.current.tempId).then(response => {
            this.tempName = response.data.template.tempName
          })
        }
        this.openEditPage('modify')
      },
      // 重置
      resetCurrent() {
        this.current = {
          id: '',
          name: '',
          describe: '',
          code: '',
          createBy: '',
          tempId: '',
          url:'',
          sql:'',
        }
        this.tempName = ''
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          code: ''
        }
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          this.btnLoading = true
          if (valid) {
            let fun = this.dialogStatus === 'create' ? api.createTheme : api.modifyTheme
            fun(this.current).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogStatus = ''
                this.$message({type: 'success', content: '操作成功'})
                this.searchList()
              } else {
                this.btnLoading = false
                this.$message({type: 'danger', content: res.data.message})
              }
            })
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getApiList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    },

  }
</script>
