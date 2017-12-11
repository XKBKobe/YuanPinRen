import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    NativeModules,
    ListView,
    Image,
    Alert,
    InteractionManager
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import ClickScope from '../Components/ClickScope';
import Header from '../Components/Header';
import * as Request from '../NetWork/nativeDataRequest';
import {formatDate} from '../Utils/toolFunctions';
import OrderDetail from './OrderDetail';
import { Actions, ActionConst } from 'react-native-router-flux';
import requestData from '../NetWork/request';

const GetBasicInfo = NativeModules.GetBasicInfo;
export default class MyOrder extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            data: [],
            listData: [],
            orderStatus: this.props.handleId,
            totalPage: 0,
            currentPage: 1,
            isLoadingMore: false
        };


        this.orderListRender = this.orderListRender.bind(this);
        this.orderItemRender = this.orderItemRender.bind(this);
        this.orderItemBottomRender = this.orderItemBottomRender.bind(this);
        this.goodsListRender = this.goodsListRender.bind(this);
        this.goodsItemRender = this.goodsItemRender.bind(this);
        this.loadingMoreFooterRender = this.loadingMoreFooterRender.bind(this);

        this.LoadMoreData = this.LoadMoreData.bind(this);

        this.gotoOrderDetailPage = this.gotoOrderDetailPage.bind(this);

        this.order1Click = this.order1Click.bind(this);
        this.order2Click = this.order2Click.bind(this);
        this.order3Click = this.order3Click.bind(this);
        this.order4Click = this.order4Click.bind(this);
        this.order5Click = this.order5Click.bind(this);
        this.LoadLessData = this.LoadLessData.bind(this);
    }

    componentWillMount() {
        let param = "";
        if (this.props.handleId != 1) {
            param = "type="+(this.props.handleId-1);
        }
        this.queryOrdersData(param);
    }

    queryOrdersData(type, page) {
        if (!page) {page = 1}
        requestData('/index/Order/order_list', "POST", type+"&page="+page+"&pageSize=10")
        .then((data) => {
            if (0 == data.errno) {
                //console.log(" ********* ", data);
                if (0 == data.data.total) {
                    this.setState({pageStatus:"NODATA",isLoadingMore: false});
                    return;
                }
                this.setState({
                    pageStatus: 'HASDATA',
                    isLoadingMore: false,
                    listData: data.data.data,
                    totalPage: parseInt(data.data.total)/10 < 1 ? 1 : Math.ceil(parseInt(data.data.total)/10),
                    currentPage: data.data.current_page
                });
            }else {
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA",isLoadingMore: false});
            }
        }, (error) => {

        });
    }

    gotoOrderDetailPage(orderId) {
        Actions.OrderDetail({orderSn: orderId});
    }

    order1Click() {
        if (1 == this.state.orderStatus) {
            return ;
        }
        this.queryOrdersData("");
        this.setState({
            pageStatus: 'LOADING',
            orderStatus: 1
        });
    }

    order2Click() {
        if (2 == this.state.orderStatus) {
            return ;
        }

        this.queryOrdersData("type=1");
        this.setState({
            pageStatus: 'LOADING',
            orderStatus: 2
        });
    }

    order3Click() {
        if (3 == this.state.orderStatus) {
            return ;
        }
        this.queryOrdersData("type=2");
        this.setState({
            pageStatus: 'LOADING',
            orderStatus: 3
        });
    }

    order4Click() {
        if (4 == this.state.orderStatus) {
            return ;
        }
        this.queryOrdersData("type=3");
        this.setState({
            pageStatus: 'LOADING',
            orderStatus: 4
        });
    }

    order5Click() {
        if (5 == this.state.orderStatus) {
            return ;
        }
        this.queryOrdersData("type=4");
        this.setState({
            pageStatus: 'LOADING',
            orderStatus: 5
        });
    }

    tabBarRender() {
        var coupon1Style = styles.tabItemView;
        var coupon2Style = styles.tabItemView;
        var coupon3Style = styles.tabItemView;
        var coupon4Style = styles.tabItemView;
        let coupon5Style = styles.tabItemView;
        var coupon1TextStyle = styles.tabItemText;
        var coupon2TextStyle = styles.tabItemText;
        var coupon3TextStyle = styles.tabItemText;
        var coupon4TextStyle = styles.tabItemText;
        let coupon5TextStyle = styles.tabItemText;

        if (1 == this.state.orderStatus) {
            coupon1Style = styles.tabItemChoosedView;
            coupon1TextStyle = styles.tabItemChoosedText;
        }else if (2 == this.state.orderStatus) {
            coupon2Style = styles.tabItemChoosedView;
            coupon2TextStyle = styles.tabItemChoosedText;
        }else if (3 == this.state.orderStatus) {
            coupon3Style = styles.tabItemChoosedView;
            coupon3TextStyle = styles.tabItemChoosedText;
        }else if (4 == this.state.orderStatus) {
            coupon4Style = styles.tabItemChoosedView;
            coupon4TextStyle = styles.tabItemChoosedText;
        }else if (5 == this.state.orderStatus) {
            coupon5Style = styles.tabItemChoosedView;
            coupon5TextStyle = styles.tabItemChoosedText;
        }


        return (
            <View style = {styles.tabBarView}>
                <ClickScope
                    onPress = {this.order1Click}
                    style = {coupon1Style}
                >
                    <Text style = {coupon1TextStyle}>全部</Text>
                </ClickScope>

                <ClickScope
                    onPress = {this.order2Click}
                    style = {coupon2Style}
                >
                    <Text style = {coupon2TextStyle}>待付款</Text>
                </ClickScope>

                <ClickScope
                    onPress = {this.order3Click}
                    style = {coupon3Style}
                >
                    <Text style = {coupon3TextStyle}>待发货</Text>
                </ClickScope>

                <ClickScope
                    onPress = {this.order4Click}
                    style = {coupon4Style}
                >
                    <Text style = {coupon4TextStyle}>待收货</Text>
                </ClickScope>

                <ClickScope
                    onPress = {this.order5Click}
                    style = {coupon5Style}
                >
                    <Text style = {coupon5TextStyle}>已收货</Text>
                </ClickScope>
            </View>
        );
    }

     gotoPay(orderSn) {
        requestData('/index/Alipay/alipay', 'POST', 'orderSn=' + orderSn)
        .then((data) => {
            GetBasicInfo.payForOrder(data.data);
        });
    }

    cancelOrder(orderSn,type) {
        let self = this;
        requestData('/index/Order/operation_order', "POST", "type="+type+"&orderSn="+orderSn)
        .then((data) => {
            if (0 == data.errno) {
                let stype = "";
                if (self.state.orderStatus > 1) {stype="type="+(self.state.orderStatus-1)}
                 self.queryOrdersData(stype);
                if (type == 2) {
                    Alert.alert("成功确认收货! "); 
                }else if(type == 3) {
                    Alert.alert("成功删除订单! "); 
                }else {
                    Alert.alert("成功取消订单! "); 
                }
            }else {
                alert(data.errmsg);
            }
        }, (error) => {

        });
    }

    pageNoDataRender() {
        return (
            <View style = {styles.contentView}>
                <Text>您还没有订单!</Text>
            </View>
        );
    }

    orderItemBottomRender(param, orderSn,shipNo,shipMethod) {
        if ('待付款' == param) {
            return (
                <View style = {styles.orderItemBottomView}>
                    <ClickScope onPress={() => this.cancelOrder(orderSn,1)}
                        style = {[styles.button1, {marginRight: 15}]}
                    >
                        <Text style = {styles.textStyle1}>取消订单</Text>
                    </ClickScope>
                    <ClickScope
                        onPress = {() => this.gotoPay(orderSn)}
                        style = {styles.button2}
                    >
                        <Text style = {styles.textStyle4}>立即付款</Text>
                    </ClickScope>
                </View>
            );
        } else if ('已取消' == param) {
            return (
                <View style = {styles.orderItemBottomView}>
                    <ClickScope onPress={() => this.cancelOrder(orderSn,3)}
                        style = {styles.button1}
                    >
                        <Text style = {styles.textStyle1}>删除订单</Text>
                    </ClickScope>
                </View>
            );
        } else if ('已发货' == param) {
            return (
                <View style = {styles.orderItemBottomView}>
                    <ClickScope
                        onPress={() => Alert.alert("物流公司："+shipMethod+"\n快递单号："+shipNo)}
                        style = {[styles.button1, {marginRight: 15}]}
                    >
                        <Text style = {styles.textStyle1}>查看物流</Text>
                    </ClickScope>
                    <ClickScope onPress={() => this.cancelOrder(orderSn,2)}
                        style = {styles.button2}
                    >
                        <Text style = {styles.textStyle4}>确认收货</Text>
                    </ClickScope>
                </View>
            );
        } else if ('清关中' == param) {
            return (
                <View style = {styles.orderItemBottomView}>
                    <ClickScope
                        style = {styles.button2}
                    >
                        <Text style = {styles.textStyle4}>提醒发货</Text>
                    </ClickScope>
                </View>
            );
        }
    }

    goodsItemRender(itemData) {
        if (!itemData.imgobj){return <View></View>}
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
    }

    goodsListRender(goodsListData) {
        if (!goodsListData || goodsListData.length < 1) {return;}
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View>
                <ListView
                    dataSource = {ds.cloneWithRows(goodsListData)}
                    renderRow = {this.goodsItemRender}
                />
            </View>
        );
    }

    orderItemRender(itemData) {
        return (
            <ClickScope
                style = {styles.orderItemView}
                onPress = {() => this.gotoOrderDetailPage(itemData.orderSn)}
            >
                <View style = {styles.orderItemTitleView}>
                    <Text style = {styles.textStyle1}>{formatDate(itemData.orderTime * 1000)}</Text>
                    <Text style = {styles.textStyle2}>{itemData.orderStatus}</Text>
                </View>

                {this.goodsListRender(itemData.goodsList)}

                <View style = {styles.orderItemPriceView}>
                    <Text style = {styles.textStyle1}>
                        共{itemData.goodsNum}件商品  应付总额：
                    </Text>
                    <Text style = {styles.textStyle3}>
                        ¥{itemData.orderCost}
                    </Text>
                </View>
                {this.orderItemBottomRender(itemData.orderStatus,itemData.orderSn, itemData.shipNo,itemData.shipMethod)}
            </ClickScope>
        );
    }

    orderListRender() {
        if (!this.state.listData || this.state.listData.length < 1) {return;}
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View>
                <ListView
                    dataSource = {ds.cloneWithRows(this.state.listData)}
                    renderRow = {this.orderItemRender}
                />
            </View>
        );
    }

    headerRender() {
        return (
            <View>
                <Header
                    headerTitle = {'我的订单'}
                    leftOnPress = {() => Actions.pop()}
                />
                {this.tabBarRender()}
            </View>
        );
    }

    LoadMoreData() {
        console.log("\n\n",this.state.totalPage);
        if (this.state.totalPage == this.state.currentPage || this.state.isLoadingMore) {
            return ;
        }

        this.setState({
            isLoadingMore: true
        });

        let type = this.state.orderStatus == 1 ? "" : "type="+(this.state.orderStatus-1);
        this.queryOrdersData(type, parseInt(this.state.currentPage)+1);
    }

    LoadLessData() {
        if (1 == this.state.currentPage || this.state.isLoadingMore) {
            return ;
        }

        this.setState({
            isLoadingMore: true
        });
        let type = this.state.orderStatus == 1 ? "" : "type="+(this.state.orderStatus-1);
        this.queryOrdersData(type, parseInt(this.state.currentPage)-1);
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
            <ClickScope style = {styles.loadMoreView}
                onPress={() => this.LoadMoreData()}
            >
                <Text style = {styles.textStyle3}>
                    {loadingMoreContent}
                </Text>
            </ClickScope>
        );
    }

    pageHasDataRender() {
        return (
            <View style = {{flex: 1, backgroundColor: '#f0f0f0'}}>
                <ScrollView
                    onScrollEndDrag = {(event) => {
                        if (event.nativeEvent.contentOffset.y < -1) {
                            //console.log('zhangzhao_content', parseInt(event.nativeEvent.contentSize.height));
                            this.LoadLessData();
                        }
                    }}
                >
                    {this.orderListRender()}
                    {this.loadingMoreFooterRender()}
                </ScrollView>
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

const styles = StyleSheet.create({
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
    orderItemView: {
        marginTop: 10,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    orderItemTitleView: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        paddingHorizontal: 15
    },
    orderItemPriceView: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        paddingHorizontal: 15
    },
    contentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderItemBottomView: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        paddingRight: 15
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
    goodsItemView: {
        height: 90,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd'
    },
    loadMoreView: {
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    goodsNameView: {
        marginLeft: 10,
        width: 213
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
    }
});
