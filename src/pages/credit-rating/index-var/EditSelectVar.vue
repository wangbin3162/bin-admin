<template>
  <div class="select-var">
    <b-modal v-model="showDialog" title="选择变量"
      width="900" @on-cancel="$emit('close')">
      <v-table-wrap class="con">
        <div class="table">
          <v-filter-bar>
            <v-filter-item title="名称" style="width: 35%">
              <b-input placeholder="请输入"></b-input>
            </v-filter-item>
            <v-filter-item title="编码" style="width: 35%">
              <b-input placeholder="请输入"></b-input>
            </v-filter-item>
            <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
          </v-filter-bar>

          <b-table :columns="columns" :data="list"
            height="300" :loading="listLoading">
            <template v-slot:name="scope">
              <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
            </template>
            <!-- 操作栏 -->
            <template v-slot:action="scope">
              <b-button type="text" @click="selected(scope.row)">
                选择
              </b-button>
            </template>
          </b-table>
          <!-- 分页器 -->
          <b-page :total="total" :current.sync="listQuery.page" size="small"
            @on-change="handleCurrentChange"
            @on-page-size-change="handleSizeChange"></b-page>
        </div>
      </v-table-wrap>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'

  export default {
    name: 'IndexVarEditSelectVar',
    props: ['open'],
    mixins: [commonMixin, permission],
    data () {
      return {
        list: [
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          },
          {
            name: '名称',
            desc: '描述',
            code: '编码',
            varType: '变量类型',
            dataType: '数据类型',
            tempType: '模板类型'
          }
        ],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'name' },
          { title: '描述', key: 'desc' },
          { title: '编码', key: 'code' },
          { title: '变量类型', key: 'varType' },
          { title: '数据类型', key: 'dataType' },
          { title: '模板类型', key: 'tempType' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    computed: {
      showDialog: {
        get () {
          return this.open
        },
        set (val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
        }
      }
    },
    created () {

    },
    methods: {
      handleFilter () {

      },
      resetQuery () {

      },
      handleCheck () {

      },
      selected () {

      }
    }
  }
</script>

<style lang="stylus">
  // 覆盖bin-ui弹框组件样式
  .select-var {
    .bin-modal-body {
      padding: 0!important;
    }
  }
</style>

<style lang="stylus" scoped>
.select-var {

}
</style>
