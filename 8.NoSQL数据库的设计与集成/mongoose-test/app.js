const mongoose = require('mongoose')
//因为在创建虚拟机contos的testdb的时候，加了用户验证，用户名test，密码123456   如果没有加就不用写
mongoose.connect('mongodb://test:123456@192.168.169.129:27017/testdb',{
  useNewUrlParser: true
})

const User = mongoose.model('user',{name:String,age:Number})

const imooc = new User({
  name:'imooc-test',
  age:50
})
imooc.save().then(()=>{console.log('ok')})