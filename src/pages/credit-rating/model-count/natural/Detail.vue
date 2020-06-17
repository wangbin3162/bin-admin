<template>
  <div class="model-count-legal-detaiil">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="自然人详情" collapse>
          <div style="position: relative;">
            <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
            <table class="table">
              <tr>
                <td colspan="6">
                  <h4>基本信息</h4>
                </td>
              </tr>
              <tr>
                <td>姓名：</td>
                <td>{{ detail.natBaseInfo.name }}</td>
                <td>性别：</td>
                <td>{{ detail.natBaseInfo.xb }}</td>
                <td>民族：</td>
                <td>{{ detail.natBaseInfo.mz }}</td>
              </tr>
                <tr>
                <td>曾用名：</td>
                <td></td>
                <td>证件类型：</td>
                <td>{{ detail.natBaseInfo.idTypeName }}</td>
                <td>证件号码</td>
                <td>{{ detail.natBaseInfo.idCode }}</td>
              </tr>
              <tr>
                <td>外文姓：</td>
                <td>{{ detail.natBaseInfo.wwx }}</td>
                <td>外文名：</td>
                <td>{{ detail.natBaseInfo.wwm }}</td>
                <td>国籍地区：</td>
                <td>{{ detail.natBaseInfo.gjdq }}</td>
              </tr>
              <tr>
                <td>出生日期：</td>
                <td>{{ detail.natBaseInfo.csrq }}</td>
                <td>人员识别号：</td>
                <td>{{ detail.natBaseInfo.idTypeName }}</td>
              </tr>
              <tr>
                <td>户籍地派出所：</td>
                <td></td>
                <td>所属辖区编码：</td>
                <td></td>
                <td>户籍地派出所编码：</td>
                <td></td>
              </tr>
              <tr>
                <td>户籍地址：</td>
                <td>{{ detail.natBaseInfo.hjdz }}</td>
                <td>居住地址：</td>
                <td>{{ detail.natBaseInfo.hjdz }}</td>
                <td>户籍号码：</td>
                <td>{{ detail.natBaseInfo.hh }}</td>
              </tr>
              <tr>
                <td>签发机关：</td>
                <td>{{ detail.natBaseInfo.qfjg }}</td>
                <td>签发日期：</td>
                <td>{{ detail.natBaseInfo.qfrq }}</td>
                <td>登记状态：</td>
                <td>{{ detail.natBaseInfo.djzt }}</td>
              </tr>
              <tr>
                <!-- <td>汉语拼音：</td>
                <td></td>
                <td>拼音字母：</td>
                <td></td> -->
                <td>与户主关系</td>
                <td>{{ detail.natBaseInfo.yhzgx }}</td>
              </tr>
              <!-- <tr>
                <td>户主标志：</td>
                <td></td>
                <td>户口类型：</td>
                <td></td>
                <td>户籍号码：</td>
                <td>{{ detail.natBaseInfo.hh }}</td>
              </tr> -->
              <!-- <tr>
                <td>户籍地门牌号：</td>
                <td></td>
                <td>宗教信仰：</td>
                <td></td>
              </tr> -->
              <tr>
                <td colspan="6">
                  <b-divider></b-divider>
                </td>
              </tr>
              <tr>
                <td>
                  <h4 style="font-size: 14px;">系统信息</h4>
                </td>
              </tr>
              <tr>
                <td>采集人员：</td>
                <td>{{ detail.natBaseInfo.createName }}</td>
                <td>采集部门：</td>
                <td>{{ detail.natBaseInfo.createDeptName }}</td>
                <td>采集时间：</td>
                <td>
                  {{ $util.parseTime(detail.natBaseInfo.createDate, '{y}-{m}-{d} {h}:{i}:{s}') }}
                </td>
              </tr>
            </table>
          </div>
        </b-collapse-wrap>

        <b-collapse-wrap title="方案计算结果" collapse :value="!loading">
          <table class="table">
            <tr>
              <td>所属方案：</td>
              <td>{{ detail.modelName }}</td>
              <td>信用主体：</td>
              <td>{{ detail.natBaseInfo.name }}</td>
              <td>证件号码：</td>
              <td>{{ detail.natBaseInfo.idCode }}</td>
            </tr>
            <tr>
              <td>信用级别：</td>
              <td>{{ detail.levelCode }}</td>
              <td>方案得分：</td>
              <td>{{ detail.score }}</td>
              <td>结果状态：</td>
              <td></td>
            </tr>
            <tr>
              <td>评级人员：</td>
              <td></td>
              <td>评级部门：</td>
              <td></td>
              <td>评级日期：</td>
              <td>
                {{ $util.parseTime(detail.createDate, '{y}-{m}:{d} {h}:{i}:{s}') }}
              </td>
            </tr>
            <tr>
              <td>评级描述：</td>
              <td></td>
            </tr>
          </table>
        </b-collapse-wrap>

        <b-collapse-wrap title="信用信息详情" collapse :value="!loading">
          <b-row class="mb-15">
            <b-col span="12" class="field">
              <label>信用主体：</label>
              <p class="con">{{ detail.natBaseInfo.name }}</p>
            </b-col>
            <b-col span="6" class="field">
              <label>信用得分：</label>
              <p class="con">{{ detail.score }}</p>
            </b-col>
            <b-col span="6" class="field">
              <label>信用级别：</label>
              <p class="con">{{ detail.levelCode }}</p>
            </b-col>
          </b-row>

          <b-table :columns="columns" :data="list" size="small" class="mb-15">
          </b-table>
          <div flex="main:right">
            <b-page :total="total" :current.sync="query.page"
              show-total size="small"
              @on-change="handleCurrentChange"></b-page>
          </div>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getCreditInfo, getNaturalDetail } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'ModelCountNaturalDetail',
    props: [
      'title',
      'id',
      'personId'
    ],
    data () {
      return {
        loading: false,
        collapseValue: [], // 控制手风琴展开
        detail: {
          natBaseInfo: {}
        },
        query: {
          id: this.id,
          page: 1
        },
        total: 0,
        list: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '指标名称', key: 'indexName', align: 'center' },
          { title: '指标得分', key: 'score', align: 'center' },
          { title: '事件描述', key: 'valDesc', align: 'center' }
        ]
      }
    },
    created () {
      this.getCreditInfo(this.query)
      this.getNaturalDetail(this.id)
    },
    methods: {
      // 分页按钮切换回调
      handleCurrentChange (page) {
        this.query.page = page
        this.getCreditInfo(this.query)
      },
      // 获取自然人详情
      async getNaturalDetail (id) {
        this.loading = true
        try {
          const res = await getNaturalDetail(id)
          this.detail = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载失败', desc: error })
        }
        this.loading = false
        this.collapseValue = ['baseInfo', 'countResInfo', 'creditInfo']
      },
      async getCreditInfo (query) {
        try {
          const res = await getCreditInfo(query)
          this.list = res.rows
          this.total = res.total
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .model-count-legal-detaiil {
    .table {
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;

      td {
        height: 40px;
        width: 16.6%;
        padding: 5px 12px
      }
    }

    .field {
      display: flex;
      label {
        width: 116px;
        font-size: 13px;
      }
      .con {
        flex: auto;
        text-align: left
        font-size: 13px;
      }
    }

    .credit-info {

    }
  }
</style>
