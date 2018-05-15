/**
 * Created by Sind on 2017/10/18.
 */
export const themeType = {
  red: 'red',
  blue: 'blue',
  gray: 'gray',
  orange: 'orange',
  green: 'green',
  purple: 'purple'
}

export const themeItems = [
  {
    title: '板岩紫',
    name: themeType.purple,
    mainColor: '#5576bd',
    style: {
      logoColor: 'color: #5576bd',
      logo2Color: 'color:rgba(0, 0, 0, 0.5)',
      leftMenuBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(rgba(85,118,189,1)), to(rgba(85,118,189,0.5)',
      sysBarBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(rgba(85,118,189,1)), to(#9370DB))',
      sysBarColor: '#5576bd',
      selectedBack: '#F3F3F3',
      selectedBorder: '#5576bd',
      mainBackgroundColor: 'background:#5576bd',
      border: 'border:1px solid #5576bd',
      borderTop: 'border-top: 1px solid #5576bd',
      borderRight: 'border-right: 1px solid #5576bd',
      closeColor: 'color: orange',
      borderBottom2px: 'border-bottom:2px solid #5576bd',
      triangleColor: 'border-color: #5576bd',
      // 字体颜色
      fontColor: 'color: #5576bd',
      // 菜单样式----
      backColorMenu: 'color:#5576bd; background-color: rgba(85,118,189,0.1)',
      navBorderColor: 'border-top:2px solid #5576bd;border-bottom:1px solid #5576bd;border-right:1px solid #5576bd ',
      //  fifileBag 三角颜色
      chooseFileBag: 'border-bottom: 6px solid #5576bd;',
      backgroundColor: 'background: rgba(123,104,238,0.1)',
      // home 主页
      homeMenu: 'background:rgba(85,118,189,0.5); box-shadow: 0 0 20px rgba(85,118,189,0.3) inset;',
      // 笔记列表选中状态
      noteBack: 'background-color:rgba(85,118,189,0.05); box-shadow:0 0 20px rgba(85,118,189,0.1) inset;',
      userMes: {
        menuBack: 'rgba(85,118,189,1)',
        menuSelect: 'rgba(85,118,189,0.5)'
      },
      searchBox: 'background-color: rgba(85,118,189,0.32); border-right: 1px solid #5576bd;'
    }
  },
  {
    title: '科技蓝',
    name: themeType.blue,
    mainColor: '#3091f2',
    style: {
      logoColor: 'color: rgba(48,145,242,0.8)',
      logo2Color: 'color:rgba(0,0,0,0.5)',
      leftMenuBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(#3091f2), to(#30f1f2))',
      menubarBorder: '1px solid #B7558E',
      sysBarBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(#3091f2), to(#30f1f2))',
      sysBarColor: '#3091f2',
      selectedBack: '#F3F3F3',
      selectedBorder: '#3091f2',
      mainBackgroundColor: 'background:#3091f2',
      border: 'border:1px solid #3091f2',
      borderTop: 'border-top: 1px solid #3091f2',
      borderRight: 'border-right: 1px solid #3091f2',
      closeColor: 'color: orange',
      borderBottom2px: 'border-bottom:2px solid #3091f2',
      triangleColor: 'border-color: #3091f2',
      // 字体颜色
      fontColor: 'color: #3091f2',
      // 菜单样式----
      backColorMenu: 'color:#3091f2; background-color: rgba(48,145,242,0.1)',
      navBorderColor: 'border-top:2px solid #3091f2;border-bottom:1px solid #3091f2;border-right:1px solid #3091f2 ',
      //  fifileBag 三角颜色
      chooseFileBag: 'border-bottom: 6px solid #3091f2;',
      backgroundColor: 'background: rgba(48,145,242,0.1)',
      // home 主页
      homeMenu: 'background:rgba(48,145,242,0.5); box-shadow: 0 0 20px rgba(48,145,242,0.3) inset;',
      // 笔记列表选中状态
      noteBack: 'background-color:rgba(48,145,242,0.05); box-shadow:0 0 20px rgba(48,145,242,0.1) inset;',
      userMes: {
        menuBack: '#30f1f2',
        menuSelect: '#3091f2'
      },
      searchBox: 'background-color: rgba(48,145,242,0.32); border-right: 1px solid #3091f2;'
    }
  },
  {
    title: '魔幻红',
    name: themeType.red,
    mainColor: '#B7558E',
    style: {
      logoColor: 'color: #B7558E',
      logo2Color: 'color:rgba(0, 0, 0, 0.5)',
      leftMenuBackImage: '-webkit-gradient(linear, 0 0, 100% 100%, from(#B7558E), to(#C26F9F))',
      sysBarBackImage: '',
      sysBarColor: '#B7558E',
      selectedBack: '#F3F3F3',
      selectedBorder: '#B7558E',
      mainBackgroundColor: 'background:#B7558E',
      border: 'border:1px solid #B7558E;box-shadow:0 0 20px rgba(183,85,142,0.3)',
      borderTop: 'border-top: 1px solid #B7558E',
      borderRight: 'border-right: 1px solid #B7558E',
      closeColor: 'color: orange',
      borderBottom2px: 'border-bottom:2px solid #B7558E',
      triangleColor: 'border-color: #B7558E',
      // 字体颜色
      fontColor: 'color: #B7558E',
      // 菜单样式----
      backColorMenu: 'color:#B7558E; background-color: rgba(183,85,142,0.1)',
      navBorderColor: 'border-top:2px solid #B7558E;border-bottom:1px solid #B7558E;border-right:1px solid #B7558E ',
      //  fifileBag 三角颜色
      chooseFileBag: 'border-bottom: 6px solid #B7558E;',
      backgroundColor: 'background: rgba(183,85,142,0.1)',
      // home 主页
      homeMenu: 'background:rgba(183,85,142,0.4); box-shadow: 0 0 20px rgba(183,85,142,0.3) inset;',
      // 笔记列表选中状态
      noteBack: 'border: 1px solid rgba(183,85,142,1)',
      userMes: {
        menuBack: '#B7558E',
        menuSelect: '#C26F9F'
      },
      searchBox: 'background-color: rgba(142,85,183,0.32); border-right: 1px solid #B7558E;'
    }
  },
  {
    title: '高级灰',
    name: themeType.gray,
    mainColor: '#464c5b',
    style: {
      logoColor: 'color: #8b0000',
      logo2Color: 'color:rgba(0,0,0,0.6)',
      leftMenuBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(#464c5b), to(rgba(70,76,91,0.8)))',
      sysBarBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(#464c5b), to(#A9A9A9))',
      sysBarColor: '#464c5b',
      selectedBack: '#F3F3F3',
      selectedBorder: '#464c5b',
      mainBackgroundColor: 'background:#464c5b',
      border: 'border:1px solid #464c5b',
      borderTop: 'border-top: 1px solid #464c5b',
      borderRight: 'border-right: 1px solid #464c5b',
      closeColor: 'color: orange',
      borderBottom2px: 'border-bottom:2px solid #464c5b',
      triangleColor: 'border-color: #464c5b',
      // 字体颜色
      fontColor: 'color: #464c5b',
      // 菜单样式----
      backColorMenu: 'color:#464c5b; background-color: rgba(255,180,0,0.1)',
      navBorderColor: 'border-top:2px solid #464c5b;border-bottom:1px solid #464c5b;border-right:1px solid #464c5b ',
      //  fifileBag 三角颜色
      chooseFileBag: 'border-bottom: 6px solid #464c5b;',
      backgroundColor: 'background: rgba(70,76,91,0.13)',
      // home 主页
      homeMenu: 'background:rgba(70,76,91,0.7); box-shadow: 0 0 20px rgba(70,76,91,0.4) inset;',
      // 笔记列表选中状态
      noteBack: 'background-color:rgba(0,0,0,0.05); box-shadow:0 0 20px rgba(0,0,0,0.1) inset;',
      userMes: {
        menuBack: '#464c5b',
        menuSelect: 'rgba(70,76,91,0.8)'
      },
      searchBox: 'background-color: rgba(91,76,70,0.32); border-right: 1px solid #464c5b;'
    }
  },
  {
    title: '维C橙',
    name: themeType.orange,
    mainColor: 'rgb(222,124,44)',
    style: {
      // logoColor
      logoColor: 'color: rgb(222,124,44)',
      leftMenuBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(rgb(222,124,44)), to(rgba(222,124,44,0.9)))',
      menubarBorder: '1px solid rgb(222,124,44)',
      sysBarBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(rgb(222,124,44)), to(#ff8c00))',
      sysBarColor: 'rgb(222,124,44)',
      selectedBack: '#F3F3F3',
      selectedBorder: '#ff9900',
      mainBackgroundColor: 'background:rgb(222,124,44)',
      border: 'border:1px solid rgb(222,124,44);box-shadow:0 0 20px rgba(255,153,0,0.3)',
      borderTop: 'border-top: 1px solid rgb(222,124,44)',
      borderRight: 'border-right: 1px solid rgb(222,124,44)',
      closeColor: 'color: rgb(222,124,44)',
      borderBottom2px: 'border-bottom:2px solid rgb(222,124,44)',
      triangleColor: 'border-color: rgb(222,124,44)',
      // 字体颜色
      fontColor: 'color: rgb(222,124,44)',
      // 菜单样式----
      backColorMenu: 'color:rgb(222,124,44); background-color: rgba(222,124,44,0.1)',
      navBorderColor: 'border-top:2px solid rgb(222,124,44);border-bottom:1px solid rgb(222,124,44);border-right:1px solid rgb(222,124,44) ',
      //  fifileBag 三角颜色
      chooseFileBag: 'border-bottom: 6px solid rgb(222,124,44);',
      backgroundColor: 'background: rgba(222,124,44,0.1)',
      // home 主页
      homeMenu: 'background:rgba(222,124,44,0.6); box-shadow: 0 0 20px rgba(222,124,44,0.3) inset;',
      // 笔记列表选中状态
      noteBack: 'border: 1px solid rgb(222,124,44)',
      userMes: {
        menuBack: 'rgba(222,124,44,1)',
        menuSelect: 'rgba(222,124,44,0.9)'
      },
      searchBox: 'background-color: rgba(222,124,44,0.32); border-right: 1px solid rgb(222,124,44);'
    }
  },
  {
    title: '夏日绿',
    name: themeType.green,
    mainColor: '#2E8B57',
    style: {
      logoColor: 'color: #2E8B57',
      logo2Color: 'color: rgba(210,105,30,0.6)',
      leftMenuBackImage: '-webkit-gradient(linear, 0 0, 0 100%, from(#2E8B57), to(rgba(46,139,87,0.8)))',
      sysBarBackImage: '',
      sysBarColor: '#2E8B57',
      selectedBack: '#F3F3F3',
      selectedBorder: '#2E8B57',
      mainBackgroundColor: 'background:#2E8B57',
      border: 'border:1px solid #2E8B57',
      borderTop: 'border-top: 1px solid #2E8B57',
      borderRight: 'border-right: 1px solid #2E8B57',
      closeColor: 'color: orange',
      borderBottom2px: 'border-bottom:2px solid #2E8B57',
      triangleColor: 'border-color: #2E8B57',
      // 字体颜色
      fontColor: 'color: #2E8B57',
      // 菜单样式----
      backColorMenu: 'color:#2E8B57; background-color: rgba(46,139,87,0.1)',
      navBorderColor: 'border-top:2px solid #2E8B57;border-bottom:1px solid #2E8B57;border-right:1px solid #2E8B57 ',
      //  fifileBag 三角颜色
      chooseFileBag: 'border-bottom: 6px solid #2E8B57;',
      backgroundColor: 'background: rgba(46,139,87,0.1)',
      // home 主页
      homeMenu: 'background:rgba(46,139,87,0.6); box-shadow: 0 0 20px rgba(46,139,87,0.3) inset;',
      // 笔记列表选中状态
      noteBack: 'background-color:rgba(46,139,87,0.05); box-shadow:0 0 20px rgba(46,139,87,0.1) inset;',
      userMes: {
        menuBack: '#2E8B57',
        menuSelect: 'rgba(46,139,87,0.8)'
      },
      searchBox: 'background-color: rgba(87,139,46,0.32); border-right: 1px solid #2E8B57;'
    }
  }
]
