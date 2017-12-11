import React, {Component} from 'react';
import {
    Text
} from 'react-native';
import Header from './Header';
import CNClickScope from './ClickScope';

export default class HeaderRightButton extends Header {
    rightSideRender() {
        return (
            <CNClickScope
                onPress = {this.props.onRightPress}
                style = {{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}
            >
                <Text style = {{marginRight: 15, fontSize: 14, color: '#333333'}}>
                    {this.props.buttonName}
                </Text>
            </CNClickScope>
        );
    }
}
