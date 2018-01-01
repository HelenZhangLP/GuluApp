import React,{Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Request from '../common/request'
import Config from '../common/config'

import { 
  StyleSheet,
  TabBarIOS,
  Text,
  ListView,
  View,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS
} from 'react-native';

const cacheData = {
  nextpage: 1,
  total: 0,
  items: [],
  count: 0 //每页显示几条
}

class Item extends Component {
  constructor(props) {
    super(props);
    const row = this.props.row;
    this.state = {
      'isPraise': row.isPraise,
      'rowData': row
    }
  }

  _onPraise = () =>{
    let isPraise = !this.state.isPraise,
        rowData = this.state.rowData,
        url = Config.url.base + Config.url.praise,

        body = {
          'accessToken': 'abcd',
          'isPraise': isPraise,
          'id': rowData.id
        };

    Request.post(url,body)
           .then(data => {
            if (data && data.success) {
              this.setState({
                'isPraise': isPraise
              })
            } else {
              AlertIOS.alert('点赞失败，稍后重试');
            }
           })
           .catch(e => {
              console.error(e);
              AlertIOS.alert('点赞失败，稍后重试');
           })

  }

  render(row) {
    const rowData = this.props.row;
    return (
      <TouchableHighlight>
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{rowData.curTime}---{rowData.order}</Text>
          <View>
            <Image
              style={styles.itemImage}
              source={{uri: rowData.thumb}}
            />
            <Icon
              style={styles.ItemIcon}
              size={28}
              name ="ios-musical-notes-outline"
            />
          </View>
          <View style={styles.itemControl}>
            <View style={[styles.itemBar]}>
              <Icon 
                style={[styles.ItemBarIcon,this.state.isPraise ? styles.praiseY : styles.praiseN]}
                name ={this.state.isPraise ? "ios-cafe" : "ios-cafe-outline"}
                size = {22}
              />
              <Text 
                style={this.state.isPraise ? styles.praiseY : styles.praiseN}
                onPress = {this._onPraise}
              >喳</Text>
            </View>
            <View style={styles.itemBar}>
              <Icon 
                style={styles.ItemBarIcon}
                name ="ios-hammer-outline"
                size = {22}
              />
              <Text>翻牌</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}


class ShowPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.hasMore = this._hasMore.bind(this);
    this.fetchData = this._fetchData.bind(this);
    this.fetchMoreData = this._fetchMoreData.bind(this);
  }

  getInitialState() {
    let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      loadingTail: false,
      isRefreshing: false
    };
  }

  componentDidMount() {
    this._fetchData(1);
  }

  //通信，异步调用获取数据，使用 fetch
  _fetchData(page){
    if(!page){
      this.setState({
        isRefreshing: true
      })
    } else {
      this.setState({
        loadingTail: true
      });
    }

    Request.get(Config.url.base+Config.url.plist,{
      'accessToken':'abcd',
      'page': page
    })
    .then((data) => {
      if(!data.success) return false;

      if(!cacheData.total) {
        cacheData.total = data.total;
        cacheData.count = data.data.length;
      }

      let items = cacheData.items.slice();
      if(!page) {
        items = data.data.concat(items);
      } else {
        items = items.concat(data.data);
        if(cacheData.count * page < cacheData.total)cacheData.nextpage++;
      }

      cacheData.items = items;

      var that = this;
      this.page = page;
      setTimeout(()=>{
        if (!that.page) {
          that.setState({
            isRefreshing: false,
            dataSource: that.state.dataSource.cloneWithRows(cacheData.items)
          })
        } else {
          that.setState({
            loadingTail: false,
            dataSource: that.state.dataSource.cloneWithRows(cacheData.items)
          })
        }
      },20)
      
    })
    .catch((e)=>{
      if (!page) {
        this.setState({
          isRefreshing: false,
        })
      } else {
        this.setState({
          loadingTail: false,
        })
      }
      console.error('fetch',e)
    })
  }

  _hasMore() {
    if(cacheData.items.length == cacheData.total) return false;
    return true;
  }

  //自定义函数，this 指向的问题，所以使用息定义函数
  _fetchMoreData = () => {
    // 有更多数据 && 没有正在加载
    if(!this._hasMore() || this.state.loadingTail) return;

    this._fetchData(cacheData.nextpage)
  }

  _onRefresh = () => {
    if(!this.hasMore() || this.state.isRefreshing) return;

    this._fetchData(0);
  }

  _renderfoot = () => {
    if(!this._hasMore() && !this.state.loadingTail)
    {
      return (
        <View style={styles.horizontal}>
          <Text style={styles.footertext}>主子，您受累，小的跪安了！</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.horizontal}>
          <ActivityIndicator 
            color="#f10000" 
          />
        </View>
      )
    }
  }

  _renderRow(rowData) {
    return (<Item row = {rowData} />);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>小主日程</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={ this._renderRow }
          onEndReached = { this._fetchMoreData }
          onEndReachedThreshold = { 20 }
          refreshControl = {
            <RefreshControl 
              refreshing = {this.state.isRefreshing}
              onRefresh = {this._onRefresh}
              tintColor = '#f10000'
              title = '稍等，小主，在找，在找。。。'
            />
          }
          renderFooter = { this._renderfoot}
          enableEmptySections = {true}
          automaticallyAdjustContentInsets = {false}
        />
      </View> 
    )
  }
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container : {
    flex: 1,
  },
  header: {
    backgroundColor: '#f10000',
    paddingTop: 25,
    paddingBottom: 15

  },
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: "600",
    fontFamily: 'Helvetica Neue',
    color: '#fff'
  },

  item: {
    width: width,
    borderBottomWidth: 5,
    borderBottomColor: '#efefef'
  },
  itemTitle: {
    paddingVertical: 10,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18
  },
  itemImage: {
    width: width,
    height: width / 2,
    resizeMode: 'cover'
  },
  ItemIcon: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    borderWidth: 1,
    height: 40,
    width: 40,
    paddingTop: 6,
    paddingLeft: 9,
    borderColor: '#f10000',
    color: '#F10000',
    borderRadius: 20,
    backgroundColor: 'transparent'
  },
  itemControl: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-between',
    backgroundColor: '#ccc'
  },
  itemBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width/2 - 0.5,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  ItemBarIcon: {
    marginRight: 5
  },
  praiseY: {
    color: '#f10000'
  },
  praiseX: {
    color: '#333'
  },
  footertext: {
    color: '#333',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  }
});

module.exports = ShowPage;