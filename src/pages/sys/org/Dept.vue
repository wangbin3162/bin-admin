<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="部门名称" :span="8">
            <b-input v-model.trim="listQuery.departName" placeholder="请输入" clearable/>
          </v-filter-item>
          <v-filter-item title="禁用状态" :span="4">
            <b-switch size="large" v-model="listQuery.status" :true-value="ENUM.DISABLE" :false-value="ENUM.ENABLE"
                      @on-change="handleFilter">
              <span slot="open">显示</span>
              <span slot="close">隐藏</span>
            </b-switch>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
          <v-batch-import v-if="havePermission('import')" :module-name="batchType" :current-tree-node="currentTreeNode">
            批量导入
          </v-batch-import>
          <div slot="right">
            <template v-if="havePermission('download')">
              <v-download-template :module-name="batchType">模板下载</v-download-template>
              <b-divider type="vertical"></b-divider>
            </template>
            <template v-if="havePermission('export')">
              <v-batch-export :module-name="batchType" :current-tree-node="currentTreeNode">导出</v-batch-export>
              <b-divider type="vertical"></b-divider>
            </template>
            <b-button v-if="havePermission('records')" type="text" @click="handleOpenRecordDialog">导入/导出记录</b-button>
          </div>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:departName="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.departName }}</b-button>
          </template>
          <!--类型-->
          <template v-slot:departKind="scope">{{ deptMap[scope.row.departKind] }}</template>
          <!--状态-->
          <template v-slot:status="scope">
            <b-switch v-model="scope.row.status" :true-value="ENUM.ENABLE" :false-value="ENUM.DISABLE"
                      inactive-color="#ff4949"
                      @on-change="handleChangeStatusFlag(scope.row)"
                      :disabled="!havePermission('changeStatus')">
            </b-switch>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
            <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <template v-if="scope.row.status===ENUM.DISABLE">
              <b-divider type="vertical"></b-divider>
              <b-button :disabled="!canRemove" type="text" text-color="danger"
                        @click="handleRemove(scope.row)">
                删除
              </b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <b-form :model="depart" ref="form" :rules="ruleValidate" :label-width="130">
            <b-form-item label="上级部门">
              <b-input v-if="currentTreeNode" :value="currentTreeNode.title" readonly></b-input>
            </b-form-item>
            <b-row>
              <b-col span="12">
                <b-form-item label="部门名称" prop="departName">
                  <b-input v-model="depart.departName" placeholder="请输入部门名称" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="部门类型" prop="departKind">
                  <b-select v-model="depart.departKind">
                    <b-option v-for="item in departKindOptions" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </b-option>
                  </b-select>
                </b-form-item>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <b-form-item label="部门全称" prop="fullName">
                  <b-input v-model="depart.fullName" placeholder="请输入部门全称" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="统一社会信用代码" prop="unifiedCode">
                  <b-input v-model="depart.unifiedCode" placeholder="请输入统一社会信用代码" clearable></b-input>
                </b-form-item>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <b-form-item label="行政区划代码" prop="regionId">
                  <b-input v-model="depart.regionId" placeholder="请输入行政区划代码" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="排序编号" prop="sortNum">
                  <b-input-number :min="0" v-model="depart.sortNum" style="width: 100%;"></b-input-number>
                </b-form-item>
              </b-col>
            </b-row>
            <b-form-item label="备注" prop="remark">
              <b-input v-model="depart.remark" placeholder="请输入备注" type="textarea"></b-input>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <v-key-label label="上级部门" is-half is-first v-if="currentTreeNode">
            {{ currentTreeNode.title }}
          </v-key-label>
          <v-key-label label="部门名称" is-half>{{ depart.departName }}</v-key-label>
          <v-key-label label="部门类型" is-half is-first>{{ deptMap[depart.departKind] }}</v-key-label>
          <v-key-label label="排序编号" is-half>{{ depart.sortNum }}</v-key-label>
          <v-key-label label="统一社会信用代码">{{ depart.unifiedCode }}</v-key-label>
          <v-key-label label="部门全称">{{ depart.fullName }}</v-key-label>
          <v-key-label label="行政区划代码">{{ depart.regionId }}</v-key-label>
          <v-key-label label="备注" is-bottom>{{ depart.remark }}</v-key-label>
        </b-collapse-wrap>
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <!--操作记录弹窗-->
    <record-list ref="record" @on-close="handleCancel"></record-list>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/depart.api'
  import { getDeptStatus, getDeptType } from '../../../api/enum.api'
  import { verifyUnifiedCode, requiredRule } from '../../../common/utils/validate'
  import VBatchImport from '../../../components/VBatch/VBatchImport'
  import VBatchExport from '../../../components/VBatch/VBatchExport'
  import VDownloadTemplate from '../../../components/VBatch/VDownloadTemplate'
  import RecordList from '../components/RecordList'

  const batchType = 'SysDepartController' // 模块名称，提供下载模板和批量导入导出
  export default {
    name: 'Dept',
    components: { RecordList, VDownloadTemplate, VBatchImport, VBatchExport },
    mixins: [commonMixin, permission],
    data() {
      const validateDepartName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneDeptName(this.depart).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('同级部门名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateDepartKind = (rule, value, callback) => {
        if (value.length > 0) {
          this.$refs.form && this.$refs.form.validateField('fullName')
          this.$refs.form && this.$refs.form.validateField('unifiedCode')
          callback()
        }
      }
      const validateFullName = (rule, value, callback) => {
        if (this.depart.departKind === this.ENUM.NORMAL && value.length === 0) {
          callback(new Error('一般组织类型需要填写部门全称'))
        } else {
          callback()
        }
      }
      const validateUnified = (rule, value, callback) => {
        if (this.depart.departKind === this.ENUM.NORMAL) {
          if (value.length === 0) {
            callback(new Error('一般组织必须填写此项'))
          } else if (value === '00000000000000000X') {
            callback(new Error('一般组织不能填写此代码'))
          } else {
            if (verifyUnifiedCode(value)) {
              api.oneDeptUnified(this.depart)
                .then(response => {
                  if (response.data.data === 0) {
                    callback()
                  } else {
                    callback(new Error('统一社会信用代码重复'))
                  }
                })
                .catch(() => {
                  callback(new Error('请求验证重复性出错'))
                })
            } else {
              callback(new Error('请输入正确的统一社会信用代码'))
            }
          }
        } else {
          if (value.length === 0 || value === '00000000000000000X') {
            callback()
          } else {
            if (verifyUnifiedCode(value)) {
              api.oneDeptUnified(this.depart)
                .then(response => {
                  if (response.data.data === 0) {
                    callback()
                  } else {
                    callback(new Error('统一社会信用代码重复'))
                  }
                })
                .catch(() => {
                  callback(new Error('请求验证重复性出错'))
                })
            } else {
              callback(new Error('请输入正确的统一社会信用代码'))
            }
          }
        }
      }
      return {
        moduleName: '部门',
        batchType: batchType,
        listQuery: {
          departName: '',
          parentId: '',
          status: 'D'
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '部门名称', slot: 'departName' },
          { title: '部门全称', key: 'fullName' },
          { title: '部门类型', slot: 'departKind', align: 'center' },
          { title: '状态', slot: 'status', width: 180, align: 'center' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        depart: null,
        ruleValidate: {
          departName: [requiredRule, { validator: validateDepartName, trigger: 'blur' }],
          departKind: [
            { required: true, message: '必填项', trigger: 'change' },
            { validator: validateDepartKind, trigger: 'change' }
          ],
          fullName: [{ validator: validateFullName, trigger: 'blur' }],
          unifiedCode: [{ validator: validateUnified, trigger: 'blur' }]
        },
        statusMap: { 'D': '禁用', 'Y': '启用' }, // 默认值这里Y是可以删除，可删除状态及为禁用
        deptMap: { 'DOMAIN': '机构', 'NORMAL': '一般组织' }
      }
    },
    computed: {
      departKindOptions() {
        let ret = []
        Object.keys(this.deptMap).forEach(key => {
          ret.push({ value: key, label: this.deptMap[key] })
        })
        return ret
      },
      ENUM() {
        return { DISABLE: 'D', ENABLE: 'Y', ORG: 'DOMAIN', NORMAL: 'NORMAL' } // 常量比对键值对
      }
    },
    created() {
      this.getDeptStatusEnum()
      this.getDeptTypeEnum()
      this.resetDept()
      this.initTree()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.parentId = node.id
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          departName: '',
          status: this.disabledStatus || this.ENUM.DISABLE,
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetDept()
        this.openEditPage('create')
      },
      // 弹出操作记录弹窗
      handleOpenRecordDialog() {
        this.dialogStatus = 'record' // 为了设置状态隐藏主面板
        this.$refs.record && this.$refs.record.open('depart')
      },
      // 编辑事件
      handleModify(row) {
        this.resetDept()
        this.depart = { ...this.depart, ...row }
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck(row) {
        this.depart = { ...row }
        this.openEditPage('check')
      },
      // 单个启用禁用
      handleChangeStatusFlag(row) {
        let depart = { ...row }
        api.changeStatus(depart).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            // 缓存当前的禁用状态值
            this.disabledStatus = this.listQuery.status
            this.initTree()
          } else {
            this.$message({ type: 'danger', content: '操作失败' })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let depart = { ...row }
        this.$confirm({
          title: '确实要删除当前部门吗？',
          content: '删除这条数据后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeDepart(depart).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.initTree()
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
            let fun = this.dialogStatus === 'create' ? api.createDept : api.modifyDept
            fun(this.depart).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.initTree()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      /* [数据接口] */
      // 通用枚举
      getDeptStatusEnum() {
        getDeptStatus().then(res => {
          if (res.status === 200) {
            this.statusMap = res.data.data
          }
        })
      },
      // 部门类型枚举
      getDeptTypeEnum() {
        getDeptType().then(res => {
          if (res.status === 200) {
            this.deptMap = res.data.data
          }
        })
      },
      // 重置对象
      resetDept() {
        this.depart = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          departName: '',
          departCode: '',
          departKind: '',
          regionId: '',
          sortNum: 0,
          unifiedCode: '',
          fullName: '',
          remark: ''
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getDeptTree().then(response => {
          const tree = response.data.data || []
          let data = tree[0] ? this.treeMapper(tree[0], null) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0 && !this.currentTreeNode) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.parentId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
          }
          this.resetQuery()
        })
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        api.getDeptList(this.listQuery).then(response => {
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
