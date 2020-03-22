<template>
  <page-header-wrap>
    <v-table-wrap>
      <b-alert>json编辑器现已独立发布为bin-code-editor插件
        <a href="https://wangbin3162.gitee.io/bin-code-editor" target="_blank">文档地址</a>,
        具体参考对应插件使用方法
      </b-alert>
      <b-row>
        <b-col span="12">
          <b-code-editor v-model="jsonStr" :theme="theme"
                         :show-number="showNumber" :readonly="readonly" :lint="lint"/>
        </b-col>
        <b-col span="12">
          <div class="pl-15">
            <v-title-bar label="基本设置" class="mb-15"></v-title-bar>
            <div class="pl-15">
              <p>
                行号：<b-switch v-model="showNumber"/>
                只读：<b-switch v-model="readonly"/>
                检查：<b-switch v-model="lint"/>
              </p>
              <p>皮肤：
                <b-radio-group v-model="theme">
                  <b-radio label="idea"><span>idea</span></b-radio>
                  <b-radio label="eclipse"><span>eclipse</span></b-radio>
                  <b-radio label="rubyblue"><span>rubyblue</span></b-radio>
                  <b-radio label="duotone-light"><span>duotone-light</span></b-radio>
                  <b-radio label="monokai"><span>monokai</span></b-radio>
                  <b-radio label="elegant"><span>elegant</span></b-radio>
                  <b-radio label="mdn-like"><span>mdn-like</span></b-radio>
                  <b-radio label="xq-light"><span>xq-light</span></b-radio>
                  <b-radio label="neo"><span>neo</span></b-radio>
                  <b-radio label="dracula"><span>dracula</span></b-radio>
                  <b-radio label="material"><span>material</span></b-radio>
                  <b-radio label="material-ocean"><span>material-ocean</span></b-radio>
                  <b-radio label="material-darker"><span>material-darker</span></b-radio>
                </b-radio-group>
              </p>
            </div>
          </div>
        </b-col>
      </b-row>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
  const jsonData = `{"title":"测试json数据","children":[{"name":"子项名称", "desc":"子项说明" },{"name":"子项名称1", "desc":"子项说明1" }]}`

  export default {
    name: 'JsonEditorDemo',
    data() {
      return {
        jsonStr: jsonData,
        showNumber: true,
        lint: true,
        readonly: false,
        theme: 'idea'
      }
    }
  }
</script>
