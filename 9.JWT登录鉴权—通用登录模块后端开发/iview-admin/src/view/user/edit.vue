<template>
  <div>
    <Modal v-model="showStatus" title="编辑用户信息" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <Form :model="localItem" :label-width="80" :rules="ruleValidate"  ref="table">
        <FormItem label="用户名称" prop="name">
          <Input v-model="localItem.name" placeholder="请输入用户名称"></Input>
        </FormItem>
        <FormItem label="登录名" prop="username">
          <Input v-model="localItem.username" placeholder="请输入登录名"></Input>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="localItem.password" placeholder="请输入密码"></Input>
        </FormItem>

         <FormItem label="是否禁用">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
          <FormItem label="是否是VIP">
          <RadioGroup v-model="localItem.isVip">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
         <FormItem label="用户积分" prop="favs">
           <Input v-model="localItem.favs"  style="width: 120px;"></Input>
            <!-- <Slider v-model="localItem.favs" show-input :step="10"></Slider> -->
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { checkUsername } from '@/api/admin'
const validatePass = (rule, value, callback) => {
  // console.log('validatePass -> value', value)
  if (!value) {
    return callback(new Error('请输入数字'))
  }
  if (!/^[1-9]\d*$/.test(value)) {
    return callback(new Error('请输入正确的数值'))
  }
  const result = parseInt(value)
  if (result % 10 === 0) {
    callback()
  } else {
    callback(new Error('请输入可以整除10的整数'))
  }
}

// 异步校验用户名是否已存在
const userNamePassCheck = (rule, value, callback, vm) => {
  // 编辑的时候 用户没有修改username，直接不校验
  if (vm.item.username === vm.localItem.username) {
    callback()
    return
  }
  checkUsername(value).then(res => {
    if (res.code === 200) {
      const data = res.data
      if (data === 1) {
        // 校验通过
        callback()
      } else if (data === 0) {
        // 检验不通过
        callback(new Error('用户名冲突！请更换'))
      }
    }
  })
}
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
      this.localItem = { ...newval }
    },
    // 控制modal的显示隐藏
    isShow () {
      this.showStatus = this.isShow
    }
  },
  data () {
    return {
      loading: true,
      showStatus: false,
      localItem: {
        _id: '',
        name: '',
        username: '',
        password: '',
        status: '0',
        favs: 0,
        isVip: '0'
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            type: 'string',
            min: 4,
            message: '昵称长度最少4位',
            trigger: 'change'
          },
          {
            type: 'string',
            max: 16,
            message: '昵称长度不能超过16位',
            trigger: 'change'
          }
        ],
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            type: 'email',
            message: '请检查邮箱的格式',
            trigger: 'blur'
          },
          { validator: (rule, value, callback) => userNamePassCheck(rule, value, callback, this), trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度最少6位',
            trigger: 'change'
          },
          {
            type: 'string',
            max: 16,
            message: '密码长度不能超过16位',
            trigger: 'change'
          }
        ],
        favs: [
          // { required: true, message: '请输入积分', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ok () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          this.loading = false
          this.$emit('editEvent', this.localItem)
          this.$emit('changeEvent', false)
          this.$Message.info('编辑成功')
        } else {
          this.loading = false
          this.$Message.error('请检查输入的数据')
        }
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$Message.info('取消编辑')
    }
  }
}
</script>
