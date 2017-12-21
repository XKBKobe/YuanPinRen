import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    StyleSheet,
    ListView,
    Dimensions,
    Image,
    NativeModules,
    TouchableOpacity,
    Animated,
    Easing
} from 'react-native';
import {
    ActionConst,
    Actions
} from 'react-native-router-flux';
import BaseComponent from '../Components/BaseComponent';
import ClickScope from '../Components/ClickScope';
import requestData from '../NetWork/request';


const GetBasicInfo = NativeModules.GetBasicInfo;

const WINDOW_WIDTH = Dimensions.get('window').width;

export default class BestShare extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            whichItemChoosed: 1,
            goodsListData: [],
            isUseful: true,
            appUrl: "",
            hideSearch: false,
            fadeInOut: new Animated.Value(-200),
            tagData: [],
        };

        this.iosStatusBarRender = this.iosStatusBarRender.bind(this);
        this.goodsItemRender = this.goodsItemRender.bind(this);
        this.searchSelect = this.searchSelect.bind(this);
        this.startAnimation = this.startAnimation.bind(this);
        this.renderTagList = this.renderTagList.bind(this);
        this.queryTagLabel = this.queryTagLabel.bind(this);
    }

    async componentWillMount() {
        var loginStatus = await GetBasicInfo.getLoginStatus();
        let appVersion = await GetBasicInfo.getAppVersion();
        let self = this;
        requestData('/index/other/update_version', 'POST', 'version=' + appVersion)
            .then((data) => {
                if (data.data.version == 2) {
                    self.setState({isUseful: false, appUrl: data.data.url});
                }
            }, (error) => {

            });

        if (loginStatus == 'false') {
            Actions.WelcomeLogin({type: ActionConst.REPLACE});
        } else {
            this.requeryNetworkData(1);
        }
    }

    componentWillUnmount(){

    }

    requeryNetworkData(id) {
        //let id = this.state.whichItemChoosed;
        requestData('/index/Item/share_item_list', "POST", "label=" + id)
            .then((data) => {
                if (0 == data.errno) {
                    if (0 == data.data.goodsList.total) {
                        this.setState({pageStatus: "NODATA"});
                        return;
                    }
                    this.setState({pageStatus: "HASDATA", goodsListData: data.data.goodsList.data});
                } else {
                    if (data.errno == 100003 || data.errno == 100013) {
                        this.setState({pageStatus: "NODATA"});
                        GetBasicInfo.setLoginStatus("false");
                        Actions.WelcomeLogin({type: ActionConst.RESET});
                    } else {
                        alert(data.errmsg);
                        this.setState({pageStatus: "NODATA"});
                    }
                }
            }, (error) => {

            });
    }

    //筛选标签
    queryTagList(tag) {
        console.log('筛选标签 ' + tag);
        requestData('/index/Other/tag_list', "POST", "label=" + tag)
            .then((data) => {
                if (0 == data.errno) {
                    if (data.data && data.data.length > 0) {
                        let tagData = data.data;
                        for(let i in tagData){
                            tagData[i]['selected'] = false;
                        }
                        this.setState({tagData:tagData});
                        console.log('this.state.tagData '+ JSON.stringify(tagData))
                    }
                } else {

                }
            }, (error) => {

            });
    }

    queryTagLabel(){
        let that =this;
        let tagId ='';
        console.log('tagId  '+JSON.stringify(that.state.tagData));
        for(var i in that.state.tagData){
            if (that.state.tagData[i]['selected']) {
                tagId += that.state.tagData[i].tagId + ','
            }
        }
        if(!tagId){
            return;
        }
        tagId = tagId.substring(0, tagId.length - 1);

        console.log("label=" + that.state.whichItemChoosed +"&tagId=" +tagId);
        requestData('/index/Other/index_new', "POST", "label=" + that.state.whichItemChoosed +"&tagId=" +tagId)
            .then((data) => {
                if (0 == data.errno) {
                    if (0 == data.data.goodsList.total) {
                        that.setState({pageStatus: "NODATA"});
                        return;
                    }
                    that.setState({goodsListData: data.data.goodsList.data});
                } else {

                }
            }, (error) => {

            });
    }

    iosStatusBarRender() {
        if (Platform.OS === 'ios') {
            return (
                <View style={{height: 20, backgroundColor: '#ffffff'}}/>
            );
        }
    }

    headerRender() {
        var tab1Color = '#ff6700';
        var tab2Color = '#ffffff';
        var tab1TextColor = '#ff6700';
        var tab2TextColor = '#333333';

        if (this.state.whichItemChoosed == 1) {
            tab1Color = '#ff6700';
            tab2Color = '#ffffff';
            tab1TextColor = '#ff6700';
            tab2TextColor = '#333333';
        } else {
            tab1Color = '#ffffff';
            tab2Color = '#ff6700';
            tab1TextColor = '#333333';
            tab2TextColor = '#ff6700';
        }

        return (
            <View>
                {this.iosStatusBarRender()}
                <View style={{flexDirection: 'row', height: 44, borderBottomWidth: 1, borderBottomColor: '#dddddd'}}>
                    <Text style={{fontSize: 17, color: '#333333', flex: 1}}>

                    </Text>
                    <Text style={{fontSize: 17, color: '#333333', flex: 1, textAlign: 'center', lineHeight: 44}}>
                        源品分享
                    </Text>
                    <Text style={styles.tabSelect} onPress={() => {
                        this.startAnimation(0);
                        this.setState({hideSearch: true});
                        //筛选标签
                        this.queryTagList(this.state.whichItemChoosed);
                    }}>筛选
                    </Text>
                </View>

                <View style={styles.tabView}>
                    <ClickScope
                        style={[styles.commonTabItem, {borderBottomWidth: 2, borderBottomColor: tab1Color}]}
                        onPress={() => {
                            if (1 != this.state.whichItemChoosed) {
                                this.setState({
                                    whichItemChoosed: 1,
                                    pageStatus: 'LOADING'
                                });
                                this.requeryNetworkData(1);
                                //显示筛选
                                if (!!this.state.hideSearch) {
                                    this.queryTagList(1);
                                }
                            }

                        }}
                    >
                        <Text style={{fontSize: 12, color: tab1TextColor}}>
                            营养补充
                        </Text>
                    </ClickScope>
                    <ClickScope
                        style={[styles.commonTabItem, {borderBottomWidth: 2, borderBottomColor: tab2Color}]}
                        onPress={() => {
                            if (2 != this.state.whichItemChoosed) {
                                this.setState({
                                    whichItemChoosed: 2,
                                    pageStatus: 'LOADING'
                                });
                                this.requeryNetworkData(2);
                                //显示筛选
                                if (!!this.state.hideSearch) {
                                    this.queryTagList(2);
                                }
                            }
                        }}
                    >
                        <Text style={{fontSize: 12, color: tab2TextColor}}>
                            功能保健
                        </Text>
                    </ClickScope>
                </View>
            </View>
        );
    }

    goodsItemRender(itemData, index) {
        if (!itemData.appShowImg) {
            return <View></View>;
        }
        return (
            <ClickScope
                onPress={() => {
                    this.startAnimation(-200);
                    Actions.GoodsDetail({
                        goodsId: itemData.goodsId
                    })
                }}
                style={{height: 210, flexDirection: 'column', marginTop: 10, backgroundColor: '#ffffff'}}
            >
                <Image
                    style={{width: WINDOW_WIDTH, height: 150}}
                    source={{uri: itemData.appShowImg[0].url}}
                    resizeMode={"stretch"}
                />
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flex: 4, flexDirection: 'row', paddingLeft: 12, alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 12, color: '#333333'}}>
                            {itemData.goodsName}
                        </Text>
                    </View>
                    <View style={{flex: 5, flexDirection: 'row'}}>
                        <View style={{flex: 1, paddingLeft: 12, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, color: '#ff6700'}}>
                                ¥{itemData.goodsSalePrice}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#999999',
                                marginLeft: 8,
                                marginTop: 4,
                                textDecorationLine: 'line-through'
                            }}>
                                ¥{itemData.goodsMsrp}
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            paddingRight: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}>
                            <Text style={{fontSize: 10, color: '#ffa700'}}>
                                分享奖励: ￥{itemData.sharePercent}
                            </Text>
                        </View>
                    </View>
                </View>
            </ClickScope>
        );
    }

    pageHasDataRender() {
        if (!this.state.goodsListData) {
            return <View></View>;
        }
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View style={styles.rootView}>
                {this.searchSelect()}
                <ListView
                    dataSource={ds.cloneWithRows(this.state.goodsListData)}
                    renderRow={this.goodsItemRender}
                />
                <View style={{height: 60}}/>
            </View>
        );
    }

    startAnimation(value) {
        console.log('fadeInOut  ' + value);
        Animated.timing(this.state.fadeInOut, {
            toValue: value,
            duration: 400,
            easing: Easing.linear,// 线性的渐变函数
        }).start();
    }

    searchSelect() {
        if (!this.state.hideSearch) {
            return null;
        }
        return (
            <Animated.View style={{
                height: 120,
                width: WINDOW_WIDTH,
                backgroundColor: '#fff',
                position: 'absolute',
                zIndex: 1000,
                flexDirection: 'row',
                top: this.state.fadeInOut
            }}>

                <View style={{position: 'relative'}}>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', width: WINDOW_WIDTH}}>
                        {this.renderTagList(this.state.tagData)}
                    </View>
                    <View style={{flexDirection: 'row', flex: 1, position: 'absolute', bottom: 15}}>
                        <ClickScope style={{flex: 1, marginLeft: 10, width: 70, alignItems: 'flex-start'}} onPress={() => {
                            this.startAnimation(-200);
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                borderWidth: 1,
                                borderRadius: 3,
                                width: 70,
                                height: 24,
                                lineHeight:22,
                                borderColor: "#ddd"
                            }}>取消</Text>
                        </ClickScope>
                        <ClickScope style={{flex: 1, alignItems: 'flex-end', marginRight: 10}} onPress={() => {
                            this.startAnimation(-200);
                            this.queryTagLabel()
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                width: 70,
                                height: 24,
                                lineHeight:22,
                                color: '#fff',
                                borderColor: "#ff6700",
                                backgroundColor:'#ff6700',
                                borderWidth: 1,
                                borderRadius: 5,
                                overflow:'hidden'
                            }}>确定</Text>
                        </ClickScope>
                    </View>
                </View>

            </Animated.View>
        )
    }

    renderTagList(tagData) {
        var that = this;
        return (
            tagData.map(function (data, index) {
                let tagListStyle;
                !!data.selected ? tagListStyle = styles.tagSelected : tagListStyle = styles.tagNormal;
                return (
                    <ClickScope key={index} onPress={() => {
                        that.state.tagData[index]['selected'] = !that.state.tagData[index]['selected'];
                        that.setState({
                            tagData: that.state.tagData
                        })
                    }}>
                        <Text style={tagListStyle}>{data.tagName}</Text>
                    </ClickScope>
                )
            })
        )
    }

    //确定筛选
    searchSure() {

    }

    render() {
        // if(!this.state.isUseful) {
        //     let self = this;  
        //     return <View style={{flex: 1, flexDirection: 'column',alignItems: 'center',
        //     justifyContent: 'center'}}>
        //         <TouchableOpacity onPress={() => GetBasicInfo.openAppStore(self.state.appUrl)}>
        //             <Text>当前版本无法使用，请下载最新版本！</Text>
        //         </TouchableOpacity>
        //     </View>
        // }
        return super.rootSceneRender(this.state.pageStatus);
    }
}

const styles = StyleSheet.create({
    titleView: {
        height: 44,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd'
    },
    tabView: {
        flexDirection: 'row',
        height: 30,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd'
    },
    commonTabItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rootView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f0f0f0',
        position: 'relative'
    },
    tabSelect: {
        fontSize: 14,
        color: '#333333',
        flex: 1, textAlign: 'right',
        paddingTop: 2,
        paddingRight: 10,
        lineHeight: 44
    },
    tagNormal: {
        height: 24,
        lineHeight: 22,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        paddingLeft:5,
        paddingRight:5,
        marginBottom: 5,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 3,
        borderColor: "#ddd"
    },
    tagSelected: {
        height: 24,
        lineHeight: 22,
        marginLeft: 10,
        paddingLeft:5,
        paddingRight:5,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 3,
        color: '#fff',
        backgroundColor: '#ff6700',
        borderColor: "#ff6700",
        overflow:'hidden'
    }
});
