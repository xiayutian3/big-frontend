import User from './test'

// 增

const user = {
  name:'laohei',
  age:45
}
const insertMethods = async () =>{
  const data = new User(user)
  const result = await data.save()
  console.log(result)
}

// 查
const findMethods = async () =>{
  const result = await User.find()
  console.log(result)
}

// 改
const updateMethods = async () =>{
  const result = await User.updateOne({name:'laohei'},{age:75})
  console.log(result)
}

// 删
const deleteMethods = async () =>{
  const result = await User.deleteOne({name:'laohei'})
  console.log(result)
}


deleteMethods()