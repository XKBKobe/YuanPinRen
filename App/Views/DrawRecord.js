import React, { Component } from 'react';
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

export default class DrawRecord extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: 'HASDATA'
        };
    }

    componentWillMount() {
        //查看提现记录
        requestData('/index/user/withdraw_cash_list', 'POST', '')
            .then((data) => {

            }, (error) => {

            });
    }

    headerRender() {
        return (
            <Header
                isLeft = {false}
                headerTitle = {'提现记录'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}