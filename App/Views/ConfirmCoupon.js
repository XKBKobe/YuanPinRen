import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    ScrollView,
    ListView,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import CNClickScope from '../Components/ClickScope';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import HeaderRightButton from '../Components/HeaderRightButton';
import * as ImgSrc from '../Res/Images';
import {formatDate} from '../Utils/toolFunctions';
import { Actions, ActionConst } from 'react-native-router-flux';
import requestData from '../NetWork/request';
import * as ChooseCouponActions from '../Reducer/Actions/ChooseCouponActions';

class ConfirmCoupon extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            data: [],
            couponStatus: 1
        };

        this.couponStatusRequest = this.couponStatusRequest.bind(this);

        this.couponListRender = this.couponListRender.bind(this);
    }

    componentWillMount() {
         this.couponStatusRequest(this.state.couponStatus)
    }

    couponStatusRequest(status) {
        requestData('/index/coupon/coupon_data_list', "POST", "type=1")
        .then((data) => {
            console.log(" **************** ",data);
            if (0 == data.errno) {
                 if (data.data.total > 0) {
                    this.setState({
                        pageStatus: 'HASDATA',
                        data: data.data.data
                    });
                }else {
                    this.setState({pageStatus:"NODATA",data:null});
                }
            }else {
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA"});
            }
        }, (error) => {

        });
        // requestData('/index/Cart/get_coupon_list', "POST","goods="+this.props.goods)
        // .then((data) => {
        //     if (0 == data.errno) {
        //         console.log(" **************** ",data);
        //          if (data.data.length > 0) {
        //             this.setState({
        //                 pageStatus: 'HASDATA',
        //                 data: data.data
        //             });
        //         }else {
        //             this.setState({pageStatus:"NODATA",data:null});
        //         }
        //     }else {
        //         alert(data.errmsg);
        //         this.setState({pageStatus:"NODATA"});
        //     }
        // }, (error) => {

        // });
    }

    chooseCoupon(couponSn, award) {
        console.log("  ------ couponId: ", couponSn);
        requestData('/index/Cart/get_coupon_list', "POST","couponId="+couponSn+"&page=1")
        .then((data) => {
            console.log("============",data);
            if (0 == data.errno) {
                this.props.ChooseCouponActions.chooseCoupon({isRefresh: true,couponSn: couponSn});
                Actions.pop();
            }else {
                alert(data.errmsg);
            }
        }, (error) => {

        });
    }

    couponListRender() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let self = this;
        return (
            <ListView
                dataSource = {ds.cloneWithRows(this.state.data)}
                renderRow = {(itemData, index) => {
                    var startTime = formatDate(itemData.startTime * 1000);
                    var expireTime = formatDate(itemData.expireTime * 1000);

                    if (itemData.type == 1) {
                       let leftCount = itemData.sendMount - itemData.useAmount;
                       var couponBackgroundImage = ImgSrc.BG_COUPON_USELESS;

                        if (1 == this.state.couponStatus) {
                            couponBackgroundImage = ImgSrc.BG_COUPON_USE;
                        }
                        return (
                        <TouchableOpacity onPress={() => {
                                self.chooseCoupon(itemData.couponSn,itemData.discount);
                            }}
                            key={index}
                            style = {styles.itemView}
                        >
                            <View style = {styles.couponItemView}>
                                <Image
                                    style = {styles.couponBgImage}
                                    source = {couponBackgroundImage}
                                />
                                <View style = {styles.couponBgUpView}>
                                    <View style={{flexDirection: "row",width:346,height:64}}>
                                        <View style = {styles.leftView}>
                                            <View style = {styles.leftTopView}>
                                                <Text style = {{backgroundColor: 'transparent',fontSize: 32,color: '#ffffff'}}>{itemData.discount}</Text>
                                                <Text style = {[styles.textStyle2,{marginTop:-3}]}>折</Text>
                                            </View>
                                        </View>
                                        <View style = {styles.rightView}>
                                            <Text style = {styles.textNumberStyle}>适用范围：所有商品</Text>
                                            <Text style = {[styles.textNumberStyle,{marginTop:6}]}>有效期：{itemData.createTime}-{itemData.endTime}</Text>
                                        </View>
                                        <Image />
                                    </View>
                                </View>
                                <View style={{flexDirection: "row",width:346,marginTop: -52, height: 64,justifyContent:"center",alignItems:"center"}}>
                                    <View style={{width: 139}}></View>
                                    <Text style={{backgroundColor: 'transparent',color: "#fff", fontSize: 10}}>可用次数：</Text>
                                    <Text style={{backgroundColor: 'transparent',color: "#fff", fontSize:26,marginTop: -6}}>{leftCount}</Text>
                                    <Text style={{backgroundColor: 'transparent',color: "#fff", fontSize:10}}>/{itemData.sendMount}次</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                   }else {
                        var couponBackgroundImage = ImgSrc.ORDER_COUPON_UNUSED;

                        if (1 == this.state.couponStatus) {
                            couponBackgroundImage = ImgSrc.ORDER_COUPON_USED;
                        }
                        return (
                            <TouchableOpacity onPress={() => {
                                    self.chooseCoupon(itemData.couponSn,itemData.amount);
                                }}
                                key = {index}
                                style = {styles.itemView}
                            >
                                <View style = {styles.couponItemView}>
                                    <Image
                                        style = {{height: 80, width: 345}}
                                        source = {couponBackgroundImage}
                                    />
                                    <View style = {styles.couponBgUpView}>
                                        <View style = {styles.leftView}>
                                            <View style = {styles.leftTopView}>
                                                <Text style = {styles.textStyle1}>{itemData.discount}</Text>
                                                <Text style = {styles.textStyle2}>元</Text>
                                            </View>
                                            <Text style = {styles.textStyle3}>满{itemData.minFull}元可用</Text>
                                        </View>
                                        <View style = {styles.rightView}>
                                            <Text style = {styles.textStyle4}>{itemData.name}</Text>
                                            <Text style = {styles.textStyle5}>适用范围：{itemData.goodType}</Text>
                                            <Text style = {styles.textStyle5}>有效期：{itemData.createTime}-{itemData.endTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                }}
            />
        );
    }

    pageHasDataRender() {
        let self = this;
        return (
            <View style = {{flex: 1}}>
                <ScrollView style = {styles.contentView}>
                    {this.couponListRender()}
                    <TouchableOpacity onPress={() => {self.chooseCoupon(0,0);}}
                        style = {[styles.itemView,{marginTop:6,backgroundColor:"#fff",height:60}]}
                    >
                        <Text style={{marginTop:22,fontSize:13}}>任性不使用优惠券</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    headerRender() {
        return (
            <View>
                <HeaderRightButton
                    headerTitle = "选择优惠券"
                    leftOnPress = {() => Actions.pop()}
                    onRightPress = {() => {console.log('zhangzhao', 'duihuan');}}
                />
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

function mapStateToProps(state) {
    const {couponState} = state;
    return {
        couponState
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ChooseCouponActions: bindActionCreators(ChooseCouponActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCoupon);

const styles = StyleSheet.create({
    contentView: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    tabBarView: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#ffffff',
    },
    tabItemView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabItemChoosedView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#ff6700',
    },
    tabItemText: {
        fontSize: 14,
        color: '#333333'
    },
    tabItemChoosedText: {
        fontSize: 14,
        color: '#ff6700'
    },
    itemView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    couponItemView: {
        position: 'relative'
    },
    couponBgImage: {
        height: 128,
        width: 346
    },
    couponBgUpView: {
        flexDirection: 'row',
        left: 11,
        top: 0,
        position: 'absolute',
        height: 80,
        width: 345
    },
    leftView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightView: {
        flex: 3.3,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    leftTopView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    textStyle1: {
        backgroundColor: 'transparent',
        fontSize: 26,
        color: '#ffffff'
    },
    textStyle2: {
        backgroundColor: 'transparent',
        fontSize: 10,
        color: '#ffffff'
    },
    textStyle3: {
        backgroundColor: 'transparent',
        fontSize: 12,
        color: '#ffffff'
    },
    textStyle4: {
        backgroundColor: 'transparent',
        fontSize: 14,
        color: '#333333',
        marginLeft: 15
    },
    textStyle5: {
        backgroundColor: 'transparent',
        fontSize: 12,
        color: '#999999',
        marginLeft: 15
    },
    textNumberStyle: {
        backgroundColor: 'transparent',
        fontSize: 12,
        color: '#fff',
        marginLeft: 15
    },
});
