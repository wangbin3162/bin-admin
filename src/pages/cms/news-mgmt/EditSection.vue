<template>
  <div>
    <b-drawer v-model="open" :title="title" width="720" @on-visible-change="visibleChangeHandler"
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
            <b-input-number style="width: 100%" :min="0"
              v-model="form.colSort" placeholder="请输入序号">
            </b-input-number>
          </b-form-item>
          <b-form-item label="所属组织" prop="time">
            <b-input placeholder="所属组织" :value="departName" disabled></b-input>
          </b-form-item>
        </div>

        <b-form-item v-if="form.colType === 'LINK'" label="栏目地址" prop="colUrl">
          <b-input v-model="form.colUrl" placeholder="请输入栏目地址"></b-input>
        </b-form-item>

        <b-form-item label="关键字" prop="keywords">
          <b-input v-model="form.keywords" placeholder="向搜索引擎说明栏目的关键字，多个用英文逗号隔开"></b-input>
        </b-form-item>

        <b-form-item label="描述" prop="colDesc">
          <b-input v-model="form.colDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
            placeholder="向搜索引擎说明栏目的主要内容描述"></b-input>
        </b-form-item>

        <b-form-item label="备注" prop="brief">
          <b-input v-model="form.brief" type="textarea" :autosize="{minRows: 4,maxRows: 5}"
            placeholder="栏目备注"></b-input>
        </b-form-item>

        <div v-if="form.thumbnailPath !== null && form.thumbnailPath !== ''" flex="box:mean">
          <b-form-item label="高度" prop="thumbnailHeight" class="mr-15">
            <b-input-number style="width: 100%" :min="0"
              v-model="form.thumbnailHeight" placeholder="请输入缩略图高度">
            </b-input-number>
          </b-form-item>

          <b-form-item label="宽度" prop="thumbnailWidth">
            <b-input-number style="width: 100%" :min="0"
              v-model="form.thumbnailWidth" placeholder="请输入缩略图宽度">
            </b-input-number>
          </b-form-item>
        </div>

        <b-form-item label="缩略图片">
          <img-upload ref="imgUpload" funName="cms" moduleName="thumbnail"
            :echoId="form.thumbnailPath"
            @success="val => form.thumbnailPath = val"
            @clear="imgClearHandler"></img-upload>
        </b-form-item>
      </b-form>

      <div slot="footer">
        <b-button @click="open = false">取 消</b-button>
        <b-button type="primary" @click="submitHandler" :loading="btnLoading">提 交</b-button>
      </div>
    </b-drawer>
  </div>
</template>

<script>
  import { createSection, updateSection, removeSectionImg } from '../../../api/cms/cms.api'
  import ImgUpload from '../../credit-rating/credit-report-config/ImgUpload'

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
      parentNode: { // 父节点
        type: Object,
        default: null
      },
      editData: { // 待编辑数据 可用于区分是编辑还是新增
        type: Object,
        default: null
      }
    },
    components: { ImgUpload },
    data () {
      return {
        open: this.value,
        btnLoading: false,
        parentColName: '无',
        thumbnailPathCache: '', // 清空图片后缓存图片的thumbnailPath，用于提交时调用删除图片接口
        form: {
          parentCol: null,
          colName: '',
          colUrl: '',
          colType: '',
          colSort: null,
          colDesc: '',
          keywords: '',
          columnCode: '',
          brief: '', // 备注
          thumbnailPath: null,
          thumbnailHeight: null,
          thumbnailWidth: null
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
          ],
          colUrl: [
            { required: true, message: '栏目地址不能为空', trigger: 'blur' }
          ],
          thumbnailHeight: [
            { required: true, type: 'integer', message: '必须为整数', trigger: 'blur' }
          ],
          thumbnailWidth: [
            { required: true, type: 'integer', message: '必须为整数', trigger: 'blur' }
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
      },
      departName () {
        return this.$store.state.user.info.departName
      },
      title () {
        return this.optType === 'c' ? '新增栏目' : '编辑栏目'
      }
    },
    created () {

    },
    methods: {
      async submitHandler () {
        this.btnLoading = true
        try {
          const valid = await this.$refs.form.validate()

          if (this.thumbnailPathCache) await removeSectionImg(this.thumbnailPathCache)

          if (valid) {
            let res = null
            if (this.optType === 'c') {
              res = await createSection(this.form)
              this.$emit('add-success', res)
            }
            if (this.optType === 'u') {
              await updateSection(this.form)
              // 更新的时候需要返回form，因为form包含节点的相关状态，像是展开，子节点等。
              this.$emit('update-success', this.$util.deepClone(this.form))
            }
            this.open = false
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.btnLoading = false
      },

      /**
       * @author haodongdong
       * @description b-drawer组件显示状态改变时的回调
       * @param {boolean} visible 是否显示
       */
      visibleChangeHandler (visible) {
        if (visible) {
          this.init()
        } else {
          this.parentColName = '无'
          this.$refs.imgUpload.clearImg()
          this.$refs.form.resetFields()
        }
      },

      /**
       * @author haodongdong
       * @description imgUpload组件图片清空回调
       */
      imgClearHandler () {
        this.thumbnailPathCache = this.form.thumbnailPath
        this.form.thumbnailPath = ''
        this.form.thumbnailHeight = null
        this.form.thumbnailWidth = null
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
            if (this.parentNode) this.parentColName = this.parentNode.colName
            this.$nextTick(() => {
              this.$refs.imgUpload.init() // 回显存在的图片
            })
          }
        }
      }
    }
  }
</script>
