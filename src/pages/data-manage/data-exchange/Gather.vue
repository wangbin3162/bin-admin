<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <div class="header-search" flex="main:center">
          <div flex="cross:center">
            <span style="width: 80px;">资源名称：</span>
            <b-input v-model.trim="listQuery.resourceName" placeholder="请输入资源名称" clearable
                     @on-keyup.enter="handleFilter"
                     style="width: 400px;margin-right: 4px;"/>
            <b-button type="primary" @click="handleFilter">查 询</b-button>
          </div>
        </div>
        <div class="gather-wrap">
          <div class="card-box" v-for="res in list" :key="res.id">
            <div class="item">
              <div class="label-icon">{{ res.resourceName.slice(0,1) }}</div>
              <div class="card-header t-ellipsis">{{res.resourceName}}</div>
              <div class="center-box">
                <p class="create-date">最新采集时间:{{ res.lastDate }}</p>
                <div class="count">{{ res.totalCount }}<span>&nbsp;条</span></div>
              </div>
              <div class="check-box">
                <span class="check" @click="handleDownloadTemplate(res)" title="下载模板">
                  <svg-icon icon-class="download" style="width: 22px;height:22px;"/>
                </span>
                <span class="check" @click="handleCheckRes(res)" title="查看数据">
                  <svg-icon icon-class="check-data" style="width: 20px;height:20px;"/>
                </span>
              </div>
              <div class="status-icon" :class="{'active':res.gatherStatus}" :title="res.tip||''">
                <svg-icon icon-class="dengpao" class="icon"/>
              </div>
            </div>
          </div>
        </div>
        <!--下方分页器-->
        <b-page :total="total" :page-size="pageSizeOpts" :current.sync="listQuery.page" @on-change="handleCurrentChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <gather-list ref="gatherList" @on-close="handleCancel"></gather-list>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import GatherList from './components/Gather/GatherList'
  import * as api from '../../../api/data-manage/gather.api'
  import Util from '../../../common/utils/util'

  export default {
    name: 'Gather',
    components: { GatherList },
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          size: 12,
          page: 1,
          resourceName: ''
        },
        pageSizeOpts:12,
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
              let columns = detail.items.filter(i => i.id)
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
        this.searchList()
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getMyGather(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
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
      .item {
        position: relative;
        border-radius: 2px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, .1);
        overflow: hidden;
        transition: .25s;
        .card-header {
          position: relative;
          font-size: 16px;
          padding: 15px 15px 0 60px;
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
          padding: 0 15px 0 60px;
        }
        .check-box {
          background: #f7f9fa;
          border-top: 1px solid #ecf0f5;
          padding: 6px 0;
          .check {
            display: inline-block;
            vertical-align: middle;
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
        .label-icon {
          position: absolute;
          top: 14px;
          left: 10px;
          width: 34px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          color: #fff;
          border-radius: 50%;
          background: #3d9dff;
        }
        .status-icon {
          position: absolute;
          top: 10px;
          right: 0;
          padding: 4px 15px;
          border-radius: 20px 0 0 20px;
          background: #fff6ed;
          .icon {
            width: 20px;
            height: 20px;
            fill: #ffb11a;
          }
          &.active {
            background: #e6fff0;
            .icon {
              fill: #60d791;
            }
          }
        }
        &:hover {
          box-shadow: 0 0 5px 1px rgba(0, 0, 0, .2);
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
