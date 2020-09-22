<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import moment from 'dayjs'
import { on, off } from '@/libs/tools'
var labelOption = {
  show: true,
  position: 'top',
  distance: 10,
  align: 'center',
  verticalAlign: 'middle',
  rotate: 0,
  formatter: '{c}',
  fontSize: 12
  // rich: {
  //   name: {
  //     textBorderColor: '#fff'
  //   }
  // }
}
export default {
  name: 'serviceRequests',
  props: {
    weekData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    // console.log(moment().format())
    // 2020-09-22T21:25:13+08:00
    // 时间日期(当前时间往前6天)
    const dateArr = []
    for (let i = 0; i <= 6; i++) {
      dateArr.push(
        moment().subtract(6 - i, 'day').format('YYYY-MM-DD')
      )
    }
    // 格式化series数据
    const seriesArr = []
    Object.keys(this.weekData).forEach((key) => {
      let name = ''
      if (key === 'user') {
        name = '新增'
      } else if (key === 'sign') {
        name = '签到'
      } else if (key === 'post') {
        name = '发帖'
      } else if (key === 'comments') {
        name = '回复'
      }
      seriesArr.push({
        name: name,
        type: 'bar',
        barGap: 0, // 加一个就可以起作用
        label: labelOption,
        data: this.weekData[key]
      })
    })
    // 配置项
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: dateArr
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: seriesArr
      // series: [
      //   {
      //     name: '运营商/网络服务',
      //     type: 'bar',
      //     barGap: 0, // 加一个就可以起作用
      //     label: labelOption,
      //     data: [120, 132, 101, 134, 90, 230, 210]
      //   },
      //   {
      //     name: '银行/证券',
      //     type: 'bar',
      //     label: labelOption,
      //     data: [257, 358, 278, 234, 290, 330, 310]
      //   },
      //   {
      //     name: '游戏/视频',
      //     type: 'bar',
      //     label: labelOption,
      //     data: [379, 268, 354, 269, 310, 478, 358]
      //   },
      //   {
      //     name: '餐饮/外卖',
      //     type: 'bar',
      //     label: labelOption,
      //     data: [320, 332, 301, 334, 390, 330, 320]
      //   }
      // ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
