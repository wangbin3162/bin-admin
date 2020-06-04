<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="备忘录名称">
            <b-input v-model.trim="listQuery.memoName" placeholder="请输入" clearable/>
          </v-filter-item>
          <v-filter-item title="备忘录类型">
            <b-select v-model="listQuery.memoType" placeholder="全部" clearable>
              <b-option v-for="(val,key) in memoTypeMap" :key="key" :value="key">{{ val }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="接收状态">
            <b-select v-model="listQuery.receiveStatus" placeholder="全部" clearable>
              <b-option v-for="(val,key) in receiveStatusMap" :key="key" :value="key">{{ val }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:memoName="{row}">
            <b-button type="text" @click="handleCheck(row)">{{ row.memoName }}</b-button>
          </template>
          <template v-slot:memoType="{row}">{{ memoTypeMap[row.memoType] }}</template>
          <template v-slot:memoStatus="{row}">{{ memoStatusMap[row.memoStatus] }}</template>
          <template v-slot:memoDepartName="{row}">{{ row.memoDepartName }}</template>
          <template v-slot:receiveStatus="{row}">{{ receiveStatusMap[row.receiveStatus] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button :disabled="!havePermission('batchReceive')"
                      v-if="row.receiveStatus==='0'" type="text"
                      @click="handleReceive(row)">
              接收
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <div>
        <b-collapse value="1" simple>
          <b-collapse-panel title="基础信息" name="1">
            <v-key-label label="备忘录名称">{{ memo.memoName }}</v-key-label>
            <v-key-label label="发起部门" is-first is-half>{{ memo.initiateDeptName }}</v-key-label>
            <v-key-label label="备忘录类型" is-half>{{ memoTypeMap[memo.memoType] }}</v-key-label>
            <v-key-label label="备忘录状态" is-first is-half> {{ memoStatusMap[memo.memoStatus] }}</v-key-label>
            <v-key-label label="文案号" is-half>{{ memo.fileCode }}</v-key-label>
            <v-key-label label="签署日期" is-first is-half>{{ memo.signDate }}</v-key-label>
            <v-key-label label="联合部门数" is-half>{{ memo.unionNum }}</v-key-label>
            <v-key-label label="接收状态" is-bottom>{{ receiveStatusMap[memo.receiveStatus] }}</v-key-label>
          </b-collapse-panel>
        </b-collapse>
      </div>
      <div style="margin-top: 20px;">
        <b-collapse value="1" simple>
          <b-collapse-panel title="参与部门及关联措施" name="1">
            <div class="top-wrap" flex="box:first">
              <div class="total" style="width: 280px;">参与部门({{ deptMeasuresBuffer.length }})</div>
              <div class="total">处置措施</div>
            </div>
            <div class="dept-measures" flex="box:first">
              <div class="departs">
                <b-timeline>
                  <b-anchor show-ink @on-select="handleSelectDept">
                    <b-anchor-link v-for="dept in deptMeasuresBuffer" :key="dept.id"
                                   :href="`#${dept.id}`" :title="dept.name"></b-anchor-link>
                  </b-anchor>
                </b-timeline>
              </div>
              <div class="measures">
                <div class="item" v-for="dept in deptMeasuresBuffer" :key="dept.id">
                  <div class="dept-name" :class="{'active':dept.id===activeDeptID}"
                       :id="dept.id">
                    {{ dept.name }}
                    <span>({{ dept.measures?dept.measures.length:'0' }})</span>
                  </div>
                  <div class="measure-item" v-for="measure in dept.measures" :key="measure.id">
                    <b-checkbox :value="measure.isUse==='1'" disabled>
                      {{ measure.measureName }}
                    </b-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </b-collapse-panel>
        </b-collapse>
      </div>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/urp/urp-memo.api'
  import { deptMeasuresMap, getModifyUrpDeparts } from '../../../api/urp/memo.api'

  export default {
    name: 'UrpMemo',
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          memoName: '',
          memoType: '',
          receiveStatus: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '备忘录名称', slot: 'memoName' },
          { title: '备忘录类型', slot: 'memoType', align: 'center', width: 150 },
          { title: '发起部门', key: 'initiateDeptName', width: 150 },
          { title: '联合部门数', key: 'unionNum', align: 'center', width: 120 },
          { title: '备忘录状态', slot: 'memoStatus', align: 'center', width: 120 },
          { title: '接收部门', slot: 'memoDepartName', align: 'center', width: 120 },
          { title: '接收状态', slot: 'receiveStatus', align: 'center', width: 120 },
          { title: '操作', slot: 'action', width: 150 }
        ],
        memo: null,
        memoTypeMap: { '1': '惩戒', '2': '激励' },
        memoStatusMap: { '0': '通报', '1': '实施', '2': '过期' },
        receiveStatusMap: { '0': '待接收', '1': '已接收' },
        deptMeasuresBuffer: [], // 部门-措施映射缓存，新增时为初始部门-映射，修改时需要在调用方法获取
        activeDeptID: ''
      }
    },
    computed: {
      // 所有措施
      allMeasures() {
        let count = 0
        this.deptMeasuresBuffer.forEach(dept => {
          if (dept.measures) {
            count += dept.measures.length
          }
        })
        return count
      }
    },
    created() {
      this.resetMemo()
      this.resetQuery()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          memoName: '',
          memoType: '',
          receiveStatus: ''
        }
        this.handleFilter()
      },
      // 查看按钮事件
      handleCheck(row) {
        this.resetMemo()
        this.memo = { ...this.memo, ...row }
        // 查询已配置好的部门-措施映射
        Promise.all([this.getDeptMeasuresMap(this.memo.id), getModifyUrpDeparts(this.memo.id)])
          .then(([resp1, resp2]) => {
            let deptMeasures1 = resp1
            let deptMeasures2 = this.tiledReadyDeparts(resp2.data.data)
            this.deptMeasuresBuffer = deptMeasures1.filter(item => {
              return deptMeasures2.findIndex(i => i.departId === item.id) > -1
            })
          })
        this.openEditPage('check')
      },
      // 递归映射，用于追加部门对应的措施数组
      mapperWithMeasures(departs, deptMeasuresBuffer) {
        let newTree = []
        let arr = []
        deptMeasuresBuffer.forEach(item => {
          arr.push([item.id, item.measures || []])
        })
        let deptMeasuresMap = new Map(arr)
        let mapper = node => {
          let cs = deptMeasuresMap.get(node.id).map(i => {
            return {
              id: i.id,
              measureName: i.measureName,
              departId: i.departId,
              isUse: i.isUse
            }
          })
          return {
            id: node.id,
            title: node.title || node.text,
            expand: node.expand || true,
            selected: false,
            children: (node.children && node.children.map(mapper)) || [],
            measures: cs
          }
        }
        departs.forEach(topNode => {
          newTree.push(mapper(topNode))
        })
        return newTree
      },
      // 平铺树结构
      tiledReadyDeparts(readyDeparts) {
        let all = []
        const mapper = (node) => {
          all.push({ departId: node.id, departName: node.title || node.text })
          if (node.children) {
            node.children.forEach(item => {
              mapper(item)
            })
          }
        }
        readyDeparts.forEach(item => {
          mapper(item)
        })
        return all
      },
      // 接收
      handleReceive(row) {
        api.receive(row.id, row.memoDepartId).then(resp => {
          if (resp.data.code === '0') {
            this.handleFilter()
          }
        })
      },
      // 查看列表点击参与部门
      handleSelectDept(href) {
        this.activeDeptID = href.slice(1)
      },
      // 重置对象
      resetMemo() {
        this.memo = {
          id: '',
          memoName: '',
          memoType: '',
          unionNum: 0,
          memoStatus: '0',
          fileCode: '',
          signDate: '',
          initiateDept: '',
          initiateDeptName: '',
          memoDepartName: '',
          departs: [],
          measures: []
        }
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        api.getMemoList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 获取部门-措施映射值
      async getDeptMeasuresMap(memoId = '') {
        try {
          let resp = await deptMeasuresMap(memoId)
          if (resp.data.code === '0') {
            return resp.data.data
          }
          return []
        } catch (e) {
          return []
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .top-wrap {
    .total {
      padding: 0 20px;
      line-height 40px;
      font-size: 16px;
      padding-bottom: 15px;
      &:first-child {
        border-right: 1px solid #d9d9d9;
      }
    }
  }
  .dept-measures {
    .departs {
      padding: 0 15px;
      width: 280px;
      border-right: 1px solid #d9d9d9;
      .dept-name {
        cursor: pointer;
        &.active {
          color: #1089ff;
        }
      }
    }
    .measures {
      padding: 0 0 0 20px;
      .item {
        line-height: 35px;
        .dept-name {
          font-size: 16px;
          &.active {
            color: #1089ff;
          }
        }
      }
    }
  }
</style>
