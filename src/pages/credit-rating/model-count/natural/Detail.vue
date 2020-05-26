<template>
  <div class="model-count-legal-detaiil">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full" style="position: relative;">
          <b-collapse v-model="collapseValue" simple>
            <b-collapse-panel title="自然人详情" name="baseInfo">
              <h4>基本信息</h4>
              <table class="table">
                <tr>
                  <td>姓名：</td>
                  <td>{{ detail.natBaseInfo.name }}</td>
                  <td>证件类型：</td>
                  <td>{{ detail.natBaseInfo.idTypeName }}</td>
                  <td>证件号：</td>
                  <td width="310">{{ detail.natBaseInfo.idCode }}</td>
                </tr>
                <tr>
                  <td>性别：</td>
                  <td>{{ detail.natBaseInfo.xb === '1' ? '男' : '女' }}</td>
                  <td>出生日期：</td>
                  <td>{{ detail.natBaseInfo.csrq }}</td>
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
                  <td>{{ detail.natBaseInfo.createName }}</td>
                  <td>采集部门：</td>
                  <td>{{ detail.natBaseInfo.createDeptName }}</td>
                  <td>采集时间：</td>
                  <td>
                    {{ $util.parseTime(detail.natBaseInfo.createDate, '{y}-{m}-{d} {h}:{i}:{s}') }}
                  </td>
                </tr>
              </table>

            </b-collapse-panel>

            <div class="line"></div>
            <b-collapse-panel title="方案计算结果" name="countResInfo" class="count-res-inifo">
              <table class="table">
                <tr>
                  <td>ID：</td>
                  <td>XYBG-Z-20200512-000009F</td>
                </tr>
                <tr>
                  <td>所属方案：</td>
                  <td>法人默认方案</td>
                  <td>信用主体：</td>
                  <td>乐视网信息技术(北京)股份有限公司</td>
                  <td>统一社会信用代码：</td>
                  <td>XYBG-Z-20200512-000009F</td>
                </tr>
                <tr>
                  <td>信用级别：</td>
                  <td>A</td>
                  <td>方案得分：</td>
                  <td>1000</td>
                  <td>结果状态：</td>
                  <td>有效</td>
                </tr>
                <tr>
                  <td>评级人员：</td>
                  <td>测试</td>
                  <td>评级部门：</td>
                  <td>银监分局</td>
                  <td>评级日期：</td>
                  <td>2020-05-12 09:53:53</td>
                </tr>
                <tr>
                  <td>评级描述：</td>
                  <td>按查询结果重新计算</td>
                </tr>
              </table>
            </b-collapse-panel>

            <div class="line"></div>
            <b-collapse-panel title="信用信息详情" name="creditInfo" class="credit-info">
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

              <b-table :columns="columns" :data="[]" size="small">
              </b-table>
            </b-collapse-panel>
          </b-collapse>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getCreditInfo } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'ModelCountNaturalDetail',
    props: [
      'title',
      'detail'
    ],
    data () {
      return {
        collapseValue: ['baseInfo', 'countResInfo', 'creditInfo'], // 控制手风琴展开
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '指标名称', key: '', align: 'center' },
          { title: '指标得分', key: '', align: 'center' },
          { title: '事件描述', key: '', align: 'center' }
        ]
      }
    },
    created () {
      this.getCreditInfo()
      console.log(this.detail)
    },
    methods: {
      async getCreditInfo () {
        try {
          const res = await getCreditInfo(this.detail.id)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .model-count-legal-detaiil {
    .line {
      position: relative;
      left: -16px;
      height: 20px;
      width: calc(100% + 32px);
      background-color: #f0f2f5;
      margin-bottom: 24px;
    }

    .table {
      width: 100%;
      border-collapse:separate;
      border-spacing:0px 10px;
      font-size: 13px;
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
