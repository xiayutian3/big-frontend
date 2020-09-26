import ErrorRecord from '../model/ErrorRecord'
import qs from 'qs'
class ErrorController {
  async getErrorList (ctx) {
    const params = ctx.query

    // 查询的字段 method， $sort: { _id: 1 }  正序排列，数据库中该字段所有的值
    // [ { _id: 'GET' }, { _id: 'POST' } ]
    const methodFilter = await ErrorRecord.aggregate([{ $group: { _id: '$method' } }, { $sort: { _id: 1 } }])

    const codeFilter = await ErrorRecord.aggregate([{ $group: { _id: '$code' } }, { $sort: { _id: 1 } }])

    const obj = qs.parse(params)
    const query = obj.filter ? { ...obj.filter } : {}
    // { method: /get/i } 正则表达式  让数据库查询对大小写不敏感，与下面时等价的
    // 数据库提供的正则查询  'i' 对大小写不敏感
    if (query.method) {
      query.method = { $regex: query.method, $options: 'i' }
    }
    // 分页
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 10

    // { method: /get/i } 正则表达式  让数据库查询对大小写不敏感
    const result = await ErrorRecord.find(query).skip((page - 1) * limit).limit(limit).sort({ created: -1 })
    const total = await ErrorRecord.find(query).countDocuments()

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: result,
      total: total,
      filters: {
        method: methodFilter.map(o => {
          return {
            label: o._id,
            value: o._id
          }
        }),
        code: codeFilter.map(o => {
          return {
            label: o._id,
            value: parseInt(o._id)
          }
        })
      }
    }
  }

  // 批量删除日志
  async deleteError (ctx) {
    const { body } = ctx.request
    console.log('body', body)
    // $in mongodb提供的修饰符 ，遍历数组中的每一项，然后查找进行删除
    const result = await ErrorRecord.deleteMany({ _id: { $in: body.ids } })
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: result
    }
  }

  // 添加错误日志 到数据库中
  async addError (ctx) {
    const { body } = ctx.request
    const error = new ErrorRecord(body)
    const result = await error.save()
    ctx.body = {
      code: 200,
      msg: '保存成功',
      data: result
    }
  }
}

export default new ErrorController()
