<template>
  <div class="select-response">
    <b-modal v-model="open"
      title="选择响应"
      width="1050"
      :body-styles="{ padding: 0 }"
      footer-hide
      @on-visible-change="visibleChangeHandler">

      <div>
        <v-table-wrap>
          <div slot="tree">
            <b-tree :data="treeData" @on-select-change="handTreeCurrentChange"/>
          </div>
          <!--中央表格-->
          <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
            <template v-slot:respKind="{row}">
              <b-tag type="success" v-if="row.respKind==='RECORD'" size="mini">{{ respTypeMap[row.respKind] }}</b-tag>
              <b-tag type="primary" v-else size="mini">{{ respTypeMap[row.respKind] }}</b-tag>
            </template>
            <template v-slot:dataType="{row}">{{ dataTypeMap[row.dataType] }}</template>
            <!--操作栏-->
            <template v-slot:action="{row}">
              <b-button type="text" @click.stop="handleSelectBtn(row)">
                选择
              </b-button>
            </template>
          </b-table>
          <!--下方分页器-->
          <b-page :total="total" :current.sync="listQuery.page" size="small"
            @on-change="handleCurrentChange"
            @on-page-size-change="handleSizeChange">
          </b-page>
        </v-table-wrap>
      </div>

    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import * as api from '../../../../api/analyze-engine/da-business-temp.api.js'
  import { queryLeftRespInfos } from '../../../../api/data-analyze/da-content.api'

  export default {
    name: 'SelectResponse',
    mixins: [commonMixin, permission],
    props: {
      value: {
        type: Boolean,
        required: true
      },
      contentId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        open: this.value,
        listQuery: {
          bizId: ''
        },
        resp: null,
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '键名', key: 'keyName' },
          { title: '别名', key: 'keyAlias' },
          { title: '键路径', key: 'keyPath' },
          { title: '标题', key: 'title' },
          { title: '响应类型', slot: 'respKind', align: 'center', width: 90 },
          { title: '数据类型', slot: 'dataType', align: 'center', width: 90 },
          { title: '说明', key: 'memo' },
          { title: '操作', slot: 'action', width: 130 }
        ],
        respTypeMap: { QUERY: '查询', METRIC: '度量', BUCKET: '分组', RECORD: '记录' },
        dataTypeMap: {
          string: '字符',
          long: '整数',
          double: '小数',
          date: '日期',
          datetime: '日期时间',
          boolean: '布尔',
          map: 'map集合'
        }
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    created () {
      this.resetResp(null, null)
      this.getEnum()
    },
    methods: {
      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      visibleChangeHandler (visible) {
        if (visible) {
          this.init(this.contentId)
        } else {
          this.treeData = []
          this.list = []
          this.currentTreeNode = null
        }
      },

      init (bizId) {
        this.listQuery.bizId = bizId
        this.queryLeftRespInfos(bizId)
      },

      /**
       * @author haodongdong
       * @description b-tree组件当前节点改变事件回调
       * @param {Array} data 选中的节点数组
       * @param {Object} node 当前节点
       */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node // 此处需要放在this.handleFilter() 上面，因为searchList内会取currentTreeNode.id
        if (!node.root && node.id !== null) {
          this.handleFilter()
        } else {
          this.list = []
        }
      },

      // 重置响应对象
      resetResp(parentId, apiId) {
        this.resp = {
          bizId: this.listQuery.bizId,
          apiId, // 重构时添加
          parentId,
          keyName: '',
          keyAlias: '',
          keyPath: '',
          respKind: '',
          dataType: '',
          memo: '',
          orderNo: 1,
          title: ''
        }
      },

      // 获取enum
      getEnum() {
        api.getRespTypeEnum().then(res => {
          if (res.data.code === 0) {
            this.respTypeMap = res.data.data
          }
        })
        api.getDataTypeEnum().then(res => {
          if (res.data.code === 0) {
            this.dataTypeMap = res.data.data
          }
        })
      },

      // 查询所有列表
      searchList() {
        if (!this.currentTreeNode) {
          return
        }
        this.setListData()
        api.getRespList(this.currentTreeNode.id, this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },

      /**
       * @author haodongdong
       * @description 重构 构建树，由于业务需求，此处树只有两层，所以做简单的二重循环处理。
       * @param {Array} tree 待处理的树结构数据
       * @returns {Array}
       */
      buildTree (tree) {
        tree.forEach((item, index) => {
          item.selected = false
          item.expand = true
          item.root = true

          if (item.children && item.children.length) {
            item.children.forEach((subItem, subIndex) => {
              subItem.obj = { ...subItem } // 需要提交的数据结构放入obj字段
              if (index === 0 && subIndex === 0) { // 如果是第一个根节点的第一个子节点则设置默认选中
                subItem.selected = true
                this.currentTreeNode = subItem
                this.handleFilter()
              } else {
                subItem.selected = false
              }
              subItem.expand = false
              subItem.title = subItem.id === null ? `(请编辑) ${subItem.keyName}` : subItem.keyName
            })
          }
        })
        return tree
      },

      // 重构 获取左侧树
      async queryLeftRespInfos (id) {
        try {
          const res = await queryLeftRespInfos(id)
          this.treeData = this.buildTree(res)
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 选择按钮回调
       * @param {Object} row 当前行数据
       */
      handleSelectBtn (row) {
        this.$emit('selected', row)
        this.open = false
      }
    }
  }
</script>
