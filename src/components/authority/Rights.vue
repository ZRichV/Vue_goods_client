<template>
  <div>
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Role manage</el-breadcrumb-item>
      <el-breadcrumb-item>Role List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="Role Name" prop="authName"></el-table-column>
        <el-table-column label="Path" prop="path"></el-table-column>
        <el-table-column label="Role Level" prop="level">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">lv1</el-tag>
                <el-tag type="success" v-else-if="scope.row.level === '1'">lv2</el-tag>
                <el-tag type="danger" v-else>lv3</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
        rightsList: []
    };
  },
  created() {
      this.getRightsList();
  },
  methods: {
      async getRightsList(){
          const{ data: res } = await this.$http.get('rights/list');
          if(res.meta.status !== 200){
              return this.$message.error('Getting Rights List Failed');
          }
          this.rightsList = res.data
      }
  }
});
</script>
<style lang="less" scoped>
</style>