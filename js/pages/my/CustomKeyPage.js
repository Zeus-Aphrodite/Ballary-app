import React, {Component} from 'react'
import {View, Text, StyleSheet, Navigator, Image, TouchableOpacity, ScrollView, Alert} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import CheckBox from 'react-native-check-box'
import ArrayUtils from '../../util/ArrayUtils'

export default class CustomKeyPage extends Component {
  constructor (props) {
    super(props)
    this.languageDao = new LanguageDao(this.props.flag)
    this.changeValue = []
    this.isRemoveKey = !!this.props.isRemoveKey
    this.state = {
      dataArray: []
    }
  }
  componentDidMount () {
    this.loadData()
  }
  loadData () {
    this.languageDao.fetch()
        .then(result => {
          this.setState({
            dataArray: result
          })
        })
        .catch(error => {
          console.log(error)
        })
  }
  onSave () {
    if (this.changeValue.length === 0) {
      this.props.navigator.pop()
      return
    }
    if (this.isRemoveKey) {
      for (let i = 0, l = this.changeValue.length; i < l; i++) {
        ArrayUtils.remove(this.state.dataArray, this.changeValue[i])
      }
    }
    this.languageDao.save(this.state.dataArray)
    this.props.navigator.pop()
  }
  renderView () {
    if (!this.state.dataArray || this.state.dataArray.length === 0) return null
    let len = this.state.dataArray.length
    let views = []
    for (let i = 0, l = len - 2; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(this.state.dataArray[i])}
            {this.renderCheckBox(this.state.dataArray[i + 1])}
          </View>
          <View style={styles.line} />
        </View>
      )
    }
    views.push(
      <View key={len - 1}>
        <View style={styles.item}>
          {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
          {this.renderCheckBox(this.state.dataArray[len - 1])}
          <View style={styles.line} />
        </View>
      </View>
    )
    return views
  }
  onClick (data) {
    if (!this.isRemoveKey) {
      data.checked = !data.checked
    }
    ArrayUtils.updateArray(this.changeValue, data)
  }
  renderCheckBox (data) {
    let leftText = data.name
    // 判断是不是通过移除标签进入
    let isChecked = this.isRemoveKey ? false : data.checked
    return (
      <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={() => this.onClick(data)}
        leftText={leftText}
        isChecked={isChecked}
        checkedImage={<Image style={{tintColor: '#6495ED'}}
          source={require('./images/ic_check_box.png')}
         />}
        unCheckedImage={<Image style={{tintColor: '#6495ED'}}
          source={require('./images/ic_check_box_outline_blank.png')}
         />}
      />
    )
  }
  onBack () {
    if (this.changeValue.length === 0) {
      this.props.navigator.pop()
      return
    }
    Alert.alert(
      '注意~',
      '没保存就走啊~',
      [
        {text: '走咯~', onPress: () => { this.props.navigator.pop() }, style: 'cancel'},
        {text: '保存~', onPress: () => { this.onSave() }, style: 'cancel'}
      ]
    )
  }
  render () {
    // 判断是不是通过移除标签进入
    let rightButtonTitle = this.isRemoveKey ? 'Remove' : 'Save'
    let title = this.isRemoveKey ? '标签移除~' : '自定义~标签'
    title = this.props.flag == FLAG_LANGUAGE.flag_language ? '自定义语言' : title
    let rightButton = <TouchableOpacity
      onPress={
        () => this.onSave()
      }
    >
      <View style={{margin: 10}}>
        <Text style={styles.btn}>{rightButtonTitle}</Text>
      </View>
    </TouchableOpacity>

    return <View style={styles.container}>
      <NavigationBar title={title}
        style={{backgroundColor: '#6495ED'}}
        leftButton={ViewUtils.getLeftButton(() => {
          this.onBack()
        })}
        rightButton={rightButton}
      />
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 29
  },
  btn: {
    fontSize: 20,
    color: 'white'
  },
  line: {
    height: 0.3,
    backgroundColor: 'grey'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
