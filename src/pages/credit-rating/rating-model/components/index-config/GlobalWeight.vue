<template>
  <div class="global-weight">
    <table class="table">
      <tr>
        <th v-for="col in cols" :key="col">
          {{ col }}
        </th>
      </tr>

      <tr v-for="(row, rowIndex) in list" :key="rowIndex">
        <template v-for="(col, colIndex) in row" >

          <template v-if="colIndex === row.length - 1">
            <td :key="colIndex">
              <b-input-number v-model="col.lastWeight"
                :max="100" :min="1" :precision="2">
              </b-input-number>%
            </td>
          </template>

          <td v-else :key="col.id" :rowspan="col.rowSpan">
            {{ col.indexName }}
          </td>

        </template>
      </tr>
    </table>

    <p>注：此处总额和权重总计，还差</p>

    <div flex="main:center" class="mt-20">
      <b-button type="primary">
        保存
      </b-button>
      <b-button>
        重新加载
      </b-button>
    </div>
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
        list: [],
        cols: []
      }
    },
    created () {
      this.getGlobalWeight(this.modelId)
    },
    methods: {
      async getGlobalWeight (modelId) {
        try {
          const res = await getGlobalWeight(modelId)
          this.buildCol(res)
          res.forEach(row => {
            row.push({
              lastWeight: row[row.length - 1].lastWeight
            })
          })
          this.list = res
        } catch (error) {
          console.error(error)
        }
      },

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
    }
  }
</style>
