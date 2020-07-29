import store from '@/store'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  const info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}
// axios用来处理错误的函数
const errorHandle = (err) => {
  addErrorLog(err)
}
export default errorHandle
