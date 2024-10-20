<template>
    <div class="friendHub">
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="待处理" name="1">
                <!-- 第二个组件 -->
                <div class="box">
                    <el-timeline style="max-width: 100%">
                        <el-timeline-item color='#66FF99' size="large" :timestamp="item.date" placement="top"
                            hollow="true" v-for="(item, index) in pending" :key="index">
                            <el-card>
                                <div class="cardInfo">
                                    <div class="btn">
                                        <el-button type="info" size="small" round>拒绝</el-button>
                                        <el-button type="primary" size="small" round>同意</el-button>
                                    </div>

                                    <h4 class="nameInfo"><span class="name">{{ item.friendName }}</span>请求添加好友
                                    </h4>
                                    <p class="time">{{ item.date + ' ' + item.time }}</p>
                                </div>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-collapse-item>
            <el-collapse-item title="已拒绝" name="2">
                <div class="box">
                    <el-timeline style="max-width: 100%">
                        <el-timeline-item color='#FF6666' size="large" :timestamp="item.date" placement="top"
                            hollow="true" v-for="(item, index) in rejected" :key="index">
                            <el-card>
                                <div class="cardInfo">
                                    <div class="btn flex-jc-fe">
                                        <el-button type="info" size="small" round>重新考虑</el-button>
                                    </div>

                                    <h4 class="nameInfo">已拒绝<span class="name">{{ item.friendName }}</span></h4>
                                    <p class="time">{{ item.date + ' ' + item.time }}</p>
                                </div>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-collapse-item>
            <el-collapse-item title="已同意" name="3">
                <div class="box">
                    <el-timeline style="max-width: 100%">
                        <el-timeline-item color='#409eff' size="large" :timestamp="item.date" placement="top"
                            hollow="true" v-for="(item, index) in accepted" :key="index">
                            <el-card>
                                <div class="cardInfo">
                                    <div class="btn">
                                        <el-button type="info" size="small" round>删除好友</el-button>
                                    </div>
                                    <h4 class="nameInfo"><span class="name">{{ item.friendName }}</span>已成为好友
                                    </h4>
                                    <p class="time">{{ item.date + ' ' + item.time }}</p>
                                </div>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-collapse-item>
            <el-collapse-item title="已删除" name="4">
                <div class="box">
                    <el-timeline style="max-width: 100%">
                        <el-timeline-item color='#909399' size="large" :timestamp="item.date" placement="top"
                            hollow="true" v-for="(item, index) in deleted" :key="index">
                            <el-card>
                                <div class="cardInfo">
                                    <h4 class="nameInfo">好友<span class="name">{{ item.friendName }}</span>已删除
                                    </h4>
                                    <p class="time">{{ item.date + ' ' + item.time }}</p>
                                </div>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const activeName = ref('0')

interface CardItem {
    friendName: string,
    friendId: number,
    date: string,
    time: string
}
const pending: CardItem[] = reactive([
    {
        friendName: "打印机",
        friendId: 1,
        date: '2024/10/12',
        time: '01:03'
    },
    {
        friendName: "张三",
        friendId: 1,
        date: '2024/10/12',
        time: '02:08'
    }
]);
const rejected: CardItem[] = reactive([
    {
        friendName: "张三",
        friendId: 1,
        date: '2024/10/12',
        time: '01:03'
    },
    {
        friendName: "张三",
        friendId: 1,
        date: '2024/10/12',
        time: '01:03'
    }
]);
const accepted: CardItem[] = reactive([
    {
        friendName: "张三",
        friendId: 1,
        date: '2024/10/12',
        time: '01:03'
    }
]);
const deleted: CardItem[] = reactive([
    {
        friendName: "张三",
        friendId: 1,
        date: '2024/10/12',
        time: '01:03'
    }
]);

</script>

<style lang="scss" scoped>
.friendHub {
    width: 300px;
    height: 500px;
    overflow: auto;
    margin-left: 10%;
    padding-left: 1%;
    padding-right: 1%;
    background-color: #323540;
}

.cardInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #f5f5f5;
    gap: 6px;
    // background-color: pink;

    .btn {
        display: flex;
        justify-content: space-between;
        // margin-top: -3%;
        // padding-bottom: 3%;
        width: 100%;
    }

    .nameInfo {
        color: #f5f5f5;
        text-align: center;

        .name {
            font-size: large;
        }
    }

    .time {
        text-align: center;
        font-size: xx-small;
    }
}

::v-deep .el-card__body {
    padding: 3%;
}

::v-deep .el-card {
    border-radius: 15px;
    background-color: #3a3f4c;
}
</style>

<style lang="scss" scoped>
::v-deep .el-collapse {
    --el-collapse-header-bg-color: #323540;
    color: #f5f5f5;
    // background-color: #323540;
}

::v-deep .el-collapse-item__header {
    color: #f5f5f5;
}

::v-deep .el-collapse-item__wrap {
    background-color: #323540;
    padding-left: 1%;
    padding-right: 1%;
    padding: 1%;
}

::v-deep .el-collapse-item__header::before {
    content: "";
    /* 伪元素的内容，这里为空，因为我们只需要显示样式 */
    display: inline-block;
    /* 使伪元素成为内联块级元素，以便可以设置宽度和高度 */
    width: 10px;
    /* 红点的宽度 */
    height: 10px;
    /* 红点的高度 */
    background-color: #3a3f4c;
    /* 红点的背景颜色 */
    border-radius: 50%;
    /* 将红点设置为圆形 */
    margin-right: 5px;
    /* 在红点和目标元素之间添加一些间距 */
}
</style>