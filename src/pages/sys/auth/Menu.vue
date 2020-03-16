<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="菜单名称">
            <b-input v-model.trim="listQuery.menuName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="禁用状态">
            <b-switch size="large" v-model="listQuery.delFlag" :true-value="ENUM.Y" :false-value="ENUM.N"
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
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:name="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
          </template>
          <!--菜单类型-->
          <template v-slot:type="scope">
            <b-tag>
              {{ menuTypeMap[scope.row.type] }}
            </b-tag>
          </template>
          <!--状态-->
          <template v-slot:delFlag="scope">
            <b-switch v-model="scope.row.delFlag" :true-value="ENUM.N" :false-value="ENUM.Y"
                      inactive-color="#ff4949"
                      @on-change="handleChangeDelFlag(scope.row)">
            </b-switch>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
            <b-button :disabled="canModify && scope.row.delFlag===ENUM.Y"
                      type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <template v-if="canRemove && scope.row.delFlag===ENUM.Y">
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
        <b-form :model="menu" ref="form" :rules="ruleValidate" :label-width="100">
          <b-row>
            <b-col span="12">
              <b-form-item label="上级菜单" class="bin-form-item-required">
                <b-input v-if="currentTreeNode" :value="currentTreeNode.title" disabled></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="菜单类型" class="bin-form-item-required">
                <b-select :value="menu.type">
                  <b-option :value="menu.type">{{ menuTypeMap[menu.type] }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="菜单名称" prop="name">
                <b-input v-model="menu.name" placeholder="请输入菜单名称" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="前端路由" prop="path">
                <b-input v-model="menu.path" placeholder="请输入前端路由" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="菜单路径" prop="url">
                <b-input v-model="menu.url" placeholder="请输入菜单路径" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="排序编号" prop="sortNum">
                <b-input-number :min="0" v-model="menu.sortNum" style="width: 100%;"></b-input-number>
              </b-form-item>
            </b-col>
          </b-row>
          <template v-if="menu.permissions&&menu.permissions.length===0">
            <b-form-item label="动作菜单">
              <b-button type="primary" plain round @click="initPermissions">初始化</b-button>
            </b-form-item>
          </template>
        </b-form>
        <template v-if="menu.permissions&&menu.permissions.length!==0" slot="full">
          <!--动作列表编辑框-->
          <b-divider align="left">动作列表</b-divider>
          <b-table disabled-hover :data="menu.permissions" size="small"
                   :columns="[
                     { title: '动作名称', slot: 'name', width:120 },
                     { title: '前端路径', slot: 'path'},
                     { title: '动作描述', slot: 'desc'},
                     { title: '菜单路径', slot: 'url' },
                     { title: '操作', slot: 'action', width: 100, align: 'center'}]">
            <template v-slot:name="scope">
              <b-input v-model="menu.permissions[scope.index].name" size="small"
                       :readonly="permissionReadOnly(scope.row.path)"></b-input>
            </template>
            <template v-slot:path="scope">
              <b-input v-model="menu.permissions[scope.index].path" size="small"
                       :readonly="permissionReadOnly(scope.row.path)"></b-input>
            </template>
            <template v-slot:desc="scope">
              <b-input v-model="menu.permissions[scope.index].desc" size="small"></b-input>
            </template>
            <template v-slot:url="scope">
              <b-input v-model="menu.permissions[scope.index].url" size="small"></b-input>
            </template>
            <template v-slot:action="scope">
              <template v-if="scope.row.id.length > 0">
                <b-popover confirm :icon-styles="{color:'#f5222d'}" placement="top-end"
                           title="确认删除此动作吗？删除后会移除授权关联。" append-to-body
                           content="删除此行可能会移除授权关联。"
                           @on-ok="removeBufferRow(scope.row,scope.index)">
                  <b-button type="danger" transparent size="small">删除</b-button>
                </b-popover>
              </template>
              <b-button v-else type="danger" transparent size="small"
                        @click="removeBufferRow(scope.row,scope.index)">移除
              </b-button>
            </template>
          </b-table>
          <b-button type="dashed" icon="ios-add-circle-outline"
                    style="width: 100%;margin-top: 16px;margin-bottom: 8px;"
                    @click="addBufferRow">添加动作
          </b-button>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap v-if="menu&&currentTreeNode">
        <div>
          <v-key-label label="上级菜单" is-half is-first>{{ currentTreeNode.title }}</v-key-label>
          <v-key-label label="菜单名称" is-half>{{ menu.name }}</v-key-label>
          <v-key-label label="菜单类型" is-half is-first>
            <b-tag>{{ menuTypeMap[menu.type] }}</b-tag>
          </v-key-label>
          <v-key-label label="前端路由" is-half>{{ menu.path }}</v-key-label>
          <v-key-label label="菜单路径" is-half is-first is-bottom>{{ menu.url }}</v-key-label>
          <v-key-label label="排序编号" is-half is-bottom>{{ menu.sortNum }}</v-key-label>
        </div>
        <template v-if="menu.permissions.length>0" slot="full">
          <b-divider align="left">动作列表</b-divider>
          <b-table disabled-hover :data="menu.permissions" size="small"
                   :columns="[
                     { title: '动作名称', key: 'name', width:120, align: 'center', },
                     { title: '前端路径', key: 'path'},
                     { title: '动作描述', key: 'desc'},
                     { title: '菜单路径', key: 'url' }]">
          </b-table>
        </template>
        <!--保存提交-->
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
  import * as api from '../../../api/sys/menu.api'
  import { getYn, getMenuType } from '../../../api/enum.api'
  import { validateRoutePath, requiredRule } from '../../../common/utils/validate'
  import { deepCopy } from '../../../common/utils/assist'

  export default {
    name: 'Menu',
    mixins: [commonMixin, permission],
    data() {
      const checkMenuPath = (rule, value, callback) => {
        if (value && validateRoutePath(value)) {
          callback(new Error('请输入正确的菜单路由(如:/ace ; /ace/menu)'))
        }
        callback()
      }
      return {
        moduleName: '菜单',
        listQuery: {
          menuName: '',
          parentId: '', // 父菜单id
          delFlag: 'N'
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '菜单名称', slot: 'name', width: 120 },
          { title: '前端路由', key: 'path' },
          { title: '菜单类型', slot: 'type', width: 95, align: 'center' },
          { title: '排序编号', key: 'sortNum', width: 95, align: 'center' },
          { title: '状态', slot: 'delFlag', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        menu: null,
        ruleValidate: {
          name: [requiredRule],
          path: [requiredRule, { validator: checkMenuPath, trigger: 'blur' }]
        },
        ynMap: { 'N': '否', 'Y': '是' }, // 默认值这里Y是可以删除，可删除状态及为禁用
        menuTypeMap: { '1': '功能菜单', '2': '目录菜单', '3': '动作菜单' },
        TYPE: { FUN: '1', DIR: '2', ACT: '3' }
      }
    },
    computed: {
      ENUM() {
        return { N: 'N', Y: 'Y' } // 常量比对键值对
      }
    },
    created() {
      this.getYnEnum()
      this.getMenuTypeEnum()
      this.resetMenu()
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
          menuName: '',
          delFlag: this.ENUM.N,
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
      },
      // 新增按钮事件
      handleCreate() {
        this.resetMenu()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetMenu()
        api.getMenuDetail(row.id).then(res => {
          if (res.data.code === '0') {
            this.menu = { ...this.menu, ...res.data.data }
            this.openEditPage('modify')
          }
        })
      },
      // 查看按钮事件
      handleCheck(row) {
        this.resetMenu()
        api.getMenuDetail(row.id).then(res => {
          if (res.data.code === '0') {
            this.menu = { ...this.menu, ...res.data.data }
            this.openEditPage('check')
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let menu = { ...row }
        this.$confirm({
          title: '确实要删除当前菜单吗',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeMenu(menu).then(res => {
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
            let tmp = this.menu.permissions.filter(i => i.name.length > 0 && i.path.length > 0)
            this.menu.permissions = deepCopy(tmp)
            let fun = this.dialogStatus === 'create' ? api.createMenu : api.modifyMenu
            fun(this.menu).then(res => {
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
      // 单个启用禁用
      handleChangeDelFlag(row) {
        let menu = { ...row }
        api.changeDelFlag(menu).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            this.initTree()
          } else {
            this.$message({ type: 'danger', content: '操作失败' })
          }
        })
      },
      /* [动作菜单操作相关] */
      // 初始化4个基本动作菜单
      initPermissions() {
        // 创建时动作缓存初始化3个动作
        this.menu.permissions = [
          { id: '', name: '新增', path: 'create', desc: '新增单条数据', url: '', type: this.TYPE.ACT },
          { id: '', name: '更新', path: 'modify', desc: '更新单条数据', url: '', type: this.TYPE.ACT },
          { id: '', name: '删除', path: 'remove', desc: '删除单条数据', url: '', type: this.TYPE.ACT }
        ]
      },
      // 添加一行选项
      addBufferRow() {
        if (this.checkBufferValueNotEmpty()) {
          this.menu.permissions.push({ id: '', name: '', path: '', url: '', type: this.TYPE.ACT })
        } else {
          this.$message({ content: '名称和前端路径必填', type: 'danger' })
        }
      },
      // 删除一行
      removeBufferRow(item, index) {
        if (item.id.length === 0) {
          this.menu.permissions.splice(index, 1)
        } else {
          let menu = { ...item }
          api.removeMenu(menu).then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', content: '操作成功' })
              this.$modal.remove()
              this.menu.permissions.splice(index, 1)
            } else {
              this.$modal.remove()
              this.$notice.danger({ title: '操作错误', desc: res.data.message })
            }
          })
        }
      },
      // 检查bufferValue中的值是否都不为空
      checkBufferValueNotEmpty() {
        return this.menu.permissions.every(item => item.path.length > 0 && item.name.length > 0)
      },
      // 是否是只读的动作
      permissionReadOnly(per) {
        return ['create', 'modify', 'search', 'remove'].includes(per)
      },
      /* [数据接口] */
      // 重置对象
      resetMenu() {
        this.menu = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          name: '',
          sortNum: 0,
          url: '',
          type: this.TYPE.FUN, // 默认只创建功能菜单
          path: '',
          permissions: []
        }
      },
      // 通用枚举
      getYnEnum() {
        getYn().then(res => {
          if (res.status === 200) {
            this.ynMap = res.data.data
          }
        })
      },
      // 菜单类型
      getMenuTypeEnum() {
        getMenuType().then(res => {
          if (res.status === 200) {
            this.menuTypeMap = res.data.data
          }
        })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getMenuTree().then(response => {
          const tree = response.data.data
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree ? this.treeMapper(tree) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            // 如果没有当前选中节点则初始化为第一个选中
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              // 这里要注意，扩展响应式属性需要这么写
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.parentId = this.currentTreeNode.id
            this.handleFilter()
          }
        })
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        api.getMenuList(this.listQuery).then(response => {
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
