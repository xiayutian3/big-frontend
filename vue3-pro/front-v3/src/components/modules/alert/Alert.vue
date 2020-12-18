<template>
  <div class="wrapper" v-if="state.on">
    <div class="alert">
      <div class="flex">{{ state.msg }}</div>
      <div
        v-if="state.type === 'alert'"
        class="btnCommon sucess"
        @click="close"
      >
        确定
      </div>
      <div v-else class="space-around">
        <div class="btnCommon cancel" @click="cancelEvent">取消</div>
        <div class="btnCommon sucess" @click="successEvent">确定</div>
      </div>
    </div>
    <div class="mask" @click="close"></div>
  </div>
</template>

<script lang="ts">
import toggleUtils from '@/utils/toggle'
import { computed, defineComponent, reactive } from 'vue'

export default defineComponent({

  name: 'a-alert',
  props: {
    type: {
      type: String,
      default: 'alert'
    },
    msg: {
      type: String,
      default: ''
    },
    sucess: {
      type: Function,
      default: () => {
        console.log('点击了sucess')
      }
    },
    cancel: {
      type: Function,
      default: () => {
        console.log('点击了cancel')
      }
    },
    unmount: {
      type: Function,
      default: () => {
        console.log('unmount')
      }
    }
  },
  setup (props: any) {
    const { on, toggle } = toggleUtils(true, 0)
    const state = reactive({
      toggle,
      on,
      msg: computed(() => props.msg),
      type: computed(() => props.type)
    })

    const close = () => {
      state.toggle(false)
      // 删除对应的节点
      props.unmount()
    }

    const cancelEvent = () => {
      props.cancel && props.cancel()
      close()
    }
    const successEvent = () => {
      props.sucess && props.sucess()
      close()
    }

    return {
      state,
      close,
      cancelEvent,
      successEvent
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    // close () {
    //   this.isShow = false
    // },
    // closeMask () {
    //   if (this.type === 'alert') {
    //     this.close()
    //   }
    // },
    // cancelEvent () {
    //   this.cancel()
    //   this.close()
    // },
    // sucessEvent () {
    //   this.sucess()
    //   this.close()
    // }
  },
  components: {},
  watch: {}
})
</script>
<style lang="scss">
$btn-main: #009688;
// 颜色加深10%
$btn-dark: darken($btn-main, 10%);
.wrapper {
  .alert {
    width: 300px;
    height: 150px;
    position: fixed;
    background: #fff;
    border-radius: 6px;
    left: 50%;
    top: 50%;
    margin-left: -150px;
    margin-top: -75px;
    padding: 20px 10px;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.05);
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .flex {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .space-around {
    padding: 0 10px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .btnCommon {
    width: 105px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 6px;
    &.sucess {
      background: $btn-main;
      color: #fff;
      &:hover {
        background: $btn-dark;
      }
    }
    &.cancel {
      background: #ededed;
      color: #333;
    }
  }
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.04);
    overflow: hidden;
    z-index: 1;
  }
}
</style>
