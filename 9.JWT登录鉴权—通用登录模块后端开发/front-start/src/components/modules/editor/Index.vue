<template>
  <div class="edit-wrap">
    <div class="layui-form-item layui-form-text">
      <div class="layui-input-block">
        <div class="layui-unselect fly-edit" ref="icons">
          <span @click="iconShowmdal(1)" ref="face">
            <i class="iconfont icon-yxj-expression"></i>
          </span>
          <span @click="iconShowmdal(2)" ref="img">
            <i class="iconfont icon-tupian"></i>
          </span>
          <span @click="iconShowmdal(3)" ref="link">
            <i class="iconfont icon-lianjie"></i>
          </span>
          <span class="quote" @click="iconShowmdal(4)" ref="quote">“</span>
          <span @click="iconShowmdal(5)" ref="emwdaima">
            <i class="iconfont icon-emwdaima"></i>
          </span>
          <span>hr</span>
          <span>
            <i class="iconfont icon-yulan1"></i>
          </span>
        </div>
        <textarea ref="textEdit" class="layui-textarea fly-editor" name="content"></textarea>
      </div>
    </div>
    <div ref="modal">
      <Face :isShow="faceStatus" :ctrl="$refs.face" @closeEvent="faceStatus=false" />
      <ImgUpload :isShow="imgStatus" :ctrl="$refs.img" @closeEvent="imgStatus=false" />
      <LinkAdd :isShow="linkStatus" :ctrl="$refs.link" @closeEvent="linkStatus=false" />
      <Quote :isShow="quoteStatus" :ctrl="$refs.quote" @closeEvent="quoteStatus=false" />
       <!-- <Emwdaima :style="`width:${codeWidth}px;height:${codeHeight}px`" :isShow="emwdaimaStatus" :ctrl="$refs.quote" @closeEvent="emwdaimaStatus=false" /> -->
      <Emwdaima :style="`width:${codeWidth}px;height:${codeHeight}px`" :isShow="emwdaimaStatus" :ctrl="$refs.quote" @closeEvent="emwdaimaStatus=false" />
    </div>
  </div>
</template>

<script>
import Face from './Face'
import ImgUpload from './ImgUpload'
import LinkAdd from './LinkAdd'
import Quote from './Quote'
import Emwdaima from './Emwdaima'
export default {
  name: 'editor',
  props: {},
  data () {
    return {
      faceStatus: false,
      imgStatus: false,
      linkStatus: false,
      quoteStatus: false,
      emwdaimaStatus: false,
      codeWidth: 0,
      codeHeight: 0
    }
  },
  created () {},
  mounted () {
    // 点击body 触发表情框的关闭事件
    this.$nextTick(() => {
      document
        .querySelector('body')
        .addEventListener('click', this.handleBodyClick)
    })
    // 动态调整 编辑器上 Emwdaima 弹出的文本输入框 的大小 随这窗口的改变而改变
    this.codeWidth = this.$refs.textEdit.offsetWidth
    this.codeHeight = this.$refs.textEdit.offsetHeight
    window.addEventListener('resize', () => {
      this.codeWidth = this.$refs.textEdit.offsetWidth
      this.codeHeight = this.$refs.textEdit.offsetHeight
    })
  },
  // 全局绑定bodyclick事件很危险，多次使用这个组件 body上会多次绑定，所以不用使用要清除掉
  // 离开当前的url就会触发销毁事件
  beforeDestroy () {
    // console.log('我清清除了')
    document
      .querySelector('body')
      .removeEventListener('click', this.handleBodyClick)
  },
  computed: {},
  methods: {
    handleBodyClick (e) {
      // 防止事件冒泡
      e.stopPropagation()
      // 触发隐藏本组件的关闭事件，改变isShow的状态
      // 判断是否点击到了非控制ICON + 本组件  以外的地方
      // js的contains方法用来查看dom元素的包含关系，
      if (
        !(
          this.$refs.icons.contains(e.target) ||
          this.$refs.modal.contains(e.target)
        )
      ) {
        //  对所有的modal进行关闭
        this.faceStatus = false
        this.imgStatus = false
        this.linkStatus = false
        this.quoteStatus = false
        this.emwdaimaStatus = false
      }
    },
    iconShowmdal (num) {
      // 在切换前    对所有的modal进行关闭
      this.faceStatus = false
      this.imgStatus = false
      this.linkStatus = false
      this.quoteStatus = false
      this.emwdaimaStatus = false
      switch (num) {
        case 1:
          this.faceStatus = !this.faceStatus
          break
        case 2:
          this.imgStatus = !this.imgStatus
          break
        case 3:
          this.linkStatus = !this.linkStatus
          break
        case 4:
          this.quoteStatus = !this.quoteStatus
          break
        case 5:
          this.emwdaimaStatus = !this.emwdaimaStatus
          break
      }
    }
  },
  components: {
    Face,
    ImgUpload,
    LinkAdd,
    Quote,
    Emwdaima
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes bounceOut {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(0.7);
  }
}
.fade-leave-active {
  animation: bounceOut 0.3s;
}
.fade-enter-active {
  animation: bounceIn 0.3s;
}
.edit-wrap {
  position: relative;
  .fly-editor {
    height: 260px;
  }
  .quote {
    font-size: 22px;
    vertical-align: middle;
    position: relative;
    top: 4px;
  }
}
.edit-content {
  position: absolute;
  top: 45px;
  left: 0;
}
</style>
