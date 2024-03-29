import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Navigator,
  Image,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  ListView,
  Platform,
  Linking
} from 'react-native'

import ViewUtils from '../../util/ViewUtils';
import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon,{FLAG_ABOUT} from './AboutCommon'
import WebViewPage from '../WebViewPage'

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.AboutCommon = new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about)
  }
  updateState(dic) {
    this.setState(dic)
  }
  onClick(tab) {
    let TargetComponent,params = {...this.props,menuType:tab}
    switch (tab) {
      case MORE_MENU.GitHub:
        TargetComponent = WebViewPage
        params.url = 'https://github.com/laclys/github_show'
        params.title = 'In GitHub'
        break
      case MORE_MENU.Feedback:
        var url = 'mailto://laclys@126.com'
        // 检查是否安装了对应的应用
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.error('An error occurred', err));
        break
    }
    if(TargetComponent){
      this.props.navigator.push({
        component:TargetComponent,
        params:params
      })
    }
  }
  render() {
    let content =<View>
      {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.GitHub),require('../../../res/images/ic_contacts.png'),MORE_MENU.GitHub,{tintColor:"#6495ED"},null)}
      <View style={GlobalStyles.line} />
      {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Feedback),require('../../../res/images/ic_feedback.png'),MORE_MENU.Feedback,{tintColor:"#6495ED"},null)}
      <View style={GlobalStyles.line} />
    </View>
    return this.AboutCommon.render(content,{
      'name': 'Github Repo Show',
      'desc': 'A Simple React Demo To Show GitHub Repo Data',
      'avatar':'https://avatars3.githubusercontent.com/u/22010181?v=4&s=460',
      'backgroundImg':'http://img.t.sinajs.cn/t5/skin/public/covervip/2042.jpg'
    })
  }
}

