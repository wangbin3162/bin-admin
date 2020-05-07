<template>
  <div class="level-standard-edit">
    <b-modal v-model="showDialog" :title="title" width="500"
      @on-ok="submitHandler" @on-hidden="closeHandler">
      <div class="form-con">
        <b-form :model="form" ref="form" :rules="rules"
          label-position="top" :label-width="100">
          <b-form-item label="名称" prop="ratingName">
            <b-input v-model="form.ratingName" placeholder="请输入等级标准名称" clearable></b-input>
          </b-form-item>
          <b-form-item label="编码" prop="ratingCode">
            <b-input v-model="form.ratingCode" placeholder="请输入等级标准编码" clearable></b-input>
          </b-form-item>
          <b-form-item label="描述" prop="ratingDesc">
            <b-input v-model="form.ratingDesc" placeholder="请输入描述" type="textarea"></b-input>
          </b-form-item>
        </b-form>
      </div>

      <div slot="footer">
        <b-button @click="showDialog = false">取 消</b-button>
        <b-button type="primary" @click="submitHandler" :loading="btnLoading">提 交</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { createLevelStandard, updateLevelStandard } from '../../../api/credit-rating/level-standard.api'

  export default {
    name: 'LevelStandardEdit',
    props: {
      title: {
        type: String
      },
      openEdit: {
        type: Boolean,
        default: false
      },
      editData: { // 需要编辑的数据，null为新增
        type: Object,
        default: null
      }
    },
    data () {
      return {
        form: {
          ratingName: '',
          ratingCode: '',
          ratingDesc: '',
          items: null
        },
        rules: {
          ratingName: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          ratingCode: [
            { required: true, message: '编码不能为空', trigger: 'blur' }
          ],
          ratingDesc: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ]
        },
        btnLoading: false
      }
    },
    watch: {
      editData: {
        handler (newVal, oldVal) {
          this.init(newVal)
        },
        immediate: true
      }
    },
    computed: {
      showDialog: {
        get () {
          return this.openEdit
        },
        set (val) {
          // 通过setter hack 弹框的v-model
          this.$emit('close') // 发送关闭弹框的事件
        }
      }
    },
    created () {

    },
    methods: {
      init () {
        // editData为null表示新增反则表示编辑
        if (this.editData) {
          this.form = JSON.parse(JSON.stringify(this.editData))
        } else {
          this.form = {
            ratingName: '',
            ratingCode: '',
            ratingDesc: '',
            items: null
          }
        }
      },
      // 关闭弹框时还原form，并发送close事件
      closeHandler () {
        this.$refs.form.resetFields()
        this.$emit('closed') // 发送关闭弹框动画结束的事件
      },
      // 提交表单
      submitHandler () {
        this.$refs.form.validate().then(async valid => {
          if (valid) {
            this.btnLoading = true
            if (this.editData === null) { // 创建
              await this.createLevelStandard(this.form)
            } else { // 编辑
              await this.updateLevelStandard(this.form)
            }
            this.btnLoading = false
          }
        })
      },
      // 创建等级标准
      async createLevelStandard (params) {
        try {
          const [success, errorMsg] = await createLevelStandard(params)
          if (success) {
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success') // 发送成功事件
            this.showDialog = false // 关闭编辑框
          } else {
            this.$notice.danger({ title: '操作错误', desc: errorMsg })
          }
        } catch (error) {
          this.$notice.danger({ title: '操作错误', desc: error })
          console.log(error)
        }
      },
      // 编辑等级标准
      async updateLevelStandard (params) {
        try {
          const [success, errorMsg] = await updateLevelStandard(params)
          if (success) {
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success') // 发送成功事件
            this.showDialog = false // 关闭编辑框
          } else {
            this.$notice.danger({ title: '操作错误', desc: errorMsg })
          }
        } catch (error) {
          this.$notice.danger({ title: '操作错误', desc: error })
          console.log(error)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.level-standard-edit {
  .form-con {
    padding: 15px;
  }
}
</style>
