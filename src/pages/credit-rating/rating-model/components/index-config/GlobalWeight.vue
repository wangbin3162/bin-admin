<template>
  <div class="global-weight">
    <!-- <table class="table">
      <tr v-for="n in 4" :key="n">
        <th>标题</th>
      </tr>
    </table> -->
    <table class="table">
      <tr>
        <td rowspan="5">
          监督检查
        </td>
        <td rowspan="2">维度1</td>
        <td rowspan="2">净资产收益率</td>
        <td>操作</td>
      </tr>
      <tr>
        <!-- <td>row</td> -->
        <!-- <td>node</td> -->
        <!-- <td>col</td> -->
        <td>操作</td>
      </tr>
      <tr>
        <!-- <td>row</td> -->
        <td>node</td>
        <td>col</td>
        <td>操作</td>
      </tr>
      <tr>
        <!-- <td>row</td> -->
        <td>node</td>
        <td>col</td>
        <td>操作</td>
      </tr>
      <tr>
        <!-- <td>row</td> -->
        <td>node</td>
        <td>col</td>
        <td>操作</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { getGlobalWeight } from '@/api/credit-rating/rating-model.api'

  export default {
    name: 'GolbalWeight',
    props: {
      modelId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        list: [
          [
              {
                  'id': 'c0a800f172971f2b817297b1668d0001',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '监督检查',
                  'parentIndex': null,
                  'indexType': 'Dimension',
                  'calIndexId': null,
                  'weight': 80,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 5,
                  'weights': null
              },
              {
                  'id': 'c0a800157405167d817405bc2c070003',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '维度1',
                  'parentIndex': 'c0a800f172971f2b817297b1668d0001',
                  'indexType': 'Dimension',
                  'calIndexId': null,
                  'weight': 60,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 2,
                  'weights': null
              },
              {
                  'id': 'c0a800157405167d817405bcd6e60005',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '净资产收益率',
                  'parentIndex': 'c0a800157405167d817405bc2c070003',
                  'indexType': 'Index',
                  'calIndexId': 'c0a800f172a012c18172a14689420089',
                  'weight': 40,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': [
                      80,
                      60
                  ]
              }
          ],
          [
              {
                  'id': 'c0a800157405167d817405bcd7250006',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '产业政策',
                  'parentIndex': 'c0a800157405167d817405bc2c070003',
                  'indexType': 'Index',
                  'calIndexId': 'c0a800f172a012c18172a173f05d0115',
                  'weight': 60,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': [
                      80,
                      60
                  ]
              }
          ],
          [
              {
                  'id': 'c0a800157405167d817405bc2c1f0004',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '维度2',
                  'parentIndex': 'c0a800f172971f2b817297b1668d0001',
                  'indexType': 'Dimension',
                  'calIndexId': null,
                  'weight': 40,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 3,
                  'weights': null
              },
              {
                  'id': 'c0a800157405167d817405bd37ff0007',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '与银行是否有业务关系',
                  'parentIndex': 'c0a800157405167d817405bc2c1f0004',
                  'indexType': 'Index',
                  'calIndexId': 'c0a800f172a012c18172a172f4cf010e',
                  'weight': 50,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': [
                      80,
                      40
                  ]
              }
          ],
          [
              {
                  'id': 'c0a800157405167d817405bd381e0008',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '与企业经营方针相适应的组织结构',
                  'parentIndex': 'c0a800157405167d817405bc2c1f0004',
                  'indexType': 'Index',
                  'calIndexId': 'c0a800f172a012c18172a17054e800f2',
                  'weight': 25,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': [
                      80,
                      40
                  ]
              }
          ],
          [
              {
                  'id': 'c0a800157405167d817405bd38420009',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '法人及其他组织注册资本总和',
                  'parentIndex': 'c0a800157405167d817405bc2c1f0004',
                  'indexType': 'Index',
                  'calIndexId': 'c0a800ef729314aa8172938030710005',
                  'weight': 25,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': [
                      80,
                      40
                  ]
              }
          ],
          [
              {
                  'id': 'c0a800157405167d817405ba96300000',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '监督检查2',
                  'parentIndex': null,
                  'indexType': 'Dimension',
                  'calIndexId': null,
                  'weight': 20,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 2,
                  'weights': null
              },
              {
                  'id': 'c0a800157405167d817405bb2d6f0001',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '维度1',
                  'parentIndex': 'c0a800157405167d817405ba96300000',
                  'indexType': 'Dimension',
                  'calIndexId': null,
                  'weight': 50,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': null
              },
              {
                  'id': 'c0a800157405167d817405bd72e7000a',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '产业政策',
                  'parentIndex': 'c0a800157405167d817405bb2d6f0001',
                  'indexType': 'Index',
                  'calIndexId': 'c0a800f172a012c18172a173f05d0115',
                  'weight': 100,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': [
                      50,
                      20
                  ]
              }
          ],
          [
              {
                  'id': 'c0a800157405167d817405bb2d840002',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '维度2',
                  'parentIndex': 'c0a800157405167d817405ba96300000',
                  'indexType': 'Dimension',
                  'calIndexId': null,
                  'weight': 50,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': null
              },
              {
                  'id': 'c0a800157405167d817405bda2d4000b',
                  'modelId': 'c0a800f172971f2b817297b166630000',
                  'indexName': '产业政策',
                  'parentIndex': 'c0a800157405167d817405bb2d840002',
                  'indexType': 'Index',
                  'calIndexId': 'c0a800f172a012c18172a173f05d0115',
                  'weight': 100,
                  'indexDesc': '',
                  'lastWeight': null,
                  'rowSpan': 1,
                  'weights': [
                      50,
                      20
                  ]
              }
          ]
        ]
      }
    },
    created () {
      // this.getGlobalWeight(this.modelId)
      this.buildCol()
    },
    methods: {
      async getGlobalWeight (modelId) {
        try {
          const res = await getGlobalWeight(modelId)
          console.log(res)
        } catch (error) {
          console.error(error)
        }
      },

      buildCol () {
        const arr = []
        this.list.forEach(item => {
          arr.push(item.length)
        })
        const maxLength = Math.max(...arr)
        console.log(maxLength)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .global-weight {
    padding: 20px;

    .table {
      table-layout : fixed;
      border-collapse: collapse;
      margin: 0 auto;
      text-align: center;
      width: 100%;

      tr:first-child {
        background-color: #fafafa;
      }

      td, th {
        padding: 10px;
        border: 1px solid #cad9ea;
        border: 1px solid #e8eaec;
        color: #666;
        height: 40px;
      }

      .con {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .oneBg {
        background-color: #e9f8fc;
      }

      td:nth-child(odd), th:nth-child(odd) {

      }
      td:nth-child(even), th:nth-child(even) {

      }
    }
  }
</style>
