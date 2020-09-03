import {setValue,getValue,getHValue,delValue} from './RedisConfig'
setValue('imooc','imooc message from redis client')
getValue('imooc').then(res=>{
  console.log('getValue:'+res)
})

delValue('imooc')

setValue('imoocObj',{name:'aa',age:50,email:'@163.com'})
getHValue('imoocObj').then(res=>{
  console.log('getHValue:'+JSON.stringify(res))
})