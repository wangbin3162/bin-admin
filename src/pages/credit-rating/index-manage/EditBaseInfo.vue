<template>
  <div>
    <b-form :model="form" ref="form" :rules="roles" :label-width="100">
      <b-row>
        <b-col span="12">
          <b-form-item label="名称" prop="">
            <b-input v-model="cache" placeholder="请输入名称" clearable></b-input>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="编码" prop="">
            <b-input v-model="cache" placeholder="请输入编码" clearable></b-input>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="指标性质" prop="">
            <b-select v-model="selected">
              <b-option :value="0">定量</b-option>
              <b-option :value="1">定性</b-option>
            </b-select>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="指标类型" prop="">
            <b-input v-model="cache" placeholder="指标类型" disabled></b-input>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="数据类型" prop="">
            <b-select>
              <b-option :value="0">数值类型</b-option>
              <b-option :value="1">字符串类型</b-option>
              <b-option :value="2">布尔类型</b-option>
            </b-select>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="计算类型" prop="">
            <b-select>
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
          <b-form-item label="变量">
            <div flex style="width:100%;">
              <b-input :value="cache" readonly class="choose-btn"></b-input>
              <b-button slot="suffix" type="primary" plain
                @click="openSelectVarHandler" style="flex: 0 0 auto;">
                选择
              </b-button>
            </div>
          </b-form-item>
        </b-col>
        <b-col span="12">
          <b-form-item label="标度">
            <b-select v-model="selected">
              <b-option :value="0">5分</b-option>
              <b-option :value="1">10分</b-option>
            </b-select>
          </b-form-item>
        </b-col>
      </b-row>
      <b-row>
        <b-col span="12">
          <b-form-item label="有效期">
            <b-input v-model="cache" placeholder="请输入有效期"></b-input>
          </b-form-item>
        </b-col>
        <b-col span="12"></b-col>
      </b-row>
      <b-form-item label="描述" prop="desc">
        <b-input placeholder="请输入描述" type="textarea" :maxlength="100"></b-input>
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
        form: {},
        roles: {}
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
