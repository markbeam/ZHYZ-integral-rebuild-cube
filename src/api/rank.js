import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

// get 排行榜（简约）
export function getRank(groupType) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/rank/student_score`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      group_type: groupType
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// get 排行榜（简约）
export function getRankAdvanced(gId, grade, limit = 20) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/rank1/student_score`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      gid: gId,
      grade: grade,
      limit: limit
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
