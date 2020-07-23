<template>
  <div class="tab-con-c">
    <b-loading fix showText="加载中...." v-if="loading">
    </b-loading>

    <template v-if="noticeList.length > 0">
      <ul class="list">
        <li v-for="notice in noticeList" :key="notice.id"
          flex="main:justify" class="list-item">
          <div flex="cross:center">
            <div class="line"></div>
            <p>
              {{ notice.title }}
            </p>
          </div>
          <span>
            {{ $util.parseTime(new Date(notice.createDate), '{y}-{m}-{d}') }}
          </span>
        </li>
      </ul>

      <div flex="main:right">
        <div type="text" class="more-btn">
          查看更多 >>
        </div>
      </div>
    </template>

    <b-empty v-else style="margin-top: 10%;">暂时没用内容哦</b-empty>
  </div>
</template>

<script>
  import { getNoticeList } from '../../api/content.api'

  export default {
    name: 'TabConC',
    data () {
      return {
        loading: false,
        noticeList: []
      }
    },
    created () {
      this.getNoticeList()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取通知列表
       */
      async getNoticeList () {
        this.loading = true
        try {
          const res = await getNoticeList({
            size: 5,
            page: 1
          })
          this.noticeList = res.rows
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .tab-con-c {
   position: relative;
   padding-left: 5px;
   padding-right: 10px;
   height: 275px;

   .list {
      display: flex;
      flex-direction: column;
      height: 85%;

      .list-item {
        width: 100%;
        margin-bottom: 30px;

        .line {
          height: 12px;
          width: 1.5px;
          background: #3d9dff;
          margin-right: 10px;
        }

        p {
          font-size: 16px;
          cursor: pointer;

          &:hover {
            color: #0d85ff;
          }

        }

        span {
          color: #8c8c8c;
        }
      }
    }

    .more-btn {
      padding: 7px 15px;
      border-radius: 30px;
      background: #f0f0f0;
      font-size: 13px;
      color: #3d9dff;
      cursor: pointer;
      transition: all 0.4s;

      &:hover {
        color: #6db5ff;
      }
    }
  }
</style>
