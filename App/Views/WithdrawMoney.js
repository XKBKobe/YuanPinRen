import React, { Component } from 'react';
import {
    View,
    Text,
    Platform,
    StyleSheet,
    Image,
    TextInput,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import { Actions, ActionConst } from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import * as ImgSrc from '../Res/Images';
import * as WithdrawActions from '../Reducer/Actions/WithdrawActions';
import requestData from '../NetWork/request';

let {height, width} = Dimensions.get('window');
class WithdrawMoney extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: "LOADING",
            moneyText: "",
            clearButtonDisable:true,
        }
    }

    componentWillMount() {
        this.props.WithdrawActions.getWithdrawInfo();
        this.setState({pageStatus: "HASDATA"})
    }

    headerRender() {
        return (
            <Header
                headerTitle = {'我要提现'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    renderClearButton() {
        if (this.state.clearButtonDisable) {
            return <View></View>
        }else {
            return (
                <TouchableWithoutFeedback style={{marginLeft:201}}
                    onPress={() => this.setState({moneyText:"",clearButtonDisable:true})}
                >
                    <Image source={ImgSrc.WITHDRAW_CANCEL} style={{width:17,height:17,marginTop:30}}/>
                </TouchableWithoutFeedback>
            )
        }
    }

    pageHasDataRender() {
        return (
            <View style = {{flex: 1, backgroundColor: '#f0f0f0', flexDirection: 'column', alignItems: 'center'}}>
               <View style={{backgroundColor:"#ffffff",width:width,marginTop:11}}>
                    <ClickScope
                        style = {{ marginLeft:15,
                            height: 44, width: width-30,flexDirection:"row",
                            justifyContent: 'space-between',alignItems:"center"
                        }}
                        onPress={() => {Actions.ChangeBankCard()}}
                    >
                        <View style={{flexDirection:"row"}}>
                            {/*<Image source={ImgSrc.ZHAOSHANG_ICON} style={{width:26,height:26}}/>*/}
                            <View style={{flexDirection:"column",marginLeft:5}}>
                                <Text style = {{fontSize: 12, color: '#333'}}>
                                    {this.props.WithdrawState.bankName}
                                </Text>
                                <Text style={{fontSize:10,color:"#999",marginTop:3}}>
                                    银行卡号{this.props.WithdrawState.bankCardNo}
                                </Text>
                            </View>
                        </View>
                        <Image
                            style = {{ height: 14, width: 7}}
                            source = {ImgSrc.IC_RIGHT_ARROW}
                            resizeMode = {'stretch'}
                        />
                    </ClickScope>
                </View>
                <View style={{height:128,flexDirection:"column",backgroundColor:"#ffffff",marginTop:12,width:width}}>
                    <Text style={{marginTop:12,marginLeft:14,fontSize:14,color:"#333"}}>
                        提现金额
                    </Text>
                    <View style={{flexDirection:"row"}}>
                        <Text style={{marginLeft:14,marginTop:18,fontSize:30,color:"#333"}}>￥</Text>
                        <TextInput style={{height:42,fontSize:30,color:'#333',width:298,marginTop:19,padding:0}}
                            underlineColorAndroid="transparent"
                            onChange={(event) => {
                                if (event.nativeEvent.text.length > 0) {
                                    this.setState({clearButtonDisable: false})
                                }else {
                                    this.setState({clearButtonDisable: true})
                                }
                                this.setState({moneyText:event.nativeEvent.text})}
                            }
                            value={this.state.moneyText}
                            placeholder = "请输入提现金额"
                        />
                        {this.renderClearButton()}
                    </View>
                    <View style={{backgroundColor:"#eee",width:323,marginLeft:37,height:1}}/>
                    <View style={{marginTop:8,flexDirection:"row"}}>
                        <Text style={{marginLeft:35,color:"#999",fontSize:12}}>
                            可提金额：￥{this.props.withdrawMoney}
                        </Text>
                        <TouchableOpacity onPress={() => this.setState({moneyText:this.props.withdrawMoney})}>
                            <Text style={{fontSize:12,color:'#ff6700',marginLeft:176}}>全部</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ClickScope
                    style = {{
                        height: 44, width: 345,
                        borderRadius: 6, marginTop: 21,
                        backgroundColor: '#ff6700',
                        justifyContent: 'center', alignItems: 'center'
                    }}
                    onPress={() => {
                        requestData('/index/Crash/crash', "POST","crashMoney="+this.state.moneyText)
                        .then((data) => {
                            if (0 == data.errno) {
                                //提现成功
                                alert("提现申请已提交！");
                                Actions.pop();
                            }else {
                                alert(data.errmsg);
                            }
                        }, (error) => {

                        });
                    }}
                >
                    <Text style = {{fontSize: 18, color: '#ffffff'}}>
                            确认提现
                    </Text>
                </ClickScope>
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

function mapStateToProps(state) {
    const {WithdrawState} = state;
    return {
        WithdrawState
    }
}

function mapDispatchToProps(dispatch) {
    return {
        WithdrawActions: bindActionCreators(WithdrawActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawMoney);
