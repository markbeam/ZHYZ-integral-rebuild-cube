import storage from 'good-storage'

// 保存 somethink
export function saveInfo(key, token) {
  return storage.set(key, token)
}

// 加载 some，若之前无 saved 则返回空字符串
export function loadInfo(key, def = '') {
  return storage.get(key, def)
}

// clear
export function clearStorage() {
  return storage.clear()
}
