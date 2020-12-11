<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module
    replacement123.
  </p>
  <hr />
  {{ count1 }}
</template>

<script lang="ts">
import { computed, reactive } from "vue";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    const str:string = ''
    const state = reactive({
      count: 0
    });
    // console.log(state.count);
    return {
      ...state,
      count1: computed(() => state.count * 2),
      str
    };
  },
};
</script>
<style lang="scss">
/* use scss */
h1{
  color: red;
}
</style>
