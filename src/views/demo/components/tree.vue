<template>
  <bin-container ref="container">
    <div style="padding: 20px;">
      <bin-tree :data="treeData" show-checkbox></bin-tree>
    </div>
  </bin-container>
</template>

<script>
  export default {
    data () {
      return {
        treeData: [
          {
            title: 'parent 1',
            expand: true,
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
</script>
