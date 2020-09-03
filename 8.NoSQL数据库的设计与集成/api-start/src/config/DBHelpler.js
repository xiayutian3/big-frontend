import mongoose from 'mongoose'
import config from './index'

//创建连接
mongoose.connect(config,{
  useNewUrlParser:true
})

//连接成功
mongoose.connection.on('connected',()=>{
  console.log('mongoose connect is ok')
})

//连接异常
mongoose.connection.on('error',(err)=>{
  console.log('ongoose connect is '+ err)
})

//断开连接
mongoose.connection.on('disconnected',()=>{
  console.log('mongoose connection disconnected')
})

export default mongoose