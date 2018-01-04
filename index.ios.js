import React, { Component } from 'react'
import {
	View,
	Text,
	TabBarIOS,
	NavigatorIOS
} from 'react-native';

//第三方组件
import Icon from 'react-native-vector-icons/Ionicons'

//自定义组件
import ShowPage from './app/show/index'
import BuildPage from './app/build/index'

export default class GuluApp extends Component {

	constructor(){
		super();
		this.state = {
			selectedTab: 'List',
		}
	}

	render() {
		return (
			<TabBarIOS
        unselectedTintColor="yellow"
        tintColor="white"
        barTintColor="#f10000">
        <Icon.TabBarItem
          title="List"
          iconName = "ios-bowtie-outline"
          selectedIconName = "ios-bowtie"
          selected = {this.state.selectedTab == 'List'}
          onPress={() => {
            this.setState({
              selectedTab: 'List',
            });
          }}>
          <NavigatorIOS 
          	style={{flex: 1}}
          	barTintColor='#f10000'
          	initialRoute={{
	            component: ShowPage,
	            title: '小主日程',
	            passProps: {}
          }}/>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Build"
          iconName = "ios-aperture-outline"
          selectedIconName = "ios-aperture"
          selected = {this.state.selectedTab == 'Build'}
          onPress={() => {
            this.setState({
              selectedTab: 'Build',
            });
          }}>
          <NavigatorIOS 
          	style={{flex: 1}}
          	barTintColor='#f10000'
          	initialRoute={{
	            component: BuildPage,
	            title: '设置小主日程',
	            passProps: {}
          }}/>
        </Icon.TabBarItem>
      </TabBarIOS>
		)
	}
}

