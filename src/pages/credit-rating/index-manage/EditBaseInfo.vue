<template>
  <div class="edit-base-info">
    <b-form :model="form" ref="form" :rules="roles" :label-width="100">
      <b-row>
        <b-col span="12">
          <b-form-item label="名称" prop="indexName">
            <b-input v-model="form.indexName" placeholder="请输入名称" clearable></b-input>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="编码" prop="indexCode">
            <b-input v-model="form.indexCode" placeholder="请输入编码" clearable></b-input>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="指标性质" prop="indexKind">
            <b-select v-model="form.indexKind">
              <b-option :value="0">定量</b-option>
              <b-option :value="1">定性</b-option>
            </b-select>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="指标类型" prop="bizType">
            <b-input v-model="form.bizType" placeholder="请选择指标类型" disabled></b-input>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="数据类型" prop="">
            <b-select v-model="form.indexName">
              <b-option :value="0">数值类型</b-option>
              <b-option :value="1">字符串类型</b-option>
              <b-option :value="2">布尔类型</b-option>
            </b-select>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="计算类型" prop="calClass">
            <b-select v-model="form.calClass">
              <b-option :value="0">优先指标</b-option>
              <b-option :value="1">普通指标</b-option>
              <b-option :value="2">降级指标</b-option>
              <b-option :value="3">关联降级指标</b-option>
            </b-select>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="变量" prop="varId">
            <div flex style="width:100%;">
              <b-input :value="form.varId" readonly class="choose-btn"></b-input>
              <b-button slot="suffix" type="primary" plain
                @click="openSelectVarHandler" style="flex: 0 0 auto;">
                选择
              </b-button>
            </div>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="标度" prop="scale">
            <b-select v-model="form.scale">
              <b-option :value="0">5分</b-option>
              <b-option :value="1">10分</b-option>
            </b-select>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="有效期字段" prop="validParamName">
            <b-input v-model="form.validParamName" placeholder="请输入有效期字段" style="width: 100%;">
            </b-input>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="有效期" prop="validMonth">
            <b-input-number v-model="form.validMonth" :max="12" :min="1" placeholder="请输入有效期" style="width: 100%;">
            </b-input-number>
          </b-form-item>
        </b-col>
      </b-row>
      <b-form-item label="描述" prop="desc">
        <b-input v-model="form.indexName" placeholder="请输入描述" type="textarea" :maxlength="100"></b-input>
      </b-form-item>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: 'IndexManageEditBaseInfo',
    props: [],
    components: {},
    data () {
      return {
        selected: '',
        cache: '',
        form: {
          indexName: '',
          indexCode: '',
          indexDesc: '',
          bizType: '', // 类别编码[类别数据为树形结构]
          indexKind: '', // 指标性质
          calClass: '', // 计算类型
          validParamName: '', // 有效期参数名
          validMonth: 1, // 有效期 单位：月
          scale: '5', // 标度
          varId: '' // 引用变量id
        },
        roles: {
          indexName: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          indexCode: [
            { required: true, message: '编码不能为空', trigger: 'blur' }
          ],
          bizType: [
            { required: true, message: '指标类型不能为空', trigger: 'blur' }
          ],
          indexKind: [
            { required: true, message: '指标性质不能为空', trigger: 'blur' }
          ],
          calClass: [
            { required: true, message: '计算类型不能为空', trigger: 'blur' }
          ],
          validParamName: [
            { required: true, message: '请不要为空', trigger: 'blur' }
          ],
          validMonth: [
            { type: 'integer', required: true, message: '必须为1-12的整数', trigger: 'blur' }
          ],
          scale: [
            { required: true, message: '标度不能为空', trigger: 'blur' }
          ],
          varId: [
            { required: true, message: '变量不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {

    },
    methods: {
      openSelectVarHandler () {

      }
    }
  }
</script>

<style lang="stylus" scoped>
.edit-base-info {

}
</style>
