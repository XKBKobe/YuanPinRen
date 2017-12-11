import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    StyleSheet,
    Image,
    Dimensions,
    NativeModules,
    NativeAppEventEmitter,
    Alert
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import * as ImgSrc from '../Res/Images';
import ClickScope from '../Components/ClickScope';
import Request from '../NetWork/request';

const GetBasicInfo = NativeModules.GetBasicInfo;

export default class WelcomeLogin extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isWechatInstall: false,
        }
        this.renderIOSStatusBar = this.renderIOSStatusBar.bind(this);
    }

    componentDidMount() {
        let self = this;
        NativeAppEventEmitter.addListener('WX_LOGIN_SUCCESS', (params) => {
            console.log(" ------ wxCode: ",params);
            Request('/index/Login/login_wx', 'POST', 'code=' + params.wxCode)
            .then((data) => {
                console.log(" ------ callback: ",data);
                if (data.errno == 0) {
                    GetBasicInfo.setLoginStatus("true");
                    Actions.tabbar({type: ActionConst.RESET});
                } else {
                    Alert.alert(data.errmsg);
                }
            });
        });
        NativeAppEventEmitter.addListener('WX_LOGIN_FAIL', (params) => {
            Alert.alert("登录失败!");
        });

        this.setWechatState();
    }

    componentWillUnmount() {
        console.log("*********************** ");
        NativeAppEventEmitter.removeAllListeners();
    }

    async setWechatState() {
        let result =  await GetBasicInfo.isWechatInstall();
        this.setState({isWechatInstall: result == "fail" ? false : true});
    }

    renderIOSStatusBar() {
        if (Platform.OS === 'ios') {
            return (
                <View style = {{height: 25, backgroundColor: '#ffffff'}}/>
            );
        }
    }

    async loginWithWechat() {
        let result = await GetBasicInfo.wechatLogin();
        if (result == "fail") {Alert.alert("登录失败，请先安装微信！")}
    }

    renderWechatLogin() {
        let self = this;
        if (this.state.isWechatInstall) {
            return (
                 <ClickScope
                    style = {[styles.clickButton, {marginTop: 87}]}
                    onPress = {() => {
                        self.loginWithWechat();
                    }}
                >
                    <Image
                        resizeMode = {'stretch'}
                        style = {{width: 23, height: 18}}
                        source = {ImgSrc.WELCOME_WECHAT}
                    />
                    <Text style = {styles.loginText}>
                        微信登录
                    </Text>
                </ClickScope>
            )
        }
        return (<View style = {[styles.disButton, {marginTop: 87}]}></View>)
    }

    render() {
        let self = this;
        return (
            <View style = {styles.rootView}>
                {this.renderIOSStatusBar()}
                <ClickScope style={{marginTop: 12,marginLeft: 296,width:32, height:32}}
                    onPress={() => { Actions.tabbar({type: ActionConst.RESET});}}
                >
                    <Image style = {{width: 12, height: 12}} source={ImgSrc.IC_CROSS}/>
                </ClickScope>
                <Image
                    style = {{width: 88, height: 88, marginTop: 57}}
                    source = {ImgSrc.IC_YUANPINREN}
                />
                <Text style = {{fontSize: 12, color: '#333333', marginTop: 13}}>
                    欢迎登录
                </Text>
                <Text style = {{fontSize: 16, color: '#ffa700', marginTop: 10}}>
                    我们尊敬的特邀分享者
                </Text>

               {this.renderWechatLogin()}

                <ClickScope
                    style = {[styles.clickButton, {marginTop: 23}]}
                    onPress = {() => {
                        Actions.LoginByPhone()
                    }}
                >
                    <Image
                        resizeMode = {'stretch'}
                        style = {{width: 15, height: 22}}
                        source = {ImgSrc.WELCOME_PHONE}
                    />
                    <Text style = {styles.loginText}>
                        手机登录
                    </Text>
                </ClickScope>

                {/* style = {{width: Dimensions.get('window').width, height: 218, marginTop: 30}} */}
                <Image
                    resizeMode = {'stretch'}
                    style = {{width: 375, height: 218, marginTop: 30, flexDirection: 'column', alignItems: 'center'}}
                    source = {ImgSrc.WELCOME_BG}
                >
                    <View style = {{flexDirection: 'row', marginTop: 20}}>
                        <Text  style = {{fontSize: 14, color: '#333333'}}>
                            登录代表您已阅读并同意
                        </Text>
                        <Text
                            style = {{fontSize: 14, color: '#ff6700'}}
                            onPress = {() => {
                                Actions.Fuwuxieyi();
                            }}
                        >
                            服务协议
                        </Text>
                        <Text  style = {{fontSize: 14, color: '#333333'}}>
                            和
                        </Text>
                        <Text
                            style = {{fontSize: 14, color: '#ff6700'}}
                            onPress = {() => {
                                Actions.Yinsixieyi();
                            }}
                        >
                            隐私协议
                        </Text>
                    </View>
                </Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    clickButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 295,
        height: 44,
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 4,
        backgroundColor: '#ffffff'
    },
    disButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 295,
        height: 44
    },
    loginText: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 12
    }
});
