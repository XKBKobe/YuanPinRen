import React, {Component} from 'react';
import {
    View,
    Text,
    Platform,
    Image,
    Modal,
    ScrollView,
    NativeModules,
    Alert,
    TouchableOpacity
} from 'react-native';
import {
    ActionConst,
    Actions
} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ImgSrc from '../Res/Images';
import ClickScope from '../Components/ClickScope';
import styles from '../Styles/MineStyles';
import ButtonBar from '../Components/ButtonBar';
import requestData from '../NetWork/request';
import ShareWindow from '../Components/GoodsDetailComponents/ShareWindow';

import * as MineActions from '../Reducer/Actions/MineActions';

const GetBasicInfo = NativeModules.GetBasicInfo;

class Mine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShareWindowShow: false,
            shareUrl: null,
            isWechatInstall: false,
            isUseful: true,
            appUrl: ""
        }
        this.renderIOSStatusBar = this.renderIOSStatusBar.bind(this);
    }

    async componentWillMount() {
        console.log("  ############## loginStatus a ########### ");
        let appVersion = await GetBasicInfo.getAppVersion();
        let self = this;
        requestData('/index/other/update_version', 'POST', 'version=' + appVersion)
            .then((data) => {
                if (data.data.version == 2) {
                    self.setState({isUseful: false, appUrl: data.data.url});
                }
            }, (error) => {

            });

        //模拟网络请求
        var loginStatus = await GetBasicInfo.getLoginStatus();
        console.log("  ############## loginStatus: ########### ", loginStatus);
        if (loginStatus == 'false' || this.props.MineState.hasOwnProperty("isClear")) {
            Actions.WelcomeLogin({type: ActionConst.REPLACE});
        } else {
            this.props.MineActions.getUserInfo("");
            this.setWechatState();
        }
    }

    async setWechatState() {
        let result = await GetBasicInfo.isWechatInstall();
        this.setState({isWechatInstall: result == "fail" ? false : true});
    }

    renderIOSStatusBar() {
        if (Platform.OS === 'ios') {
            return (
                <View style={{height: 20, backgroundColor: '#ffffff'}}/>
            );
        }
    }

    withdrawMoneyBefore() {
        requestData('/index/Crash/is_auth', "POST", "")
            .then((data) => {
                if (0 == data.errno) {
                    if (data.data) {
                        console.log('我要提现  ' + JSON.stringify(this.props.MineState));
                        //Actions.WithdrawMoney({withdrawMoney: this.props.MineState.canUseMoney})
                        Actions.WaitReview();
                    } else {
                        //跳转实名认证
                        //Actions.UserVerified();
                        Actions.BindBankCard();
                    }
                } else if (200028 == data.errno) {
                    //正在审核中
                    Actions.WaitReview();
                } else {
                    alert(data.errmsg);
                }
            }, (error) => {

            });
    }

    async shareToWechat(data) {
        let shareData = data.data;
        let result = await GetBasicInfo.isWechatInstall();
        if (result == "fail") {
            Alert.alert("邀请失败，请先安装微信！");
            return;
        }
        GetBasicInfo.shareToWechat("FRIEND", shareData.title, shareData.brief, shareData.imgUrl, shareData.url);
    }

    getShareGoodUrl() {
        let self = this;
        requestData('/index/User/invite_partner', "POST")
            .then((data) => {
                if (0 == data.errno) {
                    if (!data.data) {
                        return;
                    }
                    self.shareToWechat(data);
                } else {
                }
            }, (error) => {

            });
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
        let imgSource = this.props.MineState && this.props.MineState.hasOwnProperty("avatar") ? {uri: this.props.MineState.avatar.url} : {uri: "test"};
        let shareData = this.state.shareUrl;
        return (
            <View style={styles.rootView}>
                {this.renderIOSStatusBar()}
                <Modal
                    transparent={true}
                    visible={this.state.isShareWindowShow}
                    onRequestClose={() => {
                    }}
                >
                    <ShareWindow
                        shareWindowCloseHandle={() => {
                            this.setState({isShareWindowShow: false})
                        }}
                        wechatClickHandle={() => {

                        }}
                        circleClickHandle={() => {
                            if (!shareData) {
                                return;
                            }
                            GetBasicInfo.shareToWechat("CIRCLE", shareData.title, shareData.brief, shareData.imgUrl, shareData.url);
                        }}
                        checkBoxClickHandle={() => {
                            this.setState({isCouponCheck: !this.state.isCouponCheck})
                        }}
                        checkCoupon={this.state.isCouponCheck}
                    />
                </Modal>
                <ScrollView>
                    <ClickScope
                        style={styles.messageBarView}
                        onPress={() => Actions.SelfInformation()}
                    >
                        <Image
                            style={{height: 70, width: 70, borderRadius: 32}}
                            source={imgSource}
                        />

                        <View style={styles.messageBarNameView}>
                            <Text style={styles.textStyle1}>
                                {this.props.MineState.nickname}
                            </Text>
                            <View style={styles.messageBarNameUnderView}>
                                <ClickScope onPress={() => Actions.Fans()}>
                                    <Text style={styles.textStyle2}>
                                        我的粉丝：{this.props.MineState.follows}
                                    </Text>
                                </ClickScope>
                                <ClickScope onPress={() => Actions.Friends()}>
                                    <Text style={[styles.textStyle2, {marginLeft: 36}]}>
                                        我的伙伴：{this.props.MineState.partner}
                                    </Text>
                                </ClickScope>
                            </View>
                        </View>
                        <Image
                            style={{width: 7, height: 14, marginLeft: 24}}
                            source={ImgSrc.IC_RIGHT_ARROW}
                        />
                    </ClickScope>

                    <View style={styles.drawBarView}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.textStyle3}>
                                可用余额：
                            </Text>
                            <Text style={styles.textStyle4}>
                                ￥{this.props.MineState.canUseMoney}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row-reverse', flex: 1}}>
                            <ClickScope onPress={() => {
                                this.withdrawMoneyBefore()
                            }}
                                        style={styles.drawButton}
                            >
                                <Text style={styles.textStyle5}>
                                    我要提现
                                </Text>
                            </ClickScope>
                            <ClickScope onPress={() => {
                                Actions.DrawRecord()
                            }}
                                        style={styles.drawRecordButton}
                            >
                                <Text style={styles.textStyle5}>
                                    提现记录
                                </Text>
                            </ClickScope>
                        </View>
                    </View>

                    <View style={[styles.moneyBarView, {marginTop: 10}]}>
                        <View style={styles.moneyBarItemView}>
                            <Text style={styles.textStyle6}>
                                ￥{this.props.MineState.noAffirmMoney}
                            </Text>
                            <Text style={[styles.textStyle2, {marginTop: 5}]}>
                                待收奖励
                            </Text>
                        </View>
                        <View style={styles.moneyBarItemView}>
                            <Text style={styles.textStyle1}>
                                ￥{this.props.MineState.totalMoney}
                            </Text>
                            <Text style={[styles.textStyle2, {marginTop: 5}]}>
                                累计奖励
                            </Text>
                        </View>
                    </View>

                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'我的订单'}
                        introduction={'全部订单'}
                        onPress={() => {
                            Actions.MyOrder({handleId: 1})
                        }}
                    />

                    <View style={[styles.moneyBarView, {
                        marginTop: 1,
                        borderBottomColor: '#dddddd',
                        borderBottomWidth: 1
                    }]}>
                        <ClickScope onPress={() => {
                            Actions.MyOrder({handleId: 2})
                        }}
                                    style={styles.moneyBarItemView}
                        >
                            <Image
                                style={{width: 20, height: 20}}
                                source={ImgSrc.WAITING_PAY}
                            />
                            <Text style={[styles.textStyle3, {marginTop: 7}]}>
                                待付款
                            </Text>
                        </ClickScope>
                        <ClickScope onPress={() => {
                            Actions.MyOrder({handleId: 3})
                        }}
                                    style={styles.moneyBarItemView}
                        >
                            <Image
                                style={{width: 22, height: 20}}
                                source={ImgSrc.WAITING_SEND}
                            />
                            <Text style={[styles.textStyle3, {marginTop: 7}]}>
                                待发货
                            </Text>
                        </ClickScope>
                        <ClickScope onPress={() => {
                            Actions.MyOrder({handleId: 4})
                        }}
                                    style={styles.moneyBarItemView}
                        >
                            <Image
                                style={{width: 27, height: 20}}
                                source={ImgSrc.WAITING_RECEIVE}
                            />
                            <Text style={[styles.textStyle3, {marginTop: 7}]}>
                                待收货
                            </Text>
                        </ClickScope>
                        <ClickScope onPress={() => {
                            Actions.MyOrder({handleId: 5})
                        }}
                                    style={styles.moneyBarItemView}
                        >
                            <Image
                                style={{width: 27, height: 20}}
                                source={ImgSrc.GOT_GOOD}
                            />
                            <Text style={[styles.textStyle3, {marginTop: 7}]}>
                                已收货
                            </Text>
                        </ClickScope>
                    </View>

                    <ButtonBar
                        style={{marginTop: 10}}
                        title={'奖励明细'}
                        onPress={() => {
                            Actions.RewardDetails()
                        }}
                    />
                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'我的优惠券'}
                        introduction={this.props.MineState.couponCount + '张优惠券'}
                        onPress={() => Actions.MyCoupon()}
                    />
                    {this.renderWechatShare()}
                    <ButtonBar
                        style={{marginTop: 1}}
                        title={'我的收货地址'}
                        onPress={() => Actions.MyAddress()}
                    />
                    <ButtonBar
                        style={{marginTop: 1, borderBottomColor: '#dddddd', borderBottomWidth: 1}}
                        title={'源品客服'}
                        onPress={() => {
                            Actions.CustomerService()
                        }}
                    />
                    <View style={{height: 60}}/>
                </ScrollView>
                <ClickScope
                    style={{
                        position: 'absolute',
                        left: 218,
                        top: 563
                    }}
                    onPress={() => {
                        Actions.ShoppingCart()
                    }}
                >
                    <Image
                        style={{height: 60, width: 60}}
                        source={ImgSrc.CIRCLE_SHOPPING_CART}
                    />

                </ClickScope>
            </View>
        );
    }

    renderWechatShare() {
        if (this.state.isWechatInstall) {
            return (
                <ButtonBar
                    style={{marginTop: 1}}
                    title={'邀请您的微信好友成为分享者'}
                    onPress={() => {
                        this.getShareGoodUrl()
                    }}
                />
            )
        }
        return <View></View>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Mine);
