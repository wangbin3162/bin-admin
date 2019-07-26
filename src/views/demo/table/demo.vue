<template>
  <b-container ref="container" header-fixed>
    <div slot="header">综合table演示</div>
    <div class="table-layout-wrapper">
      <b-table :columns="columns" :data="data"></b-table>
    </div>
  </b-container>
</template>

<script>
  export default {
    data () {
      return {
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
          }
        ]
      }
    }
  }
</script>
