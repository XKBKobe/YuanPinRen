import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    ScrollView,
    ListView,
    Image,
    StyleSheet,
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import CNClickScope from '../Components/ClickScope';
import HeaderRightButton from '../Components/HeaderRightButton';
import * as ImgSrc from '../Res/Images';
import {formatDate} from '../Utils/toolFunctions';
import { Actions, ActionConst } from 'react-native-router-flux';
import requestData from '../NetWork/request';

export default class MyCoupon extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            data: [],
            couponStatus: 1,
            totalPage: 0,
            currentPage: 1,
            isLoadingMore: false
        };

        this.couponStatusRequest = this.couponStatusRequest.bind(this);

        this.tabBarRender = this.tabBarRender.bind(this);
        this.couponListRender = this.couponListRender.bind(this);

        this.coupon1Click = this.coupon1Click.bind(this);
        this.coupon2Click = this.coupon2Click.bind(this);
        this.coupon3Click = this.coupon3Click.bind(this);
        this.LoadMoreData = this.LoadMoreData.bind(this);
        this.LoadLessData = this.LoadLessData.bind(this);
    }

    componentWillMount() {
        this.couponStatusRequest(this.state.couponStatus)
    }

    couponStatusRequest(status) {
        this.queryOrdersData(status,1);
    }

    pageNoDataRender() {
        return (
            <View style = {styles.scontentView}>
                
                <Text>您还没有优惠券！</Text>
            </View>
        );
    }

    queryOrdersData(status,page) {
        requestData('/index/coupon/coupon_data_list', "POST", "type="+status+"&page="+page+"&pageSize=10")
        .then((data) => {
            if (0 == data.errno) {
                 if (0 != data.data.total) {
                    this.setState({
                        pageStatus: 'HASDATA',
                        data: data.data.data,
                        isLoadingMore: false,
                        totalPage: (data.data.total/10) > 1 ? (data.data.total/10) : 1,
                        currentPage: data.data.current_page
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
    }

    coupon1Click() {
        if (1 == this.state.couponStatus) {
            return;
        }

        this.setState({
            pageStatus: 'LOADING',
            couponStatus: 1
        });
        this.couponStatusRequest(1);
    }

    coupon2Click() {
        if (2 == this.state.couponStatus) {
            return;
        }

        this.setState({
            pageStatus: 'LOADING',
            couponStatus: 2
        });
        this.couponStatusRequest(2);
    }

    coupon3Click() {
        if (3 == this.state.couponStatus) {
            return;
        }

        this.setState({
            pageStatus: 'LOADING',
            couponStatus: 3
        });
        this.couponStatusRequest(3);
    }

    tabBarRender() {
        var coupon1Style = styles.tabItemView;
        var coupon2Style = styles.tabItemView;
        var coupon3Style = styles.tabItemView;
        var coupon1TextStyle = styles.tabItemText;
        var coupon2TextStyle = styles.tabItemText;
        var coupon3TextStyle = styles.tabItemText;

        if (1 == this.state.couponStatus) {
            coupon1Style = styles.tabItemChoosedView;
            coupon1TextStyle = styles.tabItemChoosedText;
        }

        if (2 == this.state.couponStatus) {
            coupon2Style = styles.tabItemChoosedView;
            coupon2TextStyle = styles.tabItemChoosedText;
        }

        if (3 == this.state.couponStatus) {
            coupon3Style = styles.tabItemChoosedView;
            coupon3TextStyle = styles.tabItemChoosedText;
        }

        return (
            <View style = {styles.tabBarView}>
                <CNClickScope
                    onPress = {this.coupon1Click}
                    style = {coupon1Style}
                >
                    <Text style = {coupon1TextStyle}>未使用</Text>
                </CNClickScope>

                <CNClickScope
                    onPress = {this.coupon2Click}
                    style = {coupon2Style}
                >
                    <Text style = {coupon2TextStyle}>已使用</Text>
                </CNClickScope>

                <CNClickScope
                    onPress = {this.coupon3Click}
                    style = {coupon3Style}
                >
                    <Text style = {coupon3TextStyle}>已过期</Text>
                </CNClickScope>
            </View>
        );
    }

    couponListRender() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let self = this;
        return (
            <ListView
                dataSource = {ds.cloneWithRows(this.state.data)}
                renderRow = {(itemData, index) => {
                   
                   if (itemData.type == 1) {
                       let leftCount = itemData.sendMount - itemData.useAmount;
                       var couponBackgroundImage = ImgSrc.BG_COUPON_USELESS;

                        if (1 == this.state.couponStatus) {
                            couponBackgroundImage = ImgSrc.BG_COUPON_USE;
                        }
                        return (
                        <View key={index}
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
                                                <Text style = {styles.textStyle1}>{itemData.discount}</Text>
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
                        </View>
                    )
                   }else {
                        var couponBackgroundImage = ImgSrc.ORDER_COUPON_UNUSED;

                        if (1 == this.state.couponStatus) {
                            couponBackgroundImage = ImgSrc.ORDER_COUPON_USED;
                        }
                        return (
                            <View
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
                            </View>
                        );
                    }
                }}
            />
        );
    }

    LoadMoreData() {
        if (this.state.totalPage == this.state.currentPage || this.state.isLoadingMore) {
            return ;
        }

        this.setState({
            isLoadingMore: true
        });
        this.queryOrdersData(this.state.couponStatus, parseInt(this.state.currentPage)+1);
    }

    LoadLessData() {
        if (1 == this.state.currentPage || this.state.isLoadingMore) {
            return ;
        }

        this.setState({
            isLoadingMore: true
        });
        this.queryOrdersData(this.state.couponStatus, parseInt(this.state.currentPage)-1);
    }

    loadingMoreFooterRender() {
        var loadingMoreContent;
        if (this.state.totalPage == this.state.currentPage) {
            loadingMoreContent = '到底了，别拉了';
        } else if (this.state.isLoadingMore) {
            loadingMoreContent = '正在加载...';
        } else {
            loadingMoreContent = '点击加载更多';
        }

        return (
            <CNClickScope style = {styles.loadMoreView}
                onPress={() => this.LoadMoreData()}
            >
                <Text style = {styles.loadTextStyle}>
                    {loadingMoreContent}
                </Text>
            </CNClickScope>
        );
    }

    pageHasDataRender() {
        return (
            <View style = {{flex: 1}}>
                <ScrollView style = {styles.contentView}
                    onScrollEndDrag = {(event) => {
                        if (event.nativeEvent.contentOffset.y < -1) {
                            console.log('zhangzhao_content', parseInt(event.nativeEvent.contentSize.height));
                            this.LoadLessData();
                        }
                    }}
                >
                    {this.couponListRender()}
                    {this.loadingMoreFooterRender()}
                </ScrollView>
            </View>
        );
    }

    headerRender() {
        return (
            <View>
                <HeaderRightButton
                    headerTitle = "我的优惠券"
                    leftOnPress = {() => Actions.pop()}
                />
                {this.tabBarRender()}
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

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
    loadMoreView: {
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
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
    scontentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center'
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
        height: 64,
        width: 346
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
        marginTop: -6,
        color: '#ffffff'
    },
    textStyle3: {
        backgroundColor: 'transparent',
        fontSize: 12,
        color: '#ffffff'
    },
    loadTextStyle: {
        fontSize: 12,
        color: '#ff6700'
    },
    textStyle4: {
        backgroundColor: 'transparent',
        fontSize: 14,
        color: '#333333',
        marginLeft: 15
    },
    textNumberStyle: {
        backgroundColor: 'transparent',
        fontSize: 12,
        color: '#fff',
        marginLeft: 15
    },
    textStyle5: {
        backgroundColor: 'transparent',
        fontSize: 12,
        color: '#999999',
        marginLeft: 15
    },
});
