<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel" pad20 style="padding-top: 5px;">
      <!--<div class="fly-none">没有权限</div>-->
      <div class="layui-form layui-form-pane">
        <div class="layui-tab layui-tab-brief" lay-filter="user">
          <ul class="layui-tab-title">
            <li class="layui-this">
              发表新帖
              <!-- 编辑帖子 -->
            </li>
          </ul>
          <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
            <div class="layui-tab-item layui-show">
              <validation-observer ref="observer">
                <form action method="post">
                  <div class="layui-row layui-col-space15 layui-form-item">
                    <div class="layui-col-md3">
                      <validation-provider name="catalog" rules="is_not:请选择" v-slot="{errors}">
                        <div class="layui-row">
                          <label class="layui-form-label">所在专栏</label>
                          <div class="layui-input-block" @click="isSelect = !isSelect">
                            <div
                              class="layui-unselect layui-form-select"
                              :class="{'layui-form-selected':isSelect}"
                            >
                              <div class="layui-select-title">
                                <input
                                  type="text"
                                  placeholder="请选择"
                                  readonly
                                  v-model="catalogs[cataIndex].text"
                                  class="layui-input layui-unselect"
                                />
                                <i class="layui-edge"></i>
                              </div>
                              <dl class="layui-anim layui-anim-upbit">
                                <dd
                                  v-for="(item,index) in catalogs"
                                  :key="'catalog'+ index"
                                  @click="chooseCatalog(item,index)"
                                  :class="{'layui-this':index === cataIndex}"
                                >{{item.text}}</dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div class="layui-row">
                          <span style="color: #c00;">{{errors[0]}}</span>
                        </div>
                      </validation-provider>
                    </div>
                    <div class="layui-col-md9">
                      <label for="L_title" class="layui-form-label">标题</label>
                      <validation-provider name="title" rules="required" v-slot="{errors}">
                        <div class="layui-input-block">
                          <input type="text" v-model="title" class="layui-input" />
                          <!-- <input type="hidden" name="id" value="{{d.edit.id}}"> -->
                        </div>
                        <div class="layui-form-mid">
                          <span style="color: #c00;">{{errors[0]}}</span>
                        </div>
                      </validation-provider>
                    </div>
                  </div>
                  <Editor @changeContent="add" :initContent="content"/>
                  <div class="layui-form-item">
                    <div class="layui-inline">
                      <label class="layui-form-label">悬赏飞吻</label>
                      <div class="layui-input-inline" style="width:190px;">
                        <div
                          class="layui-unselect layui-form-select"
                          @click="isSelect_fav = !isSelect_fav"
                          :class="{'layui-form-selected':isSelect_fav}"
                        >
                          <div class="layui-select-title">
                            <input
                              type="text"
                              placeholder="请选择"
                              readonly
                              v-model="favList[favIndex]"
                              class="layui-input layui-unselect"
                            />
                            <i class="layui-edge"></i>
                          </div>
                          <dl class="layui-anim layui-anim-upbit">
                            <dd
                              v-for="(item,index) in favList"
                              :key="'favList'+ index"
                              @click="chooseFav(item,index)"
                              :class="{'layui-this':index === favIndex}"
                            >{{item}}</dd>
                          </dl>
                        </div>
                      </div>
                      <div class="layui-form-mid layui-word-aux">发表后无法更改飞吻</div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <validation-provider
                      name="code"
                      ref="codeFileld"
                      rules="required|length:4"
                      v-slot="{errors}"
                    >
                      <div class="layui-row">
                        <label for="L_vercode" class="layui-form-label">验证码</label>
                        <div class="layui-input-inline">
                          <input
                            type="text"
                            name="code"
                            v-model="code"
                            placeholder="请输入验证码"
                            autocomplete="off"
                            class="layui-input"
                          />
                        </div>
                        <div class>
                          <span class="svg" style="color: #c00;" @click="_getCode()" v-html="svg"></span>
                        </div>
                      </div>
                      <div class="layui-form-mid">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <button type="button" class="layui-btn" @click="submit">立即发布</button>
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addPost } from '@/api/content'
import CodeMix from '@/mixin/code'
import Editor from '@/components/modules/editor/Index'
export default {
  name: 'add',
  mixins: [CodeMix],
  props: {},
  data () {
    return {
      title: '',
      isSelect: false,
      isSelect_fav: false,
      cataIndex: 0,
      favIndex: 0,
      catalogs: [
        {
          text: '请选择',
          value: ''
        },
        {
          text: '提问',
          value: 'ask'
        },
        {
          text: '分享',
          value: 'share'
        },
        {
          text: '讨论',
          value: 'discuss'
        },
        {
          text: '建议',
          value: 'advise'
        }
      ],
      favList: [20, 30, 50, 60, 80],
      content: ''
    }
  },
  mounted () {
    // 当用户重新进入页面（比如说用户编辑太久，token过期，重新登录后到这页面），提示是否加载之前的内容
    const saveData = localStorage.getItem('addData')
    if (saveData && saveData !== '') {
      this.$confirm('是否加载未编辑完的内容？', () => {
        const obj = JSON.parse(saveData)
        this.title = obj.title
        this.cataIndex = obj.cataIndex
        this.content = obj.content
        this.favIndex = obj.favIndex
      }, () => {
        localStorage.setItem('addData', '')
      })
    }
  },
  computed: {},
  methods: {
    chooseCatalog (item, index) {
      this.cataIndex = index
    },
    chooseFav (item, index) {
      this.favIndex = index
    },
    add (val) {
      this.content = val
      // 防止用户编辑时间过长，token过期，保存用户的编辑内容
      const saveData = {
        title: this.title,
        cataIndex: this.cataIndex,
        content: this.content,
        favIndex: this.favIndex
      }
      if (this.title.trim() !== '' && this.content.trim() !== '') {
        localStorage.setItem('addData', JSON.stringify(saveData))
      }
    },
    async submit () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        // ABORT!!
        return
      }

      // 对发帖内容校验
      if (this.content.trim() === '') {
        this.$alert('文章内容不得为空')
        return
      }

      // 发表新帖接口
      addPost({
        title: this.title,
        catalog: this.catalogs[this.cataIndex].value,
        content: this.content,
        fav: this.favList[this.favIndex],
        code: this.code,
        sid: this.$store.state.sid || localStorage.getItem('sid')
      }).then(res => {
        if (res.code === 200) {
          // 发帖成功后对存到localstorage表单内容，进行清空
          localStorage.setItem('addData', '')
          this.$pop('', '发帖成功!')
          setTimeout(() => {
            this.$router.push({ name: 'detail', params: { tid: res.data._id } })
          }, 1000)
        } else {
          this.$alert(res.msg)
        }
      })
    }
  },
  components: {
    Editor
  },
  watch: {}
}
</script>
<style lang="scss">
.wrapper {
}
</style>
