<template>
  <div class="index-manage-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap :transparent="true">
        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>

      <b-collapse-wrap title="基本详情" collapse>
        <div style="position: relative;">
          <b-loading fix show-text="loading" v-if="loading"></b-loading>
          <v-key-label label="指标名称" is-half is-first>
            {{ detail.indexName }}
          </v-key-label>
          <v-key-label label="指标编码" is-half>
            {{ detail.indexCode }}
          </v-key-label>
          <v-key-label label="指标性质" is-half is-first>
            {{ natureEnum[detail.indexKind] }}
          </v-key-label>
          <v-key-label label="指标类型" is-half>
            {{ detail.bizTypeName }}
          </v-key-label>
          <v-key-label label="数据类型" is-half is-first>
            {{ dataTypeEnum[detail.dataType] }}
          </v-key-label>
          <v-key-label label="计算类型" is-half>
            {{ calcTypeEnum[detail.calClass] }}
          </v-key-label>
          <v-key-label label="变量" is-half is-first>
            {{ detail.varName }}
          </v-key-label>
          <v-key-label label="标度" is-half>
            {{ scaleEnum[detail.indexScale] }}
          </v-key-label>
          <v-key-label label="有效期字段" is-half is-first>
            {{ detail.validParamName }}
          </v-key-label>
          <v-key-label label="有效期" is-half>
            {{ detail.validMonth }} 月
          </v-key-label>
          <v-key-label label="描述" is-bottom>
            {{ detail.indexDesc }}
          </v-key-label>
        </div>
      </b-collapse-wrap>

      <b-collapse-wrap title="规则配置" collapse :value="!loading">
        <b-table :columns="columns" :data="rules" size="small"></b-table>
      </b-collapse-wrap>

      <b-collapse-wrap title="参数配置" collapse :value="!loading">
        <b-table id="customTable" :columns="columnsSource" :data="resources">
          <template v-slot:paraType="{ row }">
            {{ paramTypeEnum[row.paraType] }}
          </template>
        </b-table>
      </b-collapse-wrap>

    </page-header-wrap>
  </div>
</template>

<script>
  import { getIndeManageDetail } from '../../../api/credit-rating/index-manage.api'

  export default {
    name: 'IndexManageDetail',
    props: [
      'title',
      'id',
      'natureEnum',
      'dataTypeEnum',
      'calcTypeEnum',
      'scaleEnum',
      'personClassEnum',
      'resPropertyEnum',
      'paramTypeEnum'
    ],
    data () {
      return {
        loading: false,
        dataTypeCustomEnum: {
          string: '字符型',
          number: '数值型',
          money: '货币型',
          boolean: '逻辑型',
          date: '日期型',
          datetime: '日期时间型',
          text: '备注型'
        },
        detail: {},
        rules: [],
        resources: [],
        columns: [],
        columnsSource: [
          {
            type: 'expand',
            width: 50,
            className: 'expand-custom-column', // 用于查找需要点击的列的自定义class
            render: (h, { row, index }) => {
              // 这里渲染函数如果添加参数，则jsx内的class会脱离于当前样式作用域 <style lang="stylus" scoped>
              // 需要去除scoped样式才生效
              let sourceInfoTemplate = <div class="table-con">
                    <b-row class="title">
                      <b-col span={6}>资源名称</b-col>
                      <b-col span={6}>主体类别</b-col>
                      <b-col span={6}>资源性质</b-col>
                      <b-col span={6}>描述</b-col>
                    </b-row>

                    <div class="body">
                      {
                        Object.keys(row.source).map(key => {
                          return (
                            <b-row class="row">
                              <b-col span={6}>{ row.source[key].resourceName }</b-col>
                              <b-col span={6}>{ this.personClassEnum[row.source[key].personClass] }</b-col>
                              <b-col span={6}>{ this.resPropertyEnum[row.source[key].resProperty] }</b-col>
                              <b-col span={6}>
                                { row.source[key].resourceDesc === '' ? '暂无描述' : row.source[key].resourceDesc}
                              </b-col>
                            </b-row>
                          )
                        })
                      }
                    </div>
                  </div>
              let infoItemTempLate = <div class="table-con">
                  <b-row class="title">
                    <b-col span={6}>信息项名称</b-col>
                    <b-col span={6}>标题</b-col>
                    <b-col span={6}>数据类型</b-col>
                    <b-col span={6}>所属资源</b-col>
                  </b-row>

                  <div class="body">
                    {
                      Object.keys(row.info).map(key => {
                        return (
                          <b-row class="row">
                            <b-col span={6}>{row.info[key].fieldName}</b-col>
                            <b-col span={6}>{row.info[key].fieldTitle}</b-col>
                            <b-col span={6}>{this.dataTypeCustomEnum[row.info[key].dataType]}</b-col>
                            <b-col span={6}>{row.info[key].resourceName}</b-col>
                          </b-row>
                        )
                      })
                    }
                  </div>
                </div>
              const template = row.paraType === 'S' ? sourceInfoTemplate : infoItemTempLate
              return (
                <div class="expandRow">
                  <div class="headers" flex="main:justify">
                    <h4>
                      { row.paraType === 'S' ? '资源' : '信息项'}
                    </h4>
                  </div>
                  { template }
                </div>
              )
            }
          },
          { type: 'index', width: 50, align: 'center' },
          { title: '参数名称', key: 'paraName', align: 'center' },
          { title: '参数类型', slot: 'paraType', align: 'center' },
          { title: '参数描述', key: 'paraDesc', align: 'center', ellipsis: true, tooltip: true },
          { title: '缺省值', key: 'defaultValue', align: 'center' }
        ],
        domList: []
      }
    },
    created () {
      this.getIndeManageDetail()
    },
    methods: {
      async getIndeManageDetail () {
        this.loading = true
        try {
          const { index, resources, rules } = await getIndeManageDetail(this.id)
          this.initColumns(index.dataType)
          this.detail = index
          this.rules = rules
          this.resources = resources
          this.$nextTick(() => {
            this.getExpandColumn()
            this.hackClick(0)
          })
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载详情失败', desc: error })
        }
        this.loading = false
      },
      // 根据数据类型初始化不同columns
      initColumns (nature) {
        // S 字符串 N 数值
        if (nature === 'S') {
          this.columns = [
            { type: 'index', width: 50 },
            { title: '指标值', key: 'itemValue', align: 'center' },
            { title: '指标描述', key: 'itemDesc', align: 'center' },
            { title: '得分', key: 'score', align: 'center' }
          ]
        } else {
          this.columns = [
            { type: 'index', width: 50 },
            { title: '指标值', key: 'itemValue', align: 'center' },
            { title: '指标描述', key: 'itemDesc', align: 'center' },
            { title: '得分', key: 'score', align: 'center' }
          ]
        }
      },
      // 获取用于点击的可展开列的dom元素集合
      getExpandColumn () {
        this.domList = []
        const table = document.getElementById('customTable')
        const expandColumnList = table.getElementsByClassName('expand-custom-column')
        for (const item of expandColumnList) {
          const el = item.getElementsByTagName('div')[0].getElementsByTagName('div')[0]
          this.domList.push(el)
        }
        this.domList.shift() // 去除标题中的列
      },
      // hack的方式，使用原生js的click()主动触发对应行的展开操作
      hackClick (index) {
        if (this.domList.length > 0) {
          // 阻止bin-ui自身的报错，猜测可能是bin-in的dom渲染没有结束
          // 或者是任务队列没执行完触发click导致没获取的需要的数据而json报错
          setTimeout(() => {
            const el = this.domList[index]
            const str = el.className
            // 已展开则不点击
            if (!str.includes('bin-table-cell-expand-expanded')) el.click()
          }, 0)
        }
      }
    }
  }
</script>

<style lang="stylus">
.index-manage-detail {
  .expandRow {
    .headers {
      font-size: 13.5px;
      span {
        cursor: pointer;
      }
      .not-clear {
        cursor: not-allowed;
        color: #C0C4CC;
      }
    }
    .table-con {
      margin-top: 10px;
      font-size: 13px;

      .title {
        color: #909399;
        text-align: center;
      }
      .body {
        margin-top: 10px;
        text-align: center;
      }
      .row {
        margin-top: 7px;
      }
    }
  }
  td.bin-table-expanded-cell {
    background: #f0f2f5;
  }
}
</style>
