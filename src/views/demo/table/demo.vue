<template>
  <v-table-layout>
    <!--树结构-->
    <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
    <!--查询条件-->
    <v-filter-bar slot="filter" :is-opened="filterOpened">
      <v-filter-item title="用户名称">
        <b-input v-model.trim="listQuery.name" size="small" placeholder="请输入部门名称" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="显示禁用" width="160px">
        <b-switch size="large" v-model="listQuery.delFlag" true-value="Y" false-value="N"
                  @on-change="handleFilter">
          <span slot="open">显示</span>
          <span slot="close">隐藏</span>
        </b-switch>
      </v-filter-item>
      <!--添加查询按钮位置-->
      <v-filter-item @on-search="handleFilter" @on-reset="resetQuery" width="250px"
                     :show-toggle="true" :is-opened="filterOpened" @on-toggle="filterOpened=!filterOpened"
      ></v-filter-item>
      <template slot="more">
        <v-filter-item title="地址">
          <b-input v-model.trim="listQuery.address" size="small" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="年龄">
          <b-input v-model.trim="listQuery.age" size="small" placeholder="请输入" clearable></b-input>
        </v-filter-item>
      </template>
    </v-filter-bar>
    <!--控制栏-->
    <template slot="ctrl">
      <b-button type="primary" v-waves size="small" icon="ios-add" @click="handleCreate">新增</b-button>
    </template>
    <b-table slot="table" :columns="columns" :data="list" :loading="listLoading" stripe max-height="526">
      <template v-slot:name="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.name }}</a>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button type="text" @click="handleModify(scope.row)" v-waves>编辑</b-button>
        <!--是否有删除键-->
        <template>
          <b-divider type="vertical"></b-divider>
          <b-button type="text" v-waves style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
        </template>
      </template>
    </b-table>
    <!--下方分页器-->
    <b-page slot="pager" :total="total" show-sizer
            @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
    <!--编辑抽屉-->
    <b-drawer v-model="dialogFormVisible" :append-to-body="false" fullscreen footer-hide :title="editTitle">
      <!--查询内容区域-->
      <div v-if="dialogStatus==='check'" style="width: 880px;padding: 20px 0 0 20px;">
        <v-key-label label="姓名" label-width="150px" is-half is-first>{{ user.name }}</v-key-label>
        <v-key-label label="年龄" is-half>{{ user.age }}</v-key-label>
        <v-key-label label="出生日期" label-width="150px">{{ user.birthday }}</v-key-label>
        <v-key-label label="地址" label-width="150px" is-bottom>{{ user.address }}</v-key-label>
        <div style="padding: 10px;text-align: center;">
          <b-button v-waves @click="dialogFormVisible=false">取 消</b-button>
        </div>
      </div>
      <!--增加编辑区域-->
      <div v-else style="width: 880px;padding: 20px 0 0 60px;">
        <!--调试用，显示id-->
        <b-form :model="user" ref="form" :rules="ruleValidate" :label-width="130">
          <div flex="box:mean">
            <b-form-item label="姓名" prop="name">
              <b-input v-model="user.name" placeholder="请输入姓名" clearable></b-input>
            </b-form-item>
            <b-form-item label="年龄" prop="age">
              <b-input-number :min="0" v-model="user.age" style="width: 100%;"></b-input-number>
            </b-form-item>
          </div>
          <!--出生日期这里暂时为输入框-->
          <b-form-item label="出生日期" prop="birthday">
            <b-input v-model="user.birthday" placeholder="请输入出生日期" clearable></b-input>
          </b-form-item>
          <b-form-item label="地址" prop="address">
            <b-input v-model="user.address" placeholder="请输入地址" clearable></b-input>
          </b-form-item>
          <b-form-item>
            <b-button type="primary" v-waves @click="handleSubmit" :loading="btnLoading">确 定</b-button>
            <b-button v-waves @click="handleCancel">取 消</b-button>
          </b-form-item>
        </b-form>
      </div>
    </b-drawer>
  </v-table-layout>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'

  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'TableDemo',
    mixins: [commonMixin],
    data () {
      const validateDate = (rule, value, callback) => {
        if (value.length > 0) {
          // 这里需要编写对应的校验格式
          // api.oneDeptName(this.depart).then(response => {
          //   if (response.data.data === 0) {
          //     callback()
          //   } else {
          //     callback(new Error('部门名称重复'))
          //   }
          // }).catch(() => {
          //   callback(new Error('请求验证重复性出错'))
          // })
          callback()
        }
      }
      return {
        listQuery: {
          name: '',
          delFlag: 'N',
          address: '',
          age: ''
        },
        treeData: [],
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 50,
            align: 'center',
            indexMethod: (row) => {
              return this.listQuery.size * (this.listQuery.page - 1) + row._index + 1
            }
          },
          { title: '姓名', slot: 'name' },
          { title: '年龄', key: 'age' },
          { title: '出生日期', key: 'birthday' },
          { title: '地址', key: 'address' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        user: null,
        ruleValidate: {
          name: [requiredRule],
          birthday: [
            { required: true, message: '必填项', trigger: 'blur' },
            { validator: validateDate, trigger: 'blur' }
          ],
          address: [requiredRule]
        }
      }
    },
    created () {
      this.initTree()
      this.resetUser()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange (data, node) {
        this.currentTreeNode = node
        console.log(this.currentTreeNode)
        // if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
        //   this.depart.parentId = node.id
        // } else {
        //   this.listQuery.parentId = node.id
        //   this.handleFilter()
        // }
      },
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          delFlag: 'N',
          address: '',
          age: ''
        }
      },
      // 新增按钮事件
      handleCreate () {
        this.resetUser()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify (row) {
        this.user = { ...row }
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck (row) {
        this.user = { ...row }
        this.openEditPage('check')
      },
      // 弹窗提示是否删除
      handleRemove (row) {
        let user = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前用户吗？`,
          // loading: true,
          onOk: () => {
            console.log(user)
            this.$message({ type: 'success', content: '删除成功' })
            // api.removeDepart(depart).then(res => {
            //   if (res.data.code === '0') {
            //     this.$message({ type: 'success', content: '操作成功' })
            //     this.$modal.remove()
            //     this.initTree()
            //   } else {
            //     this.$modal.remove()
            //     this.$message({ type: 'danger', content: res.data.message })
            //   }
            // })
          }
        })
      },
      // 表单提交
      handleSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 校验成功后根据状态去创建或修改
            this.$message({ type: 'success', content: '操作成功' })
            // 手动关闭弹窗
            this.dialogFormVisible = false
            // this.btnLoading = true
            // let fun = this.dialogStatus === 'create' ? api.createDept : api.modifyDept
            // fun(this.user).then(res => {
            //   if (res.data.code === '0') {
            //     this.btnLoading = false
            //     this.dialogFormVisible = false
            //     this.$message({ type: 'success', content: '操作成功' })
            //     this.initTree()
            //   } else {
            //     this.$message({ type: 'error', content: res.data.message })
            //   }
            // })
          }
        })
      },
      /* [数据接口] */
      // 重置栏目对象
      resetUser () {
        this.user = {
          id: '',
          username: '',
          delFlag: 'N',
          address: '',
          age: 0
        }
      },
      // tree:初始化树结构
      initTree () {
        // 这里模拟获取
        this.treeData = [
          {
            title: '一级 1',
            expand: true,
            children: [
              {
                title: '二级 1-1',
                expand: true,
                children: [
                  { title: '三级 1-1-1' },
                  { title: '三级 1-1-2' }
                ]
              },
              {
                title: '二级 1-2',
                expand: true,
                children: [
                  { title: '三级 1-2-1' },
                  { title: '三级 1-2-2' }
                ]
              }
            ]
          }
        ]
        // 请求响应返回树结构
        // api.getTree().then(response => {
        //   const tree = response.data.data || []
        //   let mapper = node => {
        //     return {
        //       id: node.id,
        //       title: node.text,
        //       children: (node.children && node.children.map(mapper)) || []
        //     }
        //   }
        //   let data = tree[0] && tree[0].code === 'top' ? mapper(tree[0]) : []
        //   this.treeData.push(data)
        //   // 默认选中顶层树并查询对应列表
        if (this.treeData.length > 0) {
          this.currentTreeNode = this.treeData[0]
          this.listQuery.parentId = this.currentTreeNode.id
          // 这里要注意，扩展响应式属性需要这么写
          this.$set(this.treeData[0], 'selected', true)
          this.$set(this.treeData[0], 'expand', true)
          this.searchList()
        }
        // })
      },
      // 查询所有部门列表
      searchList () {
        // 模拟获取列表数据
        this.setListData({
          list: [
            {
              name: '王小明',
              age: 18,
              birthday: '1990-04-22',
              address: '北京市朝阳区芍药居'
            },
            {
              name: '张小刚',
              age: 25,
              birthday: '1990-02-11',
              address: '北京市海淀区西二旗'
            },
            {
              name: '李小红',
              age: 30,
              birthday: '1991-06-16',
              address: '上海市浦东新区世纪大道'
            },
            {
              name: '周小伟',
              age: 26,
              birthday: '1992-09-02',
              address: '深圳市南山区深南大道'
            },
            {
              name: '张小发',
              age: 33,
              birthday: '1989-12-22',
              address: '南京市龙眠大道'
            },
            {
              name: '张小刚',
              age: 25,
              birthday: '1990-02-11',
              address: '北京市海淀区西二旗'
            },
            {
              name: '李小红',
              age: 30,
              birthday: '1991-06-16',
              address: '上海市浦东新区世纪大道'
            },
            {
              name: '周小伟',
              age: 26,
              birthday: '1992-09-02',
              address: '深圳市南山区深南大道'
            },
            {
              name: '张小发',
              age: 33,
              birthday: '1989-12-22',
              address: '南京市龙眠大道'
            },
            {
              name: '张小发',
              age: 33,
              birthday: '1989-12-22',
              address: '南京市龙眠大道'
            }
          ],
          total: 15
        })
        // this.setListData()
        // api.getList(this.listQuery).then(response => {
        //   if (response.status === 200) {
        //     this.setListData({
        //       list: response.data.rows,
        //       total: response.data.total
        //     })
        //   }
        // })
      }
    }
  }
</script>
