import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

// get 个人信息
export function getPersonalInfo() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/info`
  
  return axios.get(url, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 根据学生学号 get 学分
export function getStudentCreditById(stuNumber) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/credit/by_number/${stuNumber}`
  
  return axios.get(url, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 常见问题
export function getFAQ(category) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/question`
  
  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      category: category
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
