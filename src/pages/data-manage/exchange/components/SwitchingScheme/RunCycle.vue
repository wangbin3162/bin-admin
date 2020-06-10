<template>
  <!--节点选择 for switching-scheme -->
  <div style="width: 100%;">
    <div flex>
      <b-input v-model="cronStr" placeholder="请输入运行周期"    clearable  flex-box="1"></b-input>
      <div >
        <b-button type="primary" @click="handleShowModal">
          选择
        </b-button>
      </div>
    </div>
    <b-modal v-model="dialogFormVisible" title="配置周期" width="860" class="layout-inner" append-to-body
             :mask-closable="false"  @on-opened="toggle = true" @on-ok="saveCron">
      <div v-if="toggle">
        <template>
          <b-tabs v-model="activeTab" :data="tabs"></b-tabs>
          <div v-show="activeTab==='sec'" class="tab-container">
            <b-radio-group v-model="sec.flag" class="radio-container">
              <b-radio label="range">
                从
                <template>
                   <b-input-number :max="59" :min="0" v-model="sec.begin"></b-input-number>
                </template>
                秒开始，每隔
                <template>
                  <b-input-number :max="59" :min="0" v-model="sec.cycle"></b-input-number>
                </template>
                秒执行一次
              </b-radio>
            </b-radio-group>
            <b-radio-group v-model="sec.flag"  class="radio-container">
              <b-radio label="time">指定时间</b-radio>
            </b-radio-group>
            <b-checkbox-group v-model="sec.list">
              <b-checkbox v-for="count in 60"  :key="count-1" :label="count-1">
                <span>{{count-1}}</span>
              </b-checkbox>
            </b-checkbox-group>
          </div>
          <div v-show="activeTab==='min'" class="tab-container">
            <b-radio-group v-model="min.flag" class="radio-container">
              <b-radio label="range">
                从
                <template>
                  <b-input-number :max="59" :min="0" v-model="min.begin"></b-input-number>
                </template>
                分开始，每隔
                <template>
                  <b-input-number :max="59" :min="0" v-model="min.cycle"></b-input-number>
                </template>
                分执行一次
              </b-radio>
            </b-radio-group>
            <b-radio-group v-model="min.flag"  class="radio-container">
              <b-radio label="time">指定时间</b-radio>
            </b-radio-group>
            <b-checkbox-group v-model="min.list">
              <b-checkbox v-for="count in 60"  :key="count-1" :label="count-1">
                <span>{{count-1}}</span>
              </b-checkbox>
            </b-checkbox-group>
          </div>
          <div v-show="activeTab==='hou'" class="tab-container">
            <b-radio-group v-model="hou.flag" class="radio-container">
              <b-radio label="range">
                从
                <template>
                  <b-input-number :max="59" :min="0" v-model="hou.begin"></b-input-number>
                </template>
                时开始，每隔
                <template>
                  <b-input-number :max="59" :min="0" v-model="hou.cycle"></b-input-number>
                </template>
                时执行一次
              </b-radio>
            </b-radio-group>
            <b-radio-group v-model="hou.flag"  class="radio-container">
              <b-radio label="time">指定时间</b-radio>
            </b-radio-group>
            <b-checkbox-group v-model="hou.list">
              <b-checkbox v-for="count in 24"  :key="count-1" :label="count-1">
                <span>{{count-1}}</span>
              </b-checkbox>
            </b-checkbox-group>
          </div>
          <div v-show="activeTab==='day'" class="tab-container">
            <b-radio-group v-model="day.flag" class="radio-container">
              <b-radio label="range">
                从
                <template>
                  <b-input-number :max="59" :min="0" v-model="day.begin"></b-input-number>
                </template>
                日开始，每隔
                <template>
                  <b-input-number :max="59" :min="0" v-model="day.cycle"></b-input-number>
                </template>
                日执行一次
              </b-radio>
            </b-radio-group>
            <b-radio-group v-model="day.flag"  class="radio-container">
              <b-radio label="time">指定时间</b-radio>
            </b-radio-group>
            <b-checkbox-group v-model="day.list">
              <b-checkbox v-for="count in 31"  :key="count" :label="count">
                <span>{{count}}</span>
              </b-checkbox>
            </b-checkbox-group>
          </div>
          <div v-show="activeTab==='mon'" class="tab-container">
            <b-radio-group v-model="mon.flag" class="radio-container">
              <b-radio label="range">
                从
                <template>
                  <b-input-number :max="59" :min="0" v-model="mon.begin"></b-input-number>
                </template>
                月开始，每隔
                <template>
                  <b-input-number :max="59" :min="0" v-model="mon.cycle"></b-input-number>
                </template>
                月执行一次
              </b-radio>
            </b-radio-group>
            <b-radio-group v-model="mon.flag"  class="radio-container">
              <b-radio label="time">指定时间</b-radio>
            </b-radio-group>
            <b-checkbox-group v-model="mon.list">
              <b-checkbox v-for="count in 12"  :key="count" :label="count">
                <span>{{count}}</span>
              </b-checkbox>
            </b-checkbox-group>
          </div>
        </template>
        <template>
          <b-row :gutter="20" class="gutter result-box" >
            <b-col span="12"><div>配置结果</div></b-col>
            <b-col span="12"><div>{{calCron}}</div></b-col>
          </b-row>
        </template>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'

  export default {
    name: 'RunCycle',
    mixins: [commonMixin],
    props: {
        cron: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        toggle: false,
        dialogFormVisible: false,
        cronStr: '',
        activeTab: 'sec',
        tabs: [
            { key: 'sec', title: '秒' },
            { key: 'min', title: '分' },
            { key: 'hou', title: '时' },
            { key: 'day', title: '日' },
            { key: 'mon', title: '月' }
        ],
        sec: { list: [], flag: 'time', begin: 1, cycle: 2 },
        min: { list: [], flag: 'time', begin: 1, cycle: 2 },
        hou: { list: [], flag: 'time', begin: 1, cycle: 2 },
        day: { list: [], flag: 'time', begin: 1, cycle: 2 },
        mon: { list: [], flag: 'time', begin: 1, cycle: 2 }
      }
    },
    created() {
    },
    watch: {
        cron: function () {
            this.cronStr = this.cron
        }
    },
    methods: {
      handleShowModal() {
        this.dialogFormVisible = true
      },
      // 计算表达式
      appendCron(obj, cron) {
          if (obj.flag === 'time') {
              if (obj.list.length > 0) {
                  cron += obj.list.join(',') + ' '
              } else {
                  cron += '* '
              }
          } else {
              cron += obj.begin + '/' + obj.cycle + ' '
          }
          return cron
      },
      saveCron() {
          this.cronStr = this.calCron
          this.$emit('on-select', this.cronStr)
          this.cronClear()
      },
      cronClear() {
          this.sec = { list: [], flag: 'time', begin: 1, cycle: 2 }
          this.min = { list: [], flag: 'time', begin: 1, cycle: 2 }
          this.hou = { list: [], flag: 'time', begin: 1, cycle: 2 }
          this.day = { list: [], flag: 'time', begin: 1, cycle: 2 }
          this.mon = { list: [], flag: 'time', begin: 1, cycle: 2 }
      }
    },
    computed: {
       calCron() {
           let cronStr = ''
           cronStr = this.appendCron(this.sec, cronStr)
           cronStr = this.appendCron(this.min, cronStr)
           cronStr = this.appendCron(this.hou, cronStr)
           cronStr = this.appendCron(this.day, cronStr)
           cronStr = this.appendCron(this.mon, cronStr)
           cronStr += '?'
         return cronStr
       }
    }
  }
</script>

<style scoped lang="stylus">
  .tab-container
    padding 10px
    height 200px
    .radio-container
       margin-bottom 10px
  .result-box
    margin-top 20px
    div
      text-align center
      font-weight bold

</style>
