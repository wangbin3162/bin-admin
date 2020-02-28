<template>
  <!--自然人选择框 for form-control -->
  <div flex>
    <b-input v-model="current" :placeholder="placeholder" readonly clearable @on-clear="handleClear"></b-input>
    <b-button type="primary" v-waves @click="handleShowModal"
              style="padding: 10px;flex:0 0 auto;margin-left: 0;font-size: 12px;">
      选择自然人
    </b-button>
    <!--选择自然人弹窗 for ResInfo.vue -->
    <b-modal v-model="dialogFormVisible" title="选择自然人" width="860" class="layout-inner" :mask-closable="false">
      <div style="padding: 0;">
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model.trim="listQuery.name" size="small" placeholder="输入名称" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="primary" size="mini" plain @click="chooseOne(scope.row)">
              选择
            </b-button>
          </template>
        </b-table>
      </div>
      <div slot="footer">
        <!--下方分页器-->
        <b-page :total="total" show-sizer
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { getNatList } from '../../../../../api/data-manage/gather.api'
  import { Decode, MaskCode } from '../../../../../common/utils/secret'

  export default {
    name: 'NatPersonChoose',
    mixins: [commonMixin, permission],
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogFormVisible: false,
        listQuery: {
          name: '' // 名称
        },
        columns: [
          { title: '名称', key: 'name' },
          { title: '证件类型', key: 'idTypeName' },
          { title: '证件类型', key: 'idCode' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        current: '',
        noMaskList: []
      }
    },
    watch: {
      value: {
        handler(val) {
          this.current = val
        },
        immediate: true
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '' // 名称
        }
        this.handleFilter()
      },
      handleShowModal() {
        this.dialogFormVisible = true
        this.resetQuery()
      },
      chooseOne(row) {
        let item = this.noMaskList[row._index]
        this.$emit('on-select-nat', {
          id: item.id,
          name: item.name,
          idType: item.idType,
          idCode: item.idCode
        })
        this.dialogFormVisible = false
      },
      // 清空时触发调用
      handleClear() {
        this.$emit('on-select-nat', {
          id: '',
          name: '',
          idType: '',
          idCode: ''
        })
      },
      // 查询所有自然人列表
      searchList() {
        this.setListData()
        getNatList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: this.decodeAndMaskFormat(response.data.rows, true),
              total: response.data.total
            })
            this.noMaskList = this.decodeAndMaskFormat(response.data.rows)
          }
        })
      },
      // 解码和掩码处理列表
      decodeAndMaskFormat(arr, mask = false) {
        let newArr = []
        arr.forEach(item => {
          let tmp = { ...item }
          // 遍历字段
          Object.keys(tmp).forEach(key => {
            if (key === 'idCode') { // 身份证号需要解码和混淆
              tmp[key] = mask ? MaskCode(Decode(item[key]), 'ID_CODE') : Decode(item[key])
            }
          })
          newArr.push(tmp)
        })
        return newArr
      }
    }
  }
</script>
