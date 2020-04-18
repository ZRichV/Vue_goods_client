<template>
  <div>
    <!-- bread nav -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>User Manage</el-breadcrumb-item>
      <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card view -->
    <el-card shadow="hover">
      <!-- search add -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="Please Enter the Content"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-lollipop" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDrawer = true" style="margin-left: 20px;" round>Add User</el-button>
        </el-col>
      </el-row>
      <!-- User List Area -->
      <!-- stripe: 斑马条纹, border：边框-->
      <el-table :data="userlist" border stripe highlight-current-row>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="User Name"></el-table-column>
        <el-table-column prop="email" label="Email Address"></el-table-column>
        <el-table-column prop="mobile" label="Phone Number"></el-table-column>
        <el-table-column prop="role_name" label="Role"></el-table-column>
        <el-table-column label="Status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" circle @click="showEditDrawer(scope.row.id)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="Role Assignment"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                circle
                @click="setRoleDrawerShow(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- Paging area -->
      <!-- size-change:每页条数, current-change:当前页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
      ></el-pagination>
    </el-card>

    <!-- Drawer for Adding User -->
    <el-drawer
      title="ADD USER"
      :visible.sync="addDrawer"
      direction="rtl"
      size="30%"
      @close="addDrawerClosed"
    >
      <!-- Main Content -->
      <el-form
        :model="addUserForm"
        ref="addUserFormRef"
        :rules="addUserFormRules"
        label-width="100px"
      >
        <el-form-item label="USERNAME" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="PASSWORD" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="EMAIL" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="MOBILE" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div class="drawer-button">
        <el-button @click="addDrawerClosed" round>CANCEL</el-button>
        <el-button @click="addUser" round>CONFIRM</el-button>
      </div>
    </el-drawer>

    <!-- Drawer for Editing User -->
    <el-drawer
      title="Edit User Information"
      :visible.sync="editDrawer"
      size="30%"
      @close="editDrawerClosed"
    >
      <el-form
        :model="editUserForm"
        ref="editUserFormRef"
        :rules="editUserFormRules"
        label-width="100px"
      >
        <el-form-item label="USERNAME" prop="username">
          <el-input v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="EMAIL" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="MOBILE" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div class="drawer-button">
        <el-button @click="editDrawerClosed" round>CANCEL</el-button>
        <el-button @click="editUser" round>CONFIRM</el-button>
      </div>
    </el-drawer>

    <!-- Drawer for Setting User Role -->
    <el-drawer
      title="Set Role"
      :visible.sync="setRoleDrawer"
      size="30%"
      @close="setRoleDrawerClosed"
    >
      <div>
        <p>USERNAME: {{ userInfo.username }}</p>
        <p>USERROLE: {{ userInfo.role_name }}</p>
        <p>
          SET ROLE:
          <!-- filterable:是否可搜索, allow-create:是否允许用户创建新条目，需配合 filterable 使用 -->
          <el-select
            v-model="selectRoleId"
            filterable
            allow-create
            default-first-option
            placeholder="SELECT ROLE"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <div class="drawer-button">
        <el-button @click="setRoleDrawerClosed" round>CANCEL</el-button>
        <el-button @click="setRole" round>CONFIRM</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("Enter right email"));
    };
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      // 返回一个错误提示
      callback(new Error("Enter right mobile"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 3
      },
      userlist: [],
      totle: 0,
      addDrawer: false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserFormRules: {
        username: [
          { required: true, message: "Enter name", trigger: "blur" },
          { min: 2, max: 10, message: "Length in 2-10", trigger: "blur" }
        ],
        password: [
          { required: true, message: "Enter password", trigger: "blur" },
          { min: 6, max: 18, message: "Length in 6-18", trigger: "blur" }
        ],
        email: [
          { required: true, message: "Enter email", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "Enter mobile number", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editDrawer: false,
      editUserForm: {},
      editUserFormRules: {
        email: [
          { required: true, message: "Enter email", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "Enter mobile number", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      setRoleDrawer: false,
      // User Now
      userInfo: {},
      // All Roles
      roleList: [],
      selectRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("Getting User List Failed");
      }
      this.userlist = res.data.users;
      this.totle = res.data.total;
    },
    // Listen Pagesize Changing Event
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // Listen PageNum Changing Event
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getUserList();
    },
    // Listen Switch state changing
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("Updating User State Failed");
      }
      this.$message.success("Updating User State Successed! ");
    },
    // Listen addDrawer Closing event
    addDrawerClosed() {
      this.addDrawer = false;
      this.$refs.addUserFormRef.resetFields();
    },
    // Add User
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) {
          this.$message.error("Adding User Failed");
        }
        this.$message.success("Adding User Successed");
        this.addDrawer = false;
        this.getUserList();
      });
    },
    // Destory User
    async removeUserById(id) {
      const confirmResult = await this.$confirm("Destory User?", "Remainder", {
        confirmButtonText: "CONFIRM",
        cancelButtonText: "CANCEL",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("Canceled deletion");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("Deleting User Failed ");
      }
      this.$message.success("Deleting User Successed ");
      this.getUserList();
    },
    // Show User Information
    async showEditDrawer(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("Searching User Information Failed ");
      }
      this.editDrawer = true;
      this.editUserForm = res.data;
    },
    // Listen Edit User Drawer Closing Event
    editDrawerClosed() {
      this.$refs.editUserFormRef.resetFields();
      this.editDrawer = false;
    },
    // Edit User Information
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("Failed");
        }
        this.editDrawer = false;
        this.$message.success("Successed");
        this.getUserList();
      });
    },
    // Show Set Role Drawer
    async setRoleDrawerShow (role) {
        this.userInfo = role;
        const { data : res } = await this.$http.get('roles');
        if(res.meta.status !== 200) {
            return this.$message.error("Getting Role List Failed");
        }
        this.roleList = res.data;
        this.setRoleDrawer =true;
    },
    // Set Role
    async setRole () {
        if(!this.selectRoleId){
            return this.$message.error("Select Role");
        }
        const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId });
        if (res.meta.status !== 200) {
            return this.$message.error("Failed");
        }
        this.$message.success('Successed');
        this.getUserList();
        this.setRoleDrawer = false;
    },
    // Listen Set Role Drawer Closing Event
    setRoleDrawerClosed () {
        this.selectRoleId = '';
        this.userInfo = {};
        this.setRoleDrawer = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>