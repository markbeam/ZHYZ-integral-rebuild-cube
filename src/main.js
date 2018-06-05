import Vue from 'vue'
// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import {
  /* eslint-disable no-unused-vars */
  Style,
  Button,
  Toolbar,
  CheckboxGroup,
  Radio,
  Input,
  Textarea,
  Select,
  Switch,
  Form,
  Loading,
  Tip,
  Popup,
  Toast,
  Picker,
  CascadePicker,
  DatePicker,
  TimePicker,
  Dialog,
  ActionSheet,
  Drawer,
  Scroll,
  Slide,
  IndexList,
  Swipe,
  Upload
} from 'cube-ui'
import App from './App'
import axios from 'axios'
import store from './store'
import router from './router'
import FastClick from 'fastclick'

Vue.use(Button)
Vue.use(Toolbar)
Vue.use(CheckboxGroup)
Vue.use(Radio)
Vue.use(Input)
Vue.use(Textarea)
Vue.use(Select)
Vue.use(Switch)
Vue.use(Form)
Vue.use(Loading)
Vue.use(Tip)
Vue.use(Toast)
Vue.use(Popup)
Vue.use(Picker)
Vue.use(CascadePicker)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Dialog)
Vue.use(ActionSheet)
Vue.use(Drawer)
Vue.use(Scroll)
Vue.use(Slide)
Vue.use(IndexList)
Vue.use(Swipe)
Vue.use(Upload)

Vue.config.productionTip = false

// 去除旧版本手机移动端 300ms 延迟
FastClick.attach(document.body)

// 设置全局请求头设备类型为 2(2 为 mobile)
axios.defaults.headers['XX-AppId'] = '2'

// ad
console.log('Ad: 想做一个想这样的网站吗？那就加入我们网站建设社吧！(二三四中午1点A501)')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
