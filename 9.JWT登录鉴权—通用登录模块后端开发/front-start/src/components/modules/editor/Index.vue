<template>
  <div class="edit-wrap">
    <div class="layui-form-item layui-form-text">
      <div class="layui-input-block">
        <div class="layui-unselect fly-edit">
          <span @click="faceStatus = !faceStatus" ref="face">
            <i class="iconfont icon-yxj-expression"></i>
          </span>
          <span @click="imgStatus = !imgStatus" ref="img">
            <i class="iconfont icon-tupian"></i>
          </span>
          <span>
            <i class="iconfont icon-lianjie"></i>
          </span>
          <span class="quote">
            “
          </span>
          <span>
            <i class="iconfont icon-emwdaima"></i>
          </span>
            <span>
            hr
          </span>
           <span>
            <i class="iconfont icon-yulan1"></i>
          </span>
        </div>
        <textarea class="layui-textarea fly-editor" name="content"></textarea>
      </div>
    </div>
    <Face :isShow="faceStatus" :ctrl="$refs.face" @closeEvent="faceStatus=false"/>
    <ImgUpload :isShow="imgStatus" :ctrl="$refs.img" @closeEvent="imgStatus=false"/>
  </div>
</template>

<script>
import Face from './Face'
import ImgUpload from './ImgUpload'
export default {
  name: 'editor',
  props: {},
  data () {
    return {
      faceStatus: false,
      imgStatus: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {
    Face,
    ImgUpload
  },
  watch: {}
}
</script>
<style lang="scss">
@keyframes bounceIn{
  0%{
    opacity: 0;
    transform: scale(0.5);
  }
  100%{
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes bounceOut {
  0%{
    transform: scale(1);
  }
  30%{
     transform: scale(1.05);
  }
  100%{
    opacity: 0;
    transform: scale(0.7);
  }
}
.fade-leave-active{
  animation: bounceOut 0.3s;
}
.fade-enter-active{
  animation: bounceIn 0.3s;
}
.edit-wrap{
  position: relative;
  .fly-editor{
    height: 260px;
  }
  .quote{
    font-size: 22px;
    vertical-align: middle;
    position: relative;
    top: 4px;
  }
}
.edit-content{
  position: absolute;
  top:45px;
  left: 0;
}
</style>
