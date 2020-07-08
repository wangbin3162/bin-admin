<template>
  <div class="news-mgmt">
    <page-header-wrap>
      <v-table-wrap @keyup-enter="handleFilter">
        <div slot="tree">
          <div flex="main:justify cross:center">
            <h3>栏目信息</h3>

            <div class="section-btn">
              <template v-for="btn in [
                  { icon: 'ios-create', type: 'u', tip: '编辑', size: '22px'},
                  { icon: 'ios-trash', type: 'd', tip: '删除', size: '22px'},
                  { icon: 'ios-add', type: 'c', tip: '添加', size: '24px'}
                ]">
                <b-tooltip :content="btn.tip" placement="top-start" :key="btn.icon">
                  <b-button type="text" :icon="btn.icon"
                    text-color="info" :icon-style="{fontSize: btn.size}"
                    @click="openEditSectionHandler(btn.type)">
                  </b-button>
                </b-tooltip>
              </template>
            </div>
          </div>

          <b-tree :data="treeData"></b-tree>
        </div>

        <v-filter-bar>
          <v-filter-item title="新闻标题" :span="8">
            <b-input placeholder="请输入"></b-input>
          </v-filter-item>

          <v-filter-item title="内容类型" :span="8">
            <b-select>
            </b-select>
          </v-filter-item>

          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery" :span="8"
            :show-toggle="true" :is-opened="filterOpened"
            @on-toggle="filterOpened=!filterOpened">
          </v-filter-item>

          <collapse-transition>
            <div v-show="filterOpened" style="width: 100%;">
              <v-filter-item title="内容状态" :span="8">
                <b-select>
                </b-select>
              </v-filter-item>

              <v-filter-item title="发布时间" :span="8">
                <b-date-picker type="daterange" placement="bottom-start"
                  placeholder="请选择发布时间">
                </b-date-picker>
              </v-filter-item>
            </div>
          </collapse-transition>
        </v-filter-bar>

        <b-table :columns="columns" :data="list">
          <template v-slot:action>
            <b-button type="text">
              编辑
            </b-button>

            <b-button type="text" text-color="danger">
              删除
            </b-button>
          </template>
        </b-table>

        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange">
        </b-page>

      </v-table-wrap>
    </page-header-wrap>

    <edit-section v-model="openEditSection"></edit-section>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import EditSection from './EditSection'

  export default {
    name: 'NewsMgmt',
    mixins: [commonMixin, permission],
    components: {
      EditSection
    },
    data () {
      return {
        treeData: [],
        listQuery: {
          page: 1
        },
        columns: [
          { type: 'index', width: 50 },
          { title: '新闻标题', key: '' },
          { title: '内容类型', key: '' },
          { title: '发布时间', key: '' },
          { title: '缩略图', key: '' },
          { title: '置顶', key: '' },
          { title: '状态', key: '' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        list: [],
        curRow: null,
        // 以下为组件状态
        openEditSection: false // 用于EditSection组件打开关闭。
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 重置分页查询参数listQuery
       */
      resetQuery () {

      },

      /**
       * @author haodongdong
       * @description 栏目信息操作按钮的回调函数，根据传递的参数，或删除或打开编辑弹框。
       * @param {string} type 操作类型，u 编辑 d 删除 c 创建。
       */
      openEditSectionHandler (type) {
        this.openEditSection = true
      },

      /**
       * @author haodongdong
       * @description 根据子节点查父节点
       */
      findParent (tree, code) {
        let pCode = null
        let recFun = (tree, code) => {
          for (const item of tree) {
            if (item.code === code) { // 找到相等节点则退出循环和递归
              return true
            } else { // 没找到则看是否有子节点
              if (item.children && item.children.length) { // 有则然后继续递归查找
                const res = recFun(item.children, code)
                if (res) { // 如果子节点中包含所要查找的code，则保存当前节点，然后返回false退出递归
                  pCode = item.code
                  return false
                }
              }
            }
          }
          return false
        }
        recFun(tree, code)
        recFun = null
        return pCode
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .news-mgmt {

  }
</style>
