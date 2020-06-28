<template>
  <div>
    <page-header-wrap v-show="visible && isNormal" :title="resourceName+' / 扩展配置'"
                      show-close @on-close="handleClose">
      <v-table-wrap>
        <div v-if="visible" class="mb-15">
          <b-tabs v-model="activeTab" :data="[{ key: 'tab1', title: '信息验证' },{ key: 'tab2', title: '数据关联同步' }]"/>
        </div>
        <!--信息验证-->
        <div v-if="activeTab==='tab1'" style="padding: 10px;">
          <div class="ext-info">
            <div class="row" flex="box:mean">
              <div class="row-one">
                <div class="label first">是否重复验证</div>
                <div class="value">
                  <b-switch v-model="config.repeatedCheckCfg" true-value="1" false-value="0">
                    <span slot="open">是</span><span slot="close">否</span>
                  </b-switch>
                </div>
              </div>
              <div class="row-one">
                <div class="label">是否关联验证</div>
                <div class="value">
                  <b-switch v-model="config.relationBaseCfg" true-value="1" false-value="0">
                    <span slot="open">是</span><span slot="close">否</span>
                  </b-switch>
                </div>
              </div>
              <div class="row-one">
                <div class="label">是否增补基础信息</div>
                <div class="value">
                  <b-switch v-model="config.appendBaseCfg" true-value="1" false-value="0">
                    <span slot="open">是</span><span slot="close">否</span>
                  </b-switch>
                </div>
              </div>
              <div class="row-one">
                <div class="label">是否补码</div>
                <div class="value">
                  <b-switch v-model="config.replenishCodeCfg" true-value="1" false-value="0">
                    <span slot="open">是</span><span slot="close">否</span>
                  </b-switch>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="row-one repeat">
                <div class="label first">重复字段列表</div>
                <div class="value">
                  <div>
                    <b-checkbox-group v-model="checkItems" @on-change="itemsChange">
                      <span v-for="item in items" :key="item.id" class="field-item">
                        <b-checkbox :label="item.fieldName">
                          <span>{{ item.fieldTitle }}</span>
                        </b-checkbox>
                      </span>
                    </b-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="submit-footer">
            <b-button type="primary" @click="handleSaveInfo">保存信息验证</b-button>
          </div>
        </div>
        <!--信息验证-->
        <div v-if="activeTab==='tab2'">
          <v-table-tool-bar>
            <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
          </v-table-tool-bar>
          <b-table :columns="columns" :data="list" :loading="listLoading">
            <template #syncType="{row}">
              {{syncEnum.type[row.syncType]}}
            </template>
            <!--操作栏-->
            <template v-slot:action="{row}">
              <b-button type="text" @click="handleModify(row)">
                修改
              </b-button>
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(row)">删除</b-button>
            </template>
          </b-table>
        </div>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="resourceName+' / '+editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <b-form :model="sync" ref="form" :rules="syncRules" :label-width="85" class="p10">
            <b-row :gutter="20">
              <b-col span="12">
                <b-form-item label="目标资源" prop="targetName">
                  <res-choose v-model="sync.targetKey" :defaultName="sync.targetName" @on-change="targetChange"/>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="同步类型" prop="syncType">
                  <b-select v-model="sync.syncType">
                    <b-option v-for="(o,k) in syncEnum.type" :key="k" :value="k">{{ o }}</b-option>
                  </b-select>
                </b-form-item>
              </b-col>
            </b-row>
            <b-form-item label="备注" prop="remark">
              <b-input v-model="sync.remark" type="textarea" :rows="1" placeholder="请输入备注"/>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>
        <template v-if="sync.targetName.length>0">
          <sync-items v-model="sync.items"
                      :sync-type="sync.syncType"
                      :target-fields="targetFields"
                      :source-fields="items"
                      :val-type-options="syncEnum.valType"
                      :condition-options="syncEnum.condition"/>
        </template>
        <!--<div>
          <b-code-editor :value="JSON.stringify(sync,null,2)" readonly/>
        </div>-->
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../../common/utils/assist'
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import * as api from '../../../../../api/data-manage/res-info.api'
  import ResChoose from './ResChoose'
  import SyncItems from './SyncItems'

  export default {
    name: 'ResExtEdit',
    components: { SyncItems, ResChoose },
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '关联同步',
        visible: false,
        activeTab: 'tab1',
        config: {
          appendBaseCfg: '1', // 增补基础信息
          relationBaseCfg: '1', // 关联基础信息
          repeatedCheckCfg: '1', // 是否重复验证(1,0)
          repeatedLineCfg: '', // 重复记录验证配置(逗号分隔信息项串)，
          replenishCodeCfg: '' // 是否补码
        },
        resourceName: '',
        items: [],
        checkItems: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '目标资源信息', key: 'targetName' },
          { title: '同步方式', slot: 'syncType' },
          { title: '关联说明', key: 'remark' },
          { title: '操作', slot: 'action', width: 160 }
        ],
        syncEnum: {
          type: {},
          category: {},
          valType: {},
          condition: {}
        },
        syncRules: {
          targetName: [{ required: true, message: '目标资源必选', trigger: 'change' }],
          syncType: [{ required: true, message: '同步类型必选', trigger: 'change' }]
        },
        sync: null,
        targetFields: []
      }
    },
    created() {
      this.resetSync()
      api.queryExtSyncEnum().then(res => {
        this.syncEnum = res
      })
    },
    methods: {
      open(obj) {
        // 根据传入值格式化当前表格数据
        const params = deepCopy(obj)
        this.config = params.cfg
        this.resourceKey = params.resourceKey
        this.resourceName = params.resourceName
        api.getItemsWithId(this.resourceKey).then(res => {
          this.items = res.data || []
          this.checkItems = this.filterRepeatedItems(this.config.repeatedLineCfg, this.items)
        })
        this.targetFields = []
        // 查询数据关联同步列表
        this.searchList()
        this.visible = true
      },
      // 过滤重复字段列表，去除已删除的
      filterRepeatedItems(repeatedLineCfg, items) {
        let arr = []
        if (repeatedLineCfg) {
          let temp = repeatedLineCfg.split(',')
          temp.forEach(item => {
            let hasIndex = items.findIndex(i => i.fieldName === item)
            if (hasIndex > -1) {
              arr.push(item)
            }
          })
        }
        return arr
      },
      handleClose() {
        this.visible = false
        this.activeTab = 'tab1'
        this.$emit('on-close')
      },
      // 信息项改变事件
      itemsChange(checks) {
        this.config.repeatedLineCfg = checks.join(',')
      },
      // 保存信息验证
      handleSaveInfo() {
        api.saveExt(this.resourceKey, this.config).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '信息验证配置成功!' })
          } else {
            this.$notice.danger({ title: '操作错误', desc: res.data.message })
          }
        })
      },
      // 查询数据关联同步列表
      searchList() {
        this.setListData()
        api.queryExtSyncList(this.resourceKey).then(res => {
          if (res.status === 200) {
            this.setListData({
              list: res.data.rows,
              total: res.data.total
            })
          }
        })
      },
      // 数据关联同步新增
      handleCreate() {
        this.resetSync()
        this.openEditPage('create')
      },
      // 选择目标资源改变 resourceKey, resourceName, metadataKey, fields
      targetChange(item) {
        this.targetFields = item.fields
        this.sync.targetName = item.resourceName
        this.sync.items = []

        let hasMapList = this.sync.syncType === 'A' || this.sync.syncType === 'M'
        let hasConditionList = this.sync.syncType === 'M' || this.sync.syncType === 'D'
        // 默认增加一条
        if (hasMapList) {
          this.sync.items.push({
            targetField: '',
            sourceField: '',
            category: 'M',
            valType: 'S',
            paramName: '',
            paramValue: '',
            edit: true,
            newOne: true
          })
        }
        if (hasConditionList) {
          this.sync.items.push({
            targetField: '',
            sourceField: '',
            category: 'C',
            valType: 'S',
            paramName: '',
            paramValue: '',
            condition: '',
            edit: true,
            newOne: true
          })
        }
      },
      // 修改关联同步
      handleModify(row) {
        api.queryExtSyncDetail(row.id).then(res => {
          if (res.data.code === '0') {
            this.sync = res.data.data
            this.sync.items = this.sync.items.map(item => ({ ...item, newOne: false, edit: false }))
            if (this.sync.targetKey.length > 0) {
              api.getItemsWithId(this.sync.targetKey).then(res => {
                this.targetFields = res.data || []
              })
            }
            this.openEditPage('modify')
          }
        })
      },
      // 删除关联同步
      handleRemove(row) {
        this.$confirm({
          title: '确实要删除当前关联配置吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeSync(row.id).then(res => {
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
      // 保存关联同步
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 根据同步方式来判断过滤那种字段
            this.sync.items = this.sync.items.filter(item => {
              if (this.sync.syncType === 'A') {
                return item.category === 'M'
              } else if (this.sync.syncType === 'D') {
                return item.category === 'C'
              } else {
                return item
              }
            })
            // 先过滤，再判断是否有没保存的
            if (this.checkNewOne()) {
              this.$alert.warning({ title: '警告', content: '有未保存的关联同步项，请全部保存后提交' })
              return
            }
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createSync : api.modifySync
            fun(this.resourceKey, this.sync).then(res => {
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
      // 验证是否有未添加的
      checkNewOne() {
        return this.sync.items.reduce((total, current) => current.newOne || current.edit, false)
      },
      // 重置关联同步对象
      resetSync() {
        this.sync = {
          syncType: 'M', // 同步方式默认为更新
          targetKey: '',
          targetName: '',
          remark: '',
          items: []
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .ext-info {
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    .row {
      border-bottom: 1px solid #eee;
      border-left: 1px solid #eee;
      .row-one {
        display: flex;
        align-items: center;
        .label {
          flex: 0 0 200px;
          width: 200px;
          padding: 20px;
          border-left: 1px solid #eee;
          &.first {
            border-left: none;
          }
        }
        .value {
          flex: auto;
          padding: 20px;
          border-left: 1px solid #eee;
        }
      }
    }
  }
  .submit-footer {
    padding: 20px 20px 20px 200px;
  }
  .field-item {
    display: inline-block;
    width: 25%;
    padding: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }
</style>
