<template>
  <!--选择自然人弹窗 for ResInfo.vue -->
  <b-modal v-model="dialogFormVisible" title="选择自然人" width="860" append-to-body :mask-closable="false">
    <div style="padding: 0;">
      <!--查询条件-->
      <v-filter-bar @keyup-enter="handleFilter">
        <v-filter-item title="名称">
          <b-input v-model.trim="listQuery.name" placeholder="输入名称" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
        <!--操作栏-->
        <template v-slot:action="{index}">
          <b-button type="text" @click="chooseOne(index)">选择</b-button>
        </template>
      </b-table>
    </div>
    <div slot="footer">
      <!--下方分页器-->
      <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import { getNatList } from '../../../api/data-manage/gather.api'
  import { Decode, MaskCode } from '../../../common/utils/secret'

  export default {
    name: 'NatPersonModal',
    mixins: [commonMixin],
    data() {
      return {
        dialogFormVisible: false,
        listQuery: {
          name: '' // 名称
        },
        columns: [
          { title: '名称', key: 'name' },
          { title: '证件类型', key: 'idTypeName' },
          { title: '证件号码', key: 'idCode' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        noMaskList: []
      }
    },
    methods: {
      open() {
        this.dialogFormVisible = true
        this.resetQuery()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '' // 名称
        }
        this.handleFilter()
      },
      chooseOne(index) {
        let item = this.noMaskList[index]
        this.$emit('choose-one', item)
        this.dialogFormVisible = false
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
