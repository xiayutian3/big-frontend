<template>
  <div class="layui-container">
    <Panel />
    <div class="layui-row layui-col-space15">
      <div class="layui-col-md8 content detail">
        <div class="fly-panel detail-box">
          <h1>{{page.title}}</h1>
          <div class="fly-detail-info">
            <!-- <span class="layui-badge">审核中</span> -->
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-if="page.catalog === 'share'"
            >分享</span>
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'ask'"
            >提问</span>
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'advise'"
            >建议</span>
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'logs'"
            >动态</span>
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'discuss'"
            >交流</span>
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'notice'"
            >公告</span>

            <span class="layui-badge" style="background-color: #999;" v-if="page.isEnd === '0'">未结</span>
            <span class="layui-badge" style="background-color: #5FB878;" v-else>已结</span>

            <span class="layui-badge layui-bg-black" v-show="page.isTop === '1'">置顶</span>
            <span
              class="layui-badge layui-bg-red"
              :class="tag.class"
              v-for="(tag,index) in page.tags"
              :key="'tag'+index"
            >{{tag.name}}</span>

            <!-- method1: vuex -> userInfo -> roles -> includes admin -->
            <!-- method2: 组件级权限控制 richtext ,就是做一个自定义指令，v-hasRole，像v-richtext 一样 -->
            <div v-hasRole="'admin'">
              <div class="fly-admin-box" data-id="123">
                <span
                  v-hasPermission="['get','delete']"
                  class="layui-btn layui-btn-xs jie-admin"
                  type="del"
                >删除</span>

                <span
                  class="layui-btn layui-btn-xs jie-admin"
                  type="set"
                  field="stick"
                  rank="1"
                  v-if="page.isTop === '0'"
                >置顶</span>
                <span
                  class="layui-btn layui-btn-xs jie-admin"
                  type="set"
                  field="stick"
                  rank="0"
                  style="background-color:#ccc;"
                  v-else
                >取消置顶</span>

                <!-- <span class="layui-btn layui-btn-xs jie-admin" type="set" field="status" rank="1">加精</span>
                <span
                  class="layui-btn layui-btn-xs jie-admin"
                  type="set"
                  field="status"
                  rank="0"
                  style="background-color:#ccc;"
                >取消加精</span>-->
              </div>
            </div>

            <div class="fly-admin-box" v-if="false">
              <span class="layui-btn layui-btn-xs jie-admin" type="del">删除</span>

              <span class="layui-btn layui-btn-xs jie-admin" type="set" field="stick" rank="1">置顶</span>
              <!-- <span class="layui-btn layui-btn-xs jie-admin" type="set" field="stick" rank="0" style="background-color:#ccc;">取消置顶</span> -->

              <span class="layui-btn layui-btn-xs jie-admin" type="set" field="status" rank="1">加精</span>
              <!-- <span class="layui-btn layui-btn-xs jie-admin" type="set" field="status" rank="0" style="background-color:#ccc;">取消加精</span> -->
            </div>
            <span class="fly-list-nums">
              <a href="#comment">
                <i class="iconfont" title="回答">&#xe60c;</i>
                {{page.answer}}
              </a>
              <i class="iconfont" title="人气">&#xe60b;</i>
              {{page.reads}}
            </span>
          </div>
          <!-- 收藏，作者信息 -->
          <div class="detail-about">
            <a class="fly-avatar" href="../user/home.html">
              <img :src="page.uid?page.uid.pic:'/img/bear.jpg'" />
            </a>
            <div class="fly-detail-user">
              <a href="../user/home.html" class="fly-link">
                <cite>{{page.uid?page.uid.name:'imc'}}</cite>
                <!-- <i class="iconfont icon-renzheng" title="认证信息"></i> -->
                <i
                  class="layui-badge fly-badge-vip mr1"
                  v-if="page.uid && page.uid.isVip !== '0'?page.uid.isVip:false"
                >VIP {{page.uid.isVip}}</i>
              </a>
              <span>{{page.created | moment}}</span>
            </div>
            <div class="detail-hits">
              <span style="padding-right: 10px; color: #FF7200">悬赏：{{page.fav}}积分</span>
            </div>
          </div>
          <div class="layui-btn-container fly-detail-admin pt1">
            <router-link
              v-show="page.isEnd === '0'"
              :to="{name:'edit',params:{tid:tid,page:page}}"
              class="layui-btn layui-btn-sm jie-admin-collect"
            >编辑</router-link>
            <a
              class="layui-btn layui-btn-sm jie-admin jie-admin-collect"
              :class="{'layui-btn-primary':page.isFav}"
              @click.prevent="setCollect"
            >{{page.isFav?'取消收藏':'收藏'}}</a>
          </div>
          <div class="detail-body photos" v-html="content"></div>
        </div>

        <!-- 回帖相关的内容 -->
        <div class="fly-panel detail-box" id="flyReply">
          <fieldset class="layui-elem-field layui-field-title" style="text-align: center;">
            <legend>回帖</legend>
          </fieldset>

          <ul class="jieda" id="jieda">
            <li class="jieda-daan" v-for="(item,index) in comments" :key="'comments'+index">
              <div class="detail-about detail-about-reply">
                <a class="fly-avatar" href>
                  <img :src="item.cuid?item.cuid.pic:'/img/bear.jpg'" alt=" " />
                </a>
                <div class="fly-detail-user">
                  <router-link :to="{name:'home',params:{uid:item.cuid._id}}" class="fly-link">
                    <cite>{{item.cuid?item.cuid.name:'imooc'}}</cite>
                    <!-- <i class="iconfont icon-renzheng" title="认证信息：XXX"></i> -->
                    <i
                      v-if="item.cuid && item.cuid.isVip !== '0'?item.cuid.isVip:false"
                      class="layui-badge fly-badge-vip"
                    >VIP{{item.cuid.isVip}}</i>
                  </router-link>

                  <span v-if="index === 0">(楼主)</span>
                  <!--
                <span style="color:#5FB878">(管理员)</span>
                <span style="color:#FF9E3F">（社区之光）</span>
                <span style="color:#999">（该号已被封）</span>
                  -->
                </div>

                <div class="detail-hits">
                  <span>{{item.created | moment}}</span>
                </div>

                <i class="iconfont icon-caina" title="最佳答案" v-show="item.isBest === '1'"></i>
              </div>
              <div class="detail-body jieda-body photos" v-richtext="item.content"></div>
              <div class="jieda-reply">
                <span
                  class="jieda-zan"
                  :class="{zanok:item.handed === '1'}"
                  type="zan"
                  @click="hands(item)"
                >
                  <i class="iconfont icon-zan"></i>
                  <em>{{item.hands}}</em>
                </span>
                <span type="reply" @click="reply(item)">
                  <i class="iconfont icon-svgmoban53"></i>
                  回复
                </span>
                <div class="jieda-admin">
                  <span
                    type="edit"
                    v-show="page.isEnd === '0' && item.cuid._id === user._id"
                    @click="editComment(item)"
                  >编辑</span>
                  <!-- <span type="del">删除</span> -->
                  <span
                    class="jieda-accept"
                    v-show="page.isEnd === '0' && page.uid._id === user._id"
                    @click="setBest(item)"
                  >采纳</span>
                </div>
              </div>
            </li>

            <!-- 无数据时 -->
            <li class="fly-none" v-if="comments.length === 0">消灭零回复</li>
          </ul>
          <Pagination
            v-show="comments.length > 0"
            ref="dyPagination"
            :showType="'icon'"
            :hasSelect="false"
            :hasTotal="false"
            :showEnd="true"
            :total="total"
            :size="size"
            :current="current"
            @changeCurrent="handleChange"
            @changeLimit="handLimit"
          />
          <div class="layui-form layui-form-pane">
            <form>
              <ValidationObserver ref="observer">
                <Editor @changeContent="addContent" :initContent="editInfo.content" />
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
                  <button class="layui-btn" type="button" @click="submit">提交回复</button>
                </div>
              </ValidationObserver>
            </form>
          </div>
        </div>
      </div>
      <div class="layui-col-md4">
        <HotList />
        <Ads />
        <Links />
      </div>
    </div>
  </div>
</template>

<script>
import { getDetail } from '@/api/content'
import { addCollect } from '@/api/user'
import {
  getComments,
  addComment,
  updateComment,
  setCommentBest,
  setHands
} from '@/api/comments'
import Links from '@/components/sidebar/Links'
import HotList from '@/components/sidebar/HotList'
import Ads from '@/components/sidebar/Ads'
import Panel from '@/components/Panel'
import CodeMix from '@/mixin/code'
import Editor from '@/components/modules/editor/Index'
import Pagination from '@/components/modules/pagination/Index'
import { escapeHtml } from '@/utils/escapeHtml'
import { scrollToElm } from '@/utils/common'
export default {
  name: 'detail',
  mixins: [CodeMix],
  props: ['tid'], // 这样拿 tid 是定义在router。js中    props: true,  path: '/detail/:tid',
  data () {
    return {
      total: 0,
      size: 10,
      current: 0,
      page: {},
      comments: [],
      editInfo: {
        content: '',
        code: '',
        sid: ''
      }
    }
  },
  created () {},
  mounted () {
    // 测试下滚动函数
    // window.vue = scrollToElm
    this.getPostDetail()
    this.getCommentsList()
  },
  computed: {
    // 文章的内容
    content () {
      if (!this.page.content || this.page.content.trim() === '') {
        return ''
      }
      return escapeHtml(this.page.content)
    },
    user () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    handLimit (limit) {
      // 修改limit的值
      // 每页显示的条数
      this.size = limit
      // 获取文章评论列表随limit变化(会重复触发)
      // this.getCommentsList()
    },
    handleChange (currentPage) {
      this.current = currentPage
      // 获取文章评论列表随页码变化
      this.$nextTick(() => {
        this.getCommentsList()
      })
    },
    // 获取文章详情
    getPostDetail () {
      getDetail(this.tid).then(res => {
        if (res.code === 200) {
          this.page = res.data
        }
      })
    },
    // 获取文章评论列表
    getCommentsList () {
      let params = {
        tid: this.tid,
        page: this.current,
        limit: this.size
      }
      getComments(params).then(res => {
        if (res.code === 200) {
          this.comments = res.data
          this.total = res.total
        }
      })
    },
    // 提交
    async submit () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        // ABORT!!
        return
      }
      // 用户未登录情况
      const isLogin = this.$store.state.isLogin
      if (!isLogin) {
        this.$pop('shake', '请先登录')
        return
      }

      // 用户禁言状态判断
      const user = this.$store.state.userInfo
      if (user.status !== '0') {
        this.$pop('shake', '用户已经禁言，请联系管理员')
        return
      }
      this.editInfo.code = this.code
      this.editInfo.sid = this.$store.state.sid || localStorage.getItem('sid')
      this.editInfo.tid = this.tid // 回复哪个文章的评论的id

      if (
        typeof this.editInfo.cid !== 'undefined' &&
        this.editInfo.cid !== ''
      ) {
        const obj = { ...this.editInfo }
        // 删除 item属性
        delete obj.item

        // 判断用户是否修改了内容(没有修改就什么都不做)
        if (this.editInfo.content === this.editInfo.item.content) {
          this.$pop('shake', '确定编辑了内容~~')
          return
        }
        // 更新评论
        updateComment(obj).then(res => {
          if (res.code === 200) {
            this.$pop('', '更新评论成功')
            // 重置操作
            this.code = ''
            this.editInfo.content = ''
            this.$refs.observer.reset()
            // 重新调用评论列表接口
            this.getCommentsList()

            // 方法一，只用更新特定的一条的content created ， vue的 $set
            // 方法二，更新整个数组中的这一条
            // 在点击编辑的时候，评论item 赋值给了this.editInfo.item，所以拿得到这条数据，再替换就行了
            // this.comments.splice(this.comments.indexof(this.editInfo.item), 1, res.data)
          }
        })
        return
      }
      // 添加评论
      addComment(this.editInfo).then(res => {
        if (res.code === 200) {
          this.$pop('', '发表评论成功')
          // 添加成功后，验证码也要重新变化（验证码函数在mixin上）
          this._getCode()
          // 重新请求帖子接口
          this.getPostDetail()
          // 重新请求评论数据
          this.getCommentsList()
          // 发表评论成功后，重置操作
          this.code = ''
          this.editInfo.content = ''
          // 重置表单项
          // this.$refs.observer.reset()
          // 或者像下面这样
          requestAnimationFrame(() => {
            this.$refs.observer.reset()
          })
        } else {
          this.$alert(res.msg)
        }
      })
    },
    // 实时赋值编辑的内容
    addContent (val) {
      this.editInfo.content = val
    },
    // 编辑评论
    editComment (item) {
      // 获取内容
      this.editInfo.content = item.content
      // 滚动到富文本编辑器，聚焦
      scrollToElm('.layui-input-block', 500, -65)
      document.getElementById('edit').focus()
      // 确定需要去编辑的记录 的 id
      this.editInfo.cid = item._id
      this.editInfo.item = item
    },
    // 采纳为最佳答案
    setBest (item) {
      this.$confirm(
        '确定采纳为最佳答案吗？',
        () => {
          // 发送采纳最佳答案接口
          setCommentBest({
            cid: item._id,
            tid: this.tid // 再props上传过来的
          }).then(res => {
            if (res.code === 200) {
              this.$pop('', '设置最佳答案成功!')
              // 重新请求帖子接口
              this.getPostDetail()
              // 重新调用评论列表接口
              this.getCommentsList()
            }
          })
        },
        () => {}
      )
    },
    // 给评论点赞
    hands (item) {
      setHands({ cid: item._id }).then(res => {
        if (res.code === 200) {
          this.$pop('', '点赞成功')
          // 重新调用评论列表接口
          this.getCommentsList()
        } else {
          this.$pop('shake', res.msg)
        }
      })
    },
    // 回复某条评论
    reply (item) {
      // 插入@ + name 到 content
      // 滚动页面到输入框
      // focus 输入框

      // 匹配 @name 字段
      const reg = /^@[\S]+\s/g
      if (this.editInfo.content) {
        // 有内容的时候

        console.log(this.editInfo.content.match(reg))
        if (reg.test(this.editInfo.content)) {
          // console.log(reg.test(this.editInfo.content))
          // 有@用户的时候
          this.editInfo.content = this.editInfo.content.replace(
            reg,
            `@${item.cuid.name} `
          )
        } else {
          // 无@用户的时候,有内容，加上 @用户
          if (this.editInfo.content !== '') {
            this.editInfo.content = `@${item.cuid.name} ${this.editInfo.content}`
          }
        }
      } else {
        // 输入框没有内容的时候
        this.editInfo.content = '@' + item.cuid.name + ' '
      }

      // 滚动到富文本编辑器，聚焦
      scrollToElm('.layui-input-block', 500, -65)
      document.getElementById('edit').focus()
    },
    // 收藏，取消收藏文章
    setCollect () {
      const isLogin = this.$store.state.isLogin
      if (isLogin) {
        // 登录的情况
        const collect = {
          tid: this.tid,
          title: this.page.title,
          isFav: this.page.isFav ? 1 : 0
        }
        // 发起收藏的请求
        addCollect(collect).then(res => {
          if (res.code === 200) {
            this.getPostDetail()
            // this.page.isFav = !this.page.isFav
            this.$pop('', this.page.isFav ? '取消收藏成功' : '设置收藏成功')
          }
        })
      } else {
        // 未登录的情况
        this.$pop('shake', '请先登录后再经行收藏')
      }
    }
  },
  components: {
    Links,
    HotList,
    Ads,
    Panel,
    Editor,
    Pagination
  },
  watch: {
    // comments (newVal, oldVal) {
    //   // 请空分页器的页码输入，只要数据变化，说明用户操作了分页
    //   this.$refs.dyPagination.clearPageNum()
    // }

    // 在详情页点击右侧文章推荐列表时，要发生变化(重新请求数据)
    tid (newVal, oldVal) {
      this.getPostDetail()
      this.getCommentsList()
    }
  }
}
</script>
<style lang="scss" scoped>
.fly-detail-admin {
  text-align: right;
  border-top: 1px dotted #eaeaea;
  background-color: #f8f8f8;
}
.fly-detail-info {
  span {
    margin-right: 5px;
  }
}
.fly-admin-box{
  margin-left: 0;
  margin-top: 15px;
}
.jieda-body {
  margin: 25px 0 20px !important;
}

</style>
