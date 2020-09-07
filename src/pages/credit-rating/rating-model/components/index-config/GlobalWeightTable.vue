<template>
  <div class="global-weight-table">
    <div class="con">
      <b-loading fix show-text="加载中...." v-if="listLoading"></b-loading>
      <table class="table">
        <tr>
          <th v-for="col in cols" :key="col">
            {{ col }}
          </th>
        </tr>

        <tr v-for="(row, rowIndex) in list" :key="rowIndex">
          <template v-for="(col, colIndex) in row" >

            <template v-if="colIndex === row.length - 1 && col.indexType === 'Index'">
              <td :key="colIndex">
                {{ col.lastWeight }}%
              </td>
            </template>

            <td v-else-if="colIndex !== row.length - 1 || row.length === 1" :key="col.id" :rowspan="col.rowSpan">
              {{ col.indexName }}
              <br />
              <span class="weight">
                {{ col.weight }}%
              </span>
            </td>

          </template>
        </tr>
      </table>
    </div>

    <p v-if="tip">
      注：此处综合权重总计必须为<span>100%</span>
      <template v-if="difference !== 0">
        ，还差<span>{{ difference }}%</span>
      </template>
    </p>
  </div>
</template>

<script>
  import Big from 'big.js'
  import { getGlobalWeight } from '@/api/credit-rating/rating-model.api'

  export default {
    name: 'GlobalWeightTable',
    props: {
      modelId: {
        type: String,
        required: true
      },
      tip: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        listLoading: false,
        list: [],
        cols: []
      }
    },
    computed: {
      difference () { // 计算差值
        let res = 0
        const indexList = []
        this.list.forEach(row => { // 找到所有指标元素
          const lastEl = row[row.length - 1]
          if (lastEl.indexType === 'Index') indexList.push(lastEl)
        })
        res = indexList.reduce((total, curItem) => {
          return Number(Big(total).plus(curItem.lastWeight || 0))
        }, 0)
        return Number(Big(100).minus(res))
      }
    },
    created () {
      this.getGlobalWeight(this.modelId)
    },
    methods: {
      /**
       * @author haodongdong
       * @description 后去全局权重的列表
       * @param {string} modelId 模型Id
       */
      async getGlobalWeight (modelId) {
        this.listLoading = true
        try {
          const res = await getGlobalWeight(modelId)

          // 用于重新加载后清空原有数据
          this.list = []
          this.cols = []

          this.buildCol(res)
          res.forEach(row => { // 拼接需要绑定综合权重的指标数据
            const lastEl = row[row.length - 1]
            if (lastEl.indexType === 'Index') row.push(lastEl)
          })
          this.list = res
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      },

      /**
       * @author haodongdong
       * @description 构建table的展示列
       * @param {Array} list 列表数据
       */
      buildCol (list) {
        const arr = []
        list.forEach(row => {
          arr.push(row.length)
        })
        const maxLength = Math.max(...arr)
        for (let i = 0; i < maxLength; i++) {
          this.cols.push(`${i + 1}级指标及权重`)
        }
        this.cols.push(`综合权重`)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .global-weight-table {
     width: 100%;

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

      td {
        .weight {
          font-size: 13.5px;
          color: rgba(0, 0, 0, 0.75);
        }
      }

      tr:hover {
        td {
          background: #f4f5f6;
          transition: background 0.7s;
        }
      }

      td:nth-child(odd), th:nth-child(odd) {

      }
      td:nth-child(even), th:nth-child(even) {

      }
    }

    p {
      margin: 10px 0;
      padding: 9px;
      height: 40px;
      text-align: left;
      background-color: #fafafa;

      span {
        color: #0d85ff;
      }
    }
  }
</style>
