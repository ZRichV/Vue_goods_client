<template>
  <div>
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Data Statistics</el-breadcrumb-item>
      <el-breadcrumb-item>Data Report</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 750px; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import echarts from "echarts";
import _ from 'lodash';
export default Vue.extend({
    data(){
        return{
            options: {
                title: {
                    text: 'Source of Users'
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    boundaryGap: false,
                }],
                yAxis: [{
                    type: 'value'
                }]
            }
        }
    },
    created(){

    },
    async mounted(){
        var myChart = echarts.init(document.getElementById('main'));
        const{ data: res } = await this.$http.get('/reports/type/1');
        if (res.meta.status !== 200) return this.$message('获取折线图数据失败!');
        const result = _.merge(res.data, this.options);
        myChart.setOption(result);;
    },
    methods:{}
});
</script>

<style lang="less" scoped>
</style>