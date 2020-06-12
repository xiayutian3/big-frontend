<template>
  <!-- 上传头像 -->
  <div class="layui-form layui-form-pane layui-tab-item layui-show">
    <div class="layui-form-item">
      <div class="avatar-add">
        <p>建议尺寸168*168，支持jpg、png、gif，最大不能超过50KB</p>
        <label for="pic" class="layui-btn upload-img">
          <i class="layui-icon">&#xe67c;</i>上传头像
        </label>
         <input id="pic" type="file" name="file" accept="image/png,image/gif,image/ipg" @change="upload"/>
        <!-- <img
          src="https://tva1.sinaimg.cn/crop.0.0.118.118.180/5db11ff4gw1e77d3nqrv8j203b03cweg.jpg"
        /> -->
        <img
          :src="pic"
        />
        <span class="loading"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadImg } from '@/api/content'
import { updateUserInfo } from '@/api/user'
export default {
  name: 'pic-upload',
  props: {},
  data () {
    return {
      // pic: '/img/bear.jpg',
      formData: ''
    }
  },
  created () {},
  mounted () {},
  computed: {
    pic () {
      return (this.$store.state.userInfo && this.$store.state.userInfo.pic) ? this.$store.state.userInfo.pic : '/img/bear.jpg'
    }
  },
  methods: {
    upload (e) {
      // console.log('upload -> e', e)
      let file = e.target.files
      let formData = new FormData()
      if (file.length > 0) {
        formData.append('file', file[0])
        this.formData = formData
      }

      // 上传图片之后 -》 uploadImg

      uploadImg(this.formData).then(res => {
        console.log('upload -> res', res)
        // 更新用户基本资料 -》 updateUserInfo
        // updateUserInfo({ pic: this.pic }).then(res => {
        //   if (res.code === 200) {
        //     // 修改全局的store内的用户基础信息
        //     let user = this.$store.state.userInfo
        //     user.pic = this.pic
        //     this.$store.commit('setUserInfo', user)
        //     this.$alert('图片上传成功')
        //   }
        // })
      })
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss">
#pic{
  display: none;
}
</style>
