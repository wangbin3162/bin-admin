<template>
  <page-header-wrap>
    <v-table-wrap>
      <b-alert>json编辑器现已独立发布为bin-code-editor插件
        <template slot="desc">
          具体请查看<a href="https://wangbin3162.gitee.io/bin-code-editor" target="_blank">示例文档</a>来获取更多插件使用方法
        </template>
      </b-alert>

      <b-tabs v-model="activeTab" :data="tabs"></b-tabs>
      <div v-if="activeTab==='tab1'" style="padding-top: 16px;height: 500px;">
        <b-row>
          <b-col span="12">
            <b-ace-editor v-model="jsonStr"
                          lang="json"
                          width="100%"
                          height="400"
                          :theme="theme"
                          :readonly="readonly"
                          :font-size="fontSize"></b-ace-editor>
          </b-col>
          <b-col span="12">
            <div class="pl-15">
              <v-title-bar label="设置" class="mb-15"></v-title-bar>
              <div class="pl-15">
                <p>
                  文字大小：
                  <b-input-number v-model="fontSize" :min="12" :max="16" size="small"/>
                  只读：
                  <b-switch v-model="readonly"/>
                </p>
                <p>皮肤：
                  <b-radio-group v-model="theme">
                    <div>
                      <b-radio v-for="item in themeList" :key="item" :label="item"></b-radio>
                    </div>
                  </b-radio-group>
                </p>
                <div style="padding: 8px 0;">
                  <b-button type="primary" @click="modal = true">弹窗编辑</b-button>
                  <b-button type="primary" @click="handleZip">压缩</b-button>
                  <b-button type="primary" @click="handleFormat">格式化</b-button>
                  <b-modal v-model="modal" title="弹窗编辑">
                    <b-ace-editor v-model="jsonStr" height="400"></b-ace-editor>
                  </b-modal>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
      <div v-if="activeTab==='tab2'" style="padding-top: 16px;height: 500px;">
        <b-row :gutter="20">
          <b-col span="8">
            <b-tag type="primary">javascript</b-tag>
            <b-ace-editor v-model="javascriptStr" height="400" lang="javascript"></b-ace-editor>
          </b-col>
          <b-col span="8">
            <b-tag type="success">markdown</b-tag>
            <b-ace-editor v-model="markdownStr" height="400" lang="markdown"></b-ace-editor>
          </b-col>
          <b-col span="8">
            <b-tag type="warning">sql</b-tag>
            <b-ace-editor v-model="sqlStr" height="400" lang="sql"></b-ace-editor>
          </b-col>
        </b-row>
        <br/>
        <b-row :gutter="20">
          <b-col span="8">
            <b-tag type="primary">java</b-tag>
            <b-ace-editor v-model="javaStr" height="400" lang="java"></b-ace-editor>
          </b-col>
          <b-col span="8">
            <b-tag type="success">elixir</b-tag>
            <b-ace-editor v-model="elixirStr" height="400" lang="elixir"></b-ace-editor>
          </b-col>
          <b-col span="8">
            <b-tag type="warning">html</b-tag>
            <b-ace-editor v-model="htmlStr" height="400" lang="html"></b-ace-editor>
          </b-col>
        </b-row>
        <br/>
        <b-row :gutter="20">
          <b-col span="8">
            <b-tag type="primary">css</b-tag>
            <b-ace-editor v-model="cssStr" height="400" lang="css"></b-ace-editor>
          </b-col>
          <b-col span="8">
            <b-tag type="success">stylus</b-tag>
            <b-ace-editor v-model="stylusStr" height="400" lang="stylus"></b-ace-editor>
          </b-col>
          <b-col span="8">
            <b-tag type="warning">更多</b-tag>
            <div>
              <b-ace-editor value="更多语言请查看依赖`brace/mode/`中支持更多内容。。。" height="400" lang="text"/>
            </div>
          </b-col>
        </b-row>
      </div>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
  import testData from './testData.json'
  import {
    javascriptStr,
    javaStr,
    elixirStr,
    markdownStr,
    sqlStr,
    htmlStr,
    cssStr,
    stylusStr
  } from './testStr'

  export default {
    name: 'EditorDemo',
    data() {
      return {
        tabs: [
          { key: 'tab1', title: '基础用法' },
          { key: 'tab2', title: '不同类型' }
        ],
        activeTab: 'tab1',
        modal: false,
        jsonStr: JSON.stringify(testData, null, 2),
        readonly: false,
        theme: 'chrome',
        fontSize: 12,
        themeList: [
          'chrome',
          'xcode',
          'clouds',
          'crimson_editor',
          'sqlserver',
          'github',
          'textmate',
          'tomorrow',
          'solarized_light',
          'kuroir',
          'cobalt',
          'dracula',
          'monokai',
          'solarized_dark',
          'terminal',
          'vibrant_ink'
        ],
        javascriptStr: javascriptStr,
        markdownStr: markdownStr,
        sqlStr: sqlStr,
        javaStr: javaStr,
        elixirStr: elixirStr,
        htmlStr: htmlStr,
        cssStr: cssStr,
        stylusStr: stylusStr
      }
    },
    methods: {
      handleZip() {
        this.jsonStr = JSON.stringify(JSON.parse(this.jsonStr), null, 0)
      },
      handleFormat() {
        this.jsonStr = JSON.stringify(JSON.parse(this.jsonStr), null, 2)
      }
    }
  }
</script>
