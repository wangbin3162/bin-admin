<template>
  <cre-sup-layout>
    <div class="credit-supervision-search">
      <cre-sup-header></cre-sup-header>

      <div class="search">
        <transition name="fade-scale-move">
          <div style="width: 50%;" v-show="visible">
            <p>监管查询</p>
            <div flex class="btn-con">
              <b-dropdown class="dropdown">
                <b-button type="primary" style="width: 94px;">
                  {{ personClassName }}
                  <b-icon name="ios-arrow-down"></b-icon>
                </b-button>
                <b-dropdown-menu slot="list">
                    <b-dropdown-item @click.native="personClassName = '自然人'">
                      自然人
                    </b-dropdown-item>
                    <b-dropdown-item @click.native="personClassName = '法人'">
                      法人
                    </b-dropdown-item>
                </b-dropdown-menu>
              </b-dropdown>
              <b-input placeholder="请输入查询主体"></b-input>
              <b-button type="primary" class="search-btn" @click="modalFlag = true">
                查询
              </b-button>
            </div>
          </div>
        </transition>
      </div>

      <div class="main-con">
        <transition name="fade-scale-move">
          <search-list v-show="visible"></search-list>
        </transition>
      </div>

    </div>
  </cre-sup-layout>
</template>

<script>
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'
  import SearchList from '@/pages/credit-supervision/credit-supervision-search/SearchList'

  export default {
    name: 'CreditSupervisionSearch',
    components: {
      CreSupLayout,
      CreSupHeader,
      SearchList
    },
    data () {
      return {
        visible: false,
        personClassName: '法人',
        total: 0,
        query: {
          size: 10,
          page: 1
        },
        modalFlag: false
      }
    },
    created () {

    },
    mounted () {
      this.visible = true
    },
    methods: {
      handlePageChange () {

      }
    }
  }
</script>

<style lang="stylus">
  .credit-supervision-search {
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
 .credit-supervision-search {
    height: 100%;
    background: url("../../../assets/images/credit-supervision/banner-bg0.png") no-repeat 0 0;
    background-size: 100% 310px;
    transition: background .3s;

    .search {
      display: flex;
      justify-content: center;
      padding-top: 50px;
      height: 170px;
      width: 1300px;
      margin: 0 auto;
      text-align: center;

      p {
        margin-bottom: 5px;
        font-size: 27px;
        color: #ffffff;
      }

     .btn-con {
        width: 100%;
      }
    }

    .main-con {
      width: 1300px
      margin: 0 auto;

    }
  }
</style>
