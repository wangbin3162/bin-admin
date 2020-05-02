<template>
  <div class="edit-belong-type">
    <b-modal v-model="showDialog" title="所属类型"
      width="900" @on-cancel="$emit('close')">
      <v-table-wrap class="con">
        <b-tree slot="tree" :data="treeData"></b-tree>

        <div class="table">
          <v-filter-bar>
            <v-filter-item title="模板名称" style="width: 35%">
              <b-input placeholder="请输入"></b-input>
            </v-filter-item>
            <v-filter-item title="模板编码" style="width: 35%">
              <b-input placeholder="请输入"></b-input>
            </v-filter-item>
            <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
          </v-filter-bar>

          <b-table :columns="columns" :data="list"
            height="300" :loading="listLoading">
            <template v-slot:tempName="scope">
              <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
            </template>
            <!-- 操作栏 -->
            <template v-slot:action="scope">
              <b-button type="text" @click="selected(scope.row)">
                选择
              </b-button>
            </template>
          </b-table>
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
    name: 'IndexVarEditBelongType',
    props: ['open'],
    mixins: [commonMixin, permission],
    data () {
      return {
        treeData: [
          {
            title: '业务分类',
            expand: true,
            children: [
              { title: '主题名称1' },
              { title: '主题名称2' },
              { title: '主题名称3' },
              { title: '主题名称4' }
            ]
          }
        ],
        list: [
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          }, {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          },
          {
            tempName: '名称',
            tempCode: 'code',
            tempDesc: '这里是说明的说'
          }
        ],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '模板名称', slot: 'tempName' },
          { title: '模板编码', key: 'tempCode' },
          { title: '模板说明', key: 'tempDesc' },
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
  .edit-belong-type {
    .bin-modal-body {
      padding: 0!important;
    }
  }
</style>

<style lang="stylus" scoped>
.edit-belong-type {

}
</style>
