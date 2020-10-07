<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { forbidScroll } from '@/utils/forbidScroll'
export default {
  // mounted () {
  //   // 禁止滚动，加在body上禁止 所有的滚动
  //   document.body.addEventListener(
  //     'touchmove',
  //     (evt) => {
  //       evt.preventDefault()
  //     },
  //     { passive: false }
  //   )
  // }

  mounted () {
    // 挂载到window上
    window.forbidScroll = forbidScroll
  }
}
</script>
<style lang="scss">
html,
body {
  touch-action: none;
}
.inline-block {
  display: inline-block;
}
.flex-row {
  display: flex;
  flex-flow: row nowrap;
  align-content: center;
}
.mint-header {
  height: 50px;
}
img {
  vertical-align: middle;
}
pre {
  position: relative;
  margin: 0;
  padding: 0 15px;
  line-height: 36px;
  background: #f2f2f2;
  color: #333;
  font-family: "Courier New", Courier, monospace, serif;
  font-size: 24px;
  border: none;
  border-left: 5px solid #ddd;
}

.input-wrap {
  .code {
    height: 80px;
  }
  svg {
    width: 240px;
    height: 70px;
  }
}
.error {
  color: #c00;
  font-size: 24px;
}
ul,
li {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
}

// custom style for mint ui
.cell-title {
  .mint-cell-title {
    align-self: flex-start;
  }
}
.mint-cell {
  padding: 0 20px;
}
.mint-cell-wrapper {
  padding: 0 !important;
}

.slide-right-enter-active,
.slide-left-enter-active,
.slide-right-leave-active,
.slide-left-leave-active {
  transition: all 0.5s;
  will-change: transform;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
}
.slide-right-enter {
  transform: translateX(-100%);
}
.slide-right-leave-active,
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-right-enter-to,
.slide-right-leave {
  transform: translateX(0);
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-leave-active,
.slide-left-leave-to {
  transform: translateX(-100%);
}
.slide-left-enter-to,
.slide-left-leave {
  transform: translateX(0);
}
</style>
