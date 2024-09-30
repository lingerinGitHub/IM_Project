<template>
    <div class="register-container">
        <div class="item title">
            <h1>Registration</h1>
        </div>
        <div class="item username">
            <el-input class="username" v-model="test" style="width: 80%" type="password"
                placeholder="Username" />
        </div>
        <div class="item email">
            <el-input class="email" v-model="test" style="width: 80%" type="password"
                placeholder="Email" />
        </div>
        <div class="item password">
            <el-input class="password" v-model="test" style="width: 80%" type="password"
                placeholder="Password" show-password />
        </div>
        <div class="item condition">
            <el-radio-group v-model="radio1">
                <el-radio value="Value 1">
                    <h3>I agree to the terms & conditions</h3>
                </el-radio>
            </el-radio-group>

        </div>
        <div class="item register-btn">
            <el-button class="button" type="primary" round
                >登录</el-button>
        </div>
        <div class="item mention">
            <button>
                <h5>Already have an account? Login</h5>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const test = ref()
const radio1 = ref()
</script>

<style lang="scss" scoped>
.register-container {
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-items: center;
    column-gap: 2%;
    margin-top: 8%;
    height: 65vh;
    width: 40%;
    border-radius: 30px;
    backdrop-filter: blur(20px) brightness(95%) contrast(80%) opacity(100%);
    box-shadow: 10px 10px 5px -4px rgba(0, 0, 0, 0.4);

    .item {
        height: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        

        // background-color: pink;
        ::v-deep .el-input:first-child {
            border-radius: 18px;
            height: 65%;
            width: 80%;
            padding-left: 16px;
            padding-right: 16px;
            background-color: rgba(188, 188, 188, 0.4);
            box-shadow: 10px 10px 5px -4px rgba(0, 0, 0, 0.15);
            // color: #fff;
            font-size: 18px;


        }

        ::v-deep .el-input__inner {


            &::placeholder {
                // color: rgba(247, 251, 255, 0.80);
                color: rgba(71, 71, 71, 0.55);
                font-size: 15px;
                font-weight: 500;
            }
        }

        ::v-deep .el-input__suffix-inner {

            .el-input__icon {
                padding-right: -10%;
                color: #606366;
            }
        }

        ::v-deep .el-input__wrapper {
            background-color: transparent;
            // border: 0;
            // border-left: 20px ;
            box-shadow: 0 0 0 0;
        }
    }

    .title {
        height: 25%;
        font-size: xx-large;
        margin-bottom: -4%;
    }

    .condition {
        height: 8%;
        // background-color: #fff;
    }

    .register-btn {
        
        .button {
            height: 60%;
            width: 80%;
        }
    }

    .mention {
        height: 8%;
        &:hover {
            color: #409eff;
        }
    }

}
</style>