<template>
  <exc-layout foot-hide>
    <div class="excavate-main-wrap">
      <exc-header/>
      <div class="search-wrap">
        <div class="search-inner">
          <div class="search-list">
            <res-search v-model="keyword" @search="getList"/>
            <div class="tag-list">
              <b-scrollbar style="height:100%;" v-if="resourceList.length>0">
                <span class="tag-item" v-for="item in resourceList" :key="item.resourceKey"
                      @click="handleClickResource(item)">
                  {{ item.resourceName }}
                </span>
              </b-scrollbar>
              <no-data v-else mode="mini" style="height: 200px;"/>
            </div>
          </div>
          <div class="right-img">
            <b-carousel autoplay :autoplay-speed="5000" loop>
              <b-carousel-item>
                <div class="image">
                  <img src="../../assets/images/excavate/pic1.png" height="400" width="550" alt="1"/>
                </div>
              </b-carousel-item>
              <b-carousel-item>
                <div class="image">
                  <img src="../../assets/images/excavate/pic2.png" height="400" width="550" alt="1"/>
                </div>
              </b-carousel-item>
            </b-carousel>
          </div>
        </div>
      </div>
    </div>
  </exc-layout>
</template>

<script>
import ExcLayout from '@/pages/excavate/components/ExcLayout'
import ExcHeader from '@/pages/excavate/components/ExcHeader'
import { getResList } from '@/api/excavate.api'
import ResSearch from '@/pages/excavate/components/ResSearch'
import NoData from '@/components/NoData/index'

export default {
  name: 'Excavate',
  components: { NoData, ResSearch, ExcHeader, ExcLayout },
  data() {
    return {
      keyword: '',
      resourceList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getResList(this.keyword).then(resp => {
        this.resourceList = resp.data.rows
      })
    },
    handleClickResource(item) {
      this.$router.push({ path: '/excavate/render', query: item })
    }
  }
}
</script>

<style scoped lang="stylus">
.excavate-main-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: background .3s;
  background-color: #ffffff;
  .search-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    .search-inner {
      display: flex;
      justify-content: space-between;
      width: 1300px;
      height: 90%;
      min-height: 500px;
      padding: 40px 0;
      .search-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 600px;
        height: 400px;
        padding: 0 40px;
        .tag-list {
          width: 100%;
          min-height: 100px;
          max-height: 240px;
          .tag-item {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            padding: 0 8px;
            margin: 0 12px 12px 0;
            border: 1px solid #d6dade;
            background-color: #f4f5f6;
            color: #5d6d7e;
            font-size: 14px;
            opacity: 1;
            overflow: hidden;
            line-height: 22px;
            border-radius: 2px;
            box-sizing: border-box;
            white-space: nowrap;
            transition: .25s;
            &:hover {
              border: 1px solid #cee6ff;
              background-color: #f2f8ff;
              color: #3d9dff;
            }
          }
        }
      }
      .right-img {
        width: 550px;
        .image {
          background-color: #fff;
        }
      }
    }
  }
}
</style>
