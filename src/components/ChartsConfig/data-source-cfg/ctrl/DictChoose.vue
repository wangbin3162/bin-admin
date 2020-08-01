<template>
  <div class="dict-choose-wrap">
    <template v-if="!dictItemVisible">
      <div class="filter" flex>
        <b-input v-model.trim="listQuery.groupName" placeholder="搜索字典名称"
                 size="mini" search @on-search="handleFilter" style="width: 150px;"/>
      </div>
      <div class="dict-group">
        <div class="dict-group-item" :class="{'active':selectedDict&&dict.groupCode===selectedDict.code}"
             v-for="dict in list" :key="dict.id"
             @click="handleChooseDict(dict)">
          {{ dict.groupName }}
        </div>
      </div>
      <div class="page">
        <b-page :current.sync="listQuery.page" :total="total" size="small"
                @on-change="handleCurrentChange"></b-page>
      </div>
    </template>
    <div class="dict-items" v-else>
      <div flex>
        <div style="width: 60px;">字典</div>
        <div style="width: calc(100% - 60px);">
          <b-tag type="primary" size="small">{{selectedDict.name}}</b-tag>
          <b-tooltip content="点击重选字典" placement="top">
            <b-button type="text" text-color="danger" icon="ios-undo"
                      @click="handleBackChooseDict"></b-button>
          </b-tooltip>
        </div>
      </div>
      <div flex>
        <div style="width: 60px;">字典项</div>
        <div style="width: calc(100% - 60px);">
          <div class="dict-item" :class="{'active':itemActive(key)}"
               @click="handleSelectItem(key)"
               v-for="(val,key) in selectedDict.items" :key="key">
            {{ val }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import { getDictList, getDictItems } from '../../../../api/excavate-analyze/excavate-cfg.api'
  import { deepCopy } from '../../../../common/utils/assist'

  export default {
    name: 'DictChoose',
    mixins: [commonMixin],
    props: {
      dict: {
        type: Object
      },
      items: {
        type: Array
      }
    },
    data() {
      return {
        dictItemVisible: false,
        listQuery: {
          groupName: '',
          groupCode: ''
        },
        selectedDict: { code: '', name: '' },
        selectList: []
      }
    },
    watch: {
      dict: {
        handler(val) {
          this.selectedDict = deepCopy(val)
          if (!val) {
            this.$nextTick(_ => {
              this.resetQuery()
            })
          } else {
            this.$nextTick(_ => {
              this.dictItemVisible = true
            })
          }
        },
        immediate: true
      },
      items: {
        handler(val) {
          this.selectList = val ? [...val] : []
        },
        immediate: true
      }
    },
    methods: {
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          groupName: '',
          groupCode: ''
        }
        this.handleFilter()
      },
      // 选中一个字典
      handleChooseDict(row) {
        this.selectedDict = { name: row.groupName, code: row.groupCode }
        getDictItems(row.groupCode).then(resp => {
          if (resp.data.code === '0') {
            let map = {}
            let result = resp.data.data || []
            result.forEach(i => {
              map[i.code] = i.name
            })
            this.selectedDict.items = map
            this.selectList = []
            this.dictItemVisible = true
            this.emitSelect()
          }
        })
      },
      // 发送事件
      emitSelect() {
        this.$emit('on-select', {
          dict: { ...this.selectedDict },
          value: [...this.selectList]
        })
      },
      // 返回重选字典
      handleBackChooseDict() {
        this.dictItemVisible = false
        this.resetQuery()
      },
      // 选中一个字典项
      handleSelectItem(item) {
        let index = this.selectList.indexOf(item)
        if (index === -1) {
          this.selectList.push(item)
        } else {
          this.selectList.splice(index, 1)
        }
        this.emitSelect()
      },
      // 选中列表中是否包含已存在内容
      itemActive(item) {
        return this.selectList.indexOf(item) > -1
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        getDictList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .dict-choose-wrap {
    width: 100%;
    padding: 8px 12px;
    border-top: 1px solid #eeeeee;
    .dict-group {
      padding: 8px 0;
    }
    .dict-group-item {
      position: relative;
      cursor: pointer;
      display: block;
      padding: 0 12px;
      line-height: 24px;
      margin-bottom: -1px;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, 0.125);
      transition: background .3s;
      &.active {
        background: #86c2ff;
        color: #ffffff;
        &:hover {
          background: #86c2ff;
          color: #ffffff;
        }
      }
      &:hover {
        background: #a7e3f3;
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      &:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }

    .dict-item {
      display: inline-block;
      cursor: pointer;
      margin: 2px 4px 2px 0;
      font-size: 14px;
      vertical-align: middle;
      opacity: 1;
      overflow: hidden;
      height: 22px;
      padding: 0 8px;
      line-height: 20px;
      border-radius: 2px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      white-space: nowrap;
      background-color: #f4f5f6;
      border: 1px solid #d6dade;
      color: #5d6d7e;
      transition: .25s;
      &:hover {
        border-color: #aeb6be;
      }
      &.active {
        background-color: #f6fcf3;
        border-color: #b9e7a3;
        color: #52c41a;
      }
    }
  }
</style>
