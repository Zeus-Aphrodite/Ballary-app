import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ScrollableTabView ,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import HomePage from './HomePages'

import DataRepository from '../expand/dao/DataRepository'

const URL='https://api.github.com/search/repositories?q=';
const QUERY_STR='&sort=stars&order=desc';

export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.dataRepository=new DataRepository();
    this.state={
      result:''
    }
  }
  onLoad(){
    let url=this.genUrl(this.text);
    console.log(url);
    this.dataRepository.fetchNetRepository(url)
      .then(result=>{
        console.log('成功')
        this.setState({
          result:JSON.stringify(result)
        })
      })
      .catch(error=>{
        console.log('失败')
        this.setState({
          result:JSON.stringify(error)
        })
      })
  }
  genUrl(key){
    console.log('genUrl')
    return URL + key + QUERY_STR;
  }
  render() {
    return <View style={styles.container}>
      <NavigationBar 
        title={'Popular'}
        style={{backgroundColor:'#6495ED'}}
      />
      <ScrollableTabView
        renderTabBar={()=><ScrollableTabBar/>}
      >
        <PopularTab tabLabel="Java">Java</PopularTab>
        <PopularTab tabLabel="IOS">IOS</PopularTab>
        <PopularTab tabLabel="Vue">Vue</PopularTab>
        <PopularTab tabLabel="Python">Python</PopularTab>
      </ScrollableTabView>
      {/*<Text 
        onPress={()=>{
          this.onLoad()
        }}
        style={styles.text}>获取数据
      </Text>
      <TextInput
        style={{height:40,borderWidth:1}}
        onChangeText={text=>this.text=text}
      />
      <Text style={{height:500}}>{this.state.result}</Text>*/}
    </View>
  }
}

class PopularTab extends Component{
    constructor(props) {
    super(props);
    this.dataRepository=new DataRepository();
    this.state={
      result:''
    }
  }
  componentDidMount(){
    this.LoadData();
  }
  LoadData(){
    let url=this.genUrl(this.props.tabLabel);
    console.log(url);
    this.dataRepository.fetchNetRepository(url)
      .then(result=>{
        console.log('成功')
        this.setState({
          result:JSON.stringify(result)
        })
      })
      .catch(error=>{
        console.log('失败')
        this.setState({
          result:JSON.stringify(error)
        })
      })
  }
  genUrl(key){
    console.log('genUrl')
    return URL + key + QUERY_STR;
  }
  render() {
    return <View>
            <Text style={{height:600}}>{this.state.result}</Text>      
          </View> 
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 29
  }
});