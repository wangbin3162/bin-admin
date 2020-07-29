<template>
  <div class="section-side-nav">
    <b-card class="content-search mb-20">
      <span>{{ searchTitle }}</span>
      <b-input v-model="keyword" placeholder="请输入关键词" @on-enter="handleSearch">
        <b-icon name="ios-search" slot="suffix" style="cursor: pointer"
          @click.native="handleSearch">
        </b-icon>
      </b-input>
    </b-card>

    <b-card head-tip class="card mb-20" shadow="never"
      v-for="sec in secList" :key="sec.id">
      <template v-slot:header>
        <div flex="main:justify cross:center">
          <span>{{ sec.colName }}</span>
          <!-- <b-icon name="ios-qr-scanner" size="20" style="cursor: pointer;"></b-icon> -->
        </div>
      </template>

      <div class="btn-con">
        <div class="btn" v-for="subSec in sec.children" :key="subSec.id"
          @click="handleSecBtnClick(sec.id, subSec.id)">
          {{ subSec.colName }}
        </div>
      </div>
    </b-card>

  </div>
</template>

<script>
  import {
    getTopColumn, getSectionChildren
  } from '../../../api/cms/news.api'

  export default {
    name: 'SectionSideNav',
    props: {
      value: {
        type: String,
        default: ''
      },
      searchTitle: {
        type: String,
        default: '文章搜索'
      },
      searchType: {
        type: String,
        default: 'article'
      }
    },
    data () {
      return {
        keyword: this.value,
        secList: []
      }
    },
    watch: {
      value (newVal) {
        this.keyword = newVal
      },
      keyword (newVal) {
        this.$emit('input', newVal)
      }
    },
    created () {
      this.buildSectionSideNav()
    },
    methods: {
      /**
       * @description 构建侧栏栏目导航数据结构
       * @author haodongdong
       */
      async buildSectionSideNav () {
       try {
          const res = await getTopColumn()
          res.forEach(item => {
            getSectionChildren(item.id).then(res => {
              this.$set(item, 'children', res)
            })
          })
          this.secList = res
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 搜索框回调
       */
      handleSearch () {
        if (this.searchType === 'article') {
          const query = this.$route.query
          this.$router.push({
            path: '/news',
            query: {
              pid: query.pId,
              sid: query.sId,
              keyword: this.keyword
            }
          })
        } else {
          this.$emit('search', this.keyword)
        }
      },

      /**
       * @author haodongdong
       * @description 左侧子栏目点击事件
       * @param {string} pId 根节点栏目id
       * @param {string} sId 子栏节点栏目id
       */
      handleSecBtnClick (pId, sId) {
        this.$router.push({
          path: '/news',
          query: {
            pId,
            sId
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .section-side-nav {
    .content-search {
      span {
        display: inline-block;
        margin-bottom: 10px;
      }
    }

    .card {
      .btn-con {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .btn {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
          width: 47%;
          height: 40px;
          background: #f5f5f5;
          border-radius: 5px;
          cursor: pointer;

          &:hover {
            background: #85919e;
            color: #ffffff;
            transition: all 0.4s;
          }
        }
      }
    }
  }
</style>
