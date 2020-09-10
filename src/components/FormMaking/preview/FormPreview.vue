<template>
  <!--预览弹窗-->
  <b-modal v-model="previewModal" title="表单预览" fullscreen width="100%" stop-remove-scroll>
    <generate-form :data="widgetForm"></generate-form>
    <div slot="footer" style="text-align: center;">
      <b-button type="primary" @click="formSubmit">获取数据</b-button>
      <b-button @click="formReset">重 置</b-button>
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
      widgetForm: {
        list: [],
        config: {
          name: '表单名称',
          labelWidth: 100,
          labelPosition: 'right',
          size: 'default'
        }
      }
    }
  },
  methods: {
    open(formData) {
      this.previewModal = true
      this.widgetForm = deepCopy(formData)
    },
    formSubmit() {
    },
    formReset() {
    }
  }
}
</script>
