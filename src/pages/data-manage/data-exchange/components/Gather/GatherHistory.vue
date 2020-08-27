<template>
  <div>
    <page-header-wrap v-show="historyDialog" show-close @on-close="close" title="查看历史">
      <v-edit-wrap transparent>
        <b-collapse-wrap :title="'版本比对 ' + (current.comp_name||current.name)">
          <div class="history-panel">
            <div class="left-fields">
              <v-title-bar label="历史版本">
                <b-tooltip max-width="200" content="点击勾选任意两个需要比对的版本，右侧查看比对结果详情。">
                  <b-icon name="ios-help-circle" class="pl-10 pr-10" size="18" color="#25bbe3"/>
                </b-tooltip>
              </v-title-bar>
              <div class="history-wrap">
                <b-timeline>
                  <!--当前版本-->
                  <b-timeline-item :color="nodeStyle(current).color">
                    <b-icon :name="nodeStyle(current).iconName" slot="dot" :size="nodeStyle(current).iconSize"/>
                    <div class="item" @click="selectOne(current)" style="padding-bottom: 16px;">
                      <p class="time">
                        当前版本&nbsp;版本号:{{current.version}}
                      </p>
                    </div>
                  </b-timeline-item>
                  <!--历史版本-->
                  <b-timeline-item v-for="item in historyList" :key="item.id" :color="nodeStyle(item).color">
                    <b-icon :name="nodeStyle(item).iconName" slot="dot" :size="nodeStyle(item).iconSize"/>
                    <div class="item" @click="selectOne(item)">
                      <p class="time">
                        {{item.operatorTime}}
                      </p>
                      <p class="info" flex="box:mean">
                        <v-simple-label label="操作类型" style="padding-bottom: 0;">{{item.operationType}}</v-simple-label>
                        <v-simple-label label="操作人" style="padding-bottom: 0;">{{item.operatorName}}</v-simple-label>
                      </p>
                    </div>
                  </b-timeline-item>
                </b-timeline>
              </div>
              <div class="page-wrap" v-if="total>10">
                <b-page :total="total" :current.sync="listQuery.page" size="small"
                        @on-change="handleCurrentChange"></b-page>
              </div>
            </div>
            <div class="right-panel">
              <v-title-bar label="比对结果">
                <v-toggle-show v-model="showOperator"/>
              </v-title-bar>
              <div class="result-wrap">
                <div>
                  <template v-for="(item,index) in operateObjects">
                    <span :key="item.id">
                      <b-tag :type="item.isCurrent?'primary':'info'" closable @on-close="handleCloseTag(item)">
                        <span>{{ item.title }}</span>
                      </b-tag>
                      <span style="margin: 0 12px 0 8px;" v-if="index<operateObjects.length-1">对比</span>
                    </span>
                  </template>
                  <b-empty v-if="compareList.length===0">没有选择版本</b-empty>
                </div>
                <div class="result" v-if="compareResult">
                  <b-table :columns="compareResult.columns" :data="compareResult.data"
                           size="small" max-height="400" border no-data-text="内容相同"/>
                </div>
                <div v-if="showOperator">
                  <div v-for="item in operateObjects" class="source" :key="item.id">
                    <b-tag dot no-border type="primary" style="margin-bottom: 8px;">{{ item.title }}</b-tag>
                    <b-ace-editor :value="JSON.stringify(item.obj,null,2)" readonly height="200"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-collapse-wrap>
        <template slot="footer">
          <b-button @click="close">关闭</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import * as api from '../../../../../api/data-manage/gather.api'
  import { deepCopy, isEmpty, isNotEmpty } from '../../../../../common/utils/assist'
  import { Decode, MaskCode } from '../../../../../common/utils/secret'
  import { oneOf } from 'bin-ui/src/utils/util'
  import VToggleShow from '../../../../../components/Validator/VToggleShow/index'

  export default {
    name: 'GatherHistory',
    components: { VToggleShow },
    data() {
      return {
        historyDialog: false,
        historyList: [],
        listQuery: {
          page: 1,
          size: 10,
          recordId: ''
        },
        total: 0,
        current: {},
        fieldMap: {},
        fieldsList: [], // 字段信息列表包含「字段名称，中文名，是否加密，是否掩码，和字典项」等信息
        compareList: [],
        showOperator: false
      }
    },
    computed: {
      // 对比的原始对象列表
      operateObjects() {
        let arr = []
        this.compareList.forEach((item, index) => {
          let id = item.id
          let isCurrent = !!item.version
          let title = isCurrent ? '当前版本' : item.operatorTime
          let key = 'key' + index // 显示表格的key值
          let obj = isCurrent ? deepCopy(item) : JSON.parse(item.recordJson)
          arr.push({ id, isCurrent, title, key, obj: this.formatObj(obj, !isCurrent) })
        })
        return arr
      },
      // 根据已经选择的比较集合，返回对应的比较结果
      compareResult() {
        let columns = [{ title: '字段', key: 'field', tooltip: true, width: 200 }]
        let data = []
        // 比较对象只有一个时，直接拼接一个
        if (this.operateObjects.length === 1) {
          let item = this.operateObjects[0]
          let { obj } = item
          columns.push({ title: item.title, key: item.key, tooltip: true })
          // 根据翻译字段映射来显示
          Object.keys(this.fieldMap).forEach(key => {
            let field = this.fieldMap[key]
            if (obj.hasOwnProperty(key)) {
              data.push({
                field: field.title,
                [item.key]: obj[key]
              })
            }
          })
          return { columns, data }
        }
        // 等于两个时，筛选比对不同项
        if (this.operateObjects.length === 2) {
          let item0 = this.operateObjects[0]
          let item1 = this.operateObjects[1]
          let obj0 = item0.obj
          let obj1 = item1.obj
          columns.push({ title: item0.title, key: item0.key, tooltip: true })
          columns.push({ title: item1.title, key: item1.key, tooltip: true })
          // 根据翻译字段映射来显示
          Object.keys(this.fieldMap).forEach(key => {
            let field = this.fieldMap[key]
            // 两个比较对象共有的内容
            if (obj0.hasOwnProperty(key) && obj1.hasOwnProperty(key)) {
                if (obj0[key] === '') {
                    obj0[key] = null
                }
                if (obj0[key] !== obj1[key]) { // 两个字段不同
                data.push({
                  field: field.title,
                  [item0.key]: obj0[key],
                  [item1.key]: obj1[key]
                })
              }
            }
          })
          return { columns, data }
        }
        return null
      }
    },
    methods: {
      // 打开弹窗 当前对象，原始列表
      open(current, columns) {
        this.listQuery.recordId = current.id
        // 存储当前版本最新数据，名称字段映射和需要加密的字段列表
        this.current = { ...current }
        this.fieldMap = this.formatFieldMaps(columns)
        this.historyDialog = true
        this.searchList()
      },
      close() {
        this.compareList = []
        this.historyDialog = false
        this.$emit('on-close')
      },
      // 查询历史版本列表
      searchList() {
        api.getHistory(this.listQuery).then(res => {
          if (res.status === 200) {
            this.total = res.data.total
            this.historyList = res.data.rows
          }
        })
      },
      handleCurrentChange(page) {
        this.listQuery.page = page
        this.searchList()
      },
      // 字段信息映射
      formatFieldMaps(fields) {
        let obj = {}
        // 格式化字典映射
        let formatOptions = (options) => {
          if (isEmpty(options)) {
            return null
          }
          let map = {}
          options.forEach(o => {
            map[o.code] = o.name
          })
          return map
        }
        fields.forEach(i => {
          obj[i.fieldName] = {
            title: i.fieldTitle, // 中文名
            isEncrypt: i.isEncrypt, // 是否加密
            maskModel: i.maskModel, // 加密模式
            options: formatOptions(i.validOptions) // 字典选项映射
          }
        })
        return obj
      },
      // 显示对象格式化（根据字段信息映射，遍历进行解密掩码赋值操作），非当前版本需要翻译转换
      formatObj(obj, format) {
        let tmp = {}
        Object.keys(this.fieldMap).forEach(key => {
          let field = this.fieldMap[key]
          if (obj.hasOwnProperty(key)) {
            tmp[key] = obj[key]
            if (format) {
              if (field.isEncrypt === '1') { // 解密
                tmp[key] = Decode(tmp[key])
                // console.log('解码后：' + value)
              }
              if (oneOf(field.maskModel, ['ID_CODE', 'MOBILE_PHONE'])) { // 掩码
                tmp[key] = MaskCode(tmp[key], field.maskModel)
                // console.log('掩码后：' + value)
              }
              if (field.options) {
                tmp[key] = field.options[obj[key]] !== undefined ? field.options[obj[key]] : null
              }
            }
          }
        })
        return tmp
      },
      // 版本勾选,是否是当前版本
      selectOne(item) {
        let selectIndex = this.compareList.findIndex(i => i.id === item.id)
        if (selectIndex > -1) {
          this.compareList.splice(selectIndex, 1)
          this.sortList()
          return
        }
        if (this.compareList.length >= 2) {
          this.compareList.shift() // 移除第一个
        }
        this.compareList.push(item)
        this.sortList()
      },
      // 移除一个选中标签
      handleCloseTag(item) {
        let selectIndex = this.compareList.findIndex(i => i.id === item.id)
        if (selectIndex > -1) {
          this.compareList.splice(selectIndex, 1)
          this.sortList()
        }
      },
      // 比较数组排序，为判断当前版本和日期进行比较
      sortList() {
        if (this.compareList.length === 2) {
          let one = deepCopy(this.compareList[0])
          let two = deepCopy(this.compareList[1])
          // 如果第二个是当前版本，则移入第一个
          if (isNotEmpty(two.version)) {
            this.compareList = [two, one]
          }
          if (isEmpty(one.version) && isEmpty(two.version)) {
            // 判断第二个日期，是否大于第一个日期，是则交换
            if (new Date(two.operatorTime) > new Date(one.operatorTime)) {
              this.compareList = [two, one]
            }
          }
        }
      },
      // 判断是否选中
      isSelect(row) {
        return this.compareList.findIndex(item => item.id === row.id) > -1
      },
      // 返回节点的设置值
      nodeStyle(row) {
        let selected = this.isSelect(row)
        return {
          color: selected ? 'success' : (row.version ? 'primary' : 'info'),
          iconName: selected ? 'ios-checkmark-circle' : (row.version ? 'favorfill' : 'ios-radio-button-off'),
          iconSize: selected ? 22 : 20
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .history-panel {
    display: flex;
    justify-content: space-between;
    border: 1px solid #eeeeee;
    .left-fields {
      width: 45%;
      .history-wrap {
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 28px 24px 0;
        .item {
          cursor pointer;
          transition: background .2s;
          &:hover {
            background: #e6f2ff;
          }
          .time {
            font-weight: bold;
          }
        }
      }
      .page-wrap {
        padding: 8px;
        text-align: center;
      }
    }
    .right-panel {
      width: 55%;
      border-left: 1px solid #eeeeee;
      .result-wrap {
        padding: 24px;
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        .result {
          margin-top: 16px;
        }
        .source {
          border-top: 1px solid #eeeeee;
          margin-top: 16px;
          padding-top: 8px;
        }
      }
    }
  }
</style>
