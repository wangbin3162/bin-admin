<template>
  <div>
    <b-table v-if="scaleType" :columns="columnsFive" :data="listFive">
      <template v-slot:indexValue="scope">
        <b-input v-model="scope.row.indexValue"></b-input>
      </template>
      <template v-slot:indexDesc="scope">
        <b-input v-model="scope.row.indexDesc"></b-input>
      </template>
      <template v-slot:score="scope">
        <b-input v-model="scope.row.score"></b-input>
      </template>
      <template v-slot:sort>
        ↑ ↓
      </template>
      <template v-slot:action>
        <b-button type="text">
          添加
        </b-button>
        <b-button type="text">
          移除
        </b-button>
      </template>
    </b-table>

    <b-table v-else :columns="columnsTen" :data="listTen">
      <template v-slot:max="scope">
        <b-input v-model="scope.row.max"></b-input>
      </template>
      <template v-slot:min="scope">
        <b-input v-model="scope.row.min"></b-input>
      </template>
      <template v-slot:score="scope">
        <b-input v-model="scope.row.score"></b-input>
      </template>
      <template v-slot:sort>
        ↑ ↓
      </template>
      <template v-slot:action>
        <b-button type="text">
          添加
        </b-button>
        <b-button type="text">
          移除
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    name: 'IndexManageEditIndexRule',
    props: {
      scale: {
        default: 5
      }
    },
    components: {},
    computed: {
      scaleType () {
        return this.scale === 5
      }
    },
    data () {
      return {
        listFive: [
          {
            indexValue: '1',
            indexDesc: 'desc',
            score: 1
          }
        ],
        columnsFive: [
          { type: 'index', width: 50 },
          { title: '指标值', slot: 'indexValue' },
          { title: '指标描述', slot: 'indexDesc' },
          { title: '得分', slot: 'score' },
          { title: '排序', slot: 'sort', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ],
        listTen: [
          {
            max: 10,
            min: 8,
            score: 10
          }
        ],
        columnsTen: [
          { type: 'index', width: 50 },
          { title: '上限值', slot: 'max' },
          { title: '下限值', slot: 'min' },
          { title: '得分', slot: 'score' },
          { title: '排序', slot: 'sort', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ]
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>
