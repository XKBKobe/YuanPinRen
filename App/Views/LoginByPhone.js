import React, {Component} from 'react';
import {
    View,
    Text,
    Platform,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    Dimensions,
    NativeModules
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import {Actions, ActionConst} from 'react-native-router-flux';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import requestData from '../NetWork/request';

const GetBasicInfo = NativeModules.GetBasicInfo;

export default class LoginByPhone extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            verCode: "",
            verText: "获取验证码",
        }

        this.timer = null;
        this.requeryVerCode = this.requeryVerCode.bind(this);
        this.loginHandle = this.loginHandle.bind(this);
    }

    async componentWillMount() {
        await GetBasicInfo.setLoginStatus("false");
        await GetBasicInfo.setNativeCookie('');

        this.setState({verText: "获取验证码"});
    }

    componentWillUnmount(){
        if(typeof this.timer =='function' && !!this.timer){
            clearInterval(this.timer);
        }
    }

    headerRender() {
        return (
            <Header
                headerTitle={'手机登录'}
                leftOnPress={() => Actions.pop()}
            />
        );
    }

    requeryVerCode() {
        if (this.state.verText <= 60 && this.state.verText > 0) {
            return;
        }
        let phone = this.state.phoneNumber;
        let reg = /^1([38]\d|4[57]|5[0-35-9]|7[06-8]|8[89])\d{8}$/;
        if (!phone || !reg.test(phone)) {
            alert("请输入有效的手机号!");
            return;
        }
        let paramter = "mobile=" + phone;

        this.setState({verText: 60});
        let self = this;
        this.timer = setInterval(function () {
            let sec = self.state.verText;
            if (sec <= 1) {
                self.setState({verText: "获取验证码"});
                clearInterval(self.timer);
            } else {
                self.setState({verText: sec - 1});
            }
        }, 1000);

        requestData('/index/Login/login_mobile_sms', "POST", paramter)
            .then((data) => {
                console.log(" ----------- ++++++++= =========", data);
                if (data.errno == 0) {
                    Alert.alert('温馨提示', "短信已发送，请查收！");
                } else {
                    Alert.alert('温馨提示', data.errmsg);
                }
            }, (error) => {

            });
    }

    loginHandle() {
        let phone = this.state.phoneNumber;
        let reg = /^1([38]\d|4[57]|5[0-35-9]|7[06-8]|8[89])\d{8}$/;
        if (!phone || !reg.test(phone)) {
            alert("请输入有效的手机号!");
            return;
        }
        let code = this.state.verCode;

        this.requestAppStart().then(data => {
            let self = this;
            requestData('/index/Login/login_mobile', 'POST', 'mobile=' + phone + '&code=' + code)
                .then((data) => {
                    if (data.errno == 0) {
                        clearInterval(self.timer);
                        GetBasicInfo.setLoginStatus("true");
                        Actions.tabbar({type: ActionConst.RESET});
                    } else {
                        alert(data.errmsg);
                    }

                });
        }, err => {
            alert('未知错误');
        })

    }


    requestAppStart() {
        return new Promise((resolve, reject) => {
            requestData('/index/login/app_start', "POST", "")
                .then((data) => {
                    console.log(" \n\n---*********", data);
                    if (0 == data.errno) {
                        GetBasicInfo.setNativeCookie(data.data.JSSIONID);
                        resolve(true);
                    }
                }, (error) => {
                    resolve(false);
                });
        })
    }

    pageHasDataRender() {
        let self = this;
        return (
            <View style={{flex: 1, backgroundColor: '#ffffff', flexDirection: 'column', alignItems: 'center'}}>
                <View style={{height: 9, width: Dimensions.get('window').width, backgroundColor: '#f0f0f0'}}/>
                <View style={{
                    flexDirection: 'column',
                    width: 345,
                    height: 90,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#eeeeee',
                    marginTop: 36,
                }}>
                    <View style={{
                        flex: 1,
                        borderBottomColor: '#eeeeee',
                        borderBottomWidth: 1,
                        paddingLeft: 15,
                        paddingRight: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <TextInput
                            style={{width: 240, padding: 0}}
                            underlineColorAndroid={"transparent"}
                            placeholder={'请输入您的手机号码'}
                            maxLength={11}
                            keyboardType={'numeric'}
                            onChange={(event) => {
                                this.setState({phoneNumber: event.nativeEvent.text})
                            }
                            }
                            value={this.state.phoneNumber}
                        />
                        <TouchableOpacity onPress={() => this.requeryVerCode()}>
                            <Text style={{fontSize: 14, color: '#ffa700'}}>
                                {self.state.verText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, paddingLeft: 15, alignItems: 'center', flexDirection: 'row'}}>
                        <TextInput style={{width: 280, padding: 0}}
                                   underlineColorAndroid={"transparent"}
                                   placeholder={'请输入验证码'}
                                   maxLength={4}
                                   keyboardType={'numeric'}
                                   onChange={(event) => {
                                       this.setState({verCode: event.nativeEvent.text})
                                   }
                                   }
                                   value={this.state.verCode}
                        />
                    </View>
                </View>
                <ClickScope
                    style={{
                        height: 44, width: 345,
                        borderRadius: 6, marginTop: 31,
                        backgroundColor: '#ff6700',
                        justifyContent: 'center', alignItems: 'center'
                    }}
                    onPress={() => this.loginHandle()}
                >
                    <Text style={{fontSize: 18, color: '#ffffff'}}>
                        登录
                    </Text>
                </ClickScope>
            </View>
        );
    }

    render() {
        return super.rootSceneRender('HASDATA');
    }
}
