<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="措施名称">
            <b-input v-model.trim="listQuery.measureName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="措施类型">
            <b-select v-model="listQuery.measureType" placeholder="全部" clearable>
              <b-option v-for="(val,key) in measureTypeMap" :key="key" :value="key">{{ val }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="实施部门">
            <urp-dept-select v-model="listQuery.departId" :default-name="listQuery.departName" style="height:41px;"
                             @on-choose="({departName})=>{listQuery.departName=departName}"/>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:measureName="{row}">
            <b-button type="text"  :title="row.measureName" @click="handleCheck(row)">{{ row.measureName }}</b-button>
          </template>
          <!--类型-->
          <template v-slot:measureType="{row}">{{ measureTypeMap[row.measureType] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
            <b-button :disabled="!canModify" type="text" @click="handleModify(row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <b-divider type="vertical"></b-divider>
            <b-button :disabled="!canRemove" type="text" text-color="danger"
                      @click="handleRemove(row)">
              删除
            </b-button>
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
        <b-form :model="measure" ref="form" :rules="ruleValidate" :label-width="130">
          <b-form-item label="措施名称" prop="measureName">
            <b-input v-model="measure.measureName" placeholder="请输入措施名称" clearable/>
          </b-form-item>
          <b-row>
            <b-col span="12">
              <b-form-item label="措施类型" prop="measureType">
                <b-select v-model="measure.measureType" placeholder="请选择" clearable>
                  <b-option v-for="(val,key) in measureTypeMap" :key="key" :value="key">{{ val }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="实施部门" prop="departId">
                <urp-dept-select v-model="measure.departId" :default-name="measure.departName" show-btn
                                 @on-choose="({departName})=>{measure.departName=departName}"/>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="措施内容" prop="measureContent">
            <b-input v-model="measure.measureContent" placeholder="请输入措施内容" type="textarea"/>
          </b-form-item>
        </b-form>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <div>
          <v-key-label label="措施名称" label-width="150px">{{ measure.measureName }}</v-key-label>
          <v-key-label label="措施类型" label-width="150px">{{ measureTypeMap[measure.measureType] }}</v-key-label>
          <v-key-label label="实施部门" label-width="150px">{{ measure.departName }}</v-key-label>
          <v-key-label label="创建部门" label-width="150px">{{ measure.createDeptName }}</v-key-label>
          <v-key-label label="措施内容" label-width="150px" is-bottom>{{ measure.measureContent }}</v-key-label>
        </div>
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
  import * as api from '../../api/urp/measure.api'
  import UrpDeptSelect from './components/UrpDeptSelect'
  import { requiredRule } from '../../common/utils/validate'

  export default {
    name: 'Measure',
    components: { UrpDeptSelect },
    mixins: [commonMixin, permission],
    data() {
      const validateMeasureName = (rule, value, callback) => {
        if (value.length >512) {
          callback(new Error('措施名称必须小于512个字符'))
        } else {
            api.oneMeasureName(this.measure).then(response => {
              if (response.data.data) {
                callback(new Error('同一部门措施名称重复'))
              } else {
                callback()
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          }
        }
      return {
        listQuery: {
          measureName: '',
          measureType: '',
          departId: ''
        },
        measureTypeMap: { 'R': '激励', 'P': '惩戒' },
        measure: null,
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '措施名称', slot: 'measureName' },
          { title: '措施类型', slot: 'measureType', align: 'center', width: 150 },
          { title: '实施部门名称', key: 'departName', align: 'center', width: 200 },
          { title: '创建部门名称', key: 'createDeptName', align: 'center', width: 200 },
          { title: '操作', slot: 'action', width: 150 }
        ],
        ruleValidate: {
          measureName: [requiredRule, { validator: validateMeasureName, trigger: 'blur' }],
          measureType: [{ required: true, message: '类型必选', trigger: 'change' }],
          departId: [{ required: true, message: '实施部门必选', trigger: 'change' }],
          measureContent: [requiredRule]
        }
      }
    },
    created() {
      this.resetMeasure()
      this.resetQuery()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          measureName: '',
          measureType: '',
          departId: '',
          departName: ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetMeasure()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetMeasure()
        this.measure = { ...this.measure, ...row }
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck(row) {
        this.measure = { ...row }
        this.openEditPage('check')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let measure = { ...row }
        this.$confirm({
          title: '确实要删除当前奖惩措施吗？',
          content: '删除这条数据后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeMeasure(measure).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            }).catch(() => {
              this.$modal.remove()
            })
          }
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createMeasure : api.modifyMeasure
            fun(this.measure).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 重置对象
      resetMeasure() {
        this.measure = {
          id: '',
          measureName: '',
          measureType: '',
          departId: '',
          departName: '',
          measureContent: ''
        }
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        api.getMeasureList(this.listQuery).then(response => {
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
