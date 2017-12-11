import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ListView,
    Image,
    InteractionManager
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import CNClickScope from '../Components/ClickScope';
import Header from '../Components/Header';
import * as Request from '../NetWork/nativeDataRequest';
import {formatDate} from '../Utils/toolFunctions';
import { Actions, ActionConst } from 'react-native-router-flux';
import requestData from '../NetWork/request';
import { getLocalTime, add0, getOrderStatus, getCountdown, getCountdownTimestamp } from '../Utils/Tools';

export default class OrderDetail extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            data: [],
            expireTime: "",
        };

        this.warehousListRender = this.warehousListRender.bind(this);
        this.goodsListRender = this.goodsListRender.bind(this);
        this.footerRender = this.footerRender.bind(this);
        this.renderPayinfoWithStatus = this.renderPayinfoWithStatus.bind(this);

    }

    componentWillMount() {
        requestData('/index/Order/order_detail', "POST", "orderSn="+this.props.orderSn)
        .then((data) => {
            if (0 == data.errno) {
                this.setState({
                    pageStatus: 'HASDATA',
                    data: data.data
                });
            }else {
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA"});
            }
        }, (error) => {

        });
    }

    footerRender() {
        if ('待付款' == this.state.data.order_status) {
            return (
                <View style = {styles.orderItemBottomView}>
                    <CNClickScope
                        style = {[styles.button1, {marginRight: 15}]}
                    >
                        <Text style = {styles.textStyle1}>取消订单</Text>
                    </CNClickScope>
                    <CNClickScope
                        style = {styles.button2}
                    >
                        <Text style = {styles.textStyle4}>立即付款</Text>
                    </CNClickScope>
                </View>
            );
        } else if ('已取消' == this.state.data.order_status) {
            return (
                <View style = {styles.orderItemBottomView}>
                    <CNClickScope
                        style = {styles.button1}
                    >
                        <Text style = {styles.textStyle1}>删除订单</Text>
                    </CNClickScope>
                </View>
            );
        } else if ('已发货' == this.state.data.order_status) {
            return (
                <View style = {styles.orderItemBottomView}>
                    <CNClickScope
                        style = {[styles.button1, {marginRight: 15}]}
                    >
                        <Text style = {styles.textStyle1}>查看物流</Text>
                    </CNClickScope>
                    <CNClickScope
                        style = {styles.button2}
                    >
                        <Text style = {styles.textStyle4}>确认收货</Text>
                    </CNClickScope>
                </View>
            );
        } else if ('清关中' == this.state.data.order_status) {
            return (
                <View style = {styles.orderItemBottomView}>
                    <CNClickScope
                        style = {styles.button2}
                    >
                        <Text style = {styles.textStyle4}>提醒发货</Text>
                    </CNClickScope>
                </View>
            );
        }
    }

    goodsListRender(goodsListData) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
        return (
            <View>
                <ListView
                    dataSource = {ds.cloneWithRows(goodsListData)}
                    renderRow = {(itemData) => {
                        let imgUrl = "";
                        if ((itemData.imgobj instanceof Array)) {
                            imgUrl = itemData.imgobj[0].url;
                        }else {
                            imgUrl = itemData.imgobj.url;
                        }
                        return (
                            <View style = {styles.goodsItemView}>
                                <Image
                                    style = {{height: 60, width: 60, borderWidth: 1, borderColor: '#dddddd'}}
                                    source = {{uri: imgUrl}}
                                />
                                <View style = {styles.goodsNameView}>
                                    <Text style = {styles.textStyle1}>
                                        {itemData.goodsName}
                                    </Text>
                                </View>

                                <View style = {{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
                                    <Text style = {styles.textStyle1}>
                                        ¥{itemData.goodsSalePrice}
                                    </Text>
                                    <Text style = {styles.textStyle1}>
                                        x{itemData.num}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }

    warehousListRender() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View>
                <ListView
                    dataSource = {ds.cloneWithRows(this.state.data.goodsList)}
                    renderRow = {(itemData) => {
                        return (
                            <View style = {styles.wareHouseListView}>
                                <View style = {styles.wareHouseNameView}>
                                    <Text style = {styles.textStyle1}>
                                        {itemData.warehouseName}
                                    </Text>
                                </View>
                                {this.goodsListRender(itemData.goodsList)}
                            </View>
                        );
                    }}
                />
            </View>
        );
    }

    //倒计时
	countdownTime(nS, type) {
		let self = this;
		if (this.state.expireFlag) {
			this.state.expireFlag = false;
			this.state.timer = setInterval(function () {
				let expireTime = getCountdownTimestamp(nS, type);
				--expireTime;
				if (0 == expireTime) {
					clearInterval(this.state.timer);
					self.setState({
						expireTime: '00:00:00'
					});
				} else {
					let h = parseInt(expireTime / 3600);
					let mm = parseInt(expireTime % 3600 / 60);
					let s = parseInt(expireTime % 3600 % 60);
					let countdownTime = add0(h) + ':' + add0(mm) + ':' + add0(s);
					self.setState({
						expireTime: countdownTime
					});
				}
			}, 1000);
		}
	}

    renderPayinfoWithStatus(orderInfo) {
        if (orderInfo.orderStatus == "待付款") {
            this.state.expireTime = getCountdown(orderInfo.orderTime, 1);
			this.countdownTime(orderInfo.orderTime, 1);
            return (
                <Text style = {styles.textStyle6}>
                    还剩：{this.state.expireTime}订单自动取消
                </Text>
            )
        }else {
            return (
                <Text style = {styles.textStyle6}>
                    支付方式：{orderInfo.payMthod}
                </Text>
            )
        }
    }

    pageHasDataRender() {
        let orderTitle = this.state.data.orderStatus == "待发货" ? this.state.data.orderStatus + '   （报关商品正常1~3天发货）' : this.state.data.orderStatus;
        return (
            <View style = {{flex: 1, flexDirection: 'column', backgroundColor: '#f0f0f0'}}>
                <ScrollView>
                    <View style = {styles.orderMessageView}>
                        <Text style = {styles.textStyle5}>
                            {this.state.data.orderStatus}
                        </Text>
                        <Text style = {styles.textStyle6}>
                            订单编号：{this.state.data.orderSn}
                        </Text>
                        <Text style = {styles.textStyle6}>
                            下单时间：{formatDate(this.state.data.orderTime * 1000)}
                        </Text>
                        {this.renderPayinfoWithStatus(this.state.data)}
                    </View>

                    <View style = {styles.addressView}>
                        <View style = {styles.addressUpView}>
                            <Text style = {styles.textStyle7}>
                                {this.state.data.consignee}
                            </Text>
                            <Text style = {styles.textStyle7}>
                                {this.state.data.consigneeMobile}
                            </Text>
                        </View>

                        <Text style = {[styles.textStyle1, {marginTop: 10}]}>
                            {this.state.data.shipArea}{this.state.data.shipAddress}
                        </Text>
                    </View>

                    <View style = {styles.idView}>
                        <Text style = {styles.textStyle1}>
                            身份证号码
                        </Text>
                        <Text style = {styles.textStyle1}>
                            {this.state.data.idCard}
                        </Text>
                    </View>

                    {this.warehousListRender()}

                    <View style = {styles.priceDetailView}>
                        <View style = {{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style = {styles.textStyle1}>
                                商品总价
                            </Text>
                            <Text style = {[styles.textStyle1, {marginTop: 16}]}>
                                优惠券
                            </Text>
                            <Text style = {[styles.textStyle1, {marginTop: 16}]}>
                                运费
                            </Text>
                            <Text style = {[styles.textStyle1, {marginTop: 16}]}>
                                税费
                            </Text>
                            <Text style = {[styles.textStyle1, {marginTop: 16}]}>
                                总计
                            </Text>
                        </View>
                        <View style = {{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end'}}>
                            <Text style = {styles.textStyle1}>
                                ¥{this.state.data.itemCost}
                            </Text>
                            <Text style = {[styles.textStyle1, {marginTop: 16}]}>
                                －¥{this.state.data.discountTotal}
                            </Text>
                            <Text style = {[styles.textStyle1, {marginTop: 16}]}>
                                ¥{this.state.data.shipCost}
                            </Text>
                            <Text style = {[styles.textStyle1, {marginTop: 16}]}>
                                ¥{this.state.data.taxCost}
                            </Text>
                            <Text style = {[styles.textStyle3, {marginTop: 16}]}>
                                ¥{this.state.data.orderCost}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                {this.footerRender()}
            </View>
        );
    }

    headerRender() {
        return (
            <Header
                headerTitle = {'订单详情'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

const styles = StyleSheet.create({
    orderMessageView: {
        marginTop: 10,
        backgroundColor: '#ffffff',
        height: 108,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        flexDirection: 'column',
        paddingLeft: 15,
        paddingTop: 12
    },
    addressView: {
        marginTop: 10,
        backgroundColor: '#ffffff',
        height: 90,
        flexDirection: 'column',
        paddingHorizontal: 15,
        paddingTop: 18
    },
    addressUpView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    idView: {
        marginTop: 1,
        backgroundColor: '#ffffff',
        height: 30,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    priceDetailView: {
        marginTop: 10,
        height: 211,
        backgroundColor: '#ffffff',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    orderItemBottomView: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        paddingRight: 15,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#dddddd'
    },
    wareHouseListView: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        marginTop: 10
    },
    wareHouseNameView: {
        flexDirection: 'row',
        height: 30,
        paddingLeft: 15,
        alignItems: 'center'
    },
    goodsItemView: {
        height: 90,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0'
    },
    goodsNameView: {
        marginLeft: 10,
        width: 213
    },
    button1: {
        height: 28,
        width: 78,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 4
    },
    button2: {
        height: 28,
        width: 78,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff6700',
        borderRadius: 4
    },
    textStyle1: {
        fontSize: 12,
        color: '#333333'
    },
    textStyle2: {
        fontSize: 12,
        color: '#ffa700'
    },
    textStyle3: {
        fontSize: 12,
        color: '#ff6700'
    },
    textStyle4: {
        fontSize: 12,
        color: '#ffffff'
    },
    textStyle5: {
        fontSize: 14,
        color: '#ffa700'
    },
    textStyle6: {
        fontSize: 10,
        color: '#333333',
        marginTop: 6
    },
    textStyle7: {
        fontSize: 14,
        color: '#333333'
    },
});
