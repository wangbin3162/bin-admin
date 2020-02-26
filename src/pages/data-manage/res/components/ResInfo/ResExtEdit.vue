<template>
  <!--资源信息扩展弹窗 for ResInfo.vue -->
  <b-modal v-model="chooseDialog" title="扩展配置" :mask-closable="false">
    <div>
      <b-form :model="config" ref="form" :label-width="90" label-position="left">
        <b-row>
          <b-col span="8">
            <b-form-item label="是否重复验证" prop="name">
              <b-switch v-model="config.repeatedCheckCfg" true-value="1" false-value="0">
                <span slot="open">是</span><span slot="close">否</span>
              </b-switch>
            </b-form-item>
          </b-col>
          <b-col span="8">
            <b-form-item label="是否增补基础信息" prop="name" :label-width="110">
              <b-switch v-model="config.appendBaseCfg" true-value="1" false-value="0">
                <span slot="open">是</span><span slot="close">否</span>
              </b-switch>
            </b-form-item>
          </b-col>
          <b-col span="8">
            <b-form-item label="是否关联验证" prop="name">
              <b-switch v-model="config.relationBaseCfg" true-value="1" false-value="0">
                <span slot="open">是</span><span slot="close">否</span>
              </b-switch>
            </b-form-item>
          </b-col>
        </b-row>
        <b-form-item label="重复字段列表" prop="name">
          <b-checkbox-group v-model="checkItems" @on-change="itemsChange">
            <b-checkbox v-for="item in items" :key="item.id" :label="item.fieldName">
              <span>{{ item.fieldTitle }}</span>
            </b-checkbox>
          </b-checkbox-group>
        </b-form-item>
      </b-form>
    </div>
    <div slot="footer">
      <b-button type="primary" @click="handleSubmit">确 定</b-button>
      <b-button @click="chooseDialog = false">取 消</b-button>
    </div>
  </b-modal>
</template>

<script>
  import { deepCopy } from '../../../../../common/utils/assist'

  export default {
    name: 'ResExtEdit',
    data() {
      return {
        config: {
          appendBaseCfg: '1', // 增补基础信息
          relationBaseCfg: '1', // 关联基础信息
          repeatedCheckCfg: '1', // 是否重复验证(1,0)
          repeatedLineCfg: '' // 重复记录验证配置(逗号分隔信息项串)
        },
        items: [],
        checkItems: [],
        chooseDialog: false
      }
    },
    methods: {
      open(obj) {
        // 根据传入值格式化当前表格数据
        const params = deepCopy(obj)
        this.config = params.cfg
        this.resourceKey = params.resourceKey
        this.items = params.items
        this.checkItems = this.config.repeatedLineCfg ? this.config.repeatedLineCfg.split(',') : []
        this.chooseDialog = true
      },
      itemsChange(checks) {
        this.config.repeatedLineCfg = checks.join(',')
      },
      handleSubmit() {
        this.chooseDialog = false
        this.$emit('on-save', this.resourceKey, this.config)
      }
    }
  }
</script>
