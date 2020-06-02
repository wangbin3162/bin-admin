<template>
  <div>
    <b-modal v-model="showDialog" title="重新算分"
      width="600"
      @on-visible-change="handleVisibleChange"
      @on-hidden="handleOnHidden">

      <div>
        <b-form ref="form" :model="form" :rules="rules" :label-width="100">

          <b-form-item label="主体名称" prop="personId">
            <div flex>
              <b-input :value="name" disabled placeholder="请选择主体"></b-input>
              <b-button type="primary" plain style="flex: 0 0 auto;"
                @click="handleSelectBtn">
                选择
              </b-button>
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

           <b-form-item label="报告类型" prop="configId">
            <b-select v-model="form.configId">
              <b-option v-for="item in creditReportList" :key="item.id"
                :value="item.id">
                {{ item.reportName }}
              </b-option>
            </b-select>
          </b-form-item>

          <b-form-item label="是否掩码" prop="maskCode">
            <b-radio-group v-model="form.maskCode">
              <b-radio label="true">是</b-radio>
              <b-radio label="false">否</b-radio>
            </b-radio-group>
          </b-form-item>

        </b-form>
      </div>

      <template slot="footer">
        <b-button @click="$emit('close')">取消</b-button>
        <b-button type="primary" :loading="loadingBtn"
          @click="handleSubmit">
          生成报告
        </b-button>
      </template>
    </b-modal>

    <leg-person-modal ref="legModal" @choose-one="handleChooseOne"></leg-person-modal>
    <nat-person-modal ref="natModal" @choose-one="handleChooseOne"></nat-person-modal>
  </div>
</template>

<script>
  import LegPersonModal from '../../../../components/Validator/FormControl/LegPersonModal'
  import NatPersonModal from '../../../../components/Validator/FormControl/NatPersonModal'
  import { getCreditReportList } from '../../../../api/credit-rating/credit-report-config.api'
  import { reCount, exportPDF } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'ReCount',
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
      LegPersonModal,
      NatPersonModal
    },
    data () {
      return {
        loadingBtn: false,
        name: '', // 回显的主体名称
        creditReportList: [],
        form: {
          personId: '',
          modelId: '',
          configId: '',
          maskCode: 'true'
        },
        rules: {
          personId: [
            { required: true, message: '请选择主体名称', trigger: 'change' }
          ],
          modelId: [
            { required: true, message: '请选择方案名称', trigger: 'change' }
          ],
          configId: [
            { required: true, message: '请选择报告类型', trigger: 'change' }
          ],
          maskCode: [
            { required: true, message: '请选择是否掩码', trigger: 'change' }
          ]
        },
        src: null
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
    created () {

    },
    methods: {
      handleVisibleChange(visible) {
        if (visible) {
          this.init()
        }
      },
      handleOnHidden () { // 弹框关闭动画结束后清理数据
        this.name = ''
        this.$refs.form.resetFields()
      },
      // 选择按钮回调
      handleSelectBtn () {
        if (this.isNat) { // 自然人
          this.$refs.natModal.open()
        } else if (this.isLeg) { // 法人
          this.$refs.legModal.open()
        } else {
          this.$notice.danger({ title: '传入了预期外的主体类型。', desc: '传入了预期外的主题类型: ' + this.personClass })
        }
      },
      // 主体选择组件回调
      handleChooseOne (val) {
        if (this.isNat) {
          this.name = val.name
        }
        if (this.isLeg) {
          this.name = val.compName
        }
        this.form.personId = val.id
      },
      // 确定按钮回调
      async handleSubmit () {
        const valid = await this.$refs.form.validate()

        if (valid) {
          try {
            this.loadingBtn = true
            const res = await reCount(this.form)

            const model = this.modelList.find(item => item.id === this.form.modelId)
            const res2 = await exportPDF({
              personId: this.form.personId,
              configId: this.form.configId,
              maskCode: JSON.parse(this.form.maskCode),
              modelName: model.name
            })

            // console.log(res2)
            // this.src = URL.createObjectURL(res2)

            this.showDialog = false
            this.$emit('recount-success')
          } catch (error) {
            this.$notice.danger({ title: '操作失败', desc: error })
          }
          this.loadingBtn = false
        }
      },
      // 获取配置报告用于select
      async getCreditReportList () {
        try {
          const res = await getCreditReportList({ size: 1000, page: 1 })
          this.creditReportList = res.rows
        } catch (error) {
          console.error(error)
        }
      },
      init () {
        this.getCreditReportList()
        const defaultModel = this.modelList.find(item => item.sysDefault === '1')
        this.form.modelId = defaultModel.id
      }
    }
  }
</script>
