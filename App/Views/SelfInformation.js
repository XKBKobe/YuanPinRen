import React, {Component} from 'react';
import {
    View,
    Text,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Image,
    Platform,
    TextInput,
    TouchableWithoutFeedback,
    NativeModules
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from '../Components/BaseComponent';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import ButtonBar from '../Components/ButtonBar';
import * as ImgSrc from '../Res/Images';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as MineActions from '../Reducer/Actions/MineActions';
import requestData from '../NetWork/request';
import ImagePicker from 'react-native-image-picker';

const GetBasicInfo = NativeModules.GetBasicInfo;

class SelfInformation extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'HASDATA',
            avatarUrl: null,
            nickName: this.props.MineState.name
        }
    }

    componentWillMount() {
        //模拟网络请求
        this.props.MineActions.getUserInfo("");
    }

    headerRender() {
        return (
            <Header
                headerTitle={'个人信息'}
                leftOnPress={() => Actions.pop()}
            />
        );
    }

    async pickImageClick() {
        //授权相册权限
        await GetBasicInfo.getPhotoAuthorizate();
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.uri) {
                let localUrl = "";
                if (Platform.OS === 'ios') {
                    localUrl = response.uri.replace('file://', '');
                } else {
                    localUrl = response.uri;
                }

                let formData = new FormData();
                let file = {uri: localUrl, type: 'multipart/form-data', name: 'avatar.png'};
                formData.append("avatar", file);
                requestData("/index/User/update_data", "POST", formData)
                    .then((data) => {
                        if (data.errno == 0) {
                            this.props.MineActions.getUserInfo("");
                        } else {
                            Alert.alert("上传失败: ", data.errmsg);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        Alert.alert("上传头像时发生了不可预料的错误！");
                    });
            }
        });
    }

    pageHasDataRender() {
        var {MineState, MineActions} = this.props;
        let self = this;
        return (
            <View style={styles.rootView}>
                <ScrollView>
                    <ClickScope style={styles.profileChangeBar}
                                onPress={() => this.pickImageClick()}
                    >
                        <Image
                            style={{height: 70, width: 70, borderRadius: 32}}
                            source={{uri: this.props.MineState.avatar.url}}
                        />
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#999999', marginRight: 10}}>
                                修改头像
                            </Text>
                            <Image
                                style={{width: 7, height: 14}}
                                source={ImgSrc.IC_RIGHT_ARROW}
                            />
                        </View>
                    </ClickScope>

                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'昵称'}
                        introduction={MineState.name}
                        onPress={() => {
                            Actions.ChangeNick()
                        }}
                    />

                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'手机号'}
                        introduction={MineState.mobile}
                        onPress={() => {
                            Actions.ChangeMobile()
                        }}
                    />
                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'职业'}
                        isArrow={true}
                        introduction={this.props.MineState.position}
                        onPress={() => {
                        }}
                    />
                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'身份证'}
                        isArrow={true}
                        introduction={MineState.idCardNo}
                    />
                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'我的银行卡'}
                        introduction={MineState.bankCardNo}
                        onPress={() => Actions.ChangeName()}
                    />
                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'我的粉丝'}
                        introduction={MineState.fans}
                        onPress={() => {
                            Actions.Fans()
                        }}
                    />
                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'我的伙伴'}
                        introduction={MineState.fans}
                        onPress={() => {
                            Actions.Friends()
                        }}
                    />
                    {/*<ButtonBar
                        style = {{marginTop: 10}}
                        title = {'清除缓存'}
                        introduction = {'25.28MB'}
                        onPress = {() => {}}
                    />*/}
                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'关于源品'}
                        introduction={'V1.0.0'}
                        onPress={() => {
                        }}
                    />

                    <ClickScope
                        style={styles.logoutView}
                        onPress={() => {
                            Alert.alert("提示", '确认退出当前帐号',
                                [{
                                    text: 'cancel', onPress: () => {
                                    }
                                },
                                    {
                                        text: 'ok', onPress: () => {
                                            requestData('/index/User/logout', "POST", "")
                                                .then((data) => {
                                                    alert(data.data);
                                                    if (0 == data.errno) {
                                                        GetBasicInfo.setLoginStatus("false");
                                                        this.props.MineActions.clearUserInfo();
                                                        Actions.tabbar({type: ActionConst.RESET});
                                                        //Actions.WelcomeLogin({type: ActionConst.REPLACE});
                                                    } else {
                                                        alert(data.errmsg);
                                                    }
                                                }, (error) => {

                                                });
                                        }
                                    },
                                ]);
                        }}
                    >
                        <Text style={{fontSize: 14, color: '#333333'}}>
                            退出登录
                        </Text>
                    </ClickScope>

                </ScrollView>
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

function mapStateToProps(state) {
    const {MineState} = state;

    return {
        MineState
    }
}

function mapDispatchToProps(dispatch) {
    return {
        MineActions: bindActionCreators(MineActions, dispatch)
    }
    // return {};
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f0f0f0'
    },
    profileChangeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 100,
        backgroundColor: '#ffffff',
        marginTop: 9,
        paddingLeft: 15,
        paddingRight: 15
    },
    logoutView: {
        height: 44,
        marginTop: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    buttonBarView: {
        flexDirection: 'row',
        height: 44,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonTitleText: {
        fontSize: 14,
        color: '#333333'
    },
    rightContentView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightArrowImage: {
        height: 14,
        width: 7
    },
    introductionText: {
        fontSize: 14,
        color: '#999999',
        marginRight: 3,
        width: 52,
        zIndex: 99
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(SelfInformation);
