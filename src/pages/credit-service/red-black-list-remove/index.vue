<template>
  <div class="red-black-list-remove">
    <page-header-wrap v-show="isNormal">
      <v-table-wrap style="position: relative;">
        <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
        <!-- tree -->
        <b-tree slot="tree" :data="treeData" @on-select-change="handleSelectChange"></b-tree>

        <div v-if="isEmpty">
          <b-empty>
            <span>暂无数据</span>
            <span class="btn" v-if="treeData.length" @click="handleConfigBtn">
              请点这里进行配置
            </span>
          </b-empty>
        </div>

        <div v-else>
          <!-- 查询条件 -->
          <v-filter-bar @keyup-enter="handleFilter">
            <v-filter-item title="主体名称">
              <b-input v-model="listQuery.name" placeholder="请输入主体名称"></b-input>
            </v-filter-item>
            <!-- <v-filter-item title="采集部门">
              <b-input v-model="listQuery.name" placeholder="请输入采集部门"></b-input>
            </v-filter-item> -->
            <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
          </v-filter-bar>

          <v-table-tool-bar>
            <batch-remove-btn :resourceKey="listQuery.resourceKey" @success="searchList">
              批量解除
            </batch-remove-btn>
            <b-button :disabled="btnDisabled" @click="handleDownloadTemplate">模板下载</b-button>

            <b-dropdown slot="right" trigger="custom" :visible="visible" @on-click-outside="visible = false">
              <a href="javascript:void(0)" @click="visible = true">
                字段选择
                <b-icon name="ios-arrow-down"></b-icon>
              </a>
              <b-dropdown-menu slot="list" class="ml-10" style="max-height: 500px; overflow: auto;">
                  <b-checkbox-group v-model="showColumns">
                    <b-dropdown-item v-for="item in curColumns" :key="item.id">
                      <b-checkbox :label="item.fieldName" style="display: block;">
                        <span>{{ item.fieldTitle}}</span>
                      </b-checkbox>
                    </b-dropdown-item>
                  </b-checkbox-group>
              </b-dropdown-menu>
            </b-dropdown>
          </v-table-tool-bar>

          <!-- table -->
          <b-table :columns="columns" :data="list" :loading="listLoading">
          </b-table>

          <!-- 分页器 -->
          <b-page :total="total" show-sizer :current.sync="listQuery.page"
            @on-change="handleCurrentChange"
            @on-page-size-change="handleSizeChange"></b-page>
        </div>
      </v-table-wrap>
    </page-header-wrap>

  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { oneOf } from 'bin-ui/src/utils/util'
  import Util from '../../../common/utils/util'
  import { Decode, MaskCode } from '../../../common/utils/secret'
  import {
    getLeftTreeNode, getResourceInfo,
    getResourceList, downloadTemplate
  } from '../../../api/credit-service/red-blcak-list-remove.api'
  import BatchRemoveBtn from '../components/BatchRemoveBtn'

  export default {
    name: 'RedBlackListRemove',
    mixins: [commonMixin, permission],
    components: {
      BatchRemoveBtn
    },
    data () {
      return {
        visible: false,
        btnDisabled: false,
        loading: false,
        isEmpty: true,
        treeData: [],
        curNode: null, // 当前选中节点
        listQuery: {
          name: '',
          resourceKey: ''
        },
        tableName: '',
        resourceName: '',
        curColumns: [], // 当前resourceKey对应的列
        showColumns: [] // 展示的列
      }
    },
    computed: {
      // 当前资源是否是法人
      isLeg() {
        return this.tableName.includes('leg_')
      },
      columns () {
        const res = []
        this.curColumns.forEach(item => {
          if (this.showColumns.includes(item.fieldName)) {
            res.push({
              title: item.fieldTitle, key: item.fieldName.toLowerCase(), tooltip: true
            })
          }
        })
        return res
      }
    },
    async created () {
      await this.getLeftTreeNode()
      if (this.curNode.resourceKey) {
        this.buildTable(this.curNode.resourceKey)
      }
    },
    methods: {
      // 树节点点击的回调
      handleSelectChange (nodes, node) {
        if (this.curNode.resourceKey === node.resourceKey) {
          node.selected = true
        } else {
          // 如果点击的顶层节点为空则 this.isEmpty = true
          if (node.root && !(node.children && node.children.length)) {
            this.isEmpty = true
          } else {
            this.isEmpty = false
          }
          // 不是根节点则发起请求构建table
          if (!node.root) {
            this.buildTable(node.resourceKey)
          }
        }
        this.curNode = node
      },
      resetQuery () {
        this.listQuery.name = ''
        this.listQuery.size = 10
        this.listQuery.page = 1
        this.searchList()
      },
      // 去配置按钮回调
      handleConfigBtn () {
        window.open('#/sys/setting/dict')
      },
      // 模板下载按钮回调
      async handleDownloadTemplate() {
        try {
          this.btnDisabled = true
          const res = await downloadTemplate(this.listQuery.resourceKey)
          Util.downloadFile(res, `${this.resourceName}.xlsx`)
        } catch (error) {
          console.error(error)
        }
        this.btnDisabled = false
      },
      async searchList () {
        this.listLoading = true

        let keyValues = null
        let ops = null
        if (this.listQuery.name) {
          keyValues = this.isLeg ? { comp_name: this.listQuery.name } : { name: this.listQuery.name }
          ops = this.isLeg ? { comp_name: 'LIKE' } : { name: 'LIKE' }
        }

        try {
          const res = await getResourceList(this.listQuery, keyValues, ops)
          this.setListData({
            list: this.decodeAndMaskFormat(res.rows, true),
            total: res.total
          })
        } catch (error) {
          this.$notice.danger({ title: '请求失败', desc: error })
          console.error(error)
        }
        this.listLoading = false
      },
      // 获取左侧树组件需要的数据并构建
      async getLeftTreeNode () {
        this.loading = true
        try {
          const res = await getLeftTreeNode()
          res.redList = []
          res.blackList = []
          this.treeData = this.buildTree(res)
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },
      // 构建table列
      async buildTableColumn (resourceKey) {
        try {
          const res = await getResourceInfo(resourceKey)
          this.tableName = res.tableName
          this.resourceName = res.resourceName
          // 过滤掉person_id && 选择启用的
          const columns = res.items.filter(item => item.fieldName.indexOf('_id') === -1 && item.status === 'use')
          const showColumns = []
          for (let i = 0; i < columns.length; i++) {
            if (i < 7) {
              showColumns.push(columns[i].fieldName)
            } else {
              break
            }
          }
          this.curColumns = columns
          this.showColumns = showColumns
        } catch (error) {
          console.error(error)
        }
      },
      // 构建table
      async buildTable (resourceKey) {
        try {
          this.listQuery.resourceKey = resourceKey
          await this.buildTableColumn(resourceKey)
          await this.searchList()
        } catch (error) {
          console.error(error)
        }
      },
      // 解码并掩码
      decodeAndMaskFormat(arr, mask = false) {
        let newArr = []
        arr.forEach(item => {
          let tmp = { ...item }
          this.curColumns.forEach(field => {
            if (field.isEncrypt === '1') { // 解密
              tmp[field.fieldName] = Decode(item[field.fieldName])
            }
            if (mask && oneOf(field.maskModel, ['ID_CODE', 'MOBILE_PHONE'])) { // 掩码
              tmp[field.fieldName] = MaskCode(tmp[field.fieldName], field.maskModel)
            }
          })
          newArr.push(tmp)
        })
        return newArr
      },
      // 构建左侧树组件数据结构
      buildTree (data) {
        data.redList.forEach((item, index) => {
          item.title = item.resourceName
          if (index === 0) {
            item.selected = true // 默认选中第一项
            this.curNode = item // 选中后设置当前节点
            this.isEmpty = false // 表示不为空
          }
        })
        data.blackList.forEach((item, index) => {
          item.title = item.resourceName
          if (!data.redList.length && index === 0) {
            item.selected = true // redList不存在的话默认选中blackList第一项
            this.curNode = item // 选中后设置当前节点
            this.isEmpty = false // 表示不为空
          }
        })

        const nodes = [
          {
            resourceKey: null,
            root: true,
            title: '红名单',
            expand: true,
            selected: !data.redList.length && !data.blackList.length, // redList、blackList都为空的话默认选中
            children: data.redList
          },
          {
            resourceKey: null,
            root: true,
            title: '黑名单',
            expand: true,
            children: data.blackList
          }
        ]
        // 顶层节点都为空的话则选中后设置当前节点
        if (!data.redList.length && !data.blackList.length) {
          this.curNode = nodes[0]
          this.isEmpty = true
        }

        return nodes
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .red-black-list-remove {
   .btn {
     color: #0d85ff;
     cursor: pointer;
   }
 }
</style>
