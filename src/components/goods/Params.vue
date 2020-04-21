<template>
  <div>
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods manage</el-breadcrumb-item>
      <el-breadcrumb-item>Goods List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="Note: Only Parameters Are Allowed For Lv3 Classifications"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>Choose Good Categories:</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab -->
      <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
        <!-- Active Pane -->
        <el-tab-pane label="Active Parameters" name="many">
          <el-button
            round
            size="mini"
            :disabled="isDisabled"
            @click="addDialog = true"
          >Add Parameters</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scop.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- Index Col -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Name" prop="attr_name"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >Edit</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- Static Pane -->
        <el-tab-pane label="Static Parameters" name="only">
          <el-button
            round
            size="mini"
            :disabled="isDisabled"
            @click="addDialog = true"
          >Add Parameters</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scop.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- Index Col -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Name" prop="attr_name"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >Edit</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- Add Params Dialog -->
    <el-dialog
      :title="'Add ' + getTitleText"
      :visible.sync="addDialog"
      with="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="addDialogClosed">CANCEL</el-button>
        <el-button round @click="addParams">CONFIRM</el-button>
      </span>
    </el-dialog>
    <!-- Edit Params Dialog -->
    <el-dialog
      :title="'Edit ' + getTitleText"
      :visible.sync="editDialog"
      with="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="150px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="editDialogClosed">CANCEL</el-button>
        <el-button round @click="editParams">CONFIRM</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      // Good Cate List
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedCateKeys: [],
      activeTabsName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialog: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "Enter Parameter Name", trigger: "blur" }
        ]
      },
      editDialog: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: "Enter Parameter Name", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // lv3 ID now chosen
    getCateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    getTitleText() {
      if (this.activeTabsName === "many") {
        return "Active Parameter";
      }
      return "Static Parameter";
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("Getting Good Data List Failed");
      }
      this.cateList = res.data;
    },
    handleChange() {
      this.getParamsData();
    },
    handleTabsClick() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeTabsName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("Getting Parameter List Failed");
      }
      res.data.forEach(item => {
        //   通过三元表达式判断attr_vals是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框的输入值
        item.inputValue = "";
      });
      if (this.activeTabsName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.addDialog = false;
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeTabsName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("Adding params Failed");
        }
        this.$message.success("Adding params Succeessed！");
        this.addDialog = false;
        this.getParamsData();
      });
    },
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeTabsName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("Getting Cate Failed");
      }
      this.editForm = res.data;
      this.editDialog = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.editDialog = false;
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeTabsName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("Editing Param Failed");
        }
        this.$message.success("Editing Param Successed");
        this.getParamsData();
        this.editDialog = false;
      });
    },
    async removeParams(attrId) {
      const confirmResult = await this.$confirm(
        "You will Delete this role, do you want going on?",
        "Remind",
        {
          confirmButtonText: "CONFIRM",
          cancelButtonText: "CANCEL",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("Canel Delete");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${attrId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("Deleting Param Failed");
      }
      this.$message.success("Deleting Param Successed");
      this.getParamsData();
    },
    // input lose focus or press Enter
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("Edit Param Failed");
      }
      this.$message.success("Edit Param Successed");
    },
    // Press Button to show input
    showInput(row) {
      row.inputVisible = true;
      // 让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  }
});
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-col span {
  margin-right: 10px;
}
.el-cascader {
  width: 25%;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 90px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>