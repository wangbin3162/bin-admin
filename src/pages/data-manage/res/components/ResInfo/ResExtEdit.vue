<template>
  <div>
    <page-header-wrap v-show="visible && isNormal" :title="resourceName+' / 扩展配置'"
                      show-close @on-close="handleClose">
      <v-table-wrap>
        <div v-if="visible" class="mb-15">
          <b-tabs v-model="activeTab" :data="tabs" ref="tabs"></b-tabs>
        </div>
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
                <div class="label">是否增补基础信息</div>
                <div class="value">
                  <b-switch v-model="config.appendBaseCfg" true-value="1" false-value="0">
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
            </div>
            <div class="row">
              <div class="row-one repeat">
                <div class="label first">重复字段列表</div>
                <div class="value">
                  <div style="width: 600px;">
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
      </v-table-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../../common/utils/assist'
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import * as api from '../../../../../api/data-manage/res-info.api'

  export default {
    name: 'ResExtEdit',
    mixins: [commonMixin, permission],
    data() {
      return {
        tabs: [
          { key: 'tab1', title: '信息验证' },
          { key: 'tab2', title: '数据关联同步' }
        ],
        activeTab: 'tab1',
        config: {
          appendBaseCfg: '1', // 增补基础信息
          relationBaseCfg: '1', // 关联基础信息
          repeatedCheckCfg: '1', // 是否重复验证(1,0)
          repeatedLineCfg: '' // 重复记录验证配置(逗号分隔信息项串)
        },
        resourceName: '',
        items: [],
        checkItems: [],
        visible: false
      }
    },
    methods: {
      open(obj) {
        // 根据传入值格式化当前表格数据
        const params = deepCopy(obj)
        this.config = params.cfg
        this.resourceKey = params.resourceKey
        this.resourceName = params.resourceName
        this.items = params.items
        this.checkItems = this.config.repeatedLineCfg ? this.config.repeatedLineCfg.split(',') : []
        this.visible = true
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
    padding: 5px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }
</style>
