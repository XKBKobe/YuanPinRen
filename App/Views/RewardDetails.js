import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ListView,
    Image,
    Dimensions,
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

const rebateType = ["分享奖励","开拓奖励","推荐奖励","退货扣款"]
export default class RewardDetails extends BaseComponent {
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
        this.goodsListRender = this.goodsListRender.bind(this);
        this.goodsItemRender = this.goodsItemRender.bind(this);
        this.loadingMoreFooterRender = this.loadingMoreFooterRender.bind(this);

        this.LoadMoreData = this.LoadMoreData.bind(this);

        this.gotoOrderDetailPage = this.gotoOrderDetailPage.bind(this);
    }

    componentWillMount() {
        this.queryOrdersData("");
    }

    queryOrdersData(type) {
        requestData('/index/User/rebate_list', "POST", type)
        .then((data) => {
            if (0 == data.errno) {
                if (0 == data.data.total) {
                    this.setState({pageStatus:"NODATA"});
                    return;
                }
                this.setState({
                    pageStatus: 'HASDATA',
                    listData: data.data.data,
                    totalPage: data.data.total
                });
            }else {
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA"});
            }
        }, (error) => {

        });
    }

    gotoOrderDetailPage(orderId) {
        Actions.OrderDetail({orderSn: orderId});
    }

    goodsItemRender(itemData, row) {
        return (
            <View style = {styles.goodsItemView}>
                <Image
                    style = {{height: 60, width: 60, borderWidth: 1, borderColor: '#dddddd'}}
                    source = {{uri: itemData.imgobj.url}}
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

    renderRewardItem(rebateInfo) {
        return rebateInfo.map(function(itemData, index){
            let title = rebateType[itemData.rebateType];
            return (
                <View key={index} style={{flex:1}}>
                    <Text style={{color:"#ffa700",fontSize:12,marginRight:10,textAlign:'right'}}>{title} ￥{itemData.rebateMoney}</Text>
                </View>
            )
        });
    }

    orderItemRender(itemData) {
        return (
            <ClickScope
                style = {styles.orderItemView}
            >
                <View style = {styles.orderItemTitleView}>
                    <Text style = {styles.textStyle1}>{itemData.createTime}</Text>
                    <Text style = {styles.textStyle2}>{itemData.orderStatus}</Text>
                </View>

                {this.goodsListRender(itemData.goodList)}

                <View style={{width:Dimensions.get('window').width,height:45,marginTop: -12,backgroundColor:"#fff"}}>
                    <View style={{marginTop:12,flexDirection:"row",flex:1}}>
                        <Text style={{color:"#ff6700",fontSize:12,marginLeft:10,flex:2,fontWeight:'bold'}}>购买者：{itemData.nickname}</Text>
                        {this.renderRewardItem(itemData.rebateInfo)}
                    </View>
                </View>
                <View style={{height:1,width:Dimensions.get('window').width,backgroundColor:"#eee"}}></View>
                
                <View style = {styles.orderItemPriceView}>
                    <Text style = {styles.textStyle1}>
                        共{itemData.goodsNum}件商品  应付总额：
                    </Text>
                    <Text style = {styles.textStyle3}>
                        ¥{itemData.orderCost}
                    </Text>
                </View>
            </ClickScope>
        );
    }

    orderListRender() {
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

    pageNoDataRender() {
        return (
            <View style = {styles.contentView}>
                <Text>目前还没有奖励</Text>
            </View>
        )
    }

    headerRender() {
        return (
            <View>
                <Header
                    headerTitle = {'奖励明细'}
                    leftOnPress = {() => Actions.pop()}
                />
            </View>
        );
    }

    LoadMoreData() {
        if (this.state.totalPage == this.state.currentPage || this.state.isLoadingMore) {
            return ;
        }

        this.setState({
            isLoadingMore: true
        });

        Request.orderDetail(this.state.orderStatus-1, this.state.currentPage+1, 10)
        .then((successData) => {
            this.setState({
                isLoadingMore: false,
                listData: this.state.listData.concat(successData.orderlist),
                currentPage: this.state.currentPage+1
            });
        });

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
            <View style = {styles.loadMoreView}>
                <Text style = {styles.textStyle3}>
                    {loadingMoreContent}
                </Text>
            </View>
        );
    }

    pageHasDataRender() {
        return (
            <View style = {{flex: 1, backgroundColor: '#f0f0f0'}}>
                <ScrollView
                    onScrollEndDrag = {(event) => {
                        // console.log('zhangzhao_dragEnd', event.nativeEvent);
                        // console.log('zhangzhao_content', parseInt(event.nativeEvent.contentSize.height));
                        // console.log('zhangzhao_offset', parseInt(event.nativeEvent.contentOffset.y));
                        // console.log('zhangzhao_layoutMeasurement', event.nativeEvent.layoutMeasurement.height);
                        if (parseInt(event.nativeEvent.contentSize.height) == (parseInt(event.nativeEvent.contentOffset.y)
                                + event.nativeEvent.layoutMeasurement.height)) {
                            this.LoadMoreData();
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
        borderBottomColor: '#eee'
    },
    goodsItemNormalView: {
        height: 90,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        padding: 15,
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
    },
    contentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
