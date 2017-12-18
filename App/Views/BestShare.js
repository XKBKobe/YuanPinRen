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
            isShouSerchModule: true,
            hideSearch: false,
            fadeInOut: new Animated.Value(-200),
        };

        this.iosStatusBarRender = this.iosStatusBarRender.bind(this);
        this.goodsItemRender = this.goodsItemRender.bind(this);
        this.searchSelect = this.searchSelect.bind(this);
        this.startAnimation = this.startAnimation.bind(this);

        this.animationshow = {top: '60', yoyo: false, duration: 1500};
        this.animationhide = {top: '-200', yoyo: false, duration: 1500};
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
                        this.setState({isShouSerchModule: !this.state.isShouSerchModule, hideSearch: true});
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
            duration: 2000,
            easing: Easing.linear,// 线性的渐变函数
        }).start();
    }

    searchSelect() {
        console.log('this.state.hideSearch  ' + JSON.stringify(this.state.fadeInOut))
        if (!this.state.hideSearch) {
            return null;
        }
        let animationModule;
        this.state.isShouSerchModule ? animationModule = this.animationhide : animationModule = this.animationshow;
        console.log('animationModule  ' + JSON.stringify(animationModule))
        return (
            <Animated.View style={{
                height: 100,
                width: WINDOW_WIDTH,
                backgroundColor: 'red',
                position: 'absolute',
                zIndex: 1000,
                flexDirection: 'row',
                top: this.state.fadeInOut
            }}>
                <Text style={{flex:1}} onPress={() => {
                    this.startAnimation(40)
                }}>展示</Text>


                <Text style={{flex:1}} onPress={() => {
                    this.startAnimation(-200)

                }}>隐藏</Text>

            </Animated.View>
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
    }
});
