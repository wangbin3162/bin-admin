<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="名称">
            <b-input v-model="listQuery.modelName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="主体类型">
            <!-- <b-cascader :data="subjectType" v-model="listQuery.bizType"
              change-on-select></b-cascader> -->
            <b-select v-model="listQuery.personClass" clearable>
              <b-option value="A01">自然人</b-option>
              <b-option value="A02">法人和其他组织</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="状态">
            <b-select v-model="listQuery.modelStatus" clearable>
              <b-option v-for="(value, key) in statusEnum" :key="value" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>

        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:modelName="{ row }">
            <b-button type="text" @click="handleCheck(row.id)">{{ row.modelName }}</b-button>
          </template>
          <template v-slot:personClass="{ row }">
            {{ personClassEnum[row.personClass]}}
          </template>
          <template v-slot:ratingId="{ row }">
            <b-button type="text" @click="handleSetLevel(row)">{{ row.ratingName }} ></b-button>
          </template>
          <template v-slot:modelIndex="{ row }">
            <b-button type="text" @click="handleIndexConfig(row)">指标配置 ></b-button>
          </template>
          <template v-slot:sysDefault="{ row }">
            {{ defaultEnum[row.sysDefault] }}
          </template>
          <template v-slot:modelStatus="{ row }">
            <b-switch true-value="Y" false-value="D"
              :value="row.modelStatus"
              @on-change="handleSwitchChange($event, row.id)"></b-switch>
          </template>
          <!-- 操作栏 -->
          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
              修改
            </b-button>
            <b-divider type="vertical"></b-divider>
            <b-dropdown :appendToBody="true">
              <b-button type="text">更多
                <b-icon name="ios-arrow-down"/>
              </b-button>
              <b-dropdown-menu slot="list">
                <b-dropdown-item :style="colorPrimary"
                  @click.native="handleSetDefault(row.id)">设为默认</b-dropdown-item>
                <b-dropdown-item :style="colorSuccess"
                  @click.native="handleClone(row.id)">克隆</b-dropdown-item>
                <b-dropdown-item :style="colorDanger"
                  @click.native="handleRemove(row.id)">删除</b-dropdown-item>
              </b-dropdown-menu>
            </b-dropdown>
          </template>
        </b-table>

        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <select-level :open="open"
      @close="handleLevelClose"
      @selected="handleLevelSelected"></select-level>

    <index-config v-if="dialogStatus === 'indexConfig'"
      @close="handleIndexConfigClose"
      :modelId="editData.id"></index-config>

    <edit v-if="isEdit"
      @close="handleClose"
      @success="handleEditSuccess"
      :title="editTitle"
      :editData="editData"></edit>

    <detail v-if="isCheck"
      @close="handleCancel"
      :id="ratingModelId"
      :title="editTitle"></detail>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from './Edit'
  import Detail from './Detail'
  import SelectLevel from './SelectLevel'
  import IndexConfig from './IndexConfig'
  import { getEvalCommonStatus, getEvalSysDefault } from '../../../api/enum.api'
  import {
    getSubjectTypeTree, getRatingModelList,
    deleteRatingModel, setStatus,
    setSysDefault, updateRatingModel,
    cloneRatingModel
  } from '../../../api/credit-rating/rating-model.api'

  export default {
    name: 'RatingModel',
    mixins: [commonMixin, permission],
    components: {
      Edit,
      Detail,
      SelectLevel,
      IndexConfig
    },
    data () {
      return {
        moduleName: '评级模型',
        ratingModelId: null,
        open: false, // 等级组件弹框
        editData: null, // 待编辑数据
        listQuery: {
          modelName: '',
          personClass: [],
          modelStatus: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'modelName', align: 'center' },
          { title: '编码', key: 'modelCode', align: 'center' },
          { title: '主体类别', slot: 'personClass', align: 'center' },
          { title: '等级标准', slot: 'ratingId', align: 'center' },
          { title: '模型指标', slot: 'modelIndex', align: 'center' },
          { title: '默认方案', slot: 'sysDefault', align: 'center' },
          { title: '状态', slot: 'modelStatus', align: 'center' },
          // { title: '描述', key: 'modelDesc', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', width: 160, align: 'center' }
        ]
      }
    },
    computed: {
      subjectType () {
        return this.$store.state.ratingModel.subjectType
      },
      personClassEnum () {
        return this.$store.state.ratingModel.personClassEnum
      },
      statusEnum () { // 状态枚举
        return this.$store.state.ratingModel.statusEnum
      },
      defaultEnum () { // 缺省模型枚举
        return this.$store.state.ratingModel.defaultEnum
      }
    },
    created () {
      this.getEnum()
      this.searchList()
    },
    methods: {
      // 重置查询
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          ratingName: ''
        }
        this.searchList()
      },
      // 创建回调
      handleCreate () {
        this.openEditPage('create')
      },
      // 查看详情
      handleCheck (id) {
        this.ratingModelId = id
        this.openEditPage('check')
      },
      // 修改
      handleModify (row) {
        this.editData = row
        this.openEditPage('modify')
      },
      // 设置等级标准回调
      handleSetLevel (row) {
        this.editData = row
        this.open = true
      },
      // 等级标准组件关闭回调
      handleLevelClose () {
        this.open = false
        this.editData = null
      },
      // 指标配置按钮回调
      handleIndexConfig (row) {
        this.editData = row
        this.dialogStatus = 'indexConfig'
      },
      // 指标配置组件关闭回调
      handleIndexConfigClose () {
        this.editData = null
        this.handleCancel()
      },
      // 克隆的回调
      async handleClone (id) {
        try {
          await cloneRatingModel(id)
          this.$message({ type: 'success', content: '操作成功' })
          this.searchList()
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作错误', desc: error })
        }
      },
      // 删除的回调
      async handleRemove (id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前评级模型？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              await deleteRatingModel(id)
              this.$message({ type: 'success', content: '操作成功' })
              this.searchList()
            } catch (error) {
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },
      // 编辑组件关闭
      handleClose () {
        this.editData = null
        this.handleCancel()
      },
      // 编辑组件成功
      handleEditSuccess () {
        this.searchList()
        this.handleClose()
      },
      // 状态开关的回调
      async handleSwitchChange (status, id) {
        try {
          const [success, errorMessage] = await setStatus(id)
          if (success) {
            this.$message({
              type: 'success',
              content: '操作成功'
            })
          } else {
            this.$notice.danger({
            title: '操作失败',
            desc: errorMessage
          })
          }
        } catch (error) {
          this.$notice.danger({
            title: '操作失败',
            desc: error
          })
          console.log(error)
        }
      },
      // 设为默认的回调
      async handleSetDefault (id) {
        try {
          const [success, errorMessage] = await setSysDefault(id)
          if (success) {
            this.searchList()
            this.$message({
              type: 'success',
              content: '操作成功'
            })
          } else {
            this.$notice.danger({
              title: '操作失败',
              desc: errorMessage
            })
          }
        } catch (error) {
          this.$notice.danger({
            title: '操作失败',
            desc: error
          })
          console.log(error)
        }
      },
      // 等级标准选择的回调
      async handleLevelSelected ({ id, ratingName }) {
        const params = {
          id: this.editData.id,
          ratingId: id
        }
        try {
          const [success, errorMessage] = await updateRatingModel(params)
          if (success) {
            this.searchList()
            this.$message({
              type: 'success',
              content: '操作成功'
            })
            this.searchList()
          } else {
            this.$notice.danger({
              title: '操作失败',
              desc: errorMessage
            })
          }
        } catch (error) {
          this.$notice.danger({
              title: '操作失败',
              desc: error
            })
        }
      },
      async getEnum() {
        // 主体类别树信息 code=A
        try {
          const [tree, statusEnum, defaultEnum] = await Promise.all([
            getSubjectTypeTree(), getEvalCommonStatus(), getEvalSysDefault()
          ])
          // 构建主体类别级联框使用数据，并存入vuex
          this.$store.dispatch('buildSubjectType', [tree])
          // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次，用于table显示取值
          let personClasses = []
          let mapper = (node, parentCode) => {
            personClasses.push({ key: node.code, value: node.text })
            let parents = parentCode ? parentCode.split(',') : []
            parents.push(node.code)
            let child = []
            if (node.children) {
              node.children.forEach(item => {
                child.push(mapper(item, parents.join(',')))
              })
            }
            return {
              value: node.code,
              label: node.text,
              choose: parents, // 配合级联展开时使用
              children: child
            }
          }
          // 转换级联菜单格式
          let data = tree ? mapper(tree) : {}
          // 转换类型映射值（扁平化）
          const map = {}
          personClasses.forEach(item => {
            map[item.key] = item.value
          })
          mapper = null // 清除闭包
          this.$store.commit('SET_PERSON_CLASS_ENUM', map) // 设置主体类别枚举
          this.$store.commit('SET_STATUS_ENUM', statusEnum) // 设置状态枚举
          this.$store.commit('SET_DEFAULT_ENUM', defaultEnum) // 设置缺省模型枚举
        } catch (error) {
          console.error(error)
        }
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getRatingModelList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      }
    }
  }
</script>
