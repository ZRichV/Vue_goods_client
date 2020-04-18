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
        <el-table-column label="Role Describe" prop="roleDesc"></el-table-column>
        <el-table-column label="Operation" width="300px">

        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data () {
        return {
            rolesList: [],
            setRightDialog: false,
            rightsList: [],
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            defKeys: [],
            addRoleDialog: false,
            addRoleForm: {},
            addRoleFormRules:{
                roleName: [
                    { required: true, message: 'Enter Role Name', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: 'Enter Role Description', trigger: 'blur' }
                ]
            },
            editRoleForm: {},
            editRoleDialog: false,
            editRoleFormRules: {
                roleName: [
                    { required: true, message: 'Enter Role Name', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: 'Enter Role Name', trigger: 'blur' }
                ]
            },
            // 当前即将分配权限的Id
            roleId: 0
        }
    },
    created () {
        this.getRolesList();
    },
    methods: {
        async getRolesList () {
            const {data: res} = await this.$http.get('roles');
            if(res.meta.status !== 200){
                return this.$message.error('Get Roles List Failed');
            }
            this.rolesList = res.data;
        },
        async removeRightById (role, rightId) {
            const confirmResult = await this.$confirm(
                'You will Delete this role, do you want going on?',
                'Remind',{
                    confirmButtonText: 'CONFIRM',
                    cancelButtonText: 'CANCEL',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm') {
                this.$message.info('Cancel Role Delete')
            }
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
            if(res.meta.status !== 200){
                return this.$message.erroe('Delete Right Failed');
            }
            this.rolesList = res.data;
            this.getRolesList();
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