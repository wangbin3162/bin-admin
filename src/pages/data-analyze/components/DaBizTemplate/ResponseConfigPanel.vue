<template>
  <div>
    <page-header-wrap v-show="visible" show-close @on-close="close"
                      :title="`[${template.tempName}] 响应信息配置`">
      <v-table-wrap>
        <div slot="tree">
          <div class="mb-15">
            <b-button type="primary" plain style="width: 100%;"
                      icon="ios-add" @click="handleCreateRoot">
              添加根响应
            </b-button>
          </div>
          <b-tree :data="treeData"
                  @on-select-change="handTreeCurrentChange"/>
        </div>
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:respKind="{row}">
            <b-tag type="success" v-if="row.respKind==='RECORD'" size="mini">{{ respTypeMap[row.respKind] }}</b-tag>
            <b-tag type="primary" v-else size="mini">{{ respTypeMap[row.respKind] }}</b-tag>
          </template>
          <template v-slot:dataType="{row}">{{ dataTypeMap[row.dataType] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button :disabled="!canModify" type="text" @click="handleModify(row)">修改</b-button>
            <!--是否有删除键-->
            <template v-if="canRemove">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <b-drawer v-model="drawerVisible" :title="`编辑响应${resp.parentId?'':'根'}节点`"
              width="720" append-to-body :mask-closable="false">
      <div>
        <b-form :model="resp" ref="form" label-position="top">
          <b-row :gutter="20">
            <b-col span="12">
              <b-form-item label="响应类型" prop="respKind">
                <b-input v-model="resp.respKind" placeholder="响应类型"/>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="键名" prop="keyName">
                <b-input v-model="resp.keyName" placeholder="请输入键名"/>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row :gutter="20">
            <b-col span="12">
              <b-form-item label="别名" prop="keyAlias">
                <b-input v-model="resp.keyAlias" placeholder="请输入别名"/>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="键路径" prop="keyPath">
                <b-input v-model="resp.keyPath" placeholder="邮箱"/>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row :gutter="20">
            <b-col span="12">
              <b-form-item label="数据类型" prop="dataType">
                <b-input v-model="resp.dataType" placeholder="请输数据类型"/>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="序号" prop="orderNo">
                <b-input v-model="resp.orderNo" placeholder="序号"/>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="说明" prop="memo">
            <b-input v-model="resp.memo" type="textarea" placeholder="说明"/>
          </b-form-item>
        </b-form>
      </div>
      <div slot="footer">
        <b-button @click="drawerVisible = false">取 消</b-button>
        <b-button type="primary" @click="drawerVisible = false">提 交</b-button>
      </div>
    </b-drawer>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import * as api from '../../../../api/data-analyze/da-business-temp.api.js'

  export default {
    name: 'ResponseConfigPanel',
    mixins: [commonMixin, permission],
    data() {
      return {
        visible: false,
        listQuery: {
          bizId: ''
        },
        template: null,
        params: null,
        resp: null,
        treeData: [
          {
            title: '一级 1',
            children: [
              {
                title: '二级 1-1'
              },
              {
                title: '二级 1-2'
              }
            ]
          },
          {
            title: '一级 2',
            children: [
              {
                title: '二级 2-1'
              },
              {
                title: '二级 2-2'
              }
            ]
          }
        ],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '键名', key: 'keyName' },
          { title: '别名', key: 'keyAlias' },
          { title: '键路径', key: 'keyPath' },
          { title: '响应类型', slot: 'respKind', align: 'center', width: 90 },
          { title: '数据类型', slot: 'dataType', align: 'center', width: 90 },
          { title: '说明', key: 'memo' },
          { title: '操作', slot: 'action', width: 130 }
        ],
        drawerVisible: false,
        respTypeMap: { QUERY: '查询', METRIC: '度量', BUCKET: '分组', RECORD: '记录' },
        dataTypeMap: { character: '字符', longed: '整数', doubled: '小数', date: '日期', datetime: '日期时间', bool: '布尔' }
      }
    },
    created() {
      this.resetTemplate()
      this.resetResp(null)
      this.getEnum()
    },
    methods: {
      open(template) {
        this.template = this.$util.deepClone(template)
        this.listQuery.bizId = this.template.id
        this.visible = true
        this.initTree()
      },
      close() {
        this.visible = false
        this.treeData = []
        this.list = []
        this.currentTreeNode = null
        this.$emit('on-close')
      },
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.handleFilter()
      },
      // 添加跟响应节点
      handleCreateRoot() {
        this.resetResp(null)
        this.openEditPage('create')
        this.drawerVisible = true
      },
      handleCreate() {
        if (!this.currentTreeNode) {
          this.$message({ type: 'danger', content: '请选择一个响应节点后再新增！' })
          return
        }
        this.resetResp(this.currentTreeNode.id)
        this.openEditPage('create')
        this.drawerVisible = true
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        console.log(row)
      },
      // 编辑事件
      handleModify(row) {
        console.log(row)
      },
      // 重置对象
      resetTemplate() {
        this.template = {
          id: '',
          tempName: '',
          tempCode: '',
          tempType: '',
          tempSource: '',
          tempDesc: ''
        }
        this.params = []
      },
      // 重置响应对象
      resetResp(parentId) {
        this.resp = {
          bizId: this.listQuery.bizId,
          parentId,
          keyName: '',
          keyAlias: '',
          keyPath: '',
          respKind: '',
          dataType: '',
          memo: '',
          orderNo: 1
        }
      },
      // 获取enum
      getEnum() {
        api.getRespTypeEnum().then(res => {
          if (res.data.code === 0) {
            this.respTypeMap = res.data.data
          }
        })
        api.getDataTypeEnum().then(res => {
          if (res.data.code === 0) {
            this.dataTypeMap = res.data.data
          }
        })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getRespTree(this.listQuery.bizId).then(response => {
          if (response.status === 200) {
            const tree = response.data
            // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
            this.treeData = tree ? tree.map(item => {
              return this.treeMapper(item, null,
                ['bizId', 'parentId', 'respKind', 'keyName', 'keyAlias', 'keyPatch', 'dataType'],
                'keyName')
            }) : []
            if (this.treeData.length > 0) {
              // 如果没有当前选中节点则初始化为第一个选中
              if (!this.currentTreeNode) {
                this.currentTreeNode = this.treeData[0]
                this.$set(this.treeData[0], 'selected', true)
                this.$set(this.treeData[0], 'expand', true)
              }
              this.handleFilter()
            }
          }
        })
      },
      // 查询所有列表
      searchList() {
        if (!this.currentTreeNode) {
          return
        }
        this.setListData()
        api.getRespList(this.currentTreeNode.id, this.listQuery).then(response => {
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
