import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

// 获取请假项目列表
export function getLeaveList() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/leave_type/all`

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

// 申请请假 & 留宿
export function askForLeave(query) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/flow/instance`

  const data = Object.assign({}, ...query)

  return axios.post(url, data, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 获取 全部 / 已审批 / 未审批 列表（不包含最终结果）
export function getProcessApplicationList(status, page = 1) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/flow/about_me`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      status: status,
      page: page
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// （学生）获取 全部 / 已审批 / 未审批 列表（不包含最终结果）
export function studentGetFinalProcessApplyList(page = 1) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/flow/my_sponsor`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      page: page
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 最终审批
export function approvalApply(flowInstanceId, status, summary) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/flow/approve/${flowInstanceId}`

  const data = Object.assign({}, {
    status: status,
    summary: summary
  })

  return axios.post(url, data, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 查看全校请假情况
export function viewSchoolLeave(campusId, date) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/leave/day/${date}`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      campus_id: campusId
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
