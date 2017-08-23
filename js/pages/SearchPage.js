import React, {Component} from 'react'
import {View,
  Text, 
  StyleSheet,
  TextInput, 
  ListView, 
  RefreshControl, 
  DeviceEventEmitter,
  Platform,StatusBar,
  TouchableOpacity,
  ActivityIndicator} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import GlobalStyles from '../../res/styles/GlobalStyles'
import Toast,{DURATION}  from 'react-native-easy-toast'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utills from '../util/Utills'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars&order=desc'

export default class SearchPage extends Component {
  constructor (props) {
    super(props)
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
    this.favoriteKeys=[]
    this.keys = []
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.state = {
      rightBtnText:'Search',
      isLoading:false,
      showBottomBtn: true,
      dataSource: new ListView.DataSource({
        rowHasChanged:(r1,r2)=>r1!=r2
      })
    }
  }
  componentDidMount() {
    this.initKeys()
  }
  /**
   * 获取所有标签
   */
  async initKeys() {
    this.keys = await this.languageDao.fetch()
  }
loadData(){
  this.updateState({
    isLoading:true
  })
  fetch(this.genUrl(this.inputKey))
    .then(res=>res.json())
    .then(resData =>{
      this.items=resData.items
      console.log(this.items)
      this.getFavoriteKeys()
    }).catch(e=>{
      this.updateState({
        isLoading:false,
        rightBtnText:'Search',
      })
    })
}
  getDataSource (items) {
    return this.state.dataSource.cloneWithRows(items)
  }
  onFavorite (item, isFavorite) {
    console.log(item, isFavorite)
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
    } else {
      this.favoriteDao.removeFavoriteItem(item.id.toString())
    }
  }
  flushFavoriteState () {
    let projectModels = []
    let items = this.items
    for (var i = 0, len = items.length; i < len; i++) {
      projectModels.push(new ProjectModel(items[i], Utills.checkFavorite(items[i], this.favoriteKeys)))
    }
    this.updateState({
      isLoading: false,
      dataSource: this.getDataSource(projectModels),
      rightBtnText:'Search',
    })
  }
  getFavoriteKeys () {
    this.favoriteDao.getFavoriteKeys()
        .then(keys => {
          this.favoriteKeys=keys||[]
          this.flushFavoriteState()
        })
        .catch(e => {
          this.flushFavoriteState()
        })
  }
  genUrl (key) {
    return API_URL + key + QUERY_STR
  }
  componentDidMount () {
  }
  onBackPress(){
    this.refs.input.blur();
    this.props.navigator.pop();
  }
  updateState(dic){
    this.setState(dic)
  }
  onRightBtnClick() {
    if(this.state.rightBtnText ==='Search'){
      this.updateState({
        rightBtnText:'Cancel'
      })
      this.loadData()
    }else{
      this.updateState({
        rightBtnText:'Search',
        isLoading:false
      })
    }
  }
  renderNavBar(){
    let backBtn = ViewUtils.getLeftButton(()=>this.onBackPress())
    let inputView = <TextInput
      onChangeText={text =>this.inputKey = text}
      ref="input"
      style ={styles.textInput}
    >
    </TextInput>
    let rightBtn=<TouchableOpacity
      onPress = {
       () => {
         // 失去焦点，关闭键盘
         this.refs.input.blur()
         this.onRightBtnClick()
         }
      }
    >
      <View style={{
        marginRight:10,

      }}>
        <Text
        style={{
          fontSize:18,
          color:'white',
          fontWeight:'500'
        }}
        >{this.state.rightBtnText}</Text>
      </View>
    </TouchableOpacity>  
    return <View style={{
      backgroundColor:'#6495ED',
      flexDirection:'row',
      alignItems:'center',
      height:(Platform.OS==='ios')?GlobalStyles.nav_bar_height_ios:GlobalStyles.nav_bar_height_android
    }}>
      {backBtn}
      {inputView}
      {rightBtn}
    </View>
  }
  onSelect (projectModel) {
    this.props.navigator.push({
      title: projectModel.item.full_name,
      component: RepositoryDetail,
      params: {
        projectModel: projectModel,
        parentComponent: this,
        flag: FLAG_STORAGE.flag_popular,
        ...this.props
      }
    })
  }
  renderRow (projectModel) {
    return <RepositoryCell
      key={projectModel.item.id}
      projectModel={projectModel}
      onSelect={() => this.onSelect(projectModel)}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
  }
  render () {
    let statusBar = null
    if(Platform.OS ==='ios'){
      statusbar = <View style={[styles.statusBar,{backgroundColor:'#6495ED'}]}>
      </View>  
    }
    let listView =!this.state.isLoading?<ListView
      dataSource={this.state.dataSource}
      renderRow={data=>this.renderRow(data)}
    />:null
    let indicatorView = this.state.isLoading?
      <ActivityIndicator
        style={styles.centering}
        size= 'large'
        animating ={this.state.isLoading}
      /> : null
    let resultView=<View style={{flex: 1}}>
      {indicatorView}
      {listView}
    </View>
    let bottomBtn =this.state.showBottomBtn?
    <TouchableOpacity
      style={[styles.btn,{backgroundColor:'#6495ED'}]}
    >
      <View
        style={{
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: 'white',
            fontWeight: '500'
          }}
        >add Tab</Text>
      </View>
    </TouchableOpacity>:null
    return <View style={GlobalStyles.root_container}>
       {statusbar} 
      {this.renderNavBar()}
      {resultView}
      {bottomBtn}
      <Toast
        ref={toast=>this.toast=toast}
      ></Toast>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar:{
    height:20
  },
  textInput:{
    flex:1,
    height:(Platform.Os==='ios')?30:40,
    borderWidth:(Platform.Os==='ios')?1:0,
    borderColor:'white',
    alignSelf:'center',
    paddingLeft:5,
    paddingRight:10,
    marginRight:5,
    borderRadius:3,
    opacity:0.7,
    color:'white'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height:40,
    position: 'absolute',
    left: 10,
    right: 10,
    top: GlobalStyles.window_height - 45,
    borderRadius: 3 
  }
})
