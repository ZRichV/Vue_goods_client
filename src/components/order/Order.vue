<template>
  <div>
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Order manage</el-breadcrumb-item>
      <el-breadcrumb-item>Order List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="Enter Content">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- Order List -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column width="230px" label="Order Number" prop="order_number"></el-table-column>
        <el-table-column label="Order Price" prop="order_price"></el-table-column>
        <el-table-column label="Ispay">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.pay_status">Cant Afford It</el-tag>
            <el-tag type="success" size="mini" v-else>Rich Man</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Isdelivery" prop="is_send"></el-table-column>
        <el-table-column label="Order Time" prop="create_time"></el-table-column>
        <el-table-column label="Operation">
          <template slot>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog"></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showProgressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- Edit Dialog -->
    <el-dialog
      title="Edit Address"
      :visible.sync="addressDialog"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="170px"
      >
        <el-form-item label="Provice/City/Country" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="detailed address" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="addressDialogClosed">CANCEL</el-button>
        <el-button round type="primary" @click="editAddress">CONFIRM</el-button>
      </span>
    </el-dialog>
    <!-- Delivery Information -->
    <el-dialog title="Check Delivery Process" :visible.sync="progressDialog" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{ activity.context }}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import cityData from "./citydata.js";
export default Vue.extend({
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressDialog: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "Choose Provice/City/Country",
            trigger: "blur"
          }
        ],
        address2: [
          { required: true, message: "Detail Address", trigger: "blur" }
        ]
      },
      cityData,
      progressDialog: false,
      progressInfo: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("Getting Order List Failed");
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getOrderList();
    },
    showEditDialog() {
      this.addressDialog = true;
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
      this.addressDialog = false;
    },
    async showProgressDialog() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662');
      if(res.meta.status != 200){
          return this.$message.error('Getting Delivery Progress Failed');
      }
      this.progressInfo = res.data;
      this.progressDialog = true;
    }
  }
});
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>