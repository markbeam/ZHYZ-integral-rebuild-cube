import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

// get 本学期的星期列表
export function getWeekList() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/semester/week_list`

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

// 班主任 get 我带的班
export function getMyTeachCls() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/my_teach_cls`

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

// get 根据时间戳班级常规
export function getClsMesystem(id, beginTime, endTime) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/statistic/mesystem/cls/${id}`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      begin_time: beginTime,
      end_time: endTime
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 获取单个常规的详细信息
export function getMesystemDetail(clsId, beginTime, categoryId) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/score/all`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      cls_id: clsId,
      category_id: categoryId,
      begin_time: beginTime
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
