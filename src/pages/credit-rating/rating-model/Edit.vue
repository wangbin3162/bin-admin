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
                  change-on-select
                  @on-change="handleSubjectChange"></b-cascader>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="等级标准" prop="ratingId">
                <div flex>
                  <b-input :value="ratingName" placeholder="请选择" disabled></b-input>
                  <b-button type="primary" plain @click="open = true">选择</b-button>
                </div>
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

    <select-level :open="open"
      @close="open = false" @selected="handleLevelSelected"></select-level>
  </div>
</template>

<script>
  import SelectLevel from './SeleceLevel'
  import { createRatingModel } from '../../../api/credit-rating/rating-model.api'

  export default {
    name: 'RatingModelEdit',
    props: [
      'title'
    ],
    components: {
      SelectLevel
    },
    data () {
      return {
        open: false, // 打开选择等级标准弹框
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
      // 主题类别回调
      handleSubjectChange (value) {
        this.form.personClass = value[value.length - 1]
      },
      // 等级标准选择的回调
      handleLevelSelected ({ id, ratingName }) {
        this.form.ratingId = id
        this.ratingName = ratingName
      },
      // 提交表单
     async handleSubmit () {
       try {
         const valid = await this.$refs.form.validate()
         if (valid) {
           try {
             this.btnLoading = true
             const [success, errorMessage] = await createRatingModel(this.form)
             if (success) {
               this.$message({
                 type: 'success',
                 content: '操作成功'
               })
               this.$emit('success')
             } else {
               this.$notice.danger({
               title: '操作失败',
               desc: errorMessage
             })
             }
           } catch (error) {
             this.$notice.danger({
               title: '操作失败',
               desc: error
             })
             console.log(error)
           }
           this.btnLoading = false
         }
       } catch (error) {
         console.log(error)
       }
      }
    }
  }
</script>
