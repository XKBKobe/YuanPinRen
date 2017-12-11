import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    StyleSheet,
    Image,
    WebView,
    NativeModules,
    NativeAppEventEmitter,
    Alert
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import Header from '../Components/Header';

export default class WelcomeLogin extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <Header 
                    headerTitle = {''}
                    leftOnPress = {() => Actions.pop()}
                />
                <WebView 
                    style={{marginTop:2,height:350}}
                    source={{uri: this.props.url}}
                />
            </View>
        )
    }
}