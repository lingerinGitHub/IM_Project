<template>
<div class="login-box tx-c pd-t-30">
    <div>用户登录</div>
    <div class="form-box flex-row just-c">
      <el-form
        class="mr-t-40"
        ref="loginForm"
        :model="state.loginForm"
        :rules="state.loginFormRules"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入正确的用户名"
            v-model.trim="state.loginForm.username"
          >
            <template #prefix>
              <img src="@/assets/images/login/yonghu.png" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入正确的账号匹配密码"
            v-model.trim="state.loginForm.password"
          >
            <template #prefix>
              <img src="@/assets/images/login/mima.png" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="identifyCode">
          <el-input
            placeholder="请输入验证码"
            v-model.trim="state.loginForm.identifyCode"
          >
            <template #prefix>
              <img src="@/assets/images/login/code.png" alt="" />
            </template>
          </el-input>
          <IdentifyCode
            ref="identify"
            class="code-box"
            :contentWidth="120"
            :contentHeight="60"
            @updateIdentifyCode="setIdentifyCode"
          ></IdentifyCode>
        </el-form-item>
   
        <el-button type="primary" class="mr-t-30" @click="loginValidator"
          >登录
        </el-button>
      </el-form>
    </div>
  </div>
<template/>

<script lang="ts" setup>
import IdentifyCode from "@/components/IdentifyCode.vue";
 
 const identify = ref(null);
 const validateIdentifyCode = (rule, value, callback) => {
   if (value !== curIdentifyCode.value) {
     callback(new Error("验证码错误!"));
     state.loginForm.identifyCode = "";
     identify.value.refreshCode();
   } else {
     callback();
   }
 };
  
 const state = reactive({
   loginForm: {
     username: "",
     password: "",
     identifyCode: "",
   },
   loginFormRules: {
     username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
     password: [{ required: true, message: "请输入密码", trigger: "blur" }],
     identifyCode: [
       { required: true, message: "请输入验证码", trigger: "blur" },
       { validator: validateIdentifyCode, trigger: "blur" },
     ],
   },
 });
 let curIdentifyCode = ref("");
  
 const loginForm = ref(null);
  
 // 登录校验
 const loginValidator = () => {
   loginForm.value.validate((valid) => {
     if (valid) {
       login();
     }
   });
 };
  
 // 登录
 const login = async () => {
   const { username, password } = state.loginForm;
   const params = {
     username,
     password,
     type: "1",
   };
   const res = await $api.login(params);
   const { code, data } = res;
   if (code === 0 && data) {
     sessionStorage.setItem("isLogin", true);
     sessionStorage.setItem("token", data);
     router.replace("/home");
   } else {
     identify.value.refreshCode();
   }
 };
  
 const setIdentifyCode = (val) => {
   curIdentifyCode.value = val;
 };

<script/>

<style scoped>
.code-box {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
</style>