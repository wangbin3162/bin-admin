<template>
  <!--映射关系，for SwitchingMission.vue -->
  <div>
    <v-title-bar label="映射关系" tip-pos="left" class="mb-20"></v-title-bar>
    <b-table disabled-hover :data="totalData" size="small" :columns="fieldsColumns">
      <template v-slot:fieldTitle="scope">
        <b-input v-model="totalData[scope.index].fieldTitle" size="mini" @on-change="emitValue"></b-input>
      </template>
      <template v-slot:fieldName="scope">
        <b-input v-model="totalData[scope.index].fieldName" size="mini" @on-change="emitValue"></b-input>
      </template>
      <template v-slot:colNo="scope">
        <b-input v-model="totalData[scope.index].colNo" size="mini" @on-change="emitValue"></b-input>
      </template>
      <template v-slot:isRequired="scope">
        <b-switch v-model="totalData[scope.index].isRequired"
                  true-value="Y" false-value="N" @on-change="emitValue"
                  :disabled="totalData[scope.index].required==='Y'">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </b-switch>
      </template>
      <template v-slot:status="scope">
        <b-switch v-model="totalData[scope.index].status" size="large" inactive-color="#ff4949"
                  true-value="use" false-value="ignore" @on-change="emitValue"
                  :disabled="totalData[scope.index].required==='Y'">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </b-switch>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    name: 'ItemMap',
    props: {
      value: {
        type: String,
        default: ''
      },
      tableWidth: {
        type: Number,
        default: 880
      }
    },
    data() {
      return {
        fieldsColumns: [
          { title: '字段标题', slot: 'fieldTitle' },
          { title: '字段名称', slot: 'fieldName' },
          { title: '列序号', slot: 'colNo', width: 120, align: 'center' },
          { title: '是否必填', slot: 'isRequired', width: 140, align: 'center' },
          { title: '有效值', key: 'validValue', width: 220, tooltip: true },
          { title: '选用状态', slot: 'status', width: 140, align: 'center' }
        ],
        totalData: []
      }
    },
    watch: {
      value: {
        handler(val) {
          this.totalData = JSON.parse(val)
        },
        immediate: true
      }
    },
    methods: {
      // 更新model value
      emitValue() {
        const str = JSON.stringify(this.totalData)
        this.$emit('input', str)
        this.$emit('on-change', str)
      }
    }
  }
</script>
