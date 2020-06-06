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
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:memoName="{row}">
            <b-button type="text" @click="handleCheck(row)">{{ row.memoName }}</b-button>
          </template>
          <template v-slot:memoType="{row}">{{ memoTypeMap[row.memoType] }}</template>
          <template v-slot:memoStatus="{row}">{{ memoStatusMap[row.memoStatus] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
            <b-button :disabled="!canModify || row.memoStatus!=='0'" type="text" @click="handleModify(row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <b-button :disabled="!canRemove" type="text" text-color="danger"
                      @click="handleRemove(row)">
              删除
            </b-button>
            <b-button :disabled="!havePermission('batchReceive')"
                      v-if="row.memoStatus==='0'" type="text"
                      @click="handleReceive(row)">
              批量接收
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <template slot="full">
          <b-collapse v-model="infoOpen" simple>
            <b-collapse-panel title="基础信息" name="1">
              <b-form :model="memo" ref="form" :rules="ruleValidate" :label-width="130">
                <b-form-item label="备忘录名称" prop="memoName">
                  <b-input v-model="memo.memoName" placeholder="请输入备忘录名称" clearable/>
                </b-form-item>
                <b-row :gutter="20">
                  <b-col span="12">
                    <b-form-item label="发起部门" prop="initiateDept">
                      <urp-dept-select v-model="memo.initiateDept" :default-name="memo.initiateDeptName" show-btn
                                       @on-choose="({departName})=>{memo.initiateDeptName=departName}"/>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="备忘录类型" prop="memoType">
                      <b-select v-model="memo.memoType" placeholder="全部" clearable  @on-change="memoTypeChange">
                        <b-option v-for="(val,key) in memoTypeMap" :key="key" :value="key">{{ val }}</b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-row :gutter="20">
                  <b-col span="12">
                    <b-form-item label="备忘录状态" prop="memoStatus">
                      <b-select v-model="memo.memoStatus" disabled>
                        <b-option v-for="(val,key) in memoStatusMap" :key="key" :value="key">{{ val }}</b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="文号" prop="fileCode">
                      <b-input v-model="memo.fileCode" placeholder="请输入文号" clearable/>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-row :gutter="20">
                  <b-col span="12">
                    <b-form-item label="签署日期" prop="signDate">
                      <b-date-picker type="date" :value="memo.signDate"
                                     @on-change="(date)=>{memo.signDate=date}"/>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="联合部门数" prop="unionNum">
                      <b-input v-model="memo.unionNum" disabled/>
                    </b-form-item>
                  </b-col>
                </b-row>
              </b-form>
            </b-collapse-panel>
            <b-collapse-panel title="参与部门及关联措施" name="2">
              <dept-measures ref="deptMeasures" :departs="departsBuffer" :dept-measures="deptMeasuresBuffer" :memoType="memo.memoType"
                             @on-change="handleDeptMeasuresChange"/>
            </b-collapse-panel>
          </b-collapse>
          <!-- <b-code-editor class="mt-20" v-if="isEdit" :value="JSON.stringify(memo,null,2)" readonly/>-->
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
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
            <v-key-label label="签署日期" is-first is-half is-bottom>{{ memo.signDate }}</v-key-label>
            <v-key-label label="联合部门数" is-half is-bottom>{{ memo.unionNum }}</v-key-label>
          </b-collapse-panel>
        </b-collapse>
      </div>
      <div style="margin-top: 20px;">
        <b-collapse value="1" simple>
          <b-collapse-panel title="参与部门及关联措施" name="1">
            <div class="top-wrap" flex="box:first">
              <div class="total" style="width: 280px;">参与部门({{ deptMeasuresBuffer.length }})</div>
              <div class="total">处置措施<!--({{ allMeasures }})--></div>
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
                    <span style="float: right;margin-right: 20px;font-size: 14px">{{dept.receiveStatus === '0' ? '未接收':'已接收' }}</span>
                  </div>
                  <div class="measure-item" v-for="measure in dept.measures"  :key="measure.id">
                    <b-checkbox :value="measure.isUse==='1'" v-if="measure.isUse==='1'"  disabled>
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
  import * as api from '../../../api/urp/memo.api'
  import { requiredRule } from '../../../common/utils/validate'
  import UrpDeptSelect from '../components/UrpDeptSelect'
  import { deepCopy } from '../../../common/utils/assist'
  import DeptMeasures from '../components/DeptMeasures'

  export default {
    name: 'Memo',
    components: { DeptMeasures, UrpDeptSelect },
    mixins: [commonMixin, permission],
    data() {
      const validateMemoName = (rule, value, callback) => {
        if (value.length > 200) {
          callback(new Error('备忘录名称必须小于200个字符'))
        } else {
          api.oneMemoName(this.memo).then(response => {
            if (response.data.data) {
              callback(new Error('备忘录名称重复'))
            } else {
              callback()
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        listQuery: {
          memoName: '',
          memoType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '备忘录名称', slot: 'memoName' },
          { title: '备忘录类型', slot: 'memoType', align: 'center', width: 150 },
          { title: '发起部门', key: 'initiateDeptName', width: 150 },
          { title: '联合部门数', key: 'unionNum', align: 'center', width: 120 },
          { title: '备忘录状态', slot: 'memoStatus', align: 'center', width: 120 },
          { title: '签署日期', key: 'signDate', align: 'center', width: 120 },
          { title: '操作', slot: 'action', width: 200 }
        ],
        memoTypeMap: { '1': '惩戒', '2': '激励' },
        memoStatusMap: { '0': '通报', '1': '实施', '2': '过期' },
        memo: {
            memoType: '1'
        },
        ruleValidate: {
          memoName: [requiredRule, { validator: validateMemoName, trigger: 'blur' }],
          initiateDept: [{ required: true, message: '部门必选', trigger: 'change' }],
          memoType: [{ required: true, message: '类型必选', trigger: 'change' }],
          unionNum: [{ required: true, message: '必填项', trigger: 'blur', type: 'number' }],
          memoStatus: [{ required: true, message: '状态必选', trigger: 'change' }],
          fileCode: [requiredRule],
          signDate: [{ required: true, message: '签署日期必选', trigger: 'change' }]
        },
        infoOpen: ['1', '2'],
        initDeptMeasuresMap: [], // 初始的部门-措施映射列表
        departsBuffer: [], // 联合部门树缓存，用于修改时初始化树结构
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
      this.getDeptMeasuresMap().then(data => {
        this.initDeptMeasuresMap = data
      })
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          memoName: '',
          memoType: ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetMemo()
        // 缓存原始映射值
        this.departsBuffer = []
        this.deptMeasuresBuffer = deepCopy(this.initDeptMeasuresMap)
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetMemo()
        this.memo = { ...this.memo, ...row }
        // 查询已配置好的部门-措施映射
        Promise.all([this.getDeptMeasuresMap(this.memo.id), api.getModifyUrpDeparts(this.memo.id)])
          .then(([resp1, resp2]) => {
            this.deptMeasuresBuffer = resp1
            if (resp2.data.code === '0') {
              this.departsBuffer = resp2.data.data
            }
          })
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck(row) {
        this.resetMemo()
        this.memo = { ...this.memo, ...row }
        // 查询已配置好的部门-措施映射
        Promise.all([this.getDeptMeasuresMap(this.memo.id), api.getModifyUrpDeparts(this.memo.id)])
          .then(([resp1, resp2]) => {
            let deptMeasures1 = resp1
            let deptMeasures2 = this.tiledReadyDeparts(resp2.data.data)
            this.deptMeasuresBuffer = deptMeasures1.filter(item => {
              return deptMeasures2.findIndex(i => i.departId === item.id) > -1
            })
            this.deptMeasuresBuffer.forEach((item) => {
               let index = deptMeasures2.findIndex(i => i.departId === item.id)
               item.receiveStatus = deptMeasures2[index].receiveStatus
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
          all.push({ departId: node.id, departName: node.title || node.text, receiveStatus: node.receiveStatus })
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
      // 查看列表点击参与部门
      handleSelectDept(href) {
        this.activeDeptID = href.slice(1)
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        this.$confirm({
          title: '确实要删除当前备忘录吗？',
          content: '删除这条数据后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeMemo(row).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            }).catch(() => {
              this.$modal.remove()
            })
          }
        })
      },
      // 批量接收
      handleReceive(row) {
        api.receiveAll(row.id).then(resp => {
          if (resp.data.code === '0') {
            this.handleFilter()
          }
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.memo.departs.length === 0 || this.memo.measures.length === 0) {
              this.$message({ type: 'danger', content: '必须关联部门措施' })
              return
            }
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createMemo : api.modifyMemo
            fun(this.memo).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 部门关联措施改变事件
      handleDeptMeasuresChange(tiledDeparts, tiledMeasures, unionDeptCount) {
        this.memo.departs = deepCopy(tiledDeparts)
        this.memo.measures = deepCopy(tiledMeasures)
        this.memo.unionNum = unionDeptCount
      },
      // 重置对象
      resetMemo() {
        this.memo = {
          id: '',
          memoName: '',
          memoType: '1',
          unionNum: 0,
          memoStatus: '0',
          fileCode: '',
          signDate: '',
          initiateDept: '',
          initiateDeptName: '',
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
          let resp = await api.deptMeasuresMap(memoId)
          if (resp.data.code === '0') {
            return resp.data.data
          }
          return []
        } catch (e) {
          return []
        }
      },
      // 备忘录类型改变事件
      memoTypeChange() {
        this.$refs.deptMeasures.clearMeasures(this.memo.memoType)
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
