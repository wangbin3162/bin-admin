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
        <b-icon v-if="calBtnLoading" name="loading2" color="#0d85ff"
          class="icon-is-rotating">
        </b-icon>
        <b-button type="text" @click="handleCalBtn" :disabled="calBtnLoading">
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
            :class="{ oneBg: rowIndex === colIndex }"
            @mouseenter="handleTdMouseenter">
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
        <b-button type="primary"
          @click="handleUseBtn">
          使用权重
        </b-button>
      </div>
    </b-collapse-wrap>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { matrixCalculate, saveMatrixData, getMatrixData } from '@/api/credit-rating/rating-model.api'
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
        mutationSource: null, // 导致curMatrixCol变动的来源
        crFlag: false, // 计算的一致性校验是否失败
        calBtnLoading: false,
        pIdCache: this.pId, // 用于curMatrixCol变动时判断是自身的变动还是其他层级的变动
        algorithmEnum: {
          hjf: '和积法',
          fgf: '方根法'
        },
        form: {
          id: '',
          modelId: this.modelId, // 模型id
          modelIndexId: '', // 父级维度、指标id
          algorithm: 'fgf', // 算法
          degree: 3, // 保留的小数位数
          item: '', // 暂时无用
          itemData: [] // 矩阵数据
        },
        matrixDataCache: [],
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
      curMatrixCol: { // curMatrixCol变动时构建矩阵图结构、数据
        handler (newVal) {
          if (newVal) {
            // 构建矩阵图使用的数据结构
            const { matrixData, weightList } = this.buildMatrixData(newVal)
            // 这里需要判断此次变动是自身层级的变动，还是层级切换的变动
            if (this.mutationSource === 'node-change') { // 自身变动
              if (matrixData.length === this.matrixDataCache.length) { // 判断结构是否相同，相同结构则取缓存
                this.form.itemData = this.matrixDataCache // 使用缓存数据
              } else {
                this.form.itemData = matrixData // 使用新数据
              }
            } else { // 节点切换
              this.form.itemData = matrixData // 使用新数据
            }
            this.list = weightList
            // 设置变动来源
            this.setMutationSource('node-change')
          }
        },
        deep: true
      },
      'form.itemData': {
        handler (newVal) {
          this.matrixDataCache = this.$util.deepClone(newVal)
        },
        deep: true
      }
    },
    created () {

    },
    mounted () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 计算按钮回调，维度指标不需要计算综合权重，指标类型需要计算综合权重，综合权重为判定权重乘以所有父级的权重。
       */
      async handleCalBtn () {
        this.calBtnLoading = true

        try {
          await this.validateMatrixData(this.form.itemData)

          this.form.modelIndexId = this.pId
          const { crFlag, vector } = await matrixCalculate(this.form)

          this.crFlag = crFlag // 矩阵图一致性校验flag

          if (this.crFlag) {
            for (let i = 0; i < this.list.length; i++) {
              const el = this.list[i]
              el.decisionWeight = Number((vector[i] * 100).toFixed(2))
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

            this.$message({ type: 'success', content: '操作成功' })
          } else { // 校验不通过则不填充判定权重，且后端不会保存矩阵图数据
            this.$message({ type: 'warning', content: '一致性校验出错，请重新配置比值' })
          }
        } catch (error) {
          console.error(error)
        }

        this.calBtnLoading = false
      },

      /**
       * @author haodongdong
       * @description 保存判定矩阵数据，暂时由外部组件调用
       */
      async saveMatrixData () {
        try {
          this.form.modelIndexId = this.pId
          console.log(this.form.itemData)
          await saveMatrixData(this.form)
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 获取保存的矩阵图数据
       * @param {string} modelId 模型id
       * @param {string} pId 所要保存数据的父节点的id
       */
      async getMatrixData (modelId, pId) {
        try {
          const res = await getMatrixData(modelId, pId)
          if (res) {
            this.form.id = res.id
            this.form.algorithm = res.algorithm
            this.form.degree = res.degree
            this.form.item = res.item
            this.form.itemData = JSON.parse(res.itemData)
          } else {
            this.form.id = ''
            this.form.algorithm = 'fgf'
            this.form.degree = 3
            this.form.item = ''
          }
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
      async handleUseBtn () {
        try {
          await this.validateWeightListData(this.list)
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
          this.$emit('use-weight', arr)
        } catch (error) {
          this.$message({ type: 'warning', content: error })
        }
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
            lastWeight: null,
            decisionWeight: null
          })
        }
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
      },

      /**
       * @author haodongdong
       * @description 验证权重设置列表内的判定权重是否必填
       * @param {Array} list 需要验证的数据
       * @returns {Promise}
       */
      async validateWeightListData (list) {
        return new Promise(async (resolve, reject) => {
          try {
            for (const item of list) {
              if (!item.decisionWeight) {
                let msg = '判定权重不能为空'
                throw msg
              }
            }
            resolve()
          } catch (error) {
            reject(error)
          }
        })
      },

      /**
       * @author haodongdong
       * @description 共外部组件使用，明确是谁导致了curMatrixCol变动
       * @param {string} mutationSource
       */
      setMutationSource (mutationSource) {
        this.mutationSource = mutationSource
      },

      handleTdMouseenter () {

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
