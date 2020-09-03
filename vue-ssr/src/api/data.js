
const getData = () => new Promise(resolve => {
  setTimeout(() => {
    resolve([
      {
        id: 1,
        item: 'hello'
      },
      {
        id: 2,
        item: 'hello2'
      }
    ])
  }, 1000)
})

export {
  getData
}