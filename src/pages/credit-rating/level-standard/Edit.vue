<template>
  <div class="level-standard-edit">
    <b-modal v-model="showDialog" :title="title" width="500"
      @on-ok="submitHandler" @on-hidden="closeHandler">
      <div class="form-con">
        <b-form :model="form" ref="form" :rules="rules"
          label-position="top" :label-width="100">
          <b-form-item label="名称" prop="ratingName">
            <b-input v-model="form.ratingName" placeholder="请输入名称" clearable></b-input>
          </b-form-item>
          <b-form-item label="编码" prop="ratingCode">
            <b-input v-model="form.ratingCode" placeholder="请输入编码" clearable></b-input>
          </b-form-item>
          <b-form-item label="描述" prop="ratingDesc">
            <b-input v-model="form.ratingDesc" placeholder="请输入描述" type="textarea"></b-input>
          </b-form-item>
        </b-form>
      </div>

      <div slot="footer">
        <b-button @click="showDialog = false ">取 消</b-button>
        <b-button type="primary" @click="submitHandler" :loading="btnLoading">提 交</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'levelStandardEdit',
    props: {
      title: {
        type: String
      },
      openEdit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        form: {
          ratingName: '',
          ratingCode: '',
          ratingDesc: '',
          items: []
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
    computed: {
      showDialog: {
        get () {
          return this.openEdit
        },
        set () {
          // 通过setter捕获模态框组件的v-model设置，然后发送关闭事件。
          this.$emit('close')
        }
      }
    },
    created () {

    },
    methods: {
      submitHandler () {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.showDialog = true
          } else {

          }
        })
      },
      closeHandler () {
        this.$refs.form.resetFields()
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
