import React, { Component } from 'react';
import {
    View,
    Text,
    Platform,
    StyleSheet,
    Image,
    TextInput,
    WebView
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import { Actions, ActionConst } from 'react-native-router-flux';
import Header from '../Components/Header';

const LOAD_URL = 'https://eco-api.meiqia.com/dist/standalone.html?eid=75788';

export default class CustomerService extends BaseComponent {
    constructor(props) {
        super(props);
    }

    headerRender() {
        return (
            <Header
                headerTitle = {'源品客服'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    pageHasDataRender() {
        return (
            <WebView
                source = {{uri: LOAD_URL}}
                style = {{flex: 1}}
                domStorageEnabled = {true}
            />
        );
    }

    render() {
        return super.rootSceneRender('HASDATA');
    }
}
