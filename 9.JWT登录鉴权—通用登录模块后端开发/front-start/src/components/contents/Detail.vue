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
            <a href class="layui-btn layui-btn-sm jie-admin-collect">编辑</a>
            <a href class="layui-btn layui-btn-sm jie-admin jie-admin-collect">收藏</a>
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
                  <img
                    :src="item.user?item.user.pic:'/img/bear.jpg'"
                    alt=" "
                  />
                </a>
                <div class="fly-detail-user">
                  <a href class="fly-link">
                    <cite>{{item.user?item.user.name:'imooc'}}</cite>
                    <!-- <i class="iconfont icon-renzheng" title="认证信息：XXX"></i> -->
                    <i v-if="item.user && item.user.isVip !== '0'?item.user.isVip:false" class="layui-badge fly-badge-vip">VIP{{item.user.isVip}}</i>
                  </a>

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

                <!-- <i class="iconfont icon-caina" title="最佳答案"></i> -->
              </div>
              <div class="detail-body jieda-body photos" v-html="item.content">
              </div>
              <div class="jieda-reply">
                <span class="jieda-zan" :class="{zanok:item.handed === '1'}" type="zan">
                  <i class="iconfont icon-zan"></i>
                  <em>{{item.hands}}</em>
                </span>
                <span type="reply">
                  <i class="iconfont icon-svgmoban53"></i>
                  回复
                </span>
                <div class="jieda-admin">
                  <span type="edit">编辑</span>
                  <span type="del">删除</span>
                  <!-- <span class="jieda-accept" type="accept">采纳</span> -->
                </div>
              </div>
            </li>

            <!-- 无数据时 -->
            <li class="fly-none" v-if="comments.length === 0">消灭零回复</li>
          </ul>
          <Pagination
            :showType="'icon'"
            :hasSelect="true"
            :showEnd="true"
            :total="total"
            :size="size"
            :current="current"
            @changeCurrent="handleChange"
          />
          <div class="layui-form layui-form-pane">
            <form>
              <Editor />
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
                <button class="layui-btn" type="button">提交回复</button>
              </div>
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
import { getComments } from '@/api/comments'
import Links from '@/components/sidebar/Links'
import HotList from '@/components/sidebar/HotList'
import Ads from '@/components/sidebar/Ads'
import Panel from '@/components/Panel'
import CodeMix from '@/mixin/code'
import Editor from '@/components/modules/editor/Index'
import Pagination from '@/components/modules/pagination/Index'
import { escapeHtml } from '@/utils/escapeHtml'
export default {
  name: 'detail',
  mixins: [CodeMix],
  props: ['tid'], // 这样拿 tid 是定义在router。js中    props: true,  path: '/detail/:tid',
  data () {
    return {
      total: 101,
      size: 15,
      current: 6,
      page: {},
      comments: []
    }
  },
  created () {},
  mounted () {
    this.getPostDetail()
    this.getCommentsList()
  },
  computed: {
    content () {
      if (this.page.content.trim() === '') {
        return ''
      }
      return escapeHtml(this.page.content)
    }
  },
  methods: {
    handleChange (currentPage) {
      this.current = currentPage
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
      getComments(this.tid).then(res => {
        if (res.code === 200) {
          this.comments = res.data
        }
      })
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
  watch: {}
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
.jieda-body {
  margin: 25px 0 20px !important;
}
</style>
