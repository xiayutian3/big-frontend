<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :key="timer1">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie :tipName="'统计内容'" style="height: 300px;" :value="pieData" text="发帖统计" :key="timer2"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { getStatData } from '@/api/admin'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      timer1: '0',
      timer2: '0',
      inforCardData: [
        {
          title: '新增用户',
          icon: 'md-person-add',
          count: 0,
          color: '#2d8cf0'
        },
        { title: '发帖累计', icon: 'md-locate', count: 0, color: '#19be6b' },
        {
          title: '新增评论',
          icon: 'md-chatbubbles',
          count: 0,
          color: '#ff9900'
        },
        {
          title: '本周采纳',
          icon: 'md-checkmark-circle',
          count: 0,
          color: '#ed3f14'
        },
        { title: '本周签到', icon: 'md-contacts', count: 0, color: '#E46CBB' },
        { title: '本周发帖', icon: 'md-map', count: 0, color: '#9A66E4' }
      ],
      pieData: [
        { value: 0, name: '提问' },
        { value: 0, name: '分享' },
        { value: 0, name: '讨论' },
        { value: 0, name: '建议' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  mounted () {
    //

    this.getData()
  },
  methods: {
    getData () {
      getStatData().then(res => {
        if (res.code === 200) {
          // methods 1 （更新数据的3种方式）
          // this.inforCardData.forEach((item, index) => {
          //   this.inforCardData.splice(index, 1, {
          //     ...this.inforCardData[index],
          //     count: res.data.inforCardData[index]
          //   })
          // })

          // methods 2（更新数据的3种方式）
          // this.inforCardData.forEach((item, index) => {
          //   this.$set(this.inforCardData, index, {
          //     ...this.inforCardData[index],
          //     count: res.data.inforCardData[index]
          //   })
          // })

          // methods 3（更新数据的3种方式）
          // this.inforCardData[0].count = res.data.inforCardData[0]
          // this.timer1 = new Date().getTime()
          if (res.data.inforCardData) {
            this.inforCardData.forEach((item, index) => {
              item.count = res.data.inforCardData[index]
            })
            this.timer1 = new Date().getTime()
          }
          // 2.左侧饼图
          if (res.data.pieData) {
            const arr = []
            const pieData = res.data.pieData
            arr.push({ name: '提问', value: pieData.ask || 0 })
            arr.push({ name: '分享', value: pieData.share || 0 })
            arr.push({ name: '讨论', value: pieData.discuss || 0 })
            arr.push({ name: '建议', value: pieData.advice || 0 })
            console.log('getData -> arr', arr)

            this.pieData = arr
            this.timer2 = new Date().getTime()
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
