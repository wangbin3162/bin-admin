<template>
  <page-header-wrap>
    <v-table-wrap>
      <b-row>
        <b-col span="12">
          <json-editor v-model="jsonStr"></json-editor>
        </b-col>
        <b-col span="12">
          <div class="pl-15">
            <v-title-bar label="json文本" class="mb-15"></v-title-bar>
            {{ jsonStr }}
          </div>
        </b-col>
      </b-row>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
  import JsonEditor from '../../../components/JsonEditor'

  const jsonData = `{"title":"测试json数据","children":[{"name":"子项名称", "desc":"子项说明" },{"name":"子项名称1", "desc":"子项说明1" }]}`

  export default {
    name: 'JsonEditorDemo',
    components: { JsonEditor },
    data() {
      return {
        jsonStr: JSON.parse(jsonData)
      }
    }
  }
</script>

<style scoped>

</style>
