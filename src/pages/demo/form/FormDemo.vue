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
            <b-button type="text">
              <b-icon name="ios-eye"/>&nbsp;预览
            </b-button>&nbsp;&nbsp;
            Debug：
            <b-switch v-model="debugJson" size="small"/>
          </div>
        </v-title-bar>
        <fields-cfg v-model="fields"/>
        <!--调试模式-->
        <div class="mt-15" v-show="debugJson">
          <b-code-editor :value="JSON.stringify(fields,null,2)" readonly/>
        </div>
      </v-table-wrap>
    </page-header-wrap>
    <b-modal v-model="jsonModal" title="导入Json" :z-index="50" width="750px" append-to-body
             @on-opened="$refs.editor.refresh()" @on-ok="importJson">
      <b-code-editor ref="editor" v-model="jsonStr"/>
    </b-modal>
  </div>
</template>

<script>
  import FieldsCfg from './components/FieldsCfg/FieldsCfg'
  import metadata from './metadata'
  import items from './items'
  import { ruleName } from './components/FieldsCfg/validator'

  export default {
    name: 'FormDemo',
    components: { FieldsCfg },
    data() {
      return {
        debugJson: true,
        jsonModal: false,
        jsonStr: '',
        fields: [] // 实际信息项
      }
    },
    methods: {
      getMetadata() {
        return metadata.map(item => {
          let rulesInit = {
            [ruleName.required]: {
              required: true,
              message: `${item.fieldTitle}必填`,
              trigger: item.dataType === 'number' ? 'blur' : 'change'
            }
          }
          return {
            fieldName: item.fieldName, // 元信息名称（英文）
            fieldTitle: item.fieldTitle, // 元信息标题
            dataType: item.dataType, // 数据类型
            controlType: item.dataType === 'number' ? 'NUMBER_TEXT' : 'TEXT', // 控件类型,默认文本框
            fieldDesc: '', // 提示信息
            validValue: '', // 有效值
            maskModel: '', // 掩码方式
            isEncrypt: '', // 是否加密
            tokenizer: '', // 是否分词
            openType: 'PUBLIC', // 信息项公开类型,默认社会公开
            required: 'Y', // 信息项类型，默认核心项
            status: 'use', // 启用状态，默认启用
            // eslint-disable-next-line no-template-curly-in-string
            checkRules: JSON.stringify(rulesInit) // 校验配置,校验配置默认配置一个必填项
          }
        })
      },
      openJsonModal() {
        this.jsonStr = JSON.stringify(this.getMetadata(), null, 2)
        this.jsonModal = true
      },
      importJson() {
        try {
          this.fields = JSON.parse(this.jsonStr)
        } catch (e) {
          this.$message({ type: 'danger', content: '输入格式不合法' })
        }
      },
      loadFields() {
        this.fields = items
      }
    }
  }
</script>
