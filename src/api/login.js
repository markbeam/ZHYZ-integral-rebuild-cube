import axios from 'axios'

// 检验登陆信息
export function checkLogin(query) {
  const url = `${process.env.API_ROOT}/login`

  const data = Object.assign({}, ...query)

  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
