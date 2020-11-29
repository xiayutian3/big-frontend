<template>
  <div>
    HomeChild {{propeName}}
    <button type="button" @click="clickHandler">Minus</button>
     <button type="button" @click="consolelogthis">methodsthis</button>
  </div>

  <!-- framegment  事件触发要声明,父子间的数据传递最好不要使用这个特性-->
  <!-- <div>HomeChild {{propeName}}</div>
  <button type="button" @click="clickHandler">Minus</button> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Home-Child',
  props: ['propeName'],
  emits: ['minusevent'],
  setup (props, { emit, attrs }) {
    console.log('setup ~ this', this)
    console.log('attrs', attrs)
    // console.log('props', props)
    // console.log('ctx', ctx)
    const clickHandler = () => {
      emit('minusevent')
    }
    return {
      clickHandler
    }
  },
  methods: {
    consolelogthis () {
      console.log('consolethis', this)
    }
  }
})

</script>
<style lang="scss" scoped>
</style>
