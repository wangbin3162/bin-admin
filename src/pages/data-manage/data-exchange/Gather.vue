<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <div class="header-search" flex="main:center">
          <div flex="cross:center">
            <span style="width: 80px;">资源名称：</span>
            <b-input v-model="resourceName" placeholder="请输入资源名称" clearable
                     style="width: 400px;margin-right: 4px;"></b-input>
            <b-button type="primary" v-waves @click="handleFilter">查 询</b-button>
          </div>
        </div>
        <div class="gather-wrap">
          <div class="card-box" v-for="res in computedList" :key="res.id">
            <div class="item">
              <div class="card-header t-ellipsis">{{res.resourceName}}</div>
              <div class="center-box">
                <p class="f-s-12">最新采集时间:{{res.createDate}}</p>
              </div>
              <div class="check-box" flex="main:justify cross:center">
                <span class="check" @click="handleCheckRes(res)">查看数据</span>
                <b-icon name="md-arrow-round-forward" @click.native="handleCheckRes(res)"></b-icon>
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
    .card-move-enter, .card-move-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }
    .card-move-leave-active {
      position: absolute;
    }
    .card-box {
      width: 25%;
      padding: 10px;
      transition: all .5s;
      .item {
        padding: 6px 0;
        border-radius: 8px;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, .1);
        .card-header {
          position: relative;
          font-size: 14px;
          padding: 10px 0 10px 15px;
          &:before {
            content: ''
            position: absolute;
            top: 10px;
            left: 0;
            bottom: 10px;
            width: 4px;
            background rgb(32, 123, 247);
          }
        }
        .center-box {
          padding: 0 10px;
        }
        .check-box {
          padding: 10px 30px 5px;
          border-top: 1px solid #ecf0f5;
          transition: .35s;
          &:hover {
            padding-right: 25px;
          }
          .check, .iconfont {
            cursor: pointer;
            color: #5f6f8f;
          }
        }
      }
    }
  }
</style>
