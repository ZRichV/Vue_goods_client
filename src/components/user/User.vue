<template>
    <div>
        <!-- bread nav -->
        <el-breadcrumb separator-class="el-icon-caret-right">
            <el-breadcrumb-item :to ="{ path: '/home' }">Home
            </el-breadcrumb-item>
            <el-breadcrumb-item>User Manage</el-breadcrumb-item>
            <el-breadcrumb-item>User List</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- card view -->
        <el-card shadow="hover" style="margin-top: 20px">
            <!-- search add -->
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="Please Enter the Content"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
                    <el-button slot="append"
                    icon="el-icon-lollipop"
                    @click="getUserList">
                    </el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button @click="addDrawer = true"
                    style="margin-left: 20px;"
                    round>Add User
                    </el-button>
                </el-col>
            </el-row>
            <!-- User List Area -->
            <!-- stripe: 斑马条纹, border：边框-->
            <el-table :data="userlist"
            border 
            stripe
            highlight-current-row
            style="margin-top: 20px">
            <el-table-column type="index"
            label="#"></el-table-column>
            <el-table-column prop="username" 
            label="User Name"></el-table-column>
            <el-table-column prop="email"
            label="Email Address"></el-table-column>
            <el-table-column prop="mobile"
            label="Phone Number"></el-table-column>
            <el-table-column prop="role_name"
            label="Role"></el-table-column>
            <el-table-column label="Status">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state"
                    @change="userStateChanged(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="Operation">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit"
                    size="mini"
                    circle
                    @click="editDrawer(scope.row.id)"></el-button>
                    <el-button type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="removeUserById(scope.row.id)"></el-button>
                    <el-tooltip class="item"
                    effect="dark"
                    content="Role Assignment"
                    :enterable="false"
                    placement="top">
                    <el-button type="warning"
                    icon="el-icon-setting"
                    size="mini"
                    circle
                    @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            </el-table>
            <!-- Paging area -->
            <!-- size-change:每页条数, current-change:当前页 -->
            <el-pagination @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totle"
            style="margin-top: 20px"></el-pagination>
        </el-card>
        <!-- Drawer for adding user -->
    </div>
</template>

<script>
export default {
    data () {
        // 自定义邮箱规则
        var checkEmail = (rule, value, callback) => {
        const regEmail = /^\w+@\w+(\.\w+)+$/;
        if (regEmail.test(value)) {
            // 合法邮箱
            return callback();
        }
        callback(new Error('Enter right email'));
        }
        // 自定义手机号规则
        var checkMobile = (rule, value, callback) => {
        const regMobile = /^1[34578]\d{9}$/;
        if (regMobile.test(value)) {
            return callback();
        }
        // 返回一个错误提示
        callback(new Error('Enter right mobile'));
        }
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 3
            },
            userlist: [],
            totle: 0,
            addDrawer: false,
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addUserFormRules: {
                username: [
                    { required: true, message: 'Enter name', trigger: 'blur' },
                    { min: 2, max: 10, message: 'Length in 2-10', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Enter password', trigger: 'blur' },
                    { min: 6, max: 18, message: 'Length in 6-18', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'Enter email', trigger: 'blur' },
                    { validator:checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: 'Enter mobile number', trigger: 'blur' },
                    { validator:checkMobile, trigger: 'blur' }
                ]
            },
            editDrawer: false,
            editUserForm: {},
            editUserFormRules: {
                email: [
                    { required: true, message: 'Enter email', trigger: 'blur' },
                    { validator:checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: 'Enter mobile number', trigger: 'blur' },
                    { validator:checkMobile, trigger: 'blur' }
                ]
            },
            setRoleDraw: false,
            userInfo: {},
            roleList: [],
            selectRoleId: ''
        }
    },
    created () {
        this.getUserList();
    },
    methods: {
        async getUserList () {
            const { data:res } = await this.$http.get('users', { params: this.queryInfo });
            if (res.meta.status !== 200 ){
                return this.$message.error('Get User List Failed');
            }
            this.userlist = res.data.users;
            this.totle = res.data.totle;
        },
        // Listen Pagesize Changing Event
        handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        // Listen PageNum Changing Event
        handleCurrentChange (newSzie) {
            this.queryInfo.pagenum = newSize;
            this.getUserList();
        },
        // Listen Switch state changing
        async userStateChanged (userInfo) {
        },
        //Listen addDrawer Closing event
        addDrawerClosed () {
        }
    }
}
</script>

<style lang="less" scoped>

</style>