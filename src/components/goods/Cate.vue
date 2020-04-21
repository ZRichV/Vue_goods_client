<template>
  <div>
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods manage</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Catagories</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button round @click="showAddCateDialog">Add Catagories</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        :show-row-hover="true"
        show-index
        border
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-succes"
            style="color: lightGreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">Lv1</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">Lv2</el-tag>
          <el-tag size="mini" type="warning" v-else>Lv3</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
          >Edit</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
          >Delete</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- Add Dialog -->
    <el-dialog
      title="Add Categories"
      :visible.sync="addCateDialog"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="150px"
      >
        <el-form-item label="Cate Name: ">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="Parent Cate: ">
          <!-- options：数据源 -->
          <!-- props：指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            filerable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="addCateDialogClosed">CANCEL</el-button>
        <el-button round @click="addCate">CONFIRM</el-button>
      </span>
    </el-dialog>
    <!-- Edit Dialog -->
    <el-dialog
      title="Edit Categories"
      :visible.sync="editCateDialog"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="150px"
      >
        <el-form-item label="Cate Name: ">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="editCateDialogClosed">CANCEL</el-button>
        <el-button round @click="editCate">CONFIRM</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: "Cata Name",
          prop: "cat_name"
        },
        {
          label: "Is Vaild",
          type: "template",
          template: "isOk"
        },
        {
          label: "order",
          type: "template",
          template: "order"
        },
        {
          label: "operation",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialog: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "Enter Cate Name", trigger: "blur" }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        // 配置触发选项 hover/click
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedKeys: [],
      editCateDialog: false,
      editCateFormRules: {
        cat_name: [
          { required: true, message: "Enter Cate Name", trigger: "blur" }
        ]
      },
      editCateForm: ""
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("Getting Goods Cate Failed");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialog = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("Getting Parent Cate Failed！");
      }
      this.parentCateList = res.data;
    },
    // Add cate, trigge when chosen changing
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return 0;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("Adding Cate Failed");
        }

        this.$message.success("Adding Cate successed！");
        this.getCateList();
        this.addCateDialog = false;
      });
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
      this.addCateDialog = false;
    },
    async removeCate(id) {
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
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("Deleting Cate Failed");
      }
      this.$message.success("Deleting Cate Successed");
      this.getCateList();
    },
    async showEditCateDialog(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("Getting Cate Failed");
      this.editCateForm = res.data;
      this.editCateDialog = true;
    },
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "categories/" + this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("Editing Cate Failed");
        this.$message.success("Editing Cate Successed");
        this.getCateList();
        this.editCateDialog = false;
      });
    },
    editCateDialogClosed(){
        this.editCateDialog = false;
        this.$refs.editCateFormRef.resetFields();
    }
  }
});
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 20px;
}
</style>