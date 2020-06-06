<template>
  <div class="valid-value-wrap">
    <div class="mb-10">
      <b-row :gutter="15">
        <b-col span="8" v-if="$slots.default">
          <slot></slot>
        </b-col>
        <b-col :span="$slots.default?16:24" v-if="showValidValue">
          <div style="width: 100%;line-height:32px;" flex="main:justify">
            <span>有效值: </span>
            <div>
              <b-tooltip content="清空有效值">
                <b-icon name="ios-trash" style="vertical-align: -1px;cursor: pointer;"
                        @click.native="emitEmptyValue"/>
              </b-tooltip>
              <v-toggle-show v-model="showReal" show-text="显示调试" hide-text="隐藏调试"/>
            </div>
          </div>
          <div style="width: 100%;line-height:32px;" flex="cross:center">
            <b-radio-group v-model="normalType">
              <b-radio label="enum">
                <span>枚举</span>
              </b-radio>
              <b-radio label="dict">
                <span>字典</span>
              </b-radio>
            </b-radio-group>
            <b-button v-if="isDict" icon="ios-apps" size="mini"
                      type="primary" transparent @click="openDictModal">
              选择字典
            </b-button>
          </div>
        </b-col>
      </b-row>
    </div>
    <div v-if="showValidValue">
      <!--如果选项是字典类型-->
      <div v-show="isDict">
        <span>
          <b-tag style="margin: 0;" type="primary">字典名称</b-tag>
          <b-tag style="margin: 0 5px 0 0;">{{dict.name}}</b-tag>
          <b-tag style="margin: 0;" type="primary">字典编码</b-tag>
          <b-tag style="margin: 0;">{{dict.code}}</b-tag>
        </span>
        &nbsp;
        <b-button type="text" v-if="dict.code.length>0" @click="getDictItemList(dict.code)">详情</b-button>
      </div>
      <!--如果是枚举值类型-->
      <div v-show="isEnum">
        <draggable v-model="arrData"
                   v-bind="{ group:'enum', animation: 200, ghostClass:'ghost', handle:'.move-drag' }"
                   @end="onDragEnd">
          <transition-group name="fade" tag="div" class="enum-list">
            <div v-for="(item,index) in arrData" :key="item.id||index" class="enum-item">
              <span class="move-drag"><b-icon name="ios-menu" size="20"/></span>
              <b-input v-model.trim="arrData[index].code" style="width: 40%;" @on-change="emitValue"
                       placeholder="code"/>&nbsp;
              <b-input v-model.trim="arrData[index].name" style="width: 40%;" @on-change="emitValue"
                       placeholder="name"/>&nbsp;
              <b-button type="text" text-color="#f5222d" @click="removeEnumItem(index)">
                <b-icon name="ios-remove-circle-outline" size="22"/>
              </b-button>
            </div>
          </transition-group>
        </draggable>
        <b-button type="primary" @click="addNewEnum" style="width: 100%;" dashed
                  plain icon="ios-add-circle-outline">
          添加项
        </b-button>
      </div>
      <div v-if="showReal" flex="box:first" class="pt-10">
        <b-tag type="success" :tag-style="{margin:0}">实际存储值</b-tag>
        <b-input :value="validValue" placeholder="检查配置正确值使用" readonly/>
      </div>
    </div>
    <!--字典选择组件-->
    <b-modal v-model="chooseModal" title="选择系统字典" width="860" class="layout-inner" :mask-closable="false">
      <div>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="字典名称">
            <b-input v-model.trim="listQuery.groupName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="字典编码" width="230px">
            <b-input v-model.trim="listQuery.groupCode" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="chooseOne(scope.row)">选择</b-button>
          </template>
        </b-table>
      </div>
      <div slot="footer">
        <!--下方分页器-->
        <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"></b-page>
      </div>
    </b-modal>
    <!--查看字典详情组件-->
    <b-modal v-model="dictModal" title="字典详情">
      <!--中央表格-->
      <b-table :columns="dictColumns" :data="dictItems" size="small"/>
      <div slot="footer">
        <b-button @click="dictModal=false">返 回</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { getValidValue } from './cfg-util'
  import commonMixin from '../../../common/mixins/mixin'
  import VToggleShow from '../VToggleShow/index'
  // import { getDictGroupList } from '../../../api/sys/dict.api'
  import { getDictItems } from '../../../api/data-manage/gather.api'

  export default {
    name: 'ValidValue',
    mixins: [commonMixin],
    components: { VToggleShow, Draggable },
    props: {
      value: {
        type: String
      },
      showValidValue: {
        type: Boolean
      }
    },
    data() {
      return {
        validValue: '',
        normalType: 'enum',
        dict: {
          name: '',
          code: ''
        },
        arrData: [],
        showReal: false,
        // 用于选择字典弹窗
        listQuery: {
          groupName: '',
          groupCode: ''
        },
        chooseModal: false,
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字典名称', key: 'groupName' },
          { title: '字典编码', key: 'groupCode' },
          { title: '操作', slot: 'action', width: 90, align: 'center' }
        ],
        dictModal: false,
        dictItems: [],
        dictColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字典名称', key: 'name' },
          { title: '字典编码', key: 'code' }
        ]
      }
    },
    computed: {
      isEnum() {
        return this.normalType === 'enum'
      },
      isDict() {
        return this.normalType === 'dict'
      }
    },
    watch: {
      value: {
        handler(val) {
          this.validValue = val
          let result = getValidValue(val)
          this.normalType = result.type // 设置类型
          if (this.isDict) { // 字典值设置字典
            this.dict.name = result.name
            this.dict.code = result.code
            this.arrData = []
          } else {
            this.arrData = result.data
            this.dict.name = ''
            this.dict.code = ''
          }
        },
        immediate: true
      }
    },
    methods: {
      // 更新model value
      emitValue() {
        let result = ''
        // 将数组拼接为原始字符串,过滤空值项
        if (this.normalType === 'enum') {
          let codes = []
          let names = []
          this.arrData.forEach(item => {
            codes.push(item.code)
            names.push(item.name)
          })
          // 拼接字符串 为[ 1/0;启用/禁用 ]
          result = this.arrData.length === 0 ? '' : (names.join('/') + ';' + codes.join('/'))
        } else {
          // 拼接字符串groupName/groupCode
          result = this.dict.name + '/' + this.dict.code
        }
        this.$emit('input', result)
        this.$emit('on-change', result)
      },
      // 更新model value
      emitEmptyValue() {
        this.$emit('input', '')
        this.$emit('on-change', '')
      },
      // 添加一项枚举
      addNewEnum() {
        this.arrData.push({ code: '', name: '' })
        this.emitValue()
      },
      // 删除一项枚举
      removeEnumItem(index) {
        this.arrData.splice(index, 1)
        this.emitValue()
      },
      // 枚举拖拽结束
      onDragEnd(event) {
        let { oldIndex, newIndex } = event
        if (oldIndex !== newIndex) {
          this.emitValue()
        }
      },
      // 选择字典模块
      openDictModal() {
        this.chooseModal = true
        this.resetQuery()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          groupName: '',
          groupCode: ''
        }
        this.handleFilter()
      },
      // 选中一个角色
      chooseOne(item) {
        this.dict.name = item.groupName
        this.dict.code = item.groupCode
        this.emitValue()
        this.chooseModal = false
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        this.setListData({
          list: [{ groupName: '自然人证件类型', groupCode: 'natIdType' }, { groupName: '性别', groupCode: 'sex' }],
          total: 10
        })
        // getDictGroupList(this.listQuery).then(response => {
        //   if (response.status === 200) {
        //     this.setListData({
        //       list: response.data.rows,
        //       total: response.data.total
        //     })
        //   }
        // })
      },
      // 根据当前字典项查询字典列表
      getDictItemList(dictCode) {
        getDictItems(dictCode).then(res => {
          if (res.data.code === '0') {
            this.dictItems = res.data.data
            this.dictModal = true
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .valid-value-wrap {
    width: 100%;
  }
  .enum-item {
    box-sizing: border-box;
    border: 1px dashed transparent;
    border-radius: 2px;
    margin-bottom: 10px;
    .move-drag {
      cursor: move;
      padding: 0 6px 0 2px;
    }
    .remove {
      cursor: pointer;
    }
    &.ghost {
      position: relative;
      font-size: 0;
      border: 1px dashed #1089ff;
      height: 50px;
      &::after {
        position: absolute;
        content: '';
        background: #fff;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
</style>
