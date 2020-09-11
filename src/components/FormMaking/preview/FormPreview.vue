<template>
  <!--预览弹窗-->
  <b-modal v-model="previewModal" title="表单预览" fullscreen width="100%" stop-remove-scroll>
    <generate-form v-if="previewModal" :data="widgetForm" ref="generateForm"></generate-form>
    <b-modal v-model="modelDialog" title="数据结果" footer-hide stop-remove-scroll :body-styles="{padding:'16px'}">
      <div style="height: 350px;">
        <b-ace-editor :value="submitResult" readonly/>
      </div>
    </b-modal>
    <div slot="footer" style="text-align: center;">
      <b-button type="primary" @click="formSubmit">获取数据</b-button>
      <b-button @click="formReset">重 置</b-button>
      <b-button @click="previewModal=false">关 闭</b-button>
    </div>
  </b-modal>
</template>

<script>
import GenerateForm from '@/components/FormMaking/preview/GenerateForm'
import { deepCopy } from '@/common/utils/assist'

export default {
  name: 'FormPreview',
  components: { GenerateForm },
  data() {
    return {
      previewModal: false,
      modelDialog: false,
      widgetForm: {
        list: [],
        config: {
          name: '表单名称',
          labelWidth: 100,
          labelPosition: 'right',
          size: 'default'
        }
      },
      submitResult: ''
    }
  },
  methods: {
    open(formData) {
      this.previewModal = true
      this.widgetForm = deepCopy(formData)
    },
    formSubmit() {
      this.$refs.generateForm.getData().then(data => {
        this.modelDialog = true
        this.submitResult = JSON.stringify(data, null, 2)
        // Data verification succeeded
      }).catch(e => {
        // Data verification failed
      })
    },
    formReset() {
      this.$refs.generateForm.reset()
    }
  }
}
</script>
