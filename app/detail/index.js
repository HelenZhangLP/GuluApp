import React,{Component} from 'react'

import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video'
import Request from '../common/request'
import Config from '../common/config'


import { 
  StyleSheet,
  TabBarIOS,
  ListView,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';

class DetailPage extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
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

      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    this._fetchcommentData();
  }

  _fetchcommentData() {
    let url = Config.url.base + Config.url.comment;
    Request.get(url,{
      id: '123', //video id
      accessToken: 'abcd'
    })
    .then(data => {
      if (data && data.success) {
        let _data = data.data
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(_data)
        })
      }
      console.log('h',_data);
    })
    .catch((e) => {
      console.log(e);
    })
  }

  _onLoadStart() {
  	console.log('start')
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

  _renderRow(row) {
    console.log(row);
    /* 前台仅显示最新一条评论 */
    return (
      <View
       style={{
        paddingVertical: 10,
        flexDirection: 'row',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        marginTop: -1,
        marginHorizontal: 10
       }}>
       <Image 
          style = {{
            width: 80,
            height: 80,
            marginRight: 5,
            borderRadius: 40,
            resizeMode: 'cover',
          }}
          source = {{uri: row.info.img}}
        />
        <View style={{
          flex: 1,
          paddingVertical: 5
        }}>
          <View style={{
            height: 20,
            justifyContent: 'center'
          }}>
            <Text style={{
              flex: 1,
              color: '#232323',
              fontWeight: '800',
              fontSize: 16
            }}>{row.info.author}</Text>
          </View>
          <View style={{
            flex: 1,
            height: 50,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Text 
              style={{
                flex: 1,
                color: '#232323'
              }}
              numberOfLines = {3}
            >{row.info.desc}
              嘟噜出生了出嘟噜出生了出嘟噜出生了出嘟噜出生了出嘟噜出生了出嘟噜出生了出嘟噜出生了出
            </Text>
            <Text style={{
              color: '#999',
              width: 80,
              textAlign: 'right'
            }}>{row.info.cdate}</Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    let data = this.state.data;
    console.log(data);
    return (
      <View style={styles.container}>
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
      				marginTop: -width*0.75+20,
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
        <ScrollView 
          showsHorizontalScrollIndicator = {true}
          automaticallyAdjustContentInsets = {false} 
          style={{}}>
          <View style={{
            paddingVertical: 10,
            paddingLeft: 10,
            marginBottom: 5,
            backgroundColor: '#eaeaea',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5
          }}>
            <Text style={{
              fontSize: 18,
              color: '#222',
              fontWeight: '800'
            }}>视频信息：</Text>
          </View>
          <View style={{
            marginHorizontal: 10,
            paddingBottom: 5,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            borderBottomColor: '#ccc'
          }}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.description}>
                <Text style={styles.lable}>拍摄者：</Text>
                <Text style={styles.content} numberOfLines = {1}>{data.info.author}</Text>
              </View>
              <View style={styles.description}>
                <Text style={styles.lable}>拍摄时间：</Text>
                <Text style={styles.content}>{data.info.cdate}</Text>
              </View>
            </View>
            <View style={styles.description}>
              <Text style={styles.lable}>拍摄场景：</Text>
              <Text style={styles.content} numberOfLines={2}>{data.info.desc}描述场景，描述场景 描述场景，描述场景描述场景，描述场景</Text>
            </View>
          </View>
          <ListView 
            style = {{
              height: 100,
              overflow: 'hidden',
            }}
            dataSource = {this.state.dataSource}
            renderRow = {this._renderRow.bind(this)}
            onEndReachedThreshould = {5}
            onEndReached = {this._fetchMore}
            enableEmptySections = {true}
            />
        </ScrollView>
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
    height: width * 0.75,
    backgroundColor: '#000'
  },
  video: {
  	width: width,
  	height: width * 0.75,
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
  },

  //滚动区样式
  description: {
    flex: 1,
    paddingLeft: 3,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  lable: {
    width: 83,
    textAlign: 'right',
    color: '#333',
    fontSize: 16,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    color: '#666',
    fontSize: 14,
    overflow: 'hidden',
    paddingRight: 10
  }
})

module.exports = DetailPage;





