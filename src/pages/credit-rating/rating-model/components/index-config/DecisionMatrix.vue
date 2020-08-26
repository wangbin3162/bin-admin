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
          <b-input-number v-model="form.degree" style="width: 100%;"
            :max="4" :min="0" :precision="0">
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

    <b-collapse-wrap title="权重设置" collapse>
      <b-table :columns="columns" :data="list" size="small">
        <template v-slot:lastWeight="{ row }">
          <span v-if="row.indexType !== 'Index'">无</span>
          <span v-else>
            {{ row.lastWeight ? row.lastWeight + '%' : '暂无' }}
          </span>
        </template>

        <template v-slot:decisionWeight="{ index }">
          <b-input-number v-model="list[index].decisionWeight"
            :max="100" :min="1" :precision="2">
          </b-input-number>
          <span>%</span>
        </template>
      </b-table>

      <div flex="main:left" class="mt-20">
        <b-button type="primary" :disabled="!useStatus"
          @click="handleUseBtn">
          使用权重
        </b-button>
      </div>
    </b-collapse-wrap>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { matrixCalculate } from '@/api/credit-rating/rating-model.api'
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
        default: null
      },
      pWeight: {
        type: Number,
        default: null
      },
      pWeights: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      MatrixInput
    },
    data () {
      return {
        crfFlag: false, // 计算的一致性校验是否失败
        useStatus: false,
        algorithmEnum: {
          hjf: '和积法',
          fgf: '方根法'
        },
        form: {
          modelId: this.modelId, // 模型id
          modelIndexId: '', // 父级维度、指标id
          algorithm: 'fgf', // 算法
          degree: 3, // 保留的小数位数
          item: null, // 暂时无用
          itemData: [] // 矩阵数据
        },
        list: [], // 权重设置的list
        columns: [ // 权重设置的columns
          { type: 'index', width: 50 },
          { title: '指标名称', key: 'indexName', align: 'center' },
          { title: '综合权重', slot: 'lastWeight', align: 'center' },
          { title: '判定权重', slot: 'decisionWeight', align: 'center' }
        ]
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
          const { matrixData, weightList } = this.buildMatrixData(newVal)
          this.form.itemData = matrixData
          this.list = weightList
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
      async handleCalBtn () {
        try {
          await this.validateMatrixData(this.form.itemData)

          this.form.modelIndexId = this.pId
          const { crFlag, vector } = await matrixCalculate(this.form)

          for (let i = 0; i < this.list.length; i++) {
            const el = this.list[i]
            el.decisionWeight = vector[i] * 100
            el.decisionWeight = Number(el.decisionWeight.toFixed(2))
            el.lastWeight = el.decisionWeight
            if (el.indexType === 'Index') {
              for (const weight of this.pWeights) {
                el.lastWeight *= weight
              }
              el.lastWeight *= this.pWeight
              el.lastWeight /= 100
              el.lastWeight = el.lastWeight.toFixed(2)
            }
          }

          this.crfFlag = Boolean(crFlag)
          this.useStatus = true
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          console.error(error)
        }
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
       * @description 使用权重按钮回调
       */
      handleUseBtn () {
        const arr = []
        for (const item of this.list) {
          if (item.indexType === 'Index') {
            arr.push({
              lastWeight: item.lastWeight,
              decisionWeight: item.decisionWeight
            })
          } else {
            arr.push({
              decisionWeight: item.decisionWeight
            })
          }
        }
        console.log(JSON.stringify(arr))
        this.$emit('use-weight', arr)
      },

      /**
       * @author haodongdong
       * @description 构建矩阵图数据，用于绑定操作与提交，构建权重设置列表，用于调试权重操作
       * @param {Array} curMatrixCol 当前选择节点的子节点数组，用于构建矩阵数据
       * @returns {Array}
       */
      buildMatrixData (curMatrixCol) {
        const matrixData = []
        const weightList = []
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

          weightList.push({
            ...this.$util.deepClone(curMatrixCol[i]),
            decisionWeight: null
          })
        }
        console.log(matrixData)
        return { matrixData, weightList }
      },

      /**
       * @author haodongdong
       * @description 验证矩阵数据
       * @param {Array} matrixData 矩阵数据
       * @returns {Promise}
       */
      async validateMatrixData (matrixData) {
        return new Promise(async (resolve, reject) => {
          try {
            const reg = /[1-9]\/[1-9]/
            for (const row of matrixData) {
              for (const col of row) {
                if (col !== '1') {
                  const res = reg.test(col)
                  if (!res) {
                    const msg = '请正确填写判定矩阵内的数据'
                    throw msg
                  }
                }
              }
            }
            resolve()
          } catch (error) {
            this.$message({ type: 'warning', content: error })
            reject(error)
          }
        })
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
