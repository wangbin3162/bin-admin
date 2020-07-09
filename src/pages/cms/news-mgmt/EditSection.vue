<template>
  <div>
    <b-drawer v-model="open" title="栏目" width="720" @on-visible-change="visibleChangeHandler"
      append-to-body :mask-closable="false">
      <b-form :model="form" :rules="rules" ref="form" label-position="top">
        <div flex="box:mean">
          <b-form-item label="栏目名称" prop="colName" class="mr-15">
            <b-input v-model="form.colName" placeholder="请输入栏目名称"></b-input>
          </b-form-item>
          <b-form-item label="父栏目" prop="parentCol">
            <b-input :value="parentColName" disabled></b-input>
          </b-form-item>
        </div>

        <div flex="box:mean">
          <b-form-item label="栏目编码" prop="columnCode" class="mr-15">
            <b-input v-model="form.columnCode" placeholder="请输入栏目编码"></b-input>
          </b-form-item>
          <b-form-item label="栏目类型" prop="colType">
            <b-select v-model="form.colType">
              <b-option v-for="(value, key) in colTypeEnmu" :key="key" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </b-form-item>
        </div>

        <div flex="box:mean">
          <b-form-item label="序号" prop="colSort" class="mr-15">
              <b-input v-model="form.colSort" placeholder="请输入序号"></b-input>
          </b-form-item>
          <b-form-item label="所属组织" prop="time">
              <b-input placeholder="所属组织" disabled></b-input>
          </b-form-item>
        </div>

        <b-form-item label="栏目地址" prop="colUrl">
          <b-input v-model="form.colUrl" placeholder="请输入栏目地址"></b-input>
        </b-form-item>

        <b-form-item label="关键字" prop="keywords">
          <b-input v-model="form.keywords" placeholder="向搜索引擎说明栏目的关键字，多个用英文逗号隔开"></b-input>
        </b-form-item>

        <b-form-item label="描述" prop="colDesc">
          <b-input v-model="form.colDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
            placeholder="向搜索引擎说明栏目的主要内容描述"></b-input>
        </b-form-item>

        <b-form-item label="备注" prop="desc">
          <b-input v-model="form.desc" type="textarea" :autosize="{minRows: 4,maxRows: 5}"
            placeholder="栏目备注"></b-input>
        </b-form-item>
      </b-form>

      <div slot="footer">
        <b-button @click="open = false">取 消</b-button>
        <b-button type="primary" @click="submitHandler">提 交</b-button>
      </div>
    </b-drawer>
  </div>
</template>

<script>
  import { createSection, updateSection } from '../../../api/cms/cms.api'

  /**
   * @typedef {import('../../../api/cms/cms.api').Section} Section
   */

  export default {
    name: 'EditSection',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      optType: {
        type: String,
        required: true
      },
      editData: { // 待编辑数据 可用于区分是编辑还是新增
        type: Object,
        default: null
      }
    },
    data () {
      return {
        open: this.value,
        parentColName: '无',
        form: {
          parentCol: null,
          colName: '',
          colUrl: '',
          colType: '',
          colSort: '',
          colDesc: '',
          keywords: '',
          columnCode: ''
        },
        rules: {
          colName: [
            { required: true, message: '栏目名不能为空', trigger: 'blur' }
          ],
          columnCode: [
            { required: true, message: '栏目编码不能为空', trigger: 'blur' }
          ],
          colType: [
            { required: true, message: '栏目类型不能为空', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    computed: {
      colTypeEnmu () {
        return this.$store.state.cms.colType
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description b-drawer组件显示状态改变时的回调
       * @param {boolean} visible 是否显示
       */
      visibleChangeHandler (visible) {
        if (visible) {
          this.init()
        } else {
          this.$refs.form.resetFields()
        }
      },

      async submitHandler () {
        try {
          const valid = await this.$refs.form.validate()
          if (valid) {
            const res = this.optType === 'c' ? await createSection(this.form) : await updateSection(this.form)
            this.$emit('success', res)
            this.open = false
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description 初始化函数，用于一系列初始操作，判断是否拥有父节点、是编辑还是创建。
       */
      init () {
        const editData = this.$util.deepClone(this.editData)
        if (editData) {
          if (this.optType === 'c') {
            this.form.parentCol = editData.id
            this.parentColName = editData.colName
          }
          if (this.optType === 'u') {
            this.form = editData
          }
        }
      }
    }
  }
</script>
