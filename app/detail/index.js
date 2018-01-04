import React,{Component} from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

import { 
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  AlertIOS,
  Dimensions
} from 'react-native';

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      rate: 1,
      muted: false,
      paused: false,
      resizeMode: 'cover',
      repeat: false,

      videoError: false, //视频出错
      videoReady: false,//视频未加载成功
      playing: false, //是否正在播放
      duration: 0,	//视频总播放量
      currentTime: 0, //已播放量
      percent: 0, //表示为进度条的宽
    }
  }

  _onLoadStart() {
  	console.log('start');
  }

  _onLoad = data => {
  	this.setState({
  		duration: Number(data.duration.toFixed(2))
  	})

  	console.log('load');
  }

  _onProgress = data => {
  	if(this.state.percent == 1) {
  		return;
  	}

  	if (!this.state.videoReady) {
  		this.setState({
  			videoReady: true
  		})
  	}
  	let duration = this.state.duration
  	let currentTime = data.currentTime
  	let percent = Number(currentTime / duration).toFixed(2)
  	let newState = {
  		currentTime: currentTime,
  		percent: percent
  	}

  	if(!this.state.videoReady) {
  		newState.videoReady = true;
  	}

  	if(!this.state.playing) {
  		newState.playing = true;
  	}

  	this.setState(newState);
  	console.log(this.state,'endp');
	}

  _onEnd = () => {
  	this.setState({
  		playing: false,
  		percent: 1
  	})  	
  }

  _onError = (error) => {
  	this.setState({
  		videoError: true
  	})
  	console.log(error);
  	console.log('error');
  }

 	_replay = () => {
 		this.refs.videoPlayer.seek(0);
 		this.setState({
 			playing: true,
 			percent: 0
 		})
 	}

 	_pause = () => {
 		this.setState({
 			paused: true
 		})
 	}

 	_resume = () => {
 		this.setState({
 			paused: false
 		})
 	}

  render() {
    let data = this.state.data;
    
    return (
      <View style={styles.container} >
        <Text>DetailPage</Text>
        <View style={styles.videobox}>
          <Video
            style={styles.video}
            source={{uri: data.video}}
            ref = "videoPlayer"
            volume = {5.0}
            rate={this.state.rate}
            muted = {this.state.muted}
            paused= {this.state.paused}
            resizeMode= {this.state.resizeMode}
            repeat = {this.state.repeat}

            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          />
          {
          	!this.state.videoReady &&
	        	<ActivityIndicator 
	            color="#f10000"
	            size= "small"
	            style={styles.loadding}
	          />
	        }
	        {	
	        	this.state.videoError && 
      			<Text style={{
      				textAlign: 'center',
      				color: '#fff',
      				padding: 5,
      				marginTop: -170,
      				fontSize: 15
      			}}
      			>视频出错！</Text>
	        }
          <View style={styles.progressBox}>
          	<View style={[styles.progress, {width: this.state.percent * width}]}></View>
          </View>
          {this.state.videoReady && !this.state.playing ?
	          <View
	          	style={styles.playerBox}>
	          	<Icon
	          		style={styles.iconPlay}
	          		name= "ios-play"
	          		color= '#f10000'
	          		size={48}
	          		onPress={this._replay}
	          	/>
	          </View> 
	          : null
	        }

	        {
	        	this.state.videoReady && this.state.playing ?
	        	<TouchableOpacity 
	        		style={styles.pausedModel}
	        		onPress={this._pause}>
	        		{
	        			this.state.paused &&
	        			<View
			          	style={styles.playerBox}>
			          	<Icon
			          		style={styles.iconPlay}
			          		name= "ios-play"
			          		color= '#f10000'
			          		size={48}
			          		onPress={this._resume}
			          	/>
			          </View> 
	        		}
	        	</TouchableOpacity>
	        	: null
	        }
        </View>
      </View> 
    )
  }
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
	// container: {
	// 	flex: 1,
	// 	backgroundColor: '#efefef'
	// },
  videobox: {
    width: width,
    height: 360,
    backgroundColor: '#000'
  },
  video: {
  	width: width,
  	height: 360,
  	backgroundColor: '#000'
  },
  loadding: {
  	position: 'absolute',
  	left: '50%',
  	top: '50%',
  	marginLeft: -18,
  	marginTop: -18
  },
  progressBox: {
  	width: width,
  	height: 5,
  	backgroundColor: '#000'
  },
  progress: {
  	height: 5,
  	backgroundColor: '#f10000'
  },
  playerBox: {
  	position: 'absolute',
  	left: '50%',
  	top: '50%',
  	marginLeft: -24,
  	marginTop: -24,
  	borderStyle: 'solid',
  	borderColor: '#fff',
  	borderWidth: 1,
  	borderRadius: 24,
  	width: 48,
  	height: 48,
  	backgroundColor: 'transparent',
  	alignContent: 'center'
  },
  iconPlay: {
  	marginLeft: 14
  },
  pausedModel: {
  	position: 'absolute',
  	left: 0,
  	top: 0,
  	width: width,
  	height: 360,
  	backgroundColor: 'transparent'
  }
})

module.exports = DetailPage;





