<template>
  <b-container ref="container" bg-color="#f0f2f8">
    <v-table-layout>
      <b-tree :data="data1" slot="tree"></b-tree>
      <!--查询条件-->
      <v-filter-bar slot="filter" :is-opened="filterOpened">
        <v-filter-item title="商品名称">
          <b-input v-model.trim="listQuery.name" size="small" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="店铺名称">
          <b-input v-model.trim="listQuery.shop" size="small" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"
                       :show-toggle="true" :is-opened="filterOpened" @on-toggle="filterOpened=!filterOpened"
        ></v-filter-item>
        <template slot="more">
          <v-filter-item title="商家地址">
            <b-input v-model.trim="listQuery.address" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="商品种类">
            <b-input v-model.trim="listQuery.category" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
        </template>
      </v-filter-bar>
      <b-table slot="table" :columns="columns" :data="data" border stripe></b-table>
      <b-page slot="pager" :total="100" show-sizer></b-page>
    </v-table-layout>
  </b-container>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'

  export default {
    name: 'TableDemo',
    mixins: [commonMixin],
    data () {
      return {
        listQuery: {
          name: '',
          shop: '',
          address: '',
          category: '',
          desc: ''
        },
        data1: [
          {
            title: '一级 1',
            expand: true,
            children: [
              {
                title: '二级 1-1',
                expand: true,
                children: [
                  { title: '三级 1-1-1' },
                  { title: '三级 1-1-2' }
                ]
              },
              {
                title: '二级 1-2',
                expand: true,
                children: [
                  { title: '三级 1-2-1' },
                  { title: '三级 1-2-2' }
                ]
              }
            ]
          }
        ],
        columns: [
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '年龄',
            key: 'age'
          },
          {
            title: '出生日期',
            key: 'birthday'
          },
          {
            title: '地址',
            key: 'address'
          }
        ],
        data: [
          {
            name: '王小明',
            age: 18,
            birthday: '1990-04-22',
            address: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            age: 25,
            birthday: '1990-02-11',
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            birthday: '1991-06-16',
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            birthday: '1992-09-02',
            address: '深圳市南山区深南大道'
          },
          {
            name: '张小发',
            age: 33,
            birthday: '1989-12-22',
            address: '南京市龙眠大道'
          },
          {
            name: '张小刚',
            age: 25,
            birthday: '1990-02-11',
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            birthday: '1991-06-16',
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            birthday: '1992-09-02',
            address: '深圳市南山区深南大道'
          },
          {
            name: '张小发',
            age: 33,
            birthday: '1989-12-22',
            address: '南京市龙眠大道'
          },
          {
            name: '张小发',
            age: 33,
            birthday: '1989-12-22',
            address: '南京市龙眠大道'
          }
        ]
      }
    },
    methods: {
      /**
       * 事件响应
       */
      searchList () {

      },
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          param1: '',
          param2: '',
          param3: '',
          param4: '',
          param5: ''
        }
      }
    }
  }
</script>
