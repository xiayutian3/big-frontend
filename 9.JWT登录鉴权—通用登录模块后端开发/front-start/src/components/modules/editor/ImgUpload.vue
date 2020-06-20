<template>
  <transition name="fade">
    <div class="layui-layer-page layui-layer-border edit-content" v-show="isShow">
      <div class="layui-layer-title">插入图片</div>
      <div class="layui-layer-content">
        <ul class="layui-form layui-form-pane">
          <li class="layui-form-item">
            <label for="fileInput" class="layui-form-label">URL</label>
            <div class="layui-input-inline">
              <input type="text" id="fileInput" v-model="name" class="layui-input" placeholder="粘贴图片地址或者点击上传" />
            </div>
            <button type="button" class="layui-btn layui-btn-primary">
              <label for="uploadImg">
                <i class="layui-icon layui-icon-upload"></i>上传图片
              </label>
            </button>
            <input type="file" name="file" @change="upload" id="uploadImg" class="layui-upload-file" accept="image/png,image/gif,image/jpeg" />
          </li>
          <li class="layui-form-item">
            <button type="button" class="layui-btn" @click="submit">确认</button>
          </li>
        </ul>
      </div>
      <span class="layui-layer-setwin" @click.stop="close">
        <a href="javascript:void(0)" class="layui-layer-ico layui-layer-close layui-layer-close1"></a>
      </span>
    </div>
  </transition>
</template>

<script>
import { uploadImg } from '@/api/content'
import config from '@/config'
export default {
  name: 'imgUpload',
  props: ['isShow'],
  data () {
    return {
      name: '',
      formData: ''
    }
  },
  created () {},
  computed: {},
  methods: {
    handleFaceClick (item) {
      this.$emit('addEvent', item)
    },
    close () {
      // 清空输入内容，选择的文件，关闭弹框
      this.$emit('closeEvent')
      this.name = ''
      this.formData = ''
    },
    upload (e) {
      let file = e.target.files
      let formData = new FormData()
      if (file.length > 0) {
        formData.append('file', file[0])
        this.formData = formData
      }
      // 上传图片逻辑
      uploadImg(this.formData).then(res => {
        if (res.code === 200) {
          const baseUrl = process.env.NODE_ENV === 'production'
            ? config.baseUrl.pro
            : config.baseUrl.dev
            // 图片的路径
          this.name = baseUrl + res.data
        }
      })
      // 上传成功后清空
      document.getElementById('uploadImg').value = ''
    },
    submit () {
      // 如果图片地址输入为空，点击确认按钮，给用户聚焦，返回
      if (this.name === '') {
        document.getElementById('fileInput').focus()
        this.$pop('shake', '请上传图片或者复制图片链接')
        return
      }
      this.$emit('addEvent', this.name)
      // 清空相应的内容
      setTimeout(() => {
        this.name = ''
        this.formData = ''
        this.$emit('closeEvent')
      })
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.layui-form-item{
  text-align: center;
}
.layui-form-pane{
  margin: 20px;
}
</style>
