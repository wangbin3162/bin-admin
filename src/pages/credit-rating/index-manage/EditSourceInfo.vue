<template>
  <div class="edit-source-info">
    <!-- <b-alert v-if="valid" type="warning">有暂未配置的资源或常量缺省值，请配置后提交。</b-alert> -->
    <div class="main-con">
      <div class="left">
        <b-card header="参数" head-tip shadow="never" :bordered="false">
          <template v-if="resources.length > 0">
            <b-table ref="table" :columns="columns" :data="list" :show-header="false" size="small"
              highlight-row @on-current-change="currentRowChange">
              <template v-slot:columnA="{ row }">
                <div class="title-con">
                  <h4>{{ row.paraName }}</h4>
                  <span t-ellipsis :title="row.paraDesc" class="desc">
                    {{ row.paraDesc ? row.paraDesc: '暂无描述' }}
                  </span>
                </div>
              </template>

              <template v-slot:columnB="{ row, index }">
               <template v-if="list[index].paraType === 'C'">
                  <b-tooltip v-if="list[index].defaultValue === ''" appendToBody content="未配置缺省值">
                    <b-icon name="ios-alert" color="#ff4d4f"></b-icon>
                  </b-tooltip>
               </template>

               <template v-else>
                  <b-tooltip v-if="list[index].paraValue === ''" appendToBody content="未配置资源或信息项">
                    <b-icon name="ios-alert" color="#ff4d4f"></b-icon>
                  </b-tooltip>
               </template>

                <b-button type="primary" plain style="width: 90px;">
                  {{ paramTypeEnum[row.paraType] }}
                </b-button>
              </template>
            </b-table>
          </template>
        </b-card>
      </div>

      <div class="right">
        <b-card header="相关配置" head-tip shadow="never" :bordered="false">
          <template v-if="resources.length > 0">
            <div class="mb-10">
              <h4 class="">缺省值</h4>
              <b-input v-model="list[rowIndex].defaultValue" :disabled="!isEdit" size="small"></b-input>
            </div>

            <template v-if="!isConst">
              <div v-if="isEdit" flex="main:justify cross:center" class="mb-10">
                <b-button type="info" plain size="small">
                  <template v-if="isSource">所选资源信息</template>
                  <template v-if="isInfo">所选信息项</template>
                </b-button>
                <div>
                  <b-button type="text" icon="ios-trash" v-if="isSource" @click="clearAll(rowIndex)">清空</b-button>
                  <b-button type="text" icon="ios-settings" @click="open = true">配置</b-button>
                </div>
              </div>

              <b-table :columns="columnsConfig" :data="listConfig" size="small">
                <template v-slot:personClass="{ row }">
                  <div t-ellipsis :title="personClassEnum[row.personClass]">
                    {{ personClassEnum[row.personClass] }}
                  </div>
                </template>

                <template v-slot:resProperty="{ row }">
                  <div t-ellipsis :title="resPropertyEnum[row.resProperty]">
                    {{ resPropertyEnum[row.resProperty] }}
                  </div>
                </template>

                <template v-slot:dataType="{ row }">
                  <div t-ellipsis :title="dataTypeCustomEnum[row.dataType]">
                    {{ dataTypeCustomEnum[row.dataType] }}
                  </div>
                </template>

                <template v-slot:action="{ row }">
                  <b-button v-if="isSource" type="text" @click="remove(row.resourceKey)">移除</b-button>
                  <b-button v-if="isInfo" type="text" @click="open = true">更新</b-button>
                </template>
              </b-table>
            </template>
          </template>
        </b-card>
      </div>
    </div>
    <!-- 资源配置弹框 -->
    <source-info-select
      @close="open = false"
      @choose-mul="handleChooseMul"
      @choose-sin="handleChooseSin"
      :open="open"
      :paraType="paraType">
    </source-info-select>
  </div>
</template>

<script>
  import { getEvalParamType } from '../../../api/enum.api'
  import { getPersonClassTree } from '../../../api/data-manage/metadata.api'
  import { getResPropertyTree } from '../../../api/data-manage/res-info.api'
  import SourceInfoSelect from './SourceInfoSelect'

  export default {
    name: 'IndexManageSourceInfo',
    props: {
      resources: {
        type: Array
      },
      mode: {
        type: String,
        default: 'edit'
      },
      personClassEnum: {
        type: Object
      },
      resPropertyEnum: {
        type: Object
      },
      paramTypeEnum: {
        type: Object
      }
    },
    components: {
      SourceInfoSelect
    },
    data () {
      return {
        valid: false,
        dataTypeCustomEnum: {
          string: '字符型',
          number: '数值型',
          money: '货币型',
          boolean: '逻辑型',
          date: '日期型',
          datetime: '日期时间型',
          text: '备注型'
        },
        open: false, // 配置资源弹框
        list: [],
        columns: [
          { title: 'columnA', slot: 'columnA', align: 'left' },
          { title: 'columnB', slot: 'columnB', align: 'right' }
        ],
        columnsConfig: [],
        listConfig: [],
        paraType: null, // 配置资源弹框组件使用，参数类型
        rowId: null, // 存储点击配置资源行的id
        rowIndex: 0, // 当前行index
        domList: [] // 存储获取的用于点击的可展开列的dom集合
      }
    },
    watch: {
      resources: { // 观察变量选择带来的参数变动
        handler (newVal, oldVal) {
          this.list = this.initList(newVal)
          if (this.list.length) {
            this.$nextTick(() => {
              this.$refs.table.clickCurrentRow(0)
            })
          }
        },
        immediate: true
      },
      list: {
        handler (newVal) {
          this.$emit('data-change', this.list)
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      isEdit () {
        return this.mode === 'edit'
      },
      isSource () {
        return this.paraType === 'S'
      },
      isInfo () {
        return this.paraType === 'I'
      },
      isConst () {
        return this.paraType === 'C'
      }
    },
    created () {

    },
    methods: {
      // 参数table当前行选中回调
      currentRowChange (curRow, oldRow, index) {
        this.paraType = curRow.paraType
        this.rowIndex = index
        if (curRow.paraType === 'I') {
          this.columnsConfig = [
            { title: '名称', key: 'fieldName', ellipsis: true, tooltip: true },
            { title: '标题', key: 'fieldTitle', ellipsis: true, tooltip: true },
            { title: '数据类型', slot: 'dataType' },
            { title: '所属资源', key: 'resourceName', ellipsis: true, tooltip: true }
          ]
        } else if (curRow.paraType === 'S') {
          this.columnsConfig = [
            { title: '资源名称', key: 'resourceName', ellipsis: true, tooltip: true },
            { title: '主体类别', slot: 'personClass', ellipsis: true, tooltip: true },
            { title: '资源性质', slot: 'resProperty', ellipsis: true, tooltip: true }
          ]
        }
        if (this.isEdit) this.columnsConfig.push({ title: '操作', slot: 'action', width: 70 })
        this.listConfig = this.buildListConfig(curRow)
      },
      // 资源组件 多选回调
      handleChooseMul (arr) {
        const row = this.list[this.rowIndex]
        let originResKeyList = []
        if (row.paraValue.length > 0) { // 字符串不为空的话则还原resourceKey数组
          originResKeyList = row.paraValue.split(',') // 取出原有的resourceKey
        }

        const resKeyList = [] // 存放已选择的resourceKey
        for (const item of arr) {
          resKeyList.push(item.resourceKey)
        }

        // 去重后把数据填充到对应row的字段中
        row.paraValue = [...new Set([...originResKeyList, ...resKeyList])].join(',')

        // 更新数据
        for (const item of arr) {
          row.source[item.resourceKey] = item
        }
        this.listConfig = this.buildListConfig(row)
      },
      // 资源组件 单选回调
      handleChooseSin ({ fieldName, fieldTitle, dataType, resourceName, resourceKey }) {
        // 把数据填充到对应row的字段中
        const row = this.list[this.rowIndex]
        row.paraValue = `${fieldName}:${resourceKey}` // 更新提交的字段
        row.info = {}
        row.info[row.paraValue] = { fieldName, fieldTitle, dataType, resourceName }
        this.listConfig = this.buildListConfig(row)
      },
      // 初始化需要的数据结构
      initList (resources) {
        let list = JSON.parse(JSON.stringify(resources))
        for (const item of list) {
          // 扩展所需提交的字段
          if (item.paraValue === undefined) {
            item.paraValue = ''
          }
          if (item.defaultValue === undefined) {
            item.defaultValue = ''
          }
          if (item.source === undefined) {
            item.source = {}
          }
          if (item.info === undefined) {
            item.info = {}
          }
        }
        list = list.filter(item => item.paraCode !== 'person_id') // 过滤掉paraCode为person_id的数据
        return list
      },
      /**
       * @author haodongdong
       * @description 清空按钮的回调
       * @param {number} index 当前参数选中行的index
       */
      clearAll (index) {
        const row = this.list[index]
        if (row.paraType === 'S') {
          row.paraValue = ''
          row.source = {}
        }
        this.listConfig = this.buildListConfig(row)
      },
      /**
       * @author haodongdong
       * @description 移除按钮的回调
       * @param {string} resourceKey
       */
      remove (resourceKey) {
        const row = this.list[this.rowIndex]
        // 删除对应显示数据
        this.$delete(row.source, resourceKey)
        // 删除row.paraValue中对应的resourceKey
        const resourceKeyList = row.paraValue.split(',')
        const index = resourceKeyList.indexOf(resourceKey)
        if (index > -1) resourceKeyList.splice(index, 1)
        row.paraValue = resourceKeyList.join(',')
        // 更新列表
        this.listConfig = this.buildListConfig(row)
      },
      /**
       * @author haodongdong
       * @description 构建右侧相关配置所需要的列表
       * @param {Object} row 左侧参数table的行数据
       * @param {string} row.paraType 参数类型
       * @param {Object} row.info 携带的信息项对象
       * @param {Object} row.source 携带的资源对象
       * @returns {Array} table使用的list
       */
      buildListConfig (row) {
        let obj = {}
        const listConfig = []
        if (row.paraType === 'I') {
          obj = row.info
        } else if (row.paraType === 'S') {
          obj = row.source
        }
        Object.keys(obj).forEach(key => {
          // 扩展resourceKey属性，用于移除操作
          if (row.paraType === 'S') obj[key].resourceKey = key
          listConfig.push(obj[key])
        })
        return listConfig
      },
      // 用于给父级组件验证是否配置资源
      validate () {
        return new Promise((resolve, reject) => {
          this.valid = false
          for (const item of this.list) {
            if (item.paraType !== 'C') {
              if (item.paraValue === '') {
                this.valid = true
                this.$notice.warning({
                  title: '有暂未配置的参数',
                  desc: '有暂未配置的参数或常量缺省值，请配置后提交。'
                })
                resolve(false)
                break
              }
            } else {
              if (item.defaultValue === '') {
                this.valid = true
                this.$notice.warning({
                  title: '常量需要缺省值，请填写后提交。'
                })
                resolve(false)
                break
              }
            }
          }
          resolve(true)
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .edit-source-info {
   .main-con {
     display: flex;

     .left {
       width: 50%;
       border: 1px solid #f0f0f0;

       .title-con {
         .desc {
           font-size: 13px;
           color: #bfbfbf;
         }
       }
     }

     .right {
       flex: 1;
       border: 1px solid #f0f0f0;
       border-left: 0px;
     }
   }
 }
</style>
