import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

// get 全部校区
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
