<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <div class="header-search" flex="main:center">
          <div flex="cross:center">
            <span style="width: 80px;">资源名称：</span>
            <b-input v-model.trim="resourceName" placeholder="请输入资源名称" clearable
                     @on-keyup.enter="handleFilter"
                     style="width: 400px;margin-right: 4px;"/>
            <b-button type="primary" @click="handleFilter">查 询</b-button>
          </div>
        </div>
        <div class="gather-wrap">
          <div class="card-box" v-for="res in computedList" :key="res.id">
            <div class="item">
              <div class="card-header t-ellipsis">{{res.resourceName}}</div>
              <div class="center-box">
                <p class="create-date">最新采集时间:{{res.createDate}}</p>
                <div class="count">50<span>&nbsp;条</span></div>
              </div>
              <div class="check-box">
                <span class="check" @click="handleDownloadTemplate(res)">模板下载</span>
                <span class="check" @click="handleCheckRes(res)">查看数据</span>
              </div>
            </div>
          </div>
        </div>
      </v-table-wrap>
    </page-header-wrap>
    <gather-list ref="gatherList" @on-close="handleCancel"></gather-list>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getMyGather } from '../../../api/data-manage/res-info.api'
  import GatherList from './components/Gather/GatherList'
  import * as api from '../../../api/data-manage/gather.api'
  import Util from '../../../common/utils/util'

  export default {
    name: 'Gather',
    components: { GatherList },
    mixins: [commonMixin, permission],
    data() {
      return {
        resourceName: '',
        computedList: []
      }
    },
    created() {
      this.searchList()
    },
    methods: {
      // 根据resourceKey查看动态渲染列表
      handleCheckRes(resource) {
        // 根据resourceKey获取资源信息，并将原始表头信息传入gather-list组件
        api.getResourceInfo(resource.resourceKey).then(res => {
          if (res.status === 200) {
            let detail = res.data.data
            if (resource.status === 'audited' && detail && detail.items) { // 已经发布过的
              let columns = this.formatItemsToColumns(detail.items)
              this.dialogStatus = 'gatherList'
              this.$refs.gatherList.open(detail, columns)
            } else {
              this.$message({ type: 'danger', content: '当前资源没有发布' })
            }
          }
        })
      },
      // 下载模板
      handleDownloadTemplate(resource) {
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce((resource) => {
            api.downloadTemplate(resource.resourceKey).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, `${resource.resourceName}.xlsx`)
              }
            })
          }, 1000)
        }
        this.downloadEvent(resource)
      },
      // 查询方法
      handleFilter() {
        if (this.resourceName.length === 0) {
          this.searchList()
        } else {
          this.computedList = this.list.filter(item => {
            return item.resourceName.indexOf(this.resourceName) !== -1
          })
        }
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        getMyGather(this.resourceName).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.data,
              total: response.data.total
            })
            this.computedList = this.list
          }
        })
      },
      // 根据获取的items转换为原始表头数组
      formatItemsToColumns(items) {
        return items.filter(i => i.id)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .header-search {
    width: 100%;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
  }
  .gather-wrap {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    .card-box {
      width: 25%;
      padding: 10px;
      transition: all .5s;
      .item {
        border-radius: 2px;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, .1);
        .card-header {
          position: relative;
          font-size: 16px;
          padding: 15px 15px 0;
        }
        .create-date {
          font-size: 12px;
          color: #999;
        }
        .count {
          padding: 16px 0;
          font-size: 30px;
          color: rgba(0, 0, 0, .65)
          span {
            font-size: 14px;
          }
        }
        .center-box {
          padding: 0 15px;
        }
        .check-box {
          border-top: 1px solid #ecf0f5;
          padding: 10px 0;
          .check {
            display: inline-block;
            width: 50%;
            cursor: pointer;
            height: 24px;
            line-height: 24px;
            text-align: center;
            transition: .25s;
            color: #666;
            &:hover {
              color: #1089ff;
            }
            &:first-child {
              border-right: 1px solid #ecf0f5;
            }
          }
        }
      }
    }
    @media (min-width: 1200px) and (max-width: 1500px) {
      .card-box {
        width: 33.33%;
      }
    }
    @media (min-width: 768px) and (max-width: 1199px) {
      .card-box {
        width: 50%;
      }
    }
  }
</style>
