<template>
  <div class="tab-con-a">
      <div class="left">
        <div v-for="item in sectionList" :key="item.id"
          @click="handleBlockBtnClick(item)"
          flex="cross:center" class="block-btn-con"
          :class="{ actived: curActivedBtn.id === item.id }">

          <div class="block-btn">
            <div style="margin: 0 17%;">
              <i class="iconfont" :class="[item.brief]"></i>
            </div>
            {{ item.colName }}
          </div>
          <div class="arrow"></div>

        </div>
      </div>

      <div class="right">
        <b-loading fix showText="加载中...." v-if="loading">
        </b-loading>

        <template v-if="contentList.length > 0">
          <ul class="list">
            <li v-for="content in contentList" :key="content.id"
              flex="main:justify" class="list-item">
              <p>
                {{ content.title }}
              </p>
              <span>
                {{ $util.parseTime(new Date(content.publishDate), '{y}-{m}-{d}')}}
              </span>
            </li>
          </ul>

          <div flex="main:right">
            <div type="text" class="more-btn" @click="HandleMoreBtn">
              查看更多 >>
            </div>
          </div>
        </template>

        <b-empty v-else style="margin-top: 10%;">暂时没用内容哦</b-empty>
      </div>
    </div>
</template>

<script>
  import { getSectionChildren, getContentList } from '../../api/content.api'

  /**
   * @typedef {import('../../api/content.api').Section} Section
   */

  export default {
    name: 'TabConA',
    props: {
      parentColId: {
        type: String
      }
    },
    data () {
      return {
        loading: false,
        sectionList: [],
        contentList: [],
        curActivedBtn: {}
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 初始化方法
       */
      async init () {
        await this.getSectionChildren(this.parentColId)
        if (this.sectionList.length) await this.getContentList(this.sectionList[0].id)
      },

      /**
       * @author haodongdong
       * @description 获取子栏目
       * @param {string} parentColId 父栏目id
       */
      async getSectionChildren (parentColId) {
        try {
          const res = await getSectionChildren(parentColId)
          this.sectionList = res
          this.curActivedBtn = res[0]
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 根据栏目id获取内容
       * @param {string} columnId 栏目id
       */
      async getContentList (columnId) {
        this.loading = true
        try {
          const res = await getContentList({
            columnId,
            contentStatus: 'PUBLISHED',
            size: 5,
            page: 1
          })
          this.contentList = res.rows
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 左侧栏目点击事件回调
       * @param {Sectiob} sec 当前栏目
       */
      handleBlockBtnClick (sec) {
        this.curActivedBtn = sec
        this.getContentList(sec.id)
      },

      /**
       * @author haodongdong
       * @description 查看更多按钮回调
       */
      HandleMoreBtn () {
        console.log(this.curActivedBtn)
        window.open(`#/content/index?parentCol=${this.curActivedBtn.parentCol}&id=${this.curActivedBtn.id}`)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .tab-con-a {
    display: flex;
    height: 275px;

    .left {
      .block-btn-con {
        height: 55px;
        width: 210px;

        >* {
          transition: all 0.4s;
        }

        .block-btn {
          display: flex;
          align-items: center;
          height: 100%;
          width: 100%;
          cursor: pointer;
          background: #f5f5f5;
          font-size: 15px;
        }

        .arrow {
          width: 0;
          height: 0;
          top: 40%;
          right: -7px;
          border-top: solid 7px transparent;
          border-left: solid 7px rgba(13, 133, 255, 1);
          border-bottom: solid 7px transparent;
          opacity: 0;
        }

        &:hover {
          .block-btn {
            background: rgba(13, 133, 255, 0.5);
            color: #ffffff;
          }
          .arrow {
            // opacity: 1;
          }
        }
        &.actived {
          .block-btn {
            background: rgba(13, 133, 255, 1);
            color: #ffffff;
          }
          .arrow {
            opacity: 1;
          }
        }
      }
    }

    .right {
      position: relative;
      // padding-top: 25px;
      padding-left: 30px;
      padding-right: 10px;
      width: calc(100% - 210px);

      .list {
        display: flex;
        flex-direction: column;
        height: 85%;

        .list-item {
          width: 100%;
          margin-bottom: 30px;

          p {
            font-size: 15px;
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
  }
</style>
