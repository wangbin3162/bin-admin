<template>
  <div class="model-count-legal-detaiil">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="企业法人基本详情" collapse>
          <div style="position: relative;">
            <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
            <table class="table">
              <tr>
                <td colspan="6">
                  <h4>基本信息</h4>
                </td>
              </tr>
              <tr>
                <td>企业名称：</td>
                <td>{{ detail.legBaseInfo.compName }}</td>
                <td>统一社会信用代码：</td>
                <td>{{ detail.legBaseInfo.idCode }}</td>
                <td>住所：</td>
                <td>{{ detail.legBaseInfo.zs }}</td>
              </tr>
              <tr>
                <td>企业法人：</td>
                <td>{{ detail.legBaseInfo.fddbr }}</td>
                <td>法人证件类型：</td>
                <td>{{ detail.legBaseInfo.fddbrzjlx }}</td>
                <td>法人证件号码：</td>
                <td>{{ detail.legBaseInfo.fddbrzjhm }}</td>
              </tr>
              <tr>
                <td>登记机关：</td>
                <td>{{ detail.legBaseInfo.hsfs }}</td>
                <td>登记状态：</td>
                <td>{{ detail.legBaseInfo.hsfs }}</td>
                <td>企业类型：</td>
                <td>
                  {{ detail.legBaseInfo.lx }}
                </td>
              </tr>
              <tr>
                <td>成立日期：</td>
                <td>{{ detail.legBaseInfo.clrq }}</td>
                <td>核算方式：</td>
                <td>{{ detail.legBaseInfo.hsfs }}</td>
                <td>核准日期：</td>
                <td>{{ detail.legBaseInfo.hzrq }}</td>
              </tr>
              <tr>
                <td>实收资本(金)万元：</td>
                <td></td>
                <td>注册货币种类：</td>
                <td>{{ detail.legBaseInfo.zczbbz }}</td>
                <td>注册资本(金)万元：</td>
                <td>{{ detail.legBaseInfo.zczb }}</td>
              </tr>
              <tr>
                <td>投资国别：</td>
                <td>{{ detail.legBaseInfo.gb }}</td>
                <td>行业代码：</td>
                <td>{{ detail.legBaseInfo.hydm }}</td>
                <td>从业人数：</td>
                <td></td>
              </tr>
              <tr>
                <td>英文名称：</td>
                <td></td>
                <td>工商注册号：</td>
                <td></td>
              </tr>
              <tr>
                <td>负责人：</td>
                <td></td>
                <td>组织机构代码：</td>
                <td></td>
                <td>业务状态：</td>
                <td></td>
              </tr>
              <tr>
                <td>投资者人数：</td>
                <td></td>
                <td>负责人证件类型：</td>
                <td></td>
                <td>负责人证件号码：</td>
                <td></td>
              </tr>
              <tr>
                <td>企业地址：</td>
                <td></td>
                <td>联系电话：</td>
                <td></td>
                <td>邮政编码：</td>
                <td></td>
              </tr>
              <tr>
                <td>经营范围：</td>
              </tr>
              <tr>
                <td colspan="6">
                  {{ detail.legBaseInfo.jyfw }}
                </td>
              </tr>
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
                <td>{{ detail.legBaseInfo.createName }}</td>
                <td>采集部门：</td>
                <td>{{ detail.legBaseInfo.createDeptName }}</td>
                <td>采集时间：</td>
                <td>
                  {{ $util.parseTime(detail.legBaseInfo.createDate, '{y}-{m}-{d} {h}:{i}:{s}') }}
                </td>
              </tr>
            </table>
          </div>
        </b-collapse-wrap>

        <b-collapse-wrap title="方案计算结果" collapse :value="!loading">
          <table class="table">
            <tr>
              <td>ID：</td>
              <td>{{ detail.id }}</td>
            </tr>
            <tr>
              <td>所属方案：</td>
              <td>{{ detail.modelName }}</td>
              <td>信用主体：</td>
              <td>{{ detail.legBaseInfo.compName }}</td>
              <td>统一社会信用代码：</td>
              <td>{{ detail.legBaseInfo.idCode }}</td>
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
                {{ $util.parseTime(detail.createDate, '{h}:{i}:{s} {h}:{i}:{s}') }}
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
              <p class="con">乐视网信息技术(北京)股份有限公司</p>
            </b-col>
            <b-col span="6" class="field">
              <label>信用得分：</label>
              <p class="con">1000</p>
            </b-col>
            <b-col span="6" class="field">
              <label>信用级别：</label>
              <p class="con">A</p>
            </b-col>
          </b-row>

          <b-table :columns="columns" :data="list" size="small" class="mb-15"></b-table>
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
  import { getCreditInfo, getLegalDetail } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'ModelCountLegalDetail',
    props: [
      'id',
      'personId',
      'title'
    ],
    data () {
      return {
        loading: false,
        collapseValue: [], // 控制手风琴展开
        detail: {
          legBaseInfo: {}
        }, // 详情对象
        query: {
          id: this.id,
          page: 1
        },
        total: 0,
        list: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '指标名称', key: '', align: 'center' },
          { title: '指标得分', key: '', align: 'center' },
          { title: '事件描述', key: '', align: 'center' }
        ]
      }
    },
    created () {
      this.getCreditInfo(this.query)
      this.getLegalDetail(this.id)
    },
    methods: {
      // 分页按钮切换回调
      handleCurrentChange (page) {
        this.query.page = page
        this.getCreditInfo()
      },
      // 获取法人详情
      async getLegalDetail (id) {
        this.loading = true
        try {
          const res = await getLegalDetail(id)
          this.detail = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载失败', desc: error })
        }
        this.loading = false
        this.collapseValue = ['baseInfo', 'countResInfo', 'creditInfo']
      },
      // 获取信用评级信息
      async getCreditInfo (query) {
        try {
          const res = await getCreditInfo(query)
          this.list = res.rows
          this.total = res.total
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载失败', desc: error })
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

    td, th {
      height: 40px;
      width: 16.6%;
      padding: 5px 12px
      vertical-align: top;
      // border-bottom: 1px solid #c5c5c5;
      // color: white;
    }
    // tr:nth-child(odd){
    //     background: #01cf97;
    // }
    // tr:nth-child(even){
    //     background: #a2a9b6;
    // }
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
