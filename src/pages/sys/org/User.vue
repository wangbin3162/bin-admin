<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="登录名称">
            <b-input v-model.trim="listQuery.username" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="真实名称">
            <b-input v-model.trim="listQuery.realName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="禁用状态" width="160px">
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
          <template v-slot:username="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.username }}</b-button>
          </template>
          <!--操作栏-->
          <template v-slot:reset="scope">
            <b-button type="text" @click="handleResetPwd(scope.row)"
                      :disabled="!havePermission('resetPwd')">
              重置密码
            </b-button>
          </template>
          <!--状态-->
          <template v-slot:status="scope">
            <b-tag v-if="scope.row.status===ENUM.INIT" type="primary">初始</b-tag>
            <b-switch v-else
                      v-model="scope.row.status" :true-value="ENUM.ENABLE" :false-value="ENUM.DISABLE"
                      inactive-color="#ff4949"
                      @on-change="handleChangeStatus(scope.row)"
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
              <b-button :disabled="!canRemove" type="text" text-color="danger" @click="handleRemove(scope.row)">删除
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
      <v-edit-wrap>
        <b-form :model="user" ref="form" :rules="ruleValidate" :label-width="100">
          <b-form-item label="所属组织">
            <b-input v-if="currentTreeNode" :value="currentTreeNode.title" readonly></b-input>
          </b-form-item>
          <b-row>
            <b-col span="12">
              <b-form-item label="登录名称" prop="username">
                <!--登录名称编辑时不可修改-->
                <b-input v-model="user.username" placeholder="请输入登录名称" clearable
                         :readonly="dialogStatus==='modify'"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="真实名称" prop="realName">
                <b-input v-model="user.realName" placeholder="请输入真实名称" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="手机号码" prop="mobile">
                <b-input v-model="user.mobile" placeholder="请输入手机号码" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="电子邮件" prop="email">
                <b-input v-model="user.email" placeholder="请输入邮箱" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="角色">
            <b-tag :key="role.id" v-for="role in user.roles"
                   :closable="!isAdminRole(user)" @on-close="handleRemoveRole(role)">
              {{ role.name }}
            </b-tag>
            <b-button type="primary" style="vertical-align: middle;" plain
                      :disabled="isAdminRole(user)" @click="handleShowDialogChoose">选择角色
            </b-button>
          </b-form-item>
          <b-form-item label="备注" prop="remark">
            <b-input v-model="user.remark" placeholder="请输入备注" type="textarea"></b-input>
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
      <v-edit-wrap v-if="user&&currentTreeNode">
        <div>
          <v-key-label label="所属组织">{{ currentTreeNode.title }}</v-key-label>
          <v-key-label label="登录名称">{{ user.username }}</v-key-label>
          <v-key-label label="真实名称">{{ user.realName }}</v-key-label>
          <v-key-label label="电话号码">{{ user.mobile | mobileFilter}}</v-key-label>
          <v-key-label label="电子邮件">{{ user.email }}</v-key-label>
          <v-key-label label="角色">
            <template v-if="user.roles">
              <b-tag type="info" v-for="role in user.roles" :key="role.id">{{ role.name }}</b-tag>
            </template>
            <span v-else>未选择</span>
          </v-key-label>
          <v-key-label label="备注" is-bottom>{{ user.remark }}</v-key-label>
        </div>
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <!--角色选择弹窗-->
    <role-choose ref="roleChoose" @on-choose="handleChooseOne"></role-choose>
    <!--操作记录弹窗-->
    <record-list ref="record" @on-close="handleCancel"></record-list>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getDeptTree } from '../../../api/sys/depart.api'
  import * as api from '../../../api/sys/user.api'
  import { getUserStatus } from '../../../api/enum.api'
  import { isEmail, isTelCode, isLetterW, requiredRule } from '../../../common/utils/validate'
  import { Decode, Encode, MaskCode } from '../../../common/utils/secret'
  import RoleChoose from '../components/RoleChoose'
  import RecordList from '../components/RecordList'
  import VBatchImport from '../../../components/VBatch/VBatchImport'
  import VBatchExport from '../../../components/VBatch/VBatchExport'
  import VDownloadTemplate from '../../../components/VBatch/VDownloadTemplate'

  const batchType = 'SysUserController' // 模块名称，提供下载模板和批量导入导出

  export default {
    name: 'User',
    mixins: [commonMixin, permission],
    components: { RoleChoose, RecordList, VBatchExport, VDownloadTemplate, VBatchImport },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length <= 3  || value.length >128) {
          callback(new Error('登录名必须大于3个字符且小于128个字符'))
        } else {
          if (isLetterW(value)) {
            api.oneUsername(this.user).then(response => {
              if (response.data.data === 0) {
                callback()
              } else {
                callback(new Error('登录名称重复'))
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          } else {
            callback(new Error('登录名只能以字母开头的字母、数字、下划线组合'))
          }
        }
      }
      const validateMobile = (rule, value, callback) => {
        if (value.length > 0) {
          if (isTelCode(value)) {
            // 手机号加密后比对是否重复
            let encrypt = Encode(value)
            api.oneMobile({ id: this.user.id, mobile: encrypt }).then(response => {
              if (response.data.data === 0) {
                callback()
              } else {
                callback(new Error('电话号码重复'))
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          } else {
            callback(new Error('输入正确的手机号码'))
          }
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (value.length > 0) {
          if (isEmail(value)) {
            api.oneEmail(this.user).then(response => {
              if (response.data.data === 0) {
                callback()
              } else {
                callback(new Error('邮箱重复'))
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          } else {
            callback(new Error('输入正确的邮箱地址'))
          }
        } else {
          callback()
        }
      }
      return {
        moduleName: '用户',
        batchType: batchType,
        listQuery: {
          username: '',
          realName: '',
          status: 'D',
          departId: ''
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '登录名称', slot: 'username' },
          { title: '真实名称', key: 'realName' },
          { title: '重置', slot: 'reset', align: 'center' },
          { title: '用户状态', slot: 'status', width: 180, align: 'center' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        user: null,
        ruleValidate: {
          username: [requiredRule, { validator: validateUsername, trigger: 'blur' }],
          realName: [requiredRule],
          mobile: [{ validator: validateMobile, trigger: 'blur' }],
          email: [{ validator: validateEmail, trigger: 'blur' }]
        },
        statusMap: { 'I': '初始', 'Y': '启用', 'D': '禁用' }
      }
    },
    filters: {
      mobileFilter(value) {
        return MaskCode(value, 'MOBILE_PHONE')
      }
    },
    computed: {
      ENUM() {
        return { INIT: 'I', ENABLE: 'Y', DISABLE: 'D' } // 常量比对键值对 初始状态不可启用禁用和删除
      }
    },
    created() {
      this.getUserStatusEnum()
      this.resetUser()
      this.initTree()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.departId = node.id
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          username: '',
          realName: '',
          status: this.ENUM.DISABLE,
          departId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetUser()
        this.openEditPage('create')
      },
      // 弹出操作记录弹窗
      handleOpenRecordDialog() {
        this.dialogStatus = 'record' // 更改查询状态
        this.$refs.record && this.$refs.record.open('user')
      },
      // 查看按钮事件
      handleCheck(row) {
        this.resetUser()
        this.user = { ...this.user, ...row }
        // 解密手机号显示
        this.user.mobile = this.user.mobile.length > 0 ? Decode(this.user.mobile) : ''
        this.openEditPage('check')
      },
      // 编辑事件
      handleModify(row) {
        this.resetUser()
        this.user = { ...this.user, ...row }
        // 解密手机号显示
        this.user.mobile = this.user.mobile.length > 0 ? Decode(this.user.mobile) : ''
        this.openEditPage('modify')
      },
      // 弹窗选择角色
      handleShowDialogChoose() {
        this.$refs.roleChoose && this.$refs.roleChoose.open()
      },
      // 选中一个角色
      handleChooseOne(role) {
        if (role.id && role.id.length > 0) {
          if (this.user.roles.findIndex(item => item.id === role.id) === -1) {
            this.user.roles.push(role)
          }
        }
      },
      // 删除一个角色
      handleRemoveRole(role) {
        this.user.roles.splice(this.user.roles.indexOf(role), 1)
      },
      // 当前用户是否是管理员
      isAdminRole(user) {
        return user.id ? user.id === 'pre_ncloud_sys_user_10000' : false
      },
      // 表单提交
      handleSubmit() {
        let tmpUser = { ...this.user }
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createUser : api.modifyUser
            // 如果电话号码存在则需要加密存储
            if (tmpUser.mobile.length > 0) {
              tmpUser.mobile = Encode(this.user.mobile)
            }
            fun(tmpUser).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      // 单个启用禁用
      handleChangeStatus(row) {
        let user = { ...row }
        api.changeStatus(user).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            // this.handleFilter()
          } else {
            this.$notice.danger({ title: '操作失败', desc: res.data.message })
            this.handleFilter()
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let user = { ...row }
        this.$confirm({
          title: '确定删除当前用户吗？',
          content: '删除这条数据后，就无法使用此用户进行登录。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeUser(user).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 弹窗提示是否重置用户的密码
      handleResetPwd(row) {
        let user = { ...row }
        this.$confirm({
          title: '确定要重置此用户的密码吗？',
          content: '初始密码为：123456',
          loading: true,
          onOk: () => {
            api.resetUserPwd(user).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      /* [数据接口] */
      // 通用枚举
      getUserStatusEnum() {
        getUserStatus().then(res => {
          if (res.status === 200) {
            this.statusMap = res.data.data
          }
        })
      },
      // 重置对象
      resetUser() {
        this.user = {
          id: '',
          departId: this.currentTreeNode ? this.currentTreeNode.id : '',
          username: '',
          realName: '',
          status: this.ENUM.ENABLE,
          email: '',
          mobile: '',
          sortNum: '',
          remark: '',
          roles: []
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getDeptTree().then(response => {
          const tree = response.data.data || []
          let mapper = node => {
            return {
              id: node.id,
              title: node.text,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = tree[0] ? mapper(tree[0]) : []
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.parentId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
            this.resetQuery()
          }
        })
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        api.getUserList(this.listQuery).then(response => {
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
