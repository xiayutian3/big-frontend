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
          <span @click="addHr">hr</span>
          <span @click="iconShowmdal(6)">
            <i class="iconfont icon-yulan1"></i>
          </span>
        </div>
        <textarea v-model="content" id="edit" ref="textEdit" class="layui-textarea fly-editor" name="content" @focus="fouceEvent" @blur="blurEvent"></textarea>
      </div>
    </div>
    <div ref="modal">
      <Face :isShow="faceStatus" :ctrl="$refs.face" @closeEvent="faceStatus=false" @addEvent = "addFace"/>
      <ImgUpload :isShow="imgStatus" :ctrl="$refs.img" @closeEvent="imgStatus=false" @addEvent = "addPic" />
      <LinkAdd :isShow="linkStatus" :ctrl="$refs.link" @closeEvent="linkStatus=false" @addEvent = "addLink"/>
      <Quote :isShow="quoteStatus" :ctrl="$refs.quote" @closeEvent="quoteStatus=false" @addEvent = "addQuote"/>
      <!-- 以下两种都可以 style 写法 -->
       <!-- <Emwdaima :style="`width:${codeWidth}px;height:${codeHeight}px`" :isShow="emwdaimaStatus" :ctrl="$refs.quote" @closeEvent="emwdaimaStatus=false" /> -->
      <Emwdaima :style="{width:codeWidth+'px',height:codeHeight+'px'}" :isShow="emwdaimaStatus" :ctrl="$refs.quote" @closeEvent="emwdaimaStatus=false" @addEvent = "addCode"/>
      <Preview :isShow="previewStatus" :content="content"  @closeEvent="previewStatus=false"/>
    </div>
  </div>
</template>

<script>
import Face from './Face'
import ImgUpload from './ImgUpload'
import LinkAdd from './LinkAdd'
import Quote from './Quote'
import Emwdaima from './Emwdaima'
import Preview from './Preview'
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
      previewStatus: false,
      codeWidth: 0,
      codeHeight: 0,
      content: '', // 富文本编辑器的内容
      pos: ''// 光标的默认位置
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
        case 6:
          this.previewStatus = !this.previewStatus
          break
      }
    },
    getPos () {
      // 获取光标的位置
      let cursorPos = 0
      let elem = document.getElementById('edit')
      if (document.selection) {
        // IE
        let selectRange = document.selection.createRange()
        selectRange.moveStart('character', -elem.value.length)
        cursorPos = selectRange.text.length
      } else if (elem.selectionStart || elem.selectionStart === '0') {
        cursorPos = elem.selectionStart
      }
      this.pos = cursorPos
    },
    fouceEvent () {
      // 获取光标的位置
      // 这个不要也可以，老师的是 要的
      // this.getPos()
    },
    blurEvent () {
      // 获取光标的位置
      this.getPos()
    },
    insert (val) {
      // 在光标的位置插入内容
      if (typeof this.content === 'undefined') {
        return
      }
      let tmp = this.content.split('')
      tmp.splice(this.pos, 0, val)
      this.content = tmp.join('')
    },
    addFace (item) {
      // 添加表情
      const insertContent = ` face${item}`
      // 插入富文本内容的方法
      this.insert(insertContent)
      // 插入表情完后，调整光标的位置,连续在后边插入
      this.pos += insertContent.length
    },
    addPic (item) {
      // 添加图片链接
      const insertContent = ` img[${item}]`
      // 插入富文本内容的方法
      this.insert(insertContent)
      // 插入完后，调整光标的位置,连续在后边插入
      this.pos += insertContent.length
    },
    addLink (item) {
      // 添加链接
      const insertContent = ` a(${item})[${item}]`
      // 插入富文本内容的方法
      this.insert(insertContent)
      // 插入完后，调整光标的位置,连续在后边插入
      this.pos += insertContent.length
    },
    addCode (item) {
      // 添加代码
      const insertContent = ` \n[pre]\n${item}\n[/pre]`
      // 插入富文本内容的方法
      this.insert(insertContent)
      // 插入完后，调整光标的位置,连续在后边插入
      this.pos += insertContent.length
    },
    addQuote (item) {
      // 添加引用
      const insertContent = ` \n[quote]\n${item}\n[/quote]`
      // 插入富文本内容的方法
      this.insert(insertContent)
      // 插入完后，调整光标的位置,连续在后边插入
      this.pos += insertContent.length
    },
    addHr () {
      // 添加hr
      this.insert('\n[hr]')
      this.pos += 5
    }

  },
  components: {
    Face,
    ImgUpload,
    LinkAdd,
    Quote,
    Emwdaima,
    Preview
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
