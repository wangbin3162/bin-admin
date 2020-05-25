<template>
  <div class="model-count-legal-detaiil">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full" style="position: relative;">
          <b-collapse v-model="collapseValue" simple>
            <b-collapse-panel title="基本信息" name="baseInfo">
              hello
            </b-collapse-panel>

            <div class="line"></div>
            <b-collapse-panel title="方案计算结果" name="countResInfo" class="count-res-inifo">
              <b-row class="mb-15">
                <b-col span="8" class="field">
                  <label>ID: </label>
                  <p class="con">XYBG-Z-20200512-000009F</p>
                </b-col>
              </b-row>

              <b-row class="mb-15">
                <b-col span="8" class="field">
                  <label>所属方案: </label>
                  <p class="con">法人默认方案</p>
                </b-col>
                <b-col span="8" class="field">
                  <label>信用主体: </label>
                  <p class="con">乐视网信息技术(北京)股份有限公司</p>
                </b-col>
                <b-col span="8" class="field">
                  <label>社会统一信用代码: </label>
                  <p class="con">XYBG-Z-20200512-000009F</p>
                </b-col>
              </b-row>
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
  export default {
    name: 'ModelCountLegalDetail',
    props: ['id', 'title'],
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

    },
    methods: {

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

  .field {
    display: flex;
    label {
      width: 116px;
      font-size: 14px;
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
