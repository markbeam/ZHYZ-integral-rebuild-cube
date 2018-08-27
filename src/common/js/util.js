import VueRouter from 'vue-router'

const router = new VueRouter()

// 信息弹出提示
export function openToast(self, txt = '', type = 'correct', time = 1500, mask = false, cb) {
  let toast = self.$createToast({
    txt: txt,
    type: type,
    time: time,
    mask: mask,
    onTimeout: () => {
      cb && cb()
    }
  })
  toast.show()
}

// 登陆失效
export function loginFailure(msg = '登陆已失效') {
  router.push('/login')
}

// 函数节流
export function debounce(func, delay) {
  let timer

  return function(...args) {
    if(timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 查看数组里是否包含需要加入的元素
export function findIndex(list, newItem) {
  return list.findIndex((item) => {
    return item.id === newItem.id
  })
}

// 创建相同的数组时需要的字段可以封装成一个 class
export class Klass {
  constructor({id, name, cls, number, sex, score, scoreTotal, scoreExchange, moralEduSroce}) {
    this.id = id
    this.name = name
    this.sex = sex
    this.cls = cls
    this.score = score
    this.number = number
    this.scoreTotal = scoreTotal
    this.scoreExchange = scoreExchange
    this.moralEduSroce = moralEduSroce
  }
}

// 排序
export function normalizeList(list = [], lizeName, isLizeEng = false) {
  let map = {}
  lizeName = lizeName.split('.')

  list.forEach((item, index) => {
    let key = item
    lizeName.forEach((cItem, index) => {
      key = key[cItem]
    })
    key = key.substr(0, 1)
    
    if(!map[key]) {
      map[key] = {
        name: key,
        items: []
      }
    }

    // 把数据都加进来
    map[key].items.push(new Klass({
      id: item.id ? item.id : 0,
      name: item.name ? item.name : '',
      cls: item.cls ? item.cls : {},
      number: item.number ? item.number : '',
      sex: item.sex ? item.sex : '',
      score: item.score ? item.score : 0,
      scoreTotal: item.score_total ? item.score_total : 0,
      scoreExchange: item.score_exchange ? item.score_exchange : 0,
      moralEduSroce: item.moral_edu_score ? item.moral_edu_score : 0
    }))
  })

  // 为了得到有序列表，需要处理 map
  let ret = []
  for(let key in map) {
    let val = map[key]
    ret.push(val)
  }

  if(isLizeEng) {
    // 排序 A,B,C,D
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
  }

  return ret
}

/**
 * 判断是否全部人员都审核完毕
 * false → 还未全部审核完毕
 * true → 全部审核完毕
 * @param { Number } userId
 * @param { Array } approval
 */
export function isVerifyApply(userId, approval) {
  for(let i of approval) {
    if(i.status === 0) {
      return false
    }
  }
  return true
}

/**
 * 判断 本人是否已经审核过 此条请假申请
 * 0 → 还未审核
 * 1 → 审核完毕 → 通过
 * 2 → 审核完毕 → 拒绝
 * @param { Number } userId
 * @param { Array } approval
 */
export function verifyApplyText(userId, data) {
  // 是否已经全部点击完成
  if(data.status === 1) {
    return '通过'
  } else if(data.status === 2) {
    return '申请被拒绝'
  }

  const character = ['班主任', '学生处']
  let retIndex = -1
  
  for(let i = data.approval.length - 1; i >= 0; i--) {
    if(data.approval[i].status === 1) {
      retIndex = i
      break
    }
  }

  if(retIndex === -1) {
    return `等待${character[0]}审核`
  } else {
    return `${character[retIndex]}审核通过`
  }
}

/**
 *  判断是否显示 同意/拒绝按钮
 * @return true => 显示，false => 不显示
 */
export function isShowOperateBtn(userId, approval) {
  for(let i of approval) {
    if(i.status === 0) {
      if(userId === i.user_id) {
        return true
      }
    }
  }

  return false
}

// 根据传入的学号计算学生分数
export function figureCredit(data) {
  let ret = 0
  for(let i of data) {
    for(let j of i.data) {
      ret += parseInt(j.CREDIT ? j.CREDIT : '0')
    }
  }
  return ret
}
