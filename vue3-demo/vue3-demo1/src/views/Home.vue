<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    {{ counter + counter1 }}
    <hr />
    total is :{{ total }}
    <hr />
    counter1 is :{{ counter1 }}
    <button type="button" @click="add">增加</button>
    <button type="button" @click="add2">增加2</button>
    <button type="button" @click="modify">modify</button>
    <HomeChild id="5" :propeName="counter" @minusevent="minusEventHandler" />

    <hr />
    <ul>
      <li v-for="(item, index) in lists" :key="'im' + index">
        {{ item.text }}
      </li>
      <li v-for="(item, index) in state.lists" :key="'m' + index">
        {{ item.text }}
      </li>
    </ul>
    <button type="button" @click="setFun">set index 0</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeChild from './HomeChild.vue'
import { utils } from './home'
// 数据初始化
// const stateUtils = utils()

// defineComponent 类推推导正确（可以处理ts this-指向的问题，让类型推导正确）
export default defineComponent({
  name: 'Home',
  components: {
    HomeChild
  },
  data () {
    return {
      counter1: 0
    }
  },
  methods: {
    add2 () {
      this.counter1++
    }
  },
  setup () {
    return {
      ...utils()
    }
  },
  watch: {
    counter1 (newVal: number, oldVal: number) {
      console.log(' oldVal', oldVal)
      console.log(' newVal', newVal)
    }
  },
  computed: {
    total () {
      return this.counter1 * 2
    }
  }
})
</script>
