<template>
  <div>
    <Modal v-model="showStatus" title="Common Modal dialog box title" @on-ok="ok" @on-cancel="cancel">
      <Form :model="localItem" :label-width="80">
        <FormItem label="标题">
          <Input v-model="localItem.title" placeholder="请输入文章标题"></Input>
        </FormItem>
        <FormItem label="分类">
          <Select v-model="localItem.catalog">
            <Option value="ask">提问</Option>
            <Option value="advise">建议</Option>
            <Option value="discuss">交流</Option>
            <Option value="share">分享</Option>
            <Option value="logs">动态</Option>
            <Option value="notice">公告</Option>
          </Select>
        </FormItem>
        <FormItem label="是否结束">
          <RadioGroup v-model="localItem.isEnd">
            <Radio label="0">未结束</Radio>
            <Radio label="1">已结帖</Radio>
          </RadioGroup>
        </FormItem>
         <FormItem label="回复状态">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">打开回复</Radio>
            <Radio label="1">禁止回复</Radio>
          </RadioGroup>
        </FormItem>
          <FormItem label="是否置顶">
          <RadioGroup v-model="localItem.isTop">
            <Radio label="0">未置顶</Radio>
            <Radio label="1">已置顶</Radio>
          </RadioGroup>
        </FormItem>
         <FormItem label="帖子积分">
            <Slider v-model="formatFav" show-input :step="10"></Slider>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    item (newval, oldval) {
      this.localItem = newval
    },
    // 控制modal的显示隐藏
    isShow () {
      this.showStatus = this.isShow
    }
  },
  computed: {
    formatFav: {
      get () {
        return parseInt(this.localItem.fav)
      },
      set (val) {
        this.localItem.fav = val
      }
    }
  },
  data () {
    return {
      showStatus: false,
      localItem: {
        tid: '',
        uid: '',
        title: '',
        content: '',
        create: '',
        catalog: '',
        fav: 0,
        isEnd: '',
        reads: '',
        answer: '',
        status: '',
        isTop: '',
        sort: '',
        tags: ''
      }
    }
  },
  methods: {
    ok () {
      this.$emit('editEvent', this.localItem)
      this.$emit('changeEvent', false)
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$emit('changeEvent', false)
      this.$Message.info('Clicked cancel')
    }
  }
}
</script>
