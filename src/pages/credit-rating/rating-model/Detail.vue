<template>
  <div class="raring-model-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full" style="position: relative;">
          <b-loading fix show-text="loading" v-if="loading"></b-loading>
          <v-title-bar label="基本信息" class="mb-15"></v-title-bar>
          <b-row type="flex" justify="center">
            <b-col span="18">
              <div>
                <v-key-label label="模型名称" is-first is-half>{{ detailData.modelName }}</v-key-label>
                <v-key-label label="模型编码" is-half>{{ detailData.modelCode }}</v-key-label>
                <v-key-label label="主体类别" is-first is-half>{{ personClassEnum[detailData.personClass] }}</v-key-label>
                <v-key-label label="等级名称" is-half>{{ detailData.ratingName }}</v-key-label>
                <!-- <v-key-label label="启用/禁用" is-first is-half>
                  <b-tag :type="detailData.modelStatus === 'Y' ? 'primary' : 'warning'" size="mini">
                    {{ statusEnum[detailData.modelStatus] }}
                  </b-tag>
                </v-key-label>
                <v-key-label label="缺省模型" is-half>
                  <b-tag :type="detailData.sysDefault === '1' ? 'primary' : 'warning'" size="mini">
                    {{ defaultEnum[detailData.sysDefault] }}
                  </b-tag>
                </v-key-label> -->
                <v-key-label label="描述" is-bottom>{{ detailData.modelDesc }}</v-key-label>
              </div>
            </b-col>
          </b-row>

          <v-title-bar label="指标信息" class="mb-15"></v-title-bar>
           <div flex>
            <!-- tree -->
            <div class="tree-con">
              <b-tree :data="treeData"
                @on-select-change="handTreeCurrentChange"></b-tree>
            </div>
            <div class="table-con">
              <!-- 展示用table -->
              <b-table id="customTable" size="small"
                :columns="columns"
                :data="list"
                :loading="!loading && listLoading">
                <template v-slot:indexType="{ row }">
                  {{ natureEnum[row.indexType] }}
                </template>

                <template v-slot:weight="{ row }">
                  {{ row.weight }}%
                </template>
              </b-table>
            </div>
          </div>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getRatingModeDetail, getIndexModleTree } from '../../../api/credit-rating/rating-model.api'

  export default {
    name: 'RatingModelDetail',
    props: ['title', 'id'],
    data () {
      return {
        loading: false,
        listLoading: false,
        detailData: {},
        natureEnum: { // 模型指标下指标性质枚举
          Dimension: '维度',
          Index: '指标'
        },
        isInit: true, // 是否初始化过tree组件数据
        curNode: null, // 用于缓存选中的当前节点
        treeData: [], // 左侧树
        listQuery: {
          modelId: this.id,
          indexId: '',
          indexType: 'Index',
          size: 10,
          page: 1
        },
        list: [],
        columns: [
          {
            type: 'expand',
            width: 50,
            className: 'custome-expand-column disabled',
            render: (h, { row, index }) => {
              return (
                <div class="expand-row">
                  {
                    this.list[index].children.map(item => {
                      return (
                        <div class="row-con">
                          <div class="column-type"></div>
                          <div class="column-type"></div>
                          <div class="column-con">{ item.indexName }</div>
                          <div class="column-con">{ this.natureEnum[item.indexType] }</div>
                          <div class="column-con">{ item.weight }%</div>
                          <div class="column-con">{ item.indexDesc }</div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          },
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'indexName', ellipsis: true, tooltip: true, align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', key: 'indexDesc', ellipsis: true, tooltip: true, align: 'center' }
        ]
      }
    },
    computed: {
      personClassEnum () {
        return this.$store.state.ratingModel.personClassEnum
      },
      statusEnum () { // 状态枚举
        return this.$store.state.ratingModel.statusEnum
      },
      defaultEnum () { // 缺省模型枚举
        return this.$store.state.ratingModel.defaultEnum
      }
    },
    created () {
      this.getRatingModeDetail()
    },
    methods: {
      // 树节点选择改变回调
      handTreeCurrentChange (selectedNode, curNode) {
        if (this.curNode.id === curNode.id) { // 点击已选择的
          curNode.selected = true
        } else {
          this.curNode = curNode
          this.listQuery.indexId = curNode.id
          this.listQuery.page = 1
          this.searchList()
        }
      },
      async getRatingModeDetail () {
        this.loading = true
        try {
          const res = await getRatingModeDetail(this.id)
          await this.searchList()
          this.detailData = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '获取详情失败', desc: error })
        }
        this.loading = false
      },
      // 获取列表
      async searchList() {
        this.listLoading = true
        try {
          const res = await getIndexModleTree(this.listQuery)
          if (this.isInit) { // 第一次载入时做相关初始化
            this.treeData = this.initTree(res, 'Dimension') // 构建左侧树，只构建节点为维度的类型
            this.curNode = this.treeData[0] // 把根节点存储至当前节点
            this.list = this.buildTree(res, 'Index', this.curNode.level) // 构建为树结构(所有类型)
            this.isInit = false
          } else {
            if (this.listQuery.indexId) { // 表示不是根节点
              this.list = res[0].children || []
            } else {
              this.list = res
            }
            // 每次请求都需要构建tree组件使用的数据结构，传入当前选中节点的层级，便于准确构建子节点层级
            this.list = this.buildTree(this.list, 'Index', this.curNode.level) // 构建用于列表展示的所有类型
          }
          this.$nextTick(() => {
            this.enableOrDisableExpanColumn(this.curNode.level) // 根据节点层级启用禁用左侧table可展开列
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      },
      // tree:初始化树组件用数据结构
      initTree(tree, indexType) {
        // 创建根节点
        const rootNode = {
          title: '维度指标',
          root: true,
          expand: true,
          selected: true,
          level: 0,
          children: this.buildTree(tree, indexType, 0)
        }
        return [rootNode]
      },
      // 构建树
      buildTree (tree, indexType, level = 0) { // indexType 为 Dimension 表示只筛选出维度节点，反之筛选出维度与指标节点
        const list = []
        for (const item of tree) {
          // 构建tree组件用数据
          const obj = {
            title: `${item.indexName} (${item.weight}%)`,
            expand: false,
            selected: false,
            level: level + 1,
            children: [],
            ...item
          }
          if (obj.level < 4) { // 这边如果是4级及以上则要保留children，用于展开显示
            // 如果层级小于3且有子节点则递归
            if (obj.level < 3 && (item.children && item.children.length > 0)) {
              obj.children = this.buildTree(item.children, indexType, obj.level)
            } else { // 去除第三级及后续层级的子节点
              obj.children = [] // 把为null的置为[]
            }
          } else {
            // 有子节点则递归
            if (item.children && item.children.length > 0) {
              obj.children = this.buildTree(item.children, indexType, obj.level)
            } else {
              obj.children = []
            }
          }
          if (indexType === 'Dimension') { // 维度时只构建包含维度的节点，忽略Index指标节点
            if (obj.indexType === 'Dimension') list.push(obj)
          } else { // 非维度构建时，构建所有类型节点
            list.push(obj)
          }
        }
        return list
      },
      // 获取用于点击的可展开列的dom元素集合
      getExpandColumn () {
        const domList = []
        const tableEl = document.getElementById('customTable')
        const expandColumnList = tableEl.getElementsByClassName('custome-expand-column')
        for (const item of expandColumnList) {
          domList.push(item)
        }
        domList.shift() // 去除标题中的列
        return domList
      },
       // 启用禁用展开列功能
      enableOrDisableExpanColumn (level) {
       const domList = this.getExpandColumn() // 获取右侧可展开节点
        for (let i = 0; i < this.list.length; i++) { // 遍历右侧table数据
          const el = this.list[i]
          if (level >= 3 && el.indexType === 'Dimension') { // 是第四层且是维度指标 可展开 && indexType === 'Dimension' 暂缓维度条件
            domList[i].classList.remove('disabled')
          } else {
            domList[i].classList.add('disabled') // 反之启用
          }
        }
      }
    }
  }
</script>

<style lang="stylus">
.raring-model-detail {
  // td.disabled.custome-expand-column {
  //   cursor: not-allowed;
  // }
  td.disabled.custome-expand-column .bin-table-cell-expand {
    pointer-events: none;
    i {
      color: rgba(0, 0, 0, 0.0)
    }
  }

  .bin-table-expanded-cell { // 重写展开列默认样式
    padding: 0px;
    background: #f0f2f5;
  }

  .expand-row {
    .row-con {
      display: flex;
      justify-content: flex-start;
      margin: 7px 0;

      .column-type {
        width: 50px;
        text-align: center;
      }

      .column-con {
        padding: 0 16px;
        width: 0px; // flex-grow 均分剩余空间需要默认初始宽度
        flex-grow: 1;
        text-align: center;
        color: #909399;
        line-height: 30px;
        // 以下用于处理文字换行
        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-all;
      }
      .column-action {
        width: 100px;
        text-align: center;
        line-height: 30px;
      }
    }
  }
}
</style>

<style lang="stylus" scoped>
.raring-model-detail {
  width: 100%;

  .tree-con {
    width: 340px;
    border-right: 1px solid #eee;
    overflow: auto;
    max-height: 648px;
  }

  .table-con {
    padding-left: 16px;
    width: calc(100% - 340px);

    .table-bottom {
      margin-top: 20px;
      text-align: center;
      p {
        margin: 10px 0;
        padding: 9px;
        height: 40px;
        text-align: left;
        background-color: #fafafa;
      }
    }
  }
}
</style>
