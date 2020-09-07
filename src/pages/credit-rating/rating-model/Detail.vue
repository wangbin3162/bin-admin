<template>
  <div class="raring-model-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <div style="position: relative;">
          <b-loading fix show-text="加载中..." v-if="loading"></b-loading>
          <b-collapse-wrap title="基本信息" collapse>
            <div>
                <v-key-label label="模型名称" is-first is-half>{{ detailData.modelName }}</v-key-label>
                <v-key-label label="模型编码" is-half>{{ detailData.modelCode }}</v-key-label>
                <v-key-label label="主体类别" is-first is-half>{{ personClassEnum[detailData.personClass] }}</v-key-label>
                <v-key-label label="等级名称" is-half>{{ detailData.ratingName }}</v-key-label>
                <!-- <v-key-label label="启用/禁用" is-first is-half>
                  <b-tag :type="detailData.modelStatus === 'Y' ? 'primary' : 'warning'" size="mini">
                    {{ statusEnum[detailData.modelStatus] }}
                  </b-tag>
                </v-key-label>
                <v-key-label label="缺省模型" is-half>
                  <b-tag :type="detailData.sysDefault === '1' ? 'primary' : 'warning'" size="mini">
                    {{ defaultEnum[detailData.sysDefault] }}
                  </b-tag>
                </v-key-label> -->
                <v-key-label label="描述" is-bottom>{{ detailData.modelDesc }}</v-key-label>
              </div>
          </b-collapse-wrap>

          <b-collapse-wrap title="指标信息" collapse>
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

            <p>
              注：此处综合权重总计必须为<span>100%</span>
              <template v-if="difference !== 0">
                ，还差<span>{{ difference }}%</span>
              </template>
            </p>

          </b-collapse-wrap>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import Big from 'big.js'
  import { getRatingModeDetail, getGlobalWeight } from '@/api/credit-rating/rating-model.api'

  export default {
    name: 'RatingModelDetail',
    props: ['title', 'id'],
    data () {
      return {
        loading: false,
        listLoading: false,
        detailData: {},
        list: [],
        cols: []
      }
    },
    computed: {
      personClassEnum () {
        return this.$store.state.ratingModel.personClassEnum
      },
      statusEnum () { // 状态枚举
        return this.$store.state.ratingModel.statusEnum
      },
      defaultEnum () { // 缺省模型枚举
        return this.$store.state.ratingModel.defaultEnum
      },
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
      this.getRatingModeDetail()
      this.getGlobalWeight(this.id)
    },
    methods: {
      async getRatingModeDetail () {
        this.loading = true
        try {
          const res = await getRatingModeDetail(this.id)
          this.detailData = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '获取详情失败', desc: error })
        }
        this.loading = false
      },

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

          console.log(this.$util.deepClone(this.list))
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
.raring-model-detail {
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
