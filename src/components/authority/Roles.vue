<template>
  <div>
    <!-- bread nav -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Role Manage</el-breadcrumb-item>
      <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card view -->
    <el-card>
      <!-- Add Role -->
      <el-row>
        <el-col>
          <el-button round @click="addRoleDialog=true">Add Role</el-button>
        </el-col>
      </el-row>
      <!-- Role List -->
      <el-table :data="rolesList" border stripe>
        <!-- expand: 可以向下展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- Lv1 Authority -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- Lv2 Lv3 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- Index Col-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="Role Name" prop="roleName"></el-table-column>
        <el-table-column label="Role Description" prop="roleDesc"></el-table-column>
        <el-table-column label="Operation" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >Edit</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
            >Delete</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >Set Role</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- Set right -->
    <el-dialog
      title="SET RIGHT"
      :visible.sync="setRightDialog"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogClosed">CANCEL</el-button>
        <el-button type="primary" @click="allotRights">CONFIRM</el-button>
      </span>
    </el-dialog>
    <!-- Add Role -->
    <el-dialog
      title="ADD ROLE"
      :visible.sync="addRoleDialog"
      width="40%"
      @close="addRoleDialogClosed"
    >
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="130px"
      >
        <el-form-item label="ROLE NAME" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="DESCRIPTION" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogClosed">CANCEL</el-button>
        <el-button type="primary" @click="addRoles">CONFIRM</el-button>
      </span>
    </el-dialog>
    <!-- Edit Role -->
    <el-dialog
      title="EDIT ROLE"
      :visible.sync="editRoleDialog"
      width="40%"
      @close="editRoleDialogClosed"
    >
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="150px"
      >
        <el-form-item label="ROLE NAME" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="DESCRIPTION" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogClosed">CANCEL</el-button>
        <el-button type="primary" @click="editRoles">CONFIRM</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      rolesList: [],
      setRightDialog: false,
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children"
      },
      // default chosen ID
      defKeys: [],
      addRoleDialog: false,
      addRoleForm: {},
      addRoleFormRules: {
        roleName: [
          { required: true, message: "Enter Role Name", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "Enter Role Description", trigger: "blur" }
        ]
      },
      editRoleForm: {},
      editRoleDialog: false,
      editRoleFormRules: {
        roleName: [
          { required: true, message: "Enter Role Name", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "Enter Role Description", trigger: "blur" }
        ]
      },
      // 当前即将分配权限的Id
      roleId: 0
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("Get Roles List Failed");
      }
      this.rolesList = res.data;
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "You will Delete this right, do you want going on?",
        "Remind",
        {
          confirmButtonText: "CONFIRM",
          cancelButtonText: "CANCEL",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("Cancel Right Delete");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("Deleting Right Failed");
      }
      this.rolesList = res.data;
      this.getRolesList();
    },
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$messsage.error("Getting Right Failed");
      }
      this.rightsList = res.data;
      // get lv3 id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialog = true;
    },
    getLeafKeys(node, arr) {
      // no children is lv3
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    setRightDialogClosed() {
      this.defKeys = [];
      this.rightsList = [];
      this.setRightDialog = false;
    },
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
      this.addRoleDialog = false;
    },
    addRoles() {
      this.$refs.addRoleFormRef.validate(async vaild => {
        if (!vaild) return;
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) {
          this.$message.error("Adding Role Failed");
        }
        this.$message.success("Adding Role Succesed");
        this.addRoleDialog = false;
        this.getRolesList();
      });
    },
    async removeRoleById(id) {
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
        return this.$message.info("Cancel Role Delete");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("Deleting Role Failed");
      }
      this.$message.success("Deleting Role Successed");
      this.getRolesList();
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$messsage.error("Getting Role Information Failed");
      }
      this.editRoleForm = res.data;
      this.editRoleDialog = true;
    },
    editRoles() {
      this.$refs.editRoleFormRef.validate(async vaild => {
        if (!vaild) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        );
        if (res.meta.status !== 201) {
          this.$message.error("Editing Role Failed");
        }
        this.$message.success("Editing Role Succesed");
        this.editRoleDialog = false;
        this.getRolesList();
      });
    },
    // Alloction Right
    async allotRights(roleId) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("Alloction Right Failed");
      }
      this.$message.success("Alloction Right Successed");
      this.getRolesList();
      this.setRightDialog = false;
    },
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields();
      this.editRoleDialog = false;
    }
  }
});
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>