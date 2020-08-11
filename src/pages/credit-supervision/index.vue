<template>
  <cre-sup-layout>
    <div class="credit-supervision">
      <cre-sup-header></cre-sup-header>

      <div class="search">
        <div flex class="con">
          <b-dropdown class="dropdown" style="margin-left: 20px;">
            <b-button type="primary" style="width: 94px;">
              法人
              <b-icon name="ios-arrow-down"></b-icon>
            </b-button>
            <b-dropdown-menu slot="list">
                <b-dropdown-item>自然人</b-dropdown-item>
                <b-dropdown-item>法人</b-dropdown-item>
            </b-dropdown-menu>
          </b-dropdown>
          <b-input placeholder="请输入查询主体"></b-input>
          <b-button type="primary" class="search-btn">
            查询
          </b-button>
        </div>
      </div>

      <div class="main-con">
        <div class="left">

        </div>

        <div class="right">
          <!-- 右侧头部导航 -->
          <!-- 市场主体预警 -->
          <!-- 行业黑名单排行 -->
        </div>
      </div>
    </div>
  </cre-sup-layout>
</template>

<script>
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'

  export default {
    name: 'CreditSupervision',
    components: {
      CreSupLayout,
      CreSupHeader
    },
    data () {
      return {

      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus">
  .credit-supervision {
    .search {
      .dropdown {
        .bin-button {
          border-radius: 2px 0 0 2px;
        }
        .bin-button,
        .bin-button--primary,
        .bin-button--primary:active,
        .bin-button--primary:focus,
        .bin-button--primary:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0);
        }
      }

      .bin-input {
        border-radius: 0;
        color: #ffffff;
      }
      .bin-input,
      .bin-input:focus,
      .bin-input:hover {
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(255, 255, 255, 0);
        box-shadow: 0 0 0 2px rgba(13, 133, 255, 0);
      }

      .search-btn.bin-button {
          border-radius: 0 2px 2px 0;
        }
    }
  }
</style>

<style lang="stylus" scoped>
 .credit-supervision {
    height: 100%;
    background: url("../../assets/images/content/banner-bg0.png") no-repeat 0 0;
    background-size: 100% 310px;
    transition: background .3s;

    .search {
      display: flex;
      align-items: center;
      height: 230px;
      width: 1300px;
      margin: 0 auto;

      .con {
        width: 50%;
      }
    }
  }
</style>
