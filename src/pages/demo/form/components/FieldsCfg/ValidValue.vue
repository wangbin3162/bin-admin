<template>
  <div class="valid-value-wrap">
    <div style="width: 100%;line-height:32px;" flex="main:justify">
      <span>有效值: </span>
      <v-toggle-show v-model="showReal" show-text="显示实际值" hide-text="隐藏实际值"/>
    </div>
    <b-radio-group v-model="normalType">
      <b-radio label="enum">
        <span>枚举</span>
      </b-radio>
      <b-radio label="dict">
        <span>字典</span>
      </b-radio>
    </b-radio-group>
    <div style="padding: 10px 0 0;">
      <!--如果选项是字典类型-->
      <div v-show="isDict" flex="main:justify cross:center">
        <div>
          <b-tag style="margin: 0;" type="primary">字典名称</b-tag>
          <b-tag style="margin: 0 5px 0 0;">{{dict.name}}</b-tag>
          <b-tag style="margin: 0;" type="primary">字典编码</b-tag>
          <b-tag style="margin: 0;">{{dict.code}}</b-tag>
        </div>
        <div>
          <b-tooltip content="选择字典" theme="light">
            <b-button icon="ios-play" type="primary" transparent @click="openDictModal"/>
          </b-tooltip>
        </div>
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
              <b-popover confirm title="确认删除此项吗?" @on-ok="removeEnumItem(index)" width="170">
                <span class="remove">
                  <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
                </span>
              </b-popover>
            </div>
          </transition-group>
        </draggable>
        <b-button type="text" @click="addNewEnum">
          <b-icon name="ios-add-circle-outline"/>
          添加项
        </b-button>
      </div>
    </div>
    <div v-show="showReal">
      <b-tag type="success" size="small">实际存储值</b-tag>
      <b-input :value="validValue" readonly/>
    </div>
    <!--字典选择组件-->
    <b-modal v-model="chooseModal" title="选择系统字典" width="860" class="layout-inner" :mask-closable="false">
      <div>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="字典名称">
            <b-input v-model.trim="listQuery.groupName" placeholder="请输入" clearable size="small"></b-input>
          </v-filter-item>
          <v-filter-item title="字典编码" width="230px">
            <b-input v-model.trim="listQuery.groupCode" placeholder="请输入" clearable size="small"></b-input>
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
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { getValidValue } from './cfg-util'
  import commonMixin from '../../../../../common/mixins/mixin'
  import VToggleShow from '../../../../../components/VToggleShow/index'

  export default {
    name: 'ValidValue',
    mixins: [commonMixin],
    components: { VToggleShow, Draggable },
    props: {
      value: {
        type: String
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
        // api.getDictGroupList(this.listQuery).then(response => {
        //   if (response.status === 200) {
        //     this.setListData({
        //       list: response.data.rows,
        //       total: response.data.total
        //     })
        //   }
        // })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .valid-value-wrap {
    width: 100%;
    margin-bottom: 16px;
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
