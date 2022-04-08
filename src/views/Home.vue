<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="文本内容" prop="content">
        <el-input type="textarea" v-model="form.content" autosize></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doMark">开始事件标注</el-button>
        <el-button @click="resetForm">重置内容</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      form: {
        content: "",
      },
      rules: {
        content: [
          { required: true, message: "请输入文本内容", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    doMark: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$router.push({
            name: "EventMark",
            params: this.form,
          });
        } else {
          return false;
        }
      });
    },
    resetForm: function () {
      this.$refs["form"].resetFields();
    },
  },
};
</script>
