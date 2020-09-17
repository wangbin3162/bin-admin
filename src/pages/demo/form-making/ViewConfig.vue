<template>
  <page-header-wrap v-if="visible" show-close @on-close="close"
                    :title="`[${formMeta.formName}] 视图配置`">
    <div class="view-container">
      <div class="view-wrap">
        <v-title-bar label="视图预览" tip-pos="left"/>
        <v-table-wrap>
          <!--查询条件-->
          <v-filter-bar>
            <v-filter-item title="单据名称">
              <b-input placeholder="请输入"/>
            </v-filter-item>
            <!--添加查询按钮位置-->
            <v-filter-item/>
          </v-filter-bar>
          <!--操作栏-->
          <v-table-tool-bar>
            <b-button type="primary" icon="ios-add-circle-outline">新 增</b-button>
          </v-table-tool-bar>
          <b-table :columns="columns" :data="list" :loading="listLoading">
            <!--操作栏-->
            <template #action="{row}">
              <b-button type="text" @click="handleModify(row)">编辑</b-button>
              <!--是否有删除键-->
              <template>
                <b-divider type="vertical"></b-divider>
                <b-button type="text" text-color="danger" @click="handleRemove(row)">删除</b-button>
              </template>
              <template v-if="row.pubStatus===0">
                <b-divider type="vertical"></b-divider>
                <b-button type="text" text-color="success" @click="handlePublish(row)">发布</b-button>
              </template>
            </template>
          </b-table>
          <!--下方分页器-->
          <b-page :total="50"></b-page>
        </v-table-wrap>
      </div>
      <div class="view-config">
        <v-title-bar label="视图配置" tip-pos="left"/>
      </div>
    </div>
  </page-header-wrap>
</template>

<script>
import { deepCopy } from '@/common/utils/assist'

export default {
  name: 'ViewConfig',
  data() {
    return {
      visible: false,
      columns: [
        { title: '数据列一', key: 'col1' },
        { title: '数据列二', key: 'col2' },
        { title: '数据列三', key: 'col3' },
        { title: '数据列四', key: 'col4' },
        { title: '操作', slot: 'action', width: 160 }
      ],
      list: [
        { col1: '第一行', col2: '行列2', col3: '行列3', col4: '行列4' },
        { col1: '行列1', col2: '行列2', col3: '行列3', col4: '行列4' },
        { col1: '行列1', col2: '行列2', col3: '行列3', col4: '行列4' },
        { col1: '行列1', col2: '行列2', col3: '行列3', col4: '行列4' },
        { col1: '行列1', col2: '行列2', col3: '行列3', col4: '行列4' }
      ],
      formMeta: {
        id: '',
        formName: ''
      }
    }
  },
  methods: {
    open(formMeta) {
      this.visible = true
      this.formMeta = deepCopy(formMeta)
    },
    close() {
      this.visible = false
      this.list = []
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="stylus" scoped>
.view-container {
  display: flex;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 5px rgba(0, 0, 0, .1);
  min-height: 800px;
  .view-wrap {
    flex: 1;
    border-right: 1px solid #eeeeee;
  }
  .view-config {
    flex-shrink: 0;
    width: 350px;
  }
}
</style>
