<template>
  <div class="decision-matrix">
    <b-form :label-width="70">
      <div flex="box:mean">
        <b-form-item label="计算方法" class="mr-15">
          <b-select v-model="form.algorithm">
            <b-option v-for="(value, key) in algorithmEnum" :key="key"
              :value="key">
              {{ value }}
            </b-option>
          </b-select>
        </b-form-item>

        <b-form-item label="小数位数">
          <b-input-number style="width: 100%;">
          </b-input-number>
        </b-form-item>
      </div>
    </b-form>

    <b-collapse-wrap title="比值设置" collapse>
      <div slot="right">
        <b-button type="text" @click="handleCalBtn">
          计算
        </b-button>
      </div>

      <table class="table">
        <tr>
          <th>维度\维度</th>
          <th v-for="item in curMatrixCol" :key="item.id">{{ item.indexName }}</th>
        </tr>

        <tr v-for="(item, rowIndex) in curMatrixCol" :key="item.id">
          <th>{{ item.indexName }}</th>
          <td v-for="(colData, colIndex) in form.itemData" :key="colIndex"
            :class="{ oneBg: rowIndex === colIndex }">
            <template v-if="rowIndex === colIndex">
              <span>1</span>
            </template>

            <template v-else>
              <matrix-input v-model="form.itemData[rowIndex][colIndex]"
                @input="handleMatrixInput($event, rowIndex, colIndex)">
              </matrix-input>
            </template>
          </td>
        </tr>
      </table>
    </b-collapse-wrap>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import MatrixInput from './MatrixInput'

  export default {
    name: 'DecisionMatrix',
    props: {
      modelId: {
        type: String,
        required: true
      },
      pId: {
        type: String,
        required: true
      }
    },
    components: {
      MatrixInput
    },
    data () {
      return {
        algorithmEnum: {
          hjf: '和积法',
          fgf: '方根法'
        },
        form: {
          modelId: this.modelId, // 模型id
          modelIndexId: '', // 父级维度、指标id
          algorithm: 'fgf', // 算法
          degree: 3, // 保留的小数位数
          item: '', // 暂时无用
          itemData: [] // 矩阵数据
        },
        list: []
      }
    },
    computed: {
      ...mapState({
        curMatrixCol: state => state.ratingModel.curMatrixCol
      })
    },
    watch: {
      curMatrixCol: {
        handler (newVal) {
          this.form.itemData = this.buildMatrixData(newVal)
        }
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 计算按钮回调
       */
      handleCalBtn () {
        console.log(this.form.itemData)
      },

      /**
       * @author haodongdong
       * @description matrix-input组件input事件回调，input事件只会在被除数、除数都有值的时候正常发出。
       * @param {string} val
       * @param {number} rowIndex 绑定的数据在矩阵图中的纵轴坐标
       * @param {number} colIndex 绑定的数据在矩阵图中的横轴坐标
       */
      handleMatrixInput (val, rowIndex, colIndex) {
        const strArr = val.split('/')
        // 同步对角线数据
        this.form.itemData[colIndex][rowIndex] = strArr[1] + '/' + strArr[0]
      },

      /**
       * @author haodongdong
       * @description 构建矩阵图数据，用于绑定操作与提交
       * @param {Array} curMatrixCol 当前选择节点的子节点数组，用于构建矩阵数据
       */
      buildMatrixData (curMatrixCol) {
        const matrixData = []
        const length = curMatrixCol.length
        for (let i = 0; i < length; i++) {
          const subArr = []
          for (let j = 0; j < length; j++) {
            if (i === j) {
              subArr.push('1')
            } else {
              subArr.push('/')
            }
          }
          matrixData.push(subArr)
        }
        console.log(matrixData)
        return matrixData
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .decision-matrix {
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
      // tr:nth-child(odd) {
      //   background: #f5fafa;
      // }
      // tr:nth-child(even) {
      //   background: #ffffff;
      // }
    }
 }
</style>
