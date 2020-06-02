<template>
  <div>
    <b-modal v-model="showDialog" title="批量计算"
      width="600"
      @on-visible-change="handleVisibleChange"
      @on-hidden="handleOnHidden">

      <div>
        <b-form ref="form" :model="form" :label-width="100">

          <b-form-item label="选择文件" prop="uploadFile">
            <b-upload action="/" type="drag" :before-upload="handleUpload">
              <b-button type="primary" icon="ios-cloud-upload" plain size="small">
                选择文件
              </b-button>
            </b-upload>

            <div v-if="form.uploadFile !== null" class="mt-10"
              flex="main:justify">
              <span>
                <b-icon name="ios-document"></b-icon>
                {{ form.uploadFile.name }}
              </span>

              <span>
                <b-icon name="ios-close-circle-outline" style="cursor: pointer;"
                  @click.native="form.uploadFile = null">
                </b-icon>
              </span>
            </div>
          </b-form-item>

          <b-form-item label="方案名称" prop="modelId">
            <b-select v-model="form.modelId">
              <b-option v-for="item in modelList" :key="item.id"
                :value="item.id">
                {{ item.name }}
              </b-option>
            </b-select>
          </b-form-item>

        </b-form>
      </div>

      <template slot="footer">
        <b-button @click="$emit('close')">取消</b-button>
        <b-button type="primary" :loading="loadingBtn"
          @click="handleSubmit">
          批量计算
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import { templateCount } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'TempCount',
    props: {
      open: {
        type: Boolean
      },
      personClass: { // 主体类别
        type: String,
        required: true
      }
    },
    components: {
    },
    data () {
      return {
        loadingBtn: false,
        form: {
          personClass: this.personClass,
          modelId: '',
          uploadFile: null
        }
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.open
        },
        set(val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
          this.$emit('close')
        }
      },
      modelList () {
        return this.$store.state.modelCount.modelList
      },
      isNat () { // 自然人
        return this.personClass === 'A01'
      },
      isLeg () { // 法人
        return this.personClass === 'A02'
      }
    },
    methods: {
      handleVisibleChange(visible) {
        if (visible) {
          this.init()
        }
      },
      handleOnHidden () { // 弹框关闭动画结束后清理数据
        this.$refs.form.resetFields()
      },
      // 上传组件回调
      handleUpload (file) {
        this.form.uploadFile = file

        const suffixName = file.name.split('.').pop().toLocaleLowerCase()
        if (suffixName !== 'xlsx') {
          this.$message({ type: 'danger', content: '请选择后缀为xlsx的文件！' })
          this.form.uploadFile = null
        }

        return false
      },
      // 确定按钮回调
      async handleSubmit () {
        if (this.form.uploadFile !== null) {
          try {
            this.loadingBtn = true
            const res = await templateCount(this.form)
            this.$emit('tempcount-success')
            this.$message({ type: 'success', content: '操作成功。' })
            this.showDialog = false
          } catch (error) {
            this.$notice.danger({ title: '操作失败', desc: error })
          }
          this.loadingBtn = false
        } else {
          this.$message({ type: 'warning', content: '请先选择文件。' })
        }
      },
      init () {
        const defaultModel = this.modelList.find(item => item.sysDefault === '1')
        this.form.modelId = defaultModel.id
      }
    }
  }
</script>
