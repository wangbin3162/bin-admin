<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <b-form ref="form" :model="form" :rules="rules" :label-width="100">
          <b-row>
            <b-col span="12">
              <b-form-item label="模型名称" prop="modelName">
                <b-input v-model="form.modelName" placeholder="请输入模型名称"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="模型编码" prop="modelCode">
                <b-input v-model="form.modelCode" placeholder="请输入模型编码"></b-input>
              </b-form-item>
            </b-col>
          </b-row>

          <b-row>
            <b-col span="12">
              <b-form-item label="主体类别" prop="personClass">
                <b-cascader v-model="personClass"
                  :data="subjectType"
                  change-on-select></b-cascader>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="等级标准" prop="ratingId">
                <div flex>
                  <b-input :value="ratingName" placeholder="请选择"></b-input>
                  <b-button type="primary" plain>选择</b-button>
                </div>
              </b-form-item>
            </b-col>
          </b-row>

          <b-row>
            <b-col span="12">
              <b-form-item label="缺省模型" prop="sysDefault">
                <b-switch v-model="form.sysDefault" true-value="1" false-value="0"></b-switch>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="启用" prop="status">
                <b-switch v-model="form.status" true-value="Y" false-value="D"></b-switch>
              </b-form-item>
            </b-col>
          </b-row>

          <b-row>
            <b-col span="24">
              <b-form-item label="描述" prop="modelDesc">
                <b-input type="textarea" v-model="form.modelDesc" placeholder="请输入描述"></b-input>
              </b-form-item>
            </b-col>
          </b-row>
        </b-form>

         <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  export default {
    name: 'RatingModelEdit',
    props: [
      'title'
    ],
    components: {},
    data () {
      return {
        btnLoading: false,
        ratingName: '',
        personClass: [],
        form: {
          modelName: '',
          modelCode: '',
          modelDesc: '',
          personClass: '',
          ratingId: '',
          sysDefault: '0', // 缺省模型 '0' 否 '1' 是
          status: 'D' // D 禁用 Y 启用
        },
        rules: {
          modelName: [
            { required: true, message: '请不要为空', trigger: 'blur' }
          ],
          modelCode: [
            { required: true, message: '请不要为空', trigger: 'blur' }
          ],
          personClass: [
            { required: true, message: '请不要为空', trigger: 'change' }
          ],
          ratingId: [
            { required: true, message: '请不要为空', trigger: 'blur' }
          ],
          sysDefault: [
            { required: true, message: '请不要为空', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请不要为空', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      subjectType () {
        return this.$store.state.ratingModel.subjectType
      }
    },
    created () {

    },
    methods: {
      // 提交表单
     async handleSubmit () {
       try {
         const valid = await this.$refs.form.validate()
       } catch (error) {
         console.log(error)
       }
      }
    }
  }
</script>
