<template>
  <div class="dir-select">
    <b-modal v-model="open"
             title="选择记录"
             footer-hide
             :body-styles="{ padding: '5px' }"
             width="70%"
             @on-hidden="handleHidden">
      <div class="con">
        <div v-show="gatherVisible && isNormal">
          <v-table-wrap>
            <div flex="main:justify">
              <!--查询条件-->
              <v-filter-bar @keyup-enter="handleFilter">
                <v-filter-item title="名称">
                  <b-input v-model.trim="listQuery.name" placeholder="名称" clearable></b-input>
                </v-filter-item>
                <!--添加查询按钮位置-->
                <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"/>
              </v-filter-bar>
              <!--操作栏-->
              <b-dropdown trigger="custom" :visible="visible" placement="bottom-end" append-to-body>
                <b-button type="primary" @click="visible=!visible">
                  字段选择
                  <b-icon :name="visible?'ios-arrow-up':'ios-arrow-down'"></b-icon>
                </b-button>
                <b-dropdown-menu slot="list" v-click-out-side="clickOutSide"
                                 style="padding-left: 5px;width: auto;">
                  <b-checkbox-group v-model="showFields">
                    <b-checkbox v-for="col in columns" :key="col.id" :label="col.fieldName"
                                style="display: block;margin-right: 0;">
                      <span>{{col.fieldTitle}}</span>
                    </b-checkbox>
                  </b-checkbox-group>
                </b-dropdown-menu>
              </b-dropdown>
            </div>
            <!--中央表格-->
            <b-table :columns="dynamicColumns" :data="list" :loading="listLoading">
              <!--操作栏-->
              <template v-slot:action="scope">
                <b-button type="text" @click="handleCheck(scope.row)">查看</b-button>
                <b-button type="text" @click="handleSelectBtn(scope.row)">选择</b-button>
              </template>
            </b-table>
            <!--下方分页器-->
            <b-page :total="total" :current.sync="listQuery.page" size="small"
                    @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
          </v-table-wrap>
        </div>

        <!-- 详情 -->
        <div v-show="isCheck">
          <v-table-wrap v-if="gather" style="user-select: text;">
            <v-key-label v-for="(item,index) in columns" :key="index"
                         :label="item.fieldTitle"
                         :is-bottom="index===columns.length-1">
              <span v-if="item.controlType==='FILE_UPLOAD'">
                <file-upload :value="gather[item.fieldName]" :resource-key="resource.resourceKey" is-show/>
              </span>
              <span v-else>{{ gather[item.fieldName] }}</span>
            </v-key-label>
            <div class="mt-15" style="text-align: right">
              <b-button @click="handleCancel">返回</b-button>
            </div>
          </v-table-wrap>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import dynamicForm from '../../../common/mixins/dynamic-form'
  import { deepCopy } from '../../../common/utils/assist'
  import { initFormList } from '../../../components/Validator/FieldsCfg/cfg-util'
  import Util from '../../../common/utils/util'
  import FileUpload from '../../../components/Validator/FormControl/FileUpload'
  import * as api from '../../../api/data-manage/gather.api'

  export default {
    name: 'RecordSelect',
    mixins: [commonMixin, permission, dynamicForm],
    props: [
      'resourceKey'
    ],
    components: {
      FileUpload
    },
    data() {
      return {
        open: false, // 打开弹框
        gatherVisible: false,
        resource: {
          id: '',
          tableName: '', // 元信息表名字
          personClass: '', // 主体类别
          metadataCode: '', // 类目编码 => 这条属性只负责显示当前类目，和拼接资源代码使用，并不会保存
          metadataKey: '', // 资源标识符
          resourceName: '', // 资源名称
          resourceCode: '', // 资源代码
          resourceDesc: '', // 资源描述
          resourceKey: '',
          updatePeriod: '', // 更新周期
          expiryLimit: 0, // 有效期限
          resProperty: '', // 资源性质
          sharedType: '', // 共享属性
          shareCondition: '', // 共享条件
          shareMode: '', // 共享方式
          isOpen: '', // 开放属性
          openCondition: '', // 开放条件
          availableStatus: '',
          status: '',
          items: []
        },
        listQuery: {
          resourceKey: '',
          name: ''
        },
        visible: false, // 列筛选下拉弹窗
        showFields: [],
        columns: [], // 原始表头列数据
        batchDialog: false,
        uploadLoading: false,
        file: null,
        gather: null
      }
    },
    computed: {
      // 当前资源是否是法人
      isLeg() {
        return this.resource.tableName.includes('leg_')
      },
      // 动态列
      dynamicColumns() {
        let ret = []
        this.columns.forEach(item => {
          if (this.showFields.includes(item.fieldName)) {
            ret.push({ title: item.fieldTitle, key: item.fieldName.toLowerCase(), tooltip: true })
          }
        })
        // 最后拼接一个操作栏
        ret.push({ title: '操作', slot: 'action', width: 120, align: 'center' })
        return ret
      }
    },
    methods: {
      // 弹框关闭动画结束回调
      handleHidden() {

      },
      // 根据resourceKey获取资源信息，并打开弹框
      async openModal() {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await api.getResourceInfo(this.resourceKey)
            if (res.data.successful) {
              let detail = res.data.data
              let columns = detail.items.filter(i => i.id)
              this.initForm(detail, columns)
              this.open = true
              resolve()
            } else {
              reject(new Error(res.data.message))
            }
          } catch (error) {
            reject(error)
          }
        })
      },
      // ===========采集面板打开============ //
      initForm(res, columns) {
        this.resource = deepCopy(res)
        // 过滤 person_id 获取原始列数组
        this.columns = columns.filter(item => item.fieldName.indexOf('_id') === -1 && item.status === 'use')
        // 默认勾选显示前8列，如太多则需要额外查看
        this.columns.forEach((item, index) => index < 8 && this.showFields.push(item.fieldName))
        // 根据原始列扩展动态表单列表数据
        initFormList(this.columns).then(resp => {
          this.dynamicForm = resp
          this.initDynamicForm(resp) // 根据动态列扩展form，rules和
        })
        // 查询列表
        this.resetQuery()
        this.gatherVisible = true
      },
      // =========== 采集面板编辑关闭 =========== //
      handleCancel() {
        this.handleDynamicFormReset()
        this.dialogStatus = ''
      },
      // ===========操作栏-重置============ //
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          resourceKey: this.resource.resourceKey,
          name: ''
        }
        this.handleFilter()
      },
      // ===========操作栏-筛选关闭操作============ //
      clickOutSide() {
        if (this.visible) {
          this.visible = false
        }
      },
      // ===========列表-查看按钮事件============ //
      handleCheck(row) {
        // 根据id获取详情值
        api.show(row.id, this.resource.resourceKey).then(res => {
          if (res.data.code === '0') {
            this.gather = this.decodeFormObj(res.data.data)
            console.log(this.gather)
            this.openEditPage('check')
          }
        })
      },
      // 选择按钮回调
      handleSelectBtn(row) {
        this.$emit('selected', row)
        this.open = false // 关闭弹框
      },
      // ===========数据操作-查询动态采集列表============ //
      searchList() {
        this.setListData()
        let keyValues = null
        let ops = null
        // 查询数据时根据表名称动态传参name或comp_name
        if (this.listQuery.name.length > 0) {
          keyValues = this.isLeg ? { comp_name: this.listQuery.name } : { name: this.listQuery.name }
          ops = this.isLeg ? { comp_name: 'LIKE' } : { name: 'LIKE' }
        }
        api.getGatherList(this.listQuery, keyValues, ops).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: this.decodeAndMaskFormat(response.data.rows || [], true),
              total: response.data.total || 0
            })
          }
        })
      },
      // ===========数据操作-表单提交============ //
      handleSubmit() {
        if (!this.$refs.dynamicFormRef) return
        this.$refs.dynamicFormRef.validate((valid) => {
          if (valid) {
            let tmpForm = this.getEncodeFormObj()
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createGather : api.modifyGather
            fun(this.resource.resourceKey, tmpForm).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                // this.submitDone(false)
                this.btnLoading = false // 按钮状态清空
                this.$notice.danger({ title: '操作错误', desc: res.data.message, duration: 10 })
              }
            })
          } else {
            this.$message({ type: 'danger', content: '表单校验失败,请填写正确后提交!' })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .dir-select {
    .con {
      min-height: 300px;
      max-height: 500px;
      overflow: auto;
    }
  }
</style>
