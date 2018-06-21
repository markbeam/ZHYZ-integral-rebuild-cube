import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

// get 全部校区
export function getAllCampus() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/campus`

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

// get 全部班级信息 或 根据校区 id get 班级
export function getClsListByCampusId(campusId) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/cls/by_campus/${campusId}`
  
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

// get 全部班级信息
export function getAllClsList() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/cls`
  
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

// 根据班级 id get 班级学生信息
export function getStuByClsId(clsId) {
  let token = loadInfo(TOKEN_KEY)
  let url = `${process.env.API_ROOT}/student/by_cls/${clsId}`
  
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

// get 个人操作信息
export function getPersonalOperationInfo(page = 1) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/my`
  
  const data = Object.assign({}, {
    page: page
  })
   
  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// get 学生操作信息
export function getStudentOperationInfo(stuId, page = 1) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/by_student/${stuId}`
  
  const data = Object.assign({}, {
    page: page
  })
  
  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 根据学号查找学生信息
export function getStudentInfoByNumber(stuNum) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/student/by_number/${stuNum}`

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

// 根据 id 查找学生信息
export function getStudentInfoById(stuId) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/student/${stuId}`

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

// 根据 关键字（姓名，学号） 查找学生信息
export function searchStudentByKeyword(keyword) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/student/search`

  const data = Object.assign({}, {
    keyword: keyword
  })

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// get 分类
export function getAllCategory(type, itemType) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_category`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      type: type,
      item_type: itemType
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 根据分类 id get 项目
export function getProjectByCategoryId(id, itemType) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_item/by_category/${id}`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      // itemType 为过滤 操作班级还是个人分的字段 0 or 1
      item_type: itemType
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 操作学生积分
export function operateStudentScore(query) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/student`

  return axios.post(url, {
    data_set: [...query]
  }, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 操作班级积分
export function operateClassScore(query) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/cls`

  return axios.post(url, {
    data_set: [...query]
  }, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 撤回操作记录
export function withdrawOperateHistory(id) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/failure`

  return axios.post(url, {
    ids: id
  }, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 取消撤回操作记录
export function unWithdrawOperateHistory(id) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/activation`

  return axios.post(url, {
    ids: id
  }, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 显示加分项
export function getPersonalAddTypeList(page = 1) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/my/plus`

  const data = Object.assign({}, {
    page: page
  })

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 显示减分项
export function getPersonalDeeTypeList(page = 1) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/my/minus`

  const data = Object.assign({}, {
    page: page
  })

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// get 加分总数
export function getAllADDScore() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/my/plus/score`

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

// get 减分总数
export function getAllDeeScore() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/my/minus/score`

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

// 获取常用班级列表
export function getOftenOperateClassList() {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/score_handle/cls/order`

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

// 获取学生请假次数
export function getStudentLeaveCount(userId) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/leave/by_user/${userId}/count`

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

// 获取学生请假列表
export function getStudentLeaveList(userId) {
  let token = loadInfo(TOKEN_KEY)
  const url = `${process.env.API_ROOT}/leave/who`

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      user: userId
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
