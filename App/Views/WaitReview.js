/*
 * Name:WaitReview
 * Creator: shenjiao
 * Create Time: 2017-06-01
 * Instruction: 审核中页面
 */

import React from "react";
import {View,Text,Image,TextInput,ScrollView,ListView,AsyncStorage,Platform}from "react-native";
import Dimensions from "Dimensions";
import BaseComponent from '../Components/BaseComponent';
import styles from '../Styles/PaymentSuccess';
import * as StringImgSrc from '../Res/Images';
import { Actions } from 'react-native-router-flux';
import Header from '../Components/Header';

export default class WaitReview extends BaseComponent {
    constructor(props) {
        super(props);
    }

    headerRender() {
        return (
            <View>
                <Header
                    headerTitle = {'审批中'}
                    leftOnPress = {() => Actions.pop()}
                />
            </View>
        );
    }

    pageHasDataRender() {
        return <View style={styles.contentView}>
                <Image style={{width:80,height:80}} source={StringImgSrc.REVIEW_WAIT} />
                <View style={{height:13}}></View>
                <View style={styles.barView1}>
                    <Text style={{fontSize:14,color:"#333"}}>该账号正在审核中...审核将于</Text>
                    <Text style={styles.textStyle3}>24h</Text>
                    <Text style={{fontSize:14,color:"#333"}}>内完成</Text>
                </View>
                <View style={{height:6}}></View>
                <View style={styles.barView2}>
                    <Text style={{fontSize:12,color:"#666"}}>如有疑问，请咨询客服：400-123-1234</Text>
                </View>
            </View>;
    }

    render() {
        return super.rootSceneRender("HASDATA");
    }
}