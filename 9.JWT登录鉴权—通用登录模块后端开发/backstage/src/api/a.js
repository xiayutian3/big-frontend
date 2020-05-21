// 理论上应该这么写才工整

// async function a(ctx) {
//   ctx.body = {

//   }
// }
// module.exports = {
//   a
// }

module.exports = async function (ctx) {
  ctx.body = {
    message: 'hello from a44'
  }
}
