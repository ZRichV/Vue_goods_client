<template>
  <div>
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods manage</el-breadcrumb-item>
      <el-breadcrumb-item>Add Goods</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="Add Good Information" type="info" center show-icon :closable="false"></el-alert>
      <!-- steps -->
      <el-steps :space="200" :active="activeIndex - 0" finish_status="success" align-center>
        <el-step title="Basic Information"></el-step>
        <el-step title="Good Parameters"></el-step>
        <el-step title="Good Attributes"></el-step>
        <el-step title="Good Pictures"></el-step>
        <el-step title="Good Content"></el-step>
        <el-step title="Finish"></el-step>
      </el-steps>
      <!-- Tab -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="Basic Information" name="0">
            <el-form-item label="Good Name" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="Good Price" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Good Weight" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Good Number" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Good Category" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Good Parameters" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Good Attributes" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Good Pictures" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" round>Click to Upload</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="Good Content" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button round class="btnAdd" @click="addGoods">Add Good</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="Picture Preview" :visible.sync="picPreviewDialog" width="50%">
      <img :src="picPreviewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
export default Vue.extend({
  data() {
    return {
      // 步骤条默认激活 与左侧Tab联动
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "Enter Good Name", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "Enter Good Price", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "Enter Good Weight", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "Enter Good Number", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "Enter Good Category", trigger: "blur" }
        ]
      },
      cateList: [],
      cascaderProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://127.0.0.1:3000/api/shop/upload',
      headerObj: {
          Authorization: window.sessionStorage.getItem('token')
      },
      picPreviewPath: '',
      picPreviewDialog: false
    };
  },
  created(){
      this.getCateList();
  },
  computed: {
      getCateId(){
          if(this.addForm.goods_cat.length === 3){
              return this.addForm.goods_cat[2];
          }
          return null;
      }
  },
  methods: {
      async getCateList(){
          const{data: res} = await this.$http.get('categories');
          if(res.meta.status !== 200){
              return this.$message.error('Getting Good List Failed');
          }
          this.cateList = res.data;
      },
      handleChange (){
          if(this.addForm.goods_cat.length !== 3){
              this.addForm.goods_cat = [];
          }
      },
      beforeTabLeave (activeName, oldActiveName){
          if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
              this.$message.error('Choose good Category')
              return false;
          }
      },
      async tabClicked(){
          if(this.activeIndex === '1'){
              const{data: res} = await this.$http.get(`categories/${this.getCateId}/attributes`, {
                  params: { sel: 'many'}
              });
              if(res.meta.status !== 200){
                  return this.$message.error('Getting Active Parameter List Failed');
              }
              res.data.forEach(item => {
                  item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
              });
              this.manyTableData = res.data;
          }else if(this.activeIndex === '2'){
              const{data: res} = await this.$http.get(`categories/${this.getCateId}/attributes`, {
                  params: { sel: 'only' }
              });
              if(res.meta.status !== 200){
                  return this.$message.error('Getting Static Parameter List Failed');
              }
              this.onlyTableData = res.data;
          }
      },
      handlePreview(file){
          this.picPreviewPath = file.response.data.url;
          this.picPreviewDialog = true;
      },
      handleRemove(file){
          // 1.获取将要删除图片的临时路径
          const filePath = file.response.data.tmp_path;
          // 2.从pics数组中，找到图片对应的索引值
          const i = this.addForm.pics.findIndex(x => x.pic === filePath);
          // 3.调用splice方法，移除图片信息
          this.addForm.splice(i, 1);
      },
      handleSuccess(response){
          // 1.拼接得到一个图片信息对象 临时路径
          const picInfo = { pic: response.data.tmp_path };
          // 2.将图片信息对象，push到pics数组中
          this.addForm.pics.push(picInfo);
      },
      addGoods(){
          this.$refs.addFormRef.validate(async valid => {
              if(!valid) return this.$message.error('Please fill in the necessary form items!');
              // 除了它会递归拷贝 value。（注：也叫深拷贝）。
              // 级联选择器绑定的对象goods_cat要求是数组对象
              const form = _.cloneDeep(this.addForm);
              form.goods_cat = form.goods_cat.join(',');
              this.manyTableData.forEach(item => {
                  const newInfo = {
                      attr_id: item.attr_id,
                      attr_value: item.attr_vals.join(' ')
                  };
                  this.addForm.attrs.push(newInfo);
              });
              this.onlyTableData.forEach(item => {
                  const newInfo = {
                      attr_id: item.attr_id,
                      attr_value: item.attr_vals
                  };
                  this.addForm.attrs.push(newInfo);
              });
              form.attrs = this.addForm.attrs;
              const { data: res } = await this.$http.post('goods', form);
              if (res.meta.status !== 201) return this.$message.error('Adding Good Failed');
              this.$message.success('Adding Good Successed');
              this.$router.push('/goods');
          });
      }
  }
});
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px
}
</style>