<template>
  <div>
    <page-header-wrap>
      <v-table-wrap>
        <v-title-bar label="信息项配置" class="mb-20">
          <div>
            <b-button type="text" @click="openJsonModal">
              <b-icon name="ios-cloud-upload"/>&nbsp;导入json
            </b-button>
            <b-button type="text" @click="loadFields">
              <b-icon name="ios-cloud-download"/>&nbsp;导入默认
            </b-button>
            <b-button type="text" @click="fields = []">
              <b-icon name="ios-trash"/>&nbsp;清空
            </b-button>
            <b-button type="text" @click="previewForm">
              <b-icon name="ios-eye"/>&nbsp;预览
            </b-button>&nbsp;&nbsp;
            Debug：
            <b-switch v-model="debugJson" size="small"/>
          </div>
        </v-title-bar>
        <fields-cfg v-model="fields"/>
        <!--调试模式-->
        <div class="mt-15" v-show="debugJson">
          <b-tag type="success" size="small">实际存储对象[fields]</b-tag>
          <b-ace-editor :value="JSON.stringify(fields,null,2)" readonly wrap/>
        </div>
      </v-table-wrap>
    </page-header-wrap>
    <b-modal v-model="jsonModal" title="导入Json" :z-index="50" width="750px" @on-ok="importJson">
      <b-ace-editor v-model="jsonStr" wrap/>
    </b-modal>
    <b-modal v-model="previewModal" title="预览表单" width="1200px" :styles="{top: '20px'}"
             @on-hidden="previewModalForm=false">
      <b-form v-if="previewModalForm" :model="form" :rules="rules" ref="dynamicFormRef" label-position="top">
        <!--自定义form-item-->
        <form-item :key="item.id||index" v-for="(item,index) in dynamicForm"
                   :label="item.fieldTitle"
                   :prop="item.fieldName"
                   :control-type="item.controlType">
          <!--动态控件-->
          <form-control v-model="form[item.fieldName]"
                        resource-key="test-resource-key"
                        table-name="test-table-name"
                        :control-type="item.controlType"
                        :field-name="item.fieldName"
                        :field-desc="item.fieldDesc"
                        :field-title="item.fieldTitle"
                        :data-length="item.dataLength"
                        :data-precision="item.dataPrecision"
                        :options="item.validOptions"
                        @on-select="handleSelectNatLeg">
          </form-control>
        </form-item>
      </b-form>
      <div slot="footer">
        <b-button type="primary" @click="handleDynamicFormSubmit">提 交</b-button>
        <b-button @click="handleDynamicFormReset">重 置</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import FieldsCfg from '../../../components/Validator/FieldsCfg/FieldsCfg'
  import metadata from './metadata'
  import items from './items'
  import { initFormList } from '../../../components/Validator/FieldsCfg/cfg-util'
  import FormItem from '../../../components/Validator/FormControl/FormItem'
  import FormControl from '../../../components/Validator/FormControl/FormControl'
  import dynamicForm from '../../../common/mixins/dynamic-form'

  export default {
    name: 'FormDemo',
    mixins: [dynamicForm],
    components: { FormControl, FormItem, FieldsCfg },
    data() {
      return {
        resource: {
          tableName: 'test_table_name'
        },
        debugJson: true,
        jsonModal: false,
        previewModal: false,
        previewModalForm: false,
        jsonStr: '',
        fields: [] // 实际信息项
      }
    },
    methods: {
      // 获取元信息
      getMetadata() {
        return metadata.map(field => {
          return this.fieldsToInfoItem(field, 'directoryId')
        })
      },
      // 打开json导入窗口
      openJsonModal() {
        this.jsonStr = JSON.stringify(this.getMetadata(), null, 2)
        this.jsonModal = true
      },
      // 导入json数据
      importJson() {
        try {
          this.fields = JSON.parse(this.jsonStr)
        } catch (e) {
          this.$message({ type: 'danger', content: '输入格式不合法' })
        }
      },
      // 加载测试数据
      loadFields() {
        this.fields = items
      },
      // 预览form
      previewForm() {
        if (this.fields.length === 0) {
          this.$message({ type: 'danger', content: '没有配置信息项，请配置后预览' })
          return
        }
        // 过滤person_id
        let fields = this.fields.filter(item => item.fieldName.indexOf('_id') === -1 && item.status === 'use')
        // 根据原始列扩展动态表单列表数据
        initFormList(fields).then(res => {
          this.previewModal = true
          this.previewModalForm = true
          this.handleDynamicFormReset()
          this.dynamicForm = res
          this.initDynamicForm(res) // 根据动态列扩展form，rules和
        })
      }
    }
  }
</script>
