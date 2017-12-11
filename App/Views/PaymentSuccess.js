/*
 * Name: PaymentSuccess
 * Creator: ZhangZhao
 * Create Time: 2016-09-12
 * Instruction: 支付成功后页面
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    StyleSheet,
    Image,
    Platform,
    NativeModules
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from '../Components/BaseComponent';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import ButtonBar from '../Components/ButtonBar';
import * as ImgSrc from '../Res/Images';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as MineActions from '../Reducer/Actions/MineActions';
import requestData from '../NetWork/request';
import ImagePicker from 'react-native-image-picker';
import styles from '../Styles/PaymentSuccess'

export default class PaymentSuccess extends BaseComponent {
    constructor(props) {
        super(props);
    }
    headerRender() {
        return (
            <View>
                <Header
                    headerTitle = {'支付成功'}
                    leftOnPress = {() => Actions.pop()}
                />
            </View>
        );
    }

    pageHasDataRender() {
        return (
            <View style={styles.contentView}>
                <Image style={styles.imageStyle1} source={ImgSrc.PAYMENT_SUCCESS} />
                <Text style={styles.textStyle1}>
                    支付成功
                </Text>
                
            </View>
        );
    }

    render() {
       return super.rootSceneRender("HASDATA");
    }
}
