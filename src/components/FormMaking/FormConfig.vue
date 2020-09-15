<template>
  <div class="form-config-container">
    <cfg-group group-name="表单属性">
      <cfg-field label="标签对齐">
        <b-radio-group v-model="data.labelPosition" size="small" type="button">
          <b-radio label="left">左对齐</b-radio>
          <b-radio label="right">右对齐</b-radio>
          <b-radio label="top">顶部对齐</b-radio>
        </b-radio-group>
      </cfg-field>
      <cfg-field label="标签宽度">
        <b-input-number v-model="data.labelWidth" :min="60" :max="200" :step="5" size="small"></b-input-number>
      </cfg-field>
      <cfg-field label="组件尺寸">
        <b-radio-group v-model="data.size" size="small" type="button">
          <b-radio label="large">大号</b-radio>
          <b-radio label="default">默认</b-radio>
          <b-radio label="small">小号</b-radio>
        </b-radio-group>
      </cfg-field>
    </cfg-group>
  </div>
</template>

<script>
import CfgGroup from './components/CfgGroup'
import CfgField from './components/CfgField'

export default {
  name: 'FormConfig',
  components: { CfgField, CfgGroup },
  props: ['data']
}
</script>
