<template>
    <div class=" w-full h-1/3">
        <!-- <div class=" text-center">折线图</div> -->
        <div ref="target" id="main" class=" box-border w-full h-full"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
// 基于准备好的dom，初始化echarts实例
const target = ref(null)
var myChart: any = null

// 在 mounted 生命周期之后，实例化 echarts
onMounted(() => {
    myChart = echarts.init(target.value)// 在dom上绘制图表
    // 渲染 echarts
    //   renderChart()
    initChart()
})

const initChart = function () {
    let point = 120  //环形图的具体  百分比
    let total = 300
    let point1 = 40  //环形图的具体  百分比
    let total1 = 50
    const option = {
        title: [
            // 第一个圆环中央文字
            {
                show: true, // 是否显示
                text: point + '',
                subtext: '在线',
                textStyle: {
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: 12,
                    color: '#e1ffff'
                },
                subtextStyle: {
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 20,
                    color: '#9b9b9b'
                },
                textAlign: 'center',
                left: '23%',
                top: '48%'
            },
            // 第一个圆环中央文字2
            {
                show: true, // 是否显示
                text: `/${total}`,
                textStyle: {
                    fontSize: 10,
                    fontWeight: 500,
                    lineHeight: 12,
                    color: '#e1ffff'
                },
                textAlign: 'center',
                left: '30%',
                top: '59%'
            },
            // 第二个圆环中央文字
            {
                show: true, // 是否显示
                text: point1 + '',
                subtext: '回复比',
                textStyle: {
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: 12,
                    color: '#e1ffff'
                },
                subtextStyle: {
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 20,
                    color: '#9b9b9b'
                },
                textAlign: 'center',
                right: '7%',
                top: '48%'
            },
            // 第二个圆环中央文字2
            {
                show: true, // 是否显示
                text: `/${total1}`,
                textStyle: {
                    fontSize: 10,
                    fontWeight: 500,
                    lineHeight: 12,
                    color: '#e1ffff'
                },
                textAlign: 'center',
                right: '12%',
                top: '58%'
            },
        ],
        series: [
            // 第一个圆环底下圈
            {
                // name: '访问来源1',
                type: 'pie',
                radius: [45, 60],
                center: ['25%', '55%'],
                data: [
                    {
                        value: 80,  //对应显示的部分数据即100%
                        itemStyle: {
                            normal: {
                                borderRadius: 15,
                                color: '#add8e6'
                            }
                        }
                    },
                    {
                        value: 20, //对应隐藏的部分
                        itemStyle: {
                            normal: {
                                color: 'rgba(255,255,255,0)'//透明
                            }
                        }
                    }
                ],
                startAngle: -127,//起始角度，支持范围[0, 360]。
                minAngle: 0, //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
                label: {
                    show: false,
                    position: 'center'
                },
            },
            // 第一个圆环上面的圈
            {
                // name: '访问来源2',
                type: 'pie',
                showEmptyCircle: true,//是否在无数据的时候显示一个占位圆。
                radius: [45, 60],
                avoidLabelOverlap: true,// 标签重叠时进行调整
                center: ['25%', '55%'],
                data: [
                    {
                        value: point / total * 100 * 0.8,
                        itemStyle: {
                            normal: {
                                borderRadius: 15,//圆角
                                color: { // 设置渐变色
                                    type: 'linear',
                                    colorStops: [
                                        {
                                            offset: 0, color: '#01b8b2' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1, color: '#12a0fd' // 100% 处的颜色
                                        }
                                    ],
                                }
                            }
                        }
                    },
                    {
                        value: (total - point) / total * 100 * 0.8, //百分比
                        itemStyle: {
                            normal: {
                                borderRadius: 15,//圆角
                                color: 'rgba(255,255,255,0)'  //透明
                            }
                        }
                    },
                    {
                        value: 20, //百分比
                        itemStyle: {
                            normal: {
                                color: 'rgba(255,255,255,0)'  //透明
                            }
                        }
                    }
                ],
                startAngle: -127,//起始角度，支持范围[0, 360]。
                // minAngle: 0, //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
                label: {
                    show: false,
                    position: 'center'
                },
            },
            // 第二个圆环底下圈
            {
                // name: '访问来源1',
                type: 'pie',
                radius: [45, 60],
                center: ['75%', '55%'],
                data: [
                    {
                        value: 80,  //对应显示的部分数据即100%
                        itemStyle: {
                            normal: {
                                borderRadius: 15,
                                color: '#add8e6'
                            }
                        }
                    },
                    {
                        value: 20,
                        itemStyle: {
                            normal: {
                                color: 'rgba(255,255,255,0)'//透明
                            }
                        }
                    }
                ],
                startAngle: -127,//起始角度，支持范围[0, 360]。
                minAngle: 0, //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
                label: {
                    show: false,
                    position: 'center'
                },
            },
            // 第二个圆环上面的圈
            {
                // name: '访问来源2',
                type: 'pie',
                showEmptyCircle: true,//是否在无数据的时候显示一个占位圆。
                radius: [45, 60],
                avoidLabelOverlap: true,// 标签重叠时进行调整
                center: ['75%', '55%'],
                data: [
                    {
                        value: point1 / total1 * 100 * 0.8,
                        itemStyle: {
                            normal: {
                                borderRadius: 15,//圆角
                                color: { // 设置渐变色
                                    type: 'linear',
                                    colorStops: [
                                        {
                                            offset: 0, color: '#01b8b2' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1, color: '#12a0fd' // 100% 处的颜色
                                        }
                                    ],
                                }
                            }
                        }
                    },
                    {
                        value: (total1 - point1) / total1 * 100 * 0.8, //百分比
                        itemStyle: {
                            normal: {
                                borderRadius: 15,//圆角
                                color: 'rgba(255,255,255,0)'  //透明
                            }
                        }
                    },
                    {
                        value: 20, //百分比
                        itemStyle: {
                            normal: {
                                color: 'rgba(255,255,255,0)'  //透明
                            }
                        }
                    }
                ],
                startAngle: -127,//起始角度，支持范围[0, 360]。
                // minAngle: 0, //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
                label: {
                    show: false,
                    position: 'center'
                },
            },
        ]
    }


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)

}
window.addEventListener("resize", function () {
    myChart.resize();
});

function renderChart() {
    throw new Error('Function not implemented.');
}
</script>


<style lang="scss" scoped>
.box-border {
    // width: 400px;
    // height: 200px;
    background-color: #041B45;
}
</style>