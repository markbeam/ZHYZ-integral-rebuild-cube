import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

export function changePassword(query) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/password`

  return axios.post(url, ...query, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 检验登陆信息
export function logout() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/logout`

  return axios.post(url, {}, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
