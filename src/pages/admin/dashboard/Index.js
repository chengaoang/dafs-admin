// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入提示框，标题，....，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
// 标签自动布局特性
import { LabelLayout } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import {useEffect} from "react";

import {getInfo} from "../../../services/user";

function Index() {
    // 注册必须的组件
    echarts.use([
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        PieChart,
        CanvasRenderer,
        LabelLayout
    ]);

    useEffect(()=>{
        getInfo().then(resp=>{
            // 接下来的使用就跟之前一样，初始化图表，设置配置项
            let myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                title: {
                    text: '用   户   分   析',
                    subtext: '显示在线用户比例',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: resp.data.count, name: '注册总用户' },
                            { value: resp.data.online, name: '在线用户' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        });
    },[]);
    return(
        <div style={{display: "grid",}}>
            <div id='main' style={{height: "500px", width: "80%"}}/>
        </div>
    )
}
export default Index;
