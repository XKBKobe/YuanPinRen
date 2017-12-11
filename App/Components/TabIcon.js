import React, { Component } from 'react';
import {
    View,
    Image,
} from 'react-native';

import * as ImgSrc from '../Res/Images';

export default class TabIcon extends Component {
    render() {
        var tabIcon;

        switch (this.props.sign) {
            case 'institution':
                if (this.props.selected) {
                    tabIcon = ImgSrc.TAB_INSTITUTION_CH;
                } else {
                    tabIcon = ImgSrc.TAB_INSTITUTION;
                }
                break;
            case 'share':
                if (this.props.selected) {
                    tabIcon = ImgSrc.TAB_SHARE_CH;
                } else {
                    tabIcon = ImgSrc.TAB_SHARE;
                }
                break;
            case 'mine':
                if (this.props.selected) {
                    tabIcon = ImgSrc.TAB_MINE_CH;
                } else {
                    tabIcon = ImgSrc.TAB_MINE;
                }
                break;
            default:
                tabIcon = ImgSrc.TAB_MINE;
        }

        if (this.props.sign == 'institution') {
            return (
                <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        resizeMode = {'stretch'}
                        style = {{width: 30, height: 38}}
                        source = {tabIcon}
                    />
                </View>
            );
        } else if (this.props.sign == 'share') {
            return (
                <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        resizeMode = {'stretch'}
                        style = {{width: 42, height: 38}}
                        source = {tabIcon}
                    />
                </View>
            );
        } else {
            return (
                <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        resizeMode = {'stretch'}
                        style = {{width: 22, height: 38}}
                        source = {tabIcon}
                    />
                </View>
            );
        }


    }
}
