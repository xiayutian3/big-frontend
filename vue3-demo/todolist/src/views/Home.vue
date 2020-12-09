<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <a class="navbar-brand d-flex align-items-center" href="/">
        <div class="logo mr-2"></div>
        <span>ToDoList</span>
      </a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/add">待办事项</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/done">已完成</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/delete">已删除</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {}
})
</script>

<style lang="scss" scoped>
.logo{
  width: 40px;
  height: 40px;
  background-image: url('~@/assets/logo.png');
  background-size: 100%;
}
</style>
