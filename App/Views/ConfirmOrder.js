import React from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Modal,
    NativeModules,
    NativeAppEventEmitter
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BaseComponent from '../Components/BaseComponent';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import ButtonBar from '../Components/ButtonBar';
import * as ImgSrc from '../Res/Images';
import * as ChoosedAddressActions from '../Reducer/Actions/ChoosedAddressActions';

import Footer from '../Components/ConfirmOrderComponents/Footer';
import AddressBar from '../Components/ConfirmOrderComponents/AddressBar';
import GoodsListBar from '../Components/ConfirmOrderComponents/GoodsListBar';
import PayDetailPopWindow from '../Components/ConfirmOrderComponents/PayDetailWindow';
import requestData from '../NetWork/request';
import * as ChooseCouponActions from '../Reducer/Actions/ChooseCouponActions';

const GetBasicInfo = NativeModules.GetBasicInfo;

class ConfirmOrder extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            isModalShow: false,
            lastPageData: null
        };

        this.orderSn = null;

        this.footerPayDetailClick = this.footerPayDetailClick.bind(this);
        this.gotoPay = this.gotoPay.bind(this);
    }

    componentWillMount() {
        if (this.props.page == "cart") {
            this.requeryCartData();
        }else {
            this.requeryImmediate("")
        }
    }

    requeryCartData(couponSn) {
        let couponId = couponSn ? "couponId="+couponSn : "";
        requestData('/index/Cart/pre_query', 'POST', couponId)
            .then((data) => {
                if (data.errno == 0) {
                    this.setState({lastPageData: data.data});
                    this.props.ChoosedAddressActions.saveChoosedAddressData(this.state.lastPageData.addressInfo);
                    this.props.ChooseCouponActions.chooseCoupon({isRefresh: false});
                    this.setState({pageStatus: 'HASDATA'});
                } else {
                    Alert.alert(data.errmsg);
                    Actions.pop();
                }
            });
    }

    requeryImmediate(couponSn) {
        requestData('/index/Cart/direct_purchase', 'POST', this.props.goodParam+"&couponId="+couponSn)
        .then((data) => {
            console.log("  ~~~~~~~~~~~~ ", data);
            if (data.errno == 0) {
                this.setState({lastPageData: data.data});
                this.props.ChoosedAddressActions.saveChoosedAddressData(this.state.lastPageData.addressInfo);
                this.props.ChooseCouponActions.chooseCoupon({isRefresh: false});
                this.setState({pageStatus: 'HASDATA'});
            } else {
                alert(data.errmsg);
            }
        });
    }

    componentDidMount() {
        NativeAppEventEmitter.addListener('PAY_SUCCESS', () => {
            Actions.PaymentSuccess();
            console.log(' ~~~~~~~~~~------- ', 'pay success');
        });

        NativeAppEventEmitter.addListener('PAY_FAIL', () => {
            alert("支付失败！");
            Actions.pop();
            console.log('==============', 'pay fail');
        });
    }

    headerRender() {
        return (
            <Header
                headerTitle = {'确认订单'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    footerPayDetailClick() {
        this.setState({
            isModalShow: !this.state.isModalShow
        });
    }

    gotoPay() {
        if (this.orderSn == null) {
            var goodsData = this.state.lastPageData;
            var addressData = this.props.ChoosedAddressState.addressData;
            var paramGoods = [];

            let goodName = "";
            goodsData.goodsList.map((item1, index1) => {
                item1.goodsList.map((item2, index2) => {
                    let paramGoodItem = {};

                    goodName = item2.goodsName;
                    paramGoodItem['goodsId'] = item2.goodsId;
                    paramGoodItem['num'] = item2.num;

                    paramGoods.push(paramGoodItem);
                });
            });
            console.log(" ------------ ", goodsData.activityInfo.couponId);
            requestData('/index/Order/index', 'POST', 'goods=' + JSON.stringify(paramGoods) + '&addressId=' 
                + addressData.addressId + '&totalSalePrice=' + goodsData.allPayMoney+"&couponId="+goodsData.activityInfo.couponSn)
            .then((data) => {
                if (data.errno == 0) {
                    this.orderSn = data.data.order_sn;
                    requestData('/index/Alipay/alipay', 'POST', 'orderSn=' + this.orderSn)
                    .then((data) => {
                        GetBasicInfo.payForOrder(data.data);
                    });
                } else {
                    Alert.alert(data.errmsg);
                }
            });
        } else {
            requestData('/index/Alipay/alipay', 'POST', 'orderSn=' + this.orderSn)
            .then((data) => {
                GetBasicInfo.payForOrder(data.data);
            });
        }
    }

    pageHasDataRender() {
        if (this.props.CouponState.isRefresh) {
            if (this.props.page == "cart") {
                this.requeryCartData(this.props.CouponState.couponSn);
            }else {
                this.requeryImmediate(this.props.CouponState.couponSn)
            }
        }

        var data = this.state.lastPageData;
        var addressData = this.props.ChoosedAddressState.addressData;
        let self = this;
        let award = data.activityInfo.discount ?(data.activityInfo.type == 1 ? data.activityInfo.discount+"折" :"-"+data.activityInfo.discount) : '使用优惠券';
        let allPayMoney = data.allPayMoney;
        return (
            <View style = {{flex: 1, flexDirection: 'column'}}>
                <ScrollView style = {{flex: 1,backgroundColor: '#f0f0f0'}}>
                    <AddressBar
                        addressData = {addressData}
                    />

                    <GoodsListBar
                        goodsListData = {data.goodsList}
                    />

                    <ButtonBar
                        style = {{marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#dddddd'}}
                        title = {'优惠券'}
                        introduction = {award}
                        onPress = {() => {
                            var goodsData = self.state.lastPageData;
                            var addressData = self.props.ChoosedAddressState.addressData;
                            var paramGoods = [];

                            let goodName = "";
                            goodsData.goodsList.map((item1, index1) => {
                                item1.goodsList.map((item2, index2) => {
                                    let paramGoodItem = {};

                                    goodName = item2.goodsName;
                                    paramGoodItem['goodsId'] = item2.goodsId;
                                    paramGoodItem['num'] = item2.num;

                                    paramGoods.push(paramGoodItem);
                                });
                            });
                            Actions.ConfirmCoupon({goods: JSON.stringify(paramGoods)});
                        }}
                    />
                </ScrollView>

                <Footer
                    totalMoney = {allPayMoney}
                    gotoPayClick = {() => {
                        this.setState({isModalShow: false})
                        this.gotoPay();
                    }}
                    payDetailClick = {this.footerPayDetailClick}
                    isShowPayDetail = {this.state.isModalShow}
                />

                <Modal
                    transparent = {true}
                    visible = {this.state.isModalShow}
                    onRequestClose = {() => {}}
                >
                    <PayDetailPopWindow
                        shadeClick = {() => {this.setState({isModalShow: false});}}
                        priceData = {data}
                    />
                    <Footer
                        totalMoney = {allPayMoney}
                        gotoPayClick = {() => {
                            this.setState({isModalShow: false})
                            this.gotoPay();
                        }}
                        payDetailClick = {this.footerPayDetailClick}
                        isShowPayDetail = {this.state.isModalShow}
                    />
                </Modal>
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

function mapStateToProps(state) {
    const {ChoosedAddressState,CouponState} = state;
    return {
        ChoosedAddressState,CouponState
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ChooseCouponActions: bindActionCreators(ChooseCouponActions, dispatch),
        ChoosedAddressActions: bindActionCreators(ChoosedAddressActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOrder);
