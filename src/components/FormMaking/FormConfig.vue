<template>
  <div class="form-config-container">
    <cfg-group group-name="表单属性">
      <cfg-field label="标签对齐">
        <btn-radio v-model="data.labelPosition"
                   :options="[
                      {value: 'left',label: '左对齐'},
                      {value: 'right',label: '右对齐'},
                      {value: 'top',label: '顶部对齐'}
                    ]"
                   size="small"></btn-radio>
      </cfg-field>
      <cfg-field label="标签宽度">
        <b-input-number v-model="data.labelWidth" :min="60" :max="200" :step="5" size="small"></b-input-number>
      </cfg-field>
      <cfg-field label="组件尺寸">
        <btn-radio v-model="data.size"
                   :options="[
                      {value: 'default',label: 'default'},
                      {value: 'small',label: 'small'},
                      {value: 'mini',label: 'mini'}
                    ]"
                   size="small"></btn-radio>
      </cfg-field>
    </cfg-group>
  </div>
</template>

<script>
import BtnRadio from './components/BtnRadio'
import CfgGroup from './components/CfgGroup'
import CfgField from './components/CfgField'

export default {
  name: 'FormConfig',
  components: { CfgField, CfgGroup, BtnRadio },
  props: ['data']
}
</script>
