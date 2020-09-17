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
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
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
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
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
          // methods 1
          // this.inforCardData.forEach((item, index) => {
          //   this.inforCardData.splice(index, 1, {
          //     ...this.inforCardData[index],
          //     count: res.data.inforCardData[index]
          //   })
          // })

          // methods 2
          // this.inforCardData.forEach((item, index) => {
          //   this.$set(this.inforCardData, index, {
          //     ...this.inforCardData[index],
          //     count: res.data.inforCardData[index]
          //   })
          // })

          // methods 3
          // this.inforCardData[0].count = res.data.inforCardData[0]
          // this.timer1 = new Date().getTime()
          this.inforCardData.forEach((item, index) => {
            item.count = res.data.inforCardData[index]
          })
          this.timer1 = new Date().getTime()
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
