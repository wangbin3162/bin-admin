<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full">
          <v-title-bar label="基本信息" tipPos="left" class="mb-20"></v-title-bar>
          <b-form :model="form" ref="form" :rules="rules" :label-width="100">
            <b-row>
               <b-col span="24">
                <b-col span="12">
                  <b-form-item label="申请目录" prop="resourceKey">
                    <b-select v-model="form.resourceKey">
                      <b-option v-for="item in dirConfigList" :key="item.resourceKey"
                        :value="item.resourceKey"
                        @click.native="handleOptClick(item)">
                        {{ item.resourceName }}
                      </b-option>
                    </b-select>
                  </b-form-item>
                </b-col>
              </b-col>

              <b-col span="24">
                <b-form-item label="选择记录" prop="recordId">
                  <div flex>
                    <b-input :value="recordData" type="textarea" :rows="4" disabled></b-input>
                    <!-- 新增 or 待审核状态则选择记录 -->
                    <b-button v-if="editData === null || editData.status === '1'"
                      type="primary" plain size="small" style="flex: 0 0 auto; margin-left: 5px;"
                      :disabled="form.resourceKey === null" :loading="btnLoading"
                      @click="handleSelectBtn">
                      选择记录
                    </b-button>
                    <b-button v-else
                      type="primary" plain size="small" style="flex: 0 0 auto; margin-left: 5px;">
                      查看详细
                    </b-button>
                  </div>
                </b-form-item>
              </b-col>

              <b-col span="24">
                <b-form-item label="修复原因" prop="repairCause">
                  <b-input v-model="form.repairCause" type="textarea" :rows="4"></b-input>
                </b-form-item>
              </b-col>

              <b-col span="24">
                <b-divider></b-divider>
              </b-col>
            </b-row>

            <b-form-item label="附件列表">
              <repair-apply-attach-list
                :attachments="form.attachments ? form.attachments : []"
                @files-change="handleFilesChange">
              </repair-apply-attach-list>
            </b-form-item>

            <!-- <b-form-item label="处理方法">
              <b-radio label="">信用修复</b-radio>
            </b-form-item> -->

            <b-form-item label="修复内容" prop="repairContent">
              <b-input v-model="form.repairContent" type="textarea" :rows="4"></b-input>
            </b-form-item>
          </b-form>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">
            提 交
          </b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

    <record-select ref="dirSelect"
      @selected="handleSelected"
      :resourceKey="form.resourceKey">
    </record-select>
  </div>
</template>

<script>
  import { getAllDirConfig, getRecordData, repairApply } from '../../../../api/credit-service/credit-repair.api'
  import RepairApplyAttachList from '../../components/RepairApplyAttachList'
  import RecordSelect from '../../components/RecordSelect'

  export default {
    name: 'RepairApplyEdit',
    props: [
      'title',
      'editData'
    ],
    components: {
      RepairApplyAttachList,
      RecordSelect
    },
    data () {
      return {
        btnLoading: false,
        dirConfigList: [], // 申请记录select
        recordData: '', // 选择记录回显
        form: {
          resourceKey: null,
          resourceName: '',
          tableName: '',
          repairCause: '',
          repairContent: '',
          recordId: '',
          name: '',
          personId: '',
          attachment: []
        },
        rules: {
          resourceKey: [
            { required: true, message: '资源ID不能为空', trigger: 'blur' }
          ],
          recordId: [
            { required: true, message: '选择记录不能为空', trigger: 'change' }
          ],
          repairCause: [
            { required: true, message: '修复原因不能为空', trigger: 'change' }
          ],
          repairContent: [
            { required: true, message: '修复内容不能为空', trigger: 'change' }
          ]
        }
      }
    },
    computed: {

    },
    created () {
      this.init()
    },
    methods: {
      // 点击申请目录select option回调
      handleOptClick (dirObj) {
        this.form.resourceKey = dirObj.resourceKey
        this.form.resourceName = dirObj.resourceName
        this.form.tableName = dirObj.tableName
      },
      // 选择记录按钮回到
      async handleSelectBtn () {
        this.btnLoading = true
        try {
          await this.$refs.dirSelect.openModal() // 打开弹框
        } catch (error) {
          this.$alert({
            type: 'danger',
            title: '标题',
            content: error
          })
        }
        this.btnLoading = false
      },
      // 选择记录组件回调
      handleSelected (record) {
        this.form.recordId = record.id
        this.form.name = record.name ? record.name : record.comp_name
        this.form.personId = record.person_id
        this.getRecordData(this.form.resourceKey, this.form.recordId)
      },
      // 附件列表组件回调
      handleFilesChange (files) {
        this.form.attachment = files
      },
      // 获取目录配置列表
      async getAllDirConfig () {
        try {
          const res = await getAllDirConfig()
          this.dirConfigList = res
        } catch (error) {
          this.$notice.danger({ title: 'getAllDirConfig Failed', desc: error })
        }
      },
      // 获取选择记录回显内容
      async getRecordData (resourceKey, recordId) {
        try {
          const res = await getRecordData(resourceKey, recordId)
          this.recordData = res.recordData
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: 'getRecordData Failed', desc: error })
        }
      },
      // 提交按钮回调
      async handleSubmit () {
        // console.log(this.form)
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.btnLoading = true
          try {
            await repairApply(this.form)
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success')
            this.$emit('close')
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '操作失败', desc: error })
          }
          this.btnLoading = false
        }
      },
      init () {
        this.getAllDirConfig()
        if (this.editData) {
          this.form = this.$util.deepClone(this.editData)
          this.getRecordData(this.form.resourceKey, this.form.recordId)
        }
      }
    }
  }
</script>
