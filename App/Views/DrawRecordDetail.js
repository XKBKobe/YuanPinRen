import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    StyleSheet,
    Image,
    ListView, Dimensions, Alert
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from "../Components/BaseComponent";
import Header from '../Components/Header';
import requestData from '../NetWork/request';
import {formatMonthDate,formatFullDate} from "../Utils/toolFunctions";
import ClickScope from '../Components/ClickScope';

export default class DrawRecordDetail extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: 'HASDATA',
            detail: this.props.detail
        };

        this.drawState = this.drawState.bind(this);

    }

    componentWillMount() {

        console.log('detail' + JSON.stringify(this.state.detail))
        //物流详情

    }

    headerRender() {
        return (
            <Header
                isLeft={false}
                headerTitle={'提现记录详情'}
                leftOnPress={() => Actions.pop()}
            />
        );
    }


    pageNoDataRender() {
        return (
            <View style={styles.contentView}>
                <Text>您还没有提现记录信息！</Text>
            </View>
        );
    }

    pageHasDataRender() {
        return (
            <View style={styles.contentView}>
                <View style={{height: 100, backgroundColor: '#ffffff', paddingTop: 10, paddingLeft: 10}}>
                    <Text style={{paddingTop: 6,color:'#808080'}}>{this.drawState(this.state.detail.withdrawStatus)}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize: 40,paddingTop:5}}>-{this.state.detail.withdrawMoney}</Text>
                        <Text style={{paddingTop:30}}>元</Text>
                    </View>
                </View>

                <View style={{backgroundColor: '#ffffff', marginTop: 10,height:90,flexDirection:'row',paddingTop:20,position:'relative',borderBottomWidth: 1,
                    borderBottomColor: '#dddddd'}}>
                    <View style={{flex:1,alignItems:'center'}}>
                        <View style={{width:14,height:14,marginBottom:5,borderRadius:7,backgroundColor:'#ff6700'}}></View>
                        <Text sytle={{marginBottom:5,color:'#808080'}}>已提交</Text>
                        <Text style={{color:'#808080'}}>{formatMonthDate(this.state.detail.addTime *1000)}</Text>
                    </View>
                    <View style={{flex:1,alignItems:'center'}}>
                        <View style={{width:14,height:14,marginBottom:5,borderRadius:7,backgroundColor:'#ff6700'}}></View>
                        <Text sytle={{color:'#808080'}}>已审核</Text>
                    </View>
                    <View style={{flex:1,alignItems:'center'}}>
                        <View style={{width:16,height:16,marginBottom:5,borderRadius:8,backgroundColor:'#ff6700'}}></View>
                        <Text sytle={{color:'#808080'}}>已转账</Text>
                    </View>
                    <View style={{position:'absolute',width:Dimensions.get('window').width/6 *4,height:1,backgroundColor:'#ff6700',top:26,left: Dimensions.get('window').width/6}}></View>
                </View>


                <View style={{backgroundColor:'#ffffff',padding:10}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.listHeader}>流水号</Text>
                        <Text style={styles.listDetail}>{this.state.detail.withdrawId}</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.listHeader}>名称</Text>
                        <Text style={styles.listDetail}>现金余额-提现</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.listHeader}>日期</Text>
                        <Text style={styles.listDetail}>{formatFullDate(this.state.detail.successTime * 1000)}</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.listHeader}>类型</Text>
                        <Text style={styles.listDetail}>提现</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.listHeader}>收款银行卡</Text>
                        <Text style={styles.listDetail}>{this.state.detail.bankName}(***{this.state.detail.bankCardNo.slice(-2)})</Text>
                    </View>
                </View>
            </View>
        );

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



    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}


const styles = StyleSheet.create({
    contentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8'
    },
    listHeader:{
        paddingTop: 10,
        flex:1,
        color:'#808080'
    },
    listDetail:{
        paddingTop: 10,
        alignItems:'flex-end',
        flex:2,
        fontSize:16
    }
});