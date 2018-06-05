import { TOKEN_KEY } from 'common/js/config'
import { loadInfo } from 'common/js/cache'

const state = {
  // 身份令牌，有效时间 7200s
  // ！！！非常重要 ！！！
  token: loadInfo(TOKEN_KEY),
  // 个人信息
  personalInfo: {},
  // 查看本班德育的 data
  mesystemData: {}
}

export default state
