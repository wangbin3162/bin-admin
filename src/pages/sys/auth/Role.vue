<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="角色名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="角色编码">
            <b-input v-model.trim="listQuery.code" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:roleType="scope">
            <b-tag v-if="scope.row.roleType===ENUM.I" type="primary">{{ roleTypeMap[scope.row.roleType] }}</b-tag>
            <b-tag v-else type="warning">{{ roleTypeMap[scope.row.roleType] }}</b-tag>
          </template>
          <!--角色授权栏-->
          <template v-slot:auth="scope">
            <b-button @click="handleRoleAuth(scope.row)" type="text">编辑权限</b-button>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify || !isAdmin" type="text" @click="handleModify(scope.row)">修改
            </b-button>
            <!--是否有删除键-->
            <template v-if="canRemove && scope.row.roleType===ENUM.S">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除</b-button>
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
        <b-form :model="role" ref="form" :rules="ruleValidate" :label-width="100">
          <b-row>
            <b-col span="12">
              <b-form-item label="角色名称" prop="name">
                <b-input v-model="role.name" placeholder="请输入角色名称" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="角色编码" prop="code">
                <b-input v-model="role.code" placeholder="请输入角色编码" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="父角色">
                <div flex style="width:100%;">
                  <b-input :value="role.parentName" readonly class="choose-btn"></b-input>
                  <b-button v-if="role.parentId.length===0" slot="suffix" type="primary" plain
                            @click="handleShowDialogChoose" style="flex: 0 0 auto;">
                    选择
                  </b-button>
                  <b-button v-else type="danger" slot="suffix" plain style="flex: 0 0 auto;"
                            @click="handleChooseOne({id:'',name:''})">清空
                  </b-button>
                </div>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="角色类型" prop="roleType">
                <b-select v-model="role.roleType" placeholder="请选择角色类型">
                  <b-option v-for="item in roleTypeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12"></b-col>
            <b-col span="12"></b-col>
          </b-row>
          <b-form-item label="描述" prop="desc">
            <b-input v-model="role.desc" placeholder="请输入描述" type="textarea"></b-input>
          </b-form-item>
        </b-form>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <!--角色授权模块显示-->
    <role-auth ref="roleAuth" @on-close="handleCancel"></role-auth>
    <!--角色选择弹窗-->
    <role-choose ref="roleChoose" @on-choose="handleChooseOne" no-admin></role-choose>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getRoleType } from '../../../api/enum.api'
  import * as api from '../../../api/sys/role.api'
  import RoleChoose from '../components/RoleChoose'
  import RoleAuth from '../components/RoleAuth'
  import { requiredRule } from '../../../common/utils/validate'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Role',
    components: { RoleAuth, RoleChoose },
    mixins: [commonMixin, permission],
    data() {
      const validateName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneRoleName(this.role).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('角色名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneRoleCode(this.role).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('角色编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        moduleName: '角色',
        listQuery: {
          name: '',
          code: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '角色名称', key: 'name' },
          { title: '角色编码', key: 'code' },
          { title: '父角色名称', key: 'parentName' },
          { title: '角色类型', slot: 'roleType', width: 100, align: 'center' },
          { title: '描述', key: 'desc', width: 350, ellipsis: true, tooltip: true },
          { title: '角色授权', slot: 'auth', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        role: null,
        ruleValidate: {
          name: [requiredRule, { validator: validateName, trigger: 'blur' }],
          code: [requiredRule, { validator: validateCode, trigger: 'blur' }]
        },
        roleTypeMap: { 'S': '系统创建', 'I': '内置角色' }
      }
    },
    computed: {
      ...mapGetters(['roles']),
      isAdmin() {
        return this.roles.includes('ROLE_ADMIN')
      },
      roleTypeOptions() {
        let ret = []
        Object.keys(this.roleTypeMap).forEach(key => {
          ret.push({ value: key, label: this.roleTypeMap[key] })
        })
        return ret
      },
      ENUM() {
        return { S: 'S', I: 'I' } // 常量比对键值对I:系统角色，S：应用角色
      }
    },
    created() {
      this.getRoleTypeEnum()
      this.resetRole()
      this.searchList()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          code: ''
        }
      },
      // 新增按钮事件
      handleCreate() {
        this.resetRole()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetRole()
        this.role = { ...this.role, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let role = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前角色吗(删除此角色，相关联的用户会自动解除该角色)？`,
          loading: true,
          onOk: () => {
            api.removeRole(role).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.searchList()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createRole : api.modifyRole
            fun(this.role).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.searchList()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 弹窗选择角色
      handleShowDialogChoose() {
        this.$refs.roleChoose && this.$refs.roleChoose.open()
      },
      // 选中一个角色
      handleChooseOne(one) {
        // 获取选中角色并填充父角色id和名称
        this.role.parentId = one.id
        this.role.parentName = one.name
      },
      // 弹窗角色授权
      handleRoleAuth(row) {
        this.resetRole()
        this.role = { ...this.role, ...row }
        // 通过状态改变来弹出角色授权栏
        this.dialogStatus = 'roleAuth'
        this.$refs.roleAuth && this.$refs.roleAuth.open(this.role)
      },
      /* [数据接口] */
      // 通用枚举
      getRoleTypeEnum() {
        getRoleType().then(res => {
          if (res.status === 200) {
            this.roleTypeMap = res.data.data
          }
        })
      },
      // 重置角色对象
      resetRole() {
        this.role = {
          id: '',
          name: '',
          code: '',
          roleType: this.ENUM.S,
          desc: '',
          parentId: '',
          parentName: ''
        }
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        api.getRoleList(this.listQuery).then(response => {
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
