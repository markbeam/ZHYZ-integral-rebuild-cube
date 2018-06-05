import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 四大金刚页面
const Login = () => import('../components/login/login').then(m => m.default)
const Manage = () => import('../components/manage/manage').then(m => m.default)
const Index = () => import('../components/manage/page/index/index').then(m => m.default)
// 操作学生积分 > 执行操作
const OperateStudent = () => import('../components/operation/operateStudent/operateStudent').then(m => m.default)
const PerformOperation = () => import('../components/operation/operateStudent/page/performOperation/performOperation').then(m => m.default)
// 搜索学生 > 被选择的学生信息页面 > 查看该学生的操作详情
const SearchStudent = () => import('../components/operation/serachStudent/serachStudent').then(m => m.default)
const StudentInfo = () => import('../components/operation/serachStudent/page/studentInfo/studentInfo').then(m => m.default)
const StudentOperationDetailList = () => import('../components/operation/serachStudent/page/studentInfo/page/studentOperationDetailList/studentOperationDetailList').then(m => m.default)
const StudentOperationDetail = () => import('../components/operation/serachStudent/page/studentInfo/page/studentOperationDetailList/page/studentOperationDetail/studentOperationDetail').then(m => m.default)
// 操作班级积分
const OperateClass = () => import('../components/operation/operateClass/operateClass').then(m => m.default)
const PerformClassOperation = () => import('../components/operation/operateClass/page/performClassOperation/performClassOperation').then(m => m.default)
// 个人操作详情列表 -> 个人操作详情
const PersonalOperationDetailList = () => import('../components/operation/personalOperationDetailList/personalOperationDetailList').then(m => m.default)
const PersonalOperationDetail = () => import('../components/operation/personalOperationDetailList/page/personalOperationDetail/personalOperationDetail').then(m => m.default)
// 申请
const Application = () => import('../components/application/application').then(m => m.default)
const Leave = () => import('../components/application/page/leave/leave').then(m => m.default)
const SetStudentLeave = () => import('../components/application/page/setStudentLeave/setStudentLeave').then(m => m.default)
const ViewSchoolLeave = () => import('../components/application/page/viewSchoolLeave/viewSchoolLeave').then(m => m.default)
// 十项常规
const Mesystem = () => import('../components/manage/page/me/page/mesystem/mesystem').then(m => m.default)
const MesystemScore = () => import('../components/manage/page/me/page/mesystem/page/mesystemScore/mesystemScore').then(m => m.default)
const MesystemDetailList = () => import('../components/manage/page/me/page/mesystem/page/mesystemScore/page/mesystemDetailList/mesystemDetailList').then(m => m.default)
const MesystemDetail = () => import('../components/manage/page/me/page/mesystem/page/mesystemScore/page/mesystemDetailList/page/mesystemDetail/mesystemDetail').then(m => m.default)
// 小功能
const Feature = () => import('../components/feature/feature').then(m => m.default)
const RandomSelect = () => import('../components/feature/page/randomSelect/randomSelect').then(m => m.default)

// 我的 > 设置 > 修改密码
const Me = () => import('../components/manage/page/me/me').then(m => m.default)
const Setting = () => import('../components/manage/page/me/page/setting/setting').then(m => m.default)
const ChangePassword = () => import('../components/manage/page/me/page/setting/page/changePassowrd/changePassowrd').then(m => m.default)
// 查看自己的学分
const ViewOwnCredit = () => import('../components/manage/page/me/page/viewOwnCredit/viewOwnCredit').then(m => m.default)
// 审批请假
const ProcessApplication = () => import('../components/manage/page/me/page/processApplication/processApplication').then(m => m.default)
const ProcessVerification = () => import('../components/manage/page/me/page/processApplication/page/processVerification/processVerification').then(m => m.default)
// 我的申请（= 老师 / 管理员 -> 审批请假）
const MyApplication = () => import('../components/manage/page/me/page/myApplication/myApplication').then(m => m.default)

export default new Router({
  routes: [
    {
      path: '', // 如果url为空则调到登陆界面
      redirect: '/login'
    },
    {
      path: '/login', // 登陆界面
      name: 'login',
      component: Login
    },
    {
      path: '/manage', // 核心
      name: 'manage',
      component: Manage,
      children: [
        {
          path: '/index', // 首页
          name: 'index',
          component: Index,
          children: [
            {
              path: 'operateStudent', // 操作学生积分
              name: 'operateStudent',
              component: OperateStudent,
              children: [
                {
                  path: 'performOperation', // 执行操作
                  name: 'performOperation',
                  component: PerformOperation
                }
              ]
            },
            {
              path: 'searchStudent', // 搜索学生
              name: 'searchStudent',
              component: SearchStudent,
              children: [
                {
                  path: 'studentInfo', // 学生信息页面
                  name: 'studentInfo',
                  component: StudentInfo,
                  children: [
                    {
                      path: 'studentOperationDetailList', // 学生被操作列表
                      name: 'studentOperationDetailList',
                      component: StudentOperationDetailList,
                      children: [
                        {
                          path: 'studentOperationDetail', // 学生被操作列表详情
                          name: 'studentOperationDetail',
                          component: StudentOperationDetail
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: 'operateClass',
              name: 'operateClass',
              component: OperateClass,
              children: [
                {
                  path: 'performClassOperation',
                  name: 'performClassOperation',
                  component: PerformClassOperation
                }
              ]
            },
            {
              path: 'personalOperationDetailList', // 个人操作详情列表
              name: 'personalOperationDetailList',
              component: PersonalOperationDetailList,
              children: [
                {
                  path: 'personalOperationDetail', // 个人操作详情列表详情
                  name: 'personalOperationDetail',
                  component: PersonalOperationDetail
                }
              ]
            },
            {
              path: 'application', // 申请
              name: 'application',
              component: Application,
              children: [
                {
                  path: 'leave', // 请假
                  name: 'leave',
                  component: Leave
                },
                {
                  path: 'setStudentLeave', // 设置学生请假
                  name: 'setStudentLeave',
                  component: SetStudentLeave
                },
                {
                  path: 'viewSchoolLeave', // 查看本校请假情况
                  name: 'viewSchoolLeave',
                  component: ViewSchoolLeave
                }
              ]
            },
            {
              path: 'feature', // 小功能
              name: 'feature',
              component: Feature,
              children: [
                {
                  path: 'randomSelect', // 随机选择学生
                  name: 'randomSelect',
                  component: RandomSelect
                }
              ]
            }
          ]
        },
        {
          path: '/me', // 我的
          name: 'me',
          component: Me,
          children: [
            {
              path: 'setting', // 设置
              name: 'setting',
              component: Setting,
              children: [
                {
                  path: 'changePassowrd', // 修改密码
                  name: 'changePassword',
                  component: ChangePassword
                }
              ]
            },
            {
              path: 'mesystem', // 查看班级十项常规分
              name: 'mesystem',
              component: Mesystem,
              children: [
                {
                  path: 'mesystemList', // 选择某天的某项目
                  name: 'mesystemList',
                  component: MesystemScore,
                  children: [
                    {
                      path: 'mesystemDetailList', // 项目列表
                      name: 'mesystemDetailList',
                      component: MesystemDetailList,
                      children: [
                        {
                          path: 'mesystemDetail', // 项目详情
                          name: 'mesystemDetail',
                          component: MesystemDetail
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: 'processapplication',
              name: 'processapplication',
              component: ProcessApplication,
              children: [
                {
                  path: 'processVerification',
                  name: 'processVerification',
                  component: ProcessVerification
                }
              ]
            },
            {
              path: 'myApplication',
              name: 'myApplication',
              component: MyApplication,
              children: [
                {
                  path: 'viewVerification',
                  name: 'viewVerification',
                  component: ProcessVerification
                }
              ]
            },
            {
              path: 'viewOwnCredit', // 查看自己的学分
              name: 'viewOwnCredit',
              component: ViewOwnCredit
            }
          ]
        }
      ]
    }
  ]
})
