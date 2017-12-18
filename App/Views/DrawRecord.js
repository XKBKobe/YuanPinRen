import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    StyleSheet,
    Image,
    ListView, Dimensions
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from "../Components/BaseComponent";
import Header from '../Components/Header';
import requestData from '../NetWork/request';
import {formatDate} from "../Utils/toolFunctions";
import ClickScope from '../Components/ClickScope';
import * as ImgSrc from '../Res/Images';


export default class DrawRecord extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: 'HASDATA',
            isLoadingMore: false,
            listData: [],
            totalPage: 0,
            currentPage: 1,
        };

        this.orderItemRender = this.orderItemRender.bind(this);
        this.drawTime = this.drawTime.bind(this);
        this.drawState = this.drawState.bind(this);

    }

    componentWillMount() {
        this.queryDrawList();
    }

    queryDrawList(page) {
        if (!page) {
            page = 1;
        }
        //查看提现记录
        requestData('/index/user/withdraw_cash_list', 'POST', "page=" + page + "&pageSize=20")
            .then((data) => {
                if (0 == data.errno) {
                    if (0 == data.data.total) {
                        this.setState({pageStatus: "NODATA", isLoadingMore: false});
                        return;
                    }
                    this.setState({
                        pageStatus: 'HASDATA',
                        isLoadingMore: false,
                        listData: data.data.data,
                        totalPage: parseInt(data.data.total) / 20 < 1 ? 1 : Math.ceil(parseInt(data.data.total) / 20),
                        currentPage: data.data.current_page
                    });
                } else {
                    alert(data.errmsg);
                    this.setState({pageStatus: "NODATA", isLoadingMore: false});
                }
            }, (error) => {

            });
    }

    headerRender() {
        return (
            <Header
                isLeft={false}
                headerTitle={'提现记录'}
                leftOnPress={() => Actions.pop()}
            />
        );
    }

    pageHasDataRender() {
        return (
            <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
                <ScrollView
                    onScrollEndDrag={(event) => {
                        if (event.nativeEvent.contentOffset.y < -1) {
                            this.LoadLessData();
                        }
                    }}
                >
                    <View style={{flexDirection: 'row', flex: 1, height: 30}}>
                        <Text style={{flex: 1, paddingLeft: 5, alignSelf: 'center', color: '#696969'}}>收款账户/提交日期</Text>
                        <Text style={{
                            flex: 1,
                            textAlign: 'right',
                            paddingRight: 5,
                            alignSelf: 'center',
                            color: '#808080'
                        }}>金额（元）/状态</Text>
                    </View>
                    {this.drawListRender()}
                    {this.loadingMoreFooterRender()}
                </ScrollView>
            </View>
        )
    }

    drawListRender() {
        if (!this.state.listData || this.state.listData.length < 1) {
            return;
        }
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View>
                <ListView
                    dataSource={ds.cloneWithRows(this.state.listData)}
                    renderRow={this.orderItemRender}
                />
            </View>
        );
    }

    orderItemRender(itemData) {
        return (
            <View style={{backgroundColor: '#ffffff'}}>

                <ClickScope style={{flex: 1, flexDirection: 'row', padding: 10, position: 'relative'}} onPress={() => {
                    Actions.DrawRecordDetail({detail: itemData})
                }}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text>{itemData.bankName}</Text>
                        <Text style={{
                            fontSize: 12,
                            paddingTop: 3
                        }}>{this.drawTime(itemData.successTime * 1000, itemData.addTime * 1000, itemData.withdrawStatus)}</Text>
                    </View>

                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end', marginRight: 20}}>
                        <Text>¥{itemData.withdrawMoney}</Text>
                        <Text style={{fontSize: 12, paddingTop: 4}}>{this.drawState(this.state.withdrawStatus)}</Text>
                    </View>
                    <Image
                        style={{height: 14, width: 7, position: 'absolute', top: 18, right: 10}}
                        source={ImgSrc.IC_RIGHT_ARROW}
                        resizeMode={'stretch'}
                    />
                </ClickScope>
            </View>
        );
    }

    drawTime(successTime, addTime, type) {
        if (type == 3) {
            return formatDate(successTime)
        } else {
            return formatDate(addTime)
        }
    }

    drawState(type) {
        //   3（提现状态 1 提现申请中  2 提现失败  3 提现成功）,
        let typeText;
        switch (type) {
            case 1:
                typeText = '提现申请中';
                break;
            case 2:
                typeText = '提现失败';
                break;
            default:
                typeText = '提现成功';
        }
        return typeText;
    }


    //下拉刷新
    LoadLessData() {
        if (1 == this.state.currentPage || this.state.isLoadingMore) {
            return;
        }

        this.setState({
            isLoadingMore: true
        });
        this.queryDrawList(parseInt(this.state.currentPage) - 1);
    }

    LoadMoreData() {
        if (this.state.totalPage == this.state.currentPage || this.state.isLoadingMore) {
            return;
        }

        this.setState({
            isLoadingMore: true
        });

        this.queryDrawList(parseInt(this.state.currentPage) + 1);
    }


    //上拉加载
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
            <ClickScope style={styles.loadMoreView}
                        onPress={() => this.LoadMoreData()}
            >
                <Text style={styles.textStyle3}>
                    {loadingMoreContent}
                </Text>
            </ClickScope>
        );
    }

    pageNoDataRender() {
        return (
            <View style={styles.contentView}>
                <Text>您还没有提现信息！</Text>
            </View>
        );
    }


    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}


const styles = StyleSheet.create({
    contentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
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
    textStyle3: {
        fontSize: 12,
        color: '#ff6700'
    },
});