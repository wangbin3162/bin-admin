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
              <b-option v-for="item in natureOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </b-option>
            </b-select>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="指标类型" prop="bizType">
            <!-- <b-input v-model="form.bizType" placeholder="请选择指标类型" disabled></b-input> -->
            <b-cascader :data="cascadeData" placeholder="请选择指标类型"
              change-on-select @on-change="handleCascadeChange"></b-cascader>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="数据类型" prop="dataType">
            <b-select v-model="form.dataType">
              <b-option v-for="item in dataTypeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </b-option>
            </b-select>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="计算类型" prop="calClass">
            <b-select v-model="form.calClass">
               <b-option v-for="item in calcTypeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </b-option>
            </b-select>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="变量" prop="varId">
            <div flex style="width:100%;">
              <b-input :value="form.varId" placeholder="请选择变量" class="choose-btn"
                readonly disabled></b-input>
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
              <b-option v-for="item in scaleOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </b-option>
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
        <b-input v-model="form.desc" placeholder="请输入描述" type="textarea" :maxlength="100"></b-input>
      </b-form-item>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: 'IndexManageEditBaseInfo',
    props: [
      'natureOptions',
      'dataTypeOptions',
      'calcTypeOptions',
      'scaleOptions',
      'treeData'
    ],
    components: {},
    data () {
      return {
        cascadeData: [], // 指标类型级联数据
        form: {
          indexName: '',
          indexCode: '',
          indexDesc: '',
          bizType: '', // 指标类型[类别编码[类别数据为树形结构]]
          indexKind: '', // 指标性质
          calClass: '', // 计算类型
          dataType: '', // 数据类型
          validParamName: '', // 有效期参数名
          validMonth: 1, // 有效期 单位：月
          scale: 'F', // 标度
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
            { required: true, message: '请选择指标类型', trigger: 'change' }
          ],
          indexKind: [
            { required: true, message: '请选择指标性质', trigger: 'change' }
          ],
          dataType: [
            { required: true, message: '请选择数据类型', trigger: 'change' }
          ],
          calClass: [
            { required: true, message: '请选择计算类型', trigger: 'change' }
          ],
          validParamName: [
            { required: true, message: '有效期字段不能为空', trigger: 'blur' }
          ],
          validMonth: [
            { type: 'integer', required: true, message: '必须为1-12的整数', trigger: 'blur' }
          ],
          scale: [
            { required: true, message: '请选择标度', trigger: 'change' }
          ],
          varId: [
            { required: true, message: '变量不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      form: {
        handler (newVal, oldVal) {
          // 数据有变化就发送新的数据给上级组件
          this.$emit('data-update', newVal)
        },
        deep: true
      }
    },
    created () {
      this.cascadeData = this.treeToCascade(this.treeData[0].children)
    },
    methods: {
      openSelectVarHandler () {

      },
      handleCascadeChange (val) {
       if (val.length > 0) {
         this.form.bizType = val[0]
       } else {
         this.form.bizType = ''
       }
      },
      // 把类目的树形数据转换为级联选择框可用的树形结构
      treeToCascade (tree) {
        const list = []
        for (const item of tree) {
          const obj = {
            label: item.title,
            value: item.id,
            children: []
          }
          if (item.children && item.children.length > 0) {
            obj.children = this.treeToCascade(item.children)
          }
          list.push(obj)
        }
        return list
      }
    }
  }
</script>

<style lang="stylus" scoped>
.edit-base-info {

}
</style>
