/**
 * @Name: Header
 * @Description: 通用Header
 * @Author: ZhangZhao
 * @GitHub: https://github.com/Victor880829
 * @Create: 2016-12-13
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    StyleSheet
} from 'react-native';
import ClickScope from './ClickScope';
import * as ImgSrc from '../Res/Images';

export default class Header extends Component {
    static defaultProps = {
        headerBackgroundColor: '#ffffff',
        headerTitle: '页面名称'
    };

    constructor(props) {
        super(props);

        this.leftSideRender = this.leftSideRender.bind(this);
        this.rightSideRender = this.rightSideRender.bind(this);
    }

    leftSideRender() {
        if (this.props.isLeft) {
            return (<View></View>)
        }
        return (
            <View style = {styles.leftSideView}>
                <Image
                    style = {{height: 20, width: 10, marginLeft: 15}}
                    source = {ImgSrc.TITLE_LEFT_ARROW}
                    resizeMode = {'stretch'}
                />
            </View>
        );
    }

    rightSideRender(isIntro) {
        return (
            <View>
            </View>
        );
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <View style = {{flexDirection: 'column'}}>
                    <View style = {{height: 20, backgroundColor: this.props.headerBackgroundColor}}/>
                    <View style = {[styles.headerContainer, {height: 44, backgroundColor: this.props.headerBackgroundColor}]}>
                        <ClickScope
                            onPress = {this.props.leftOnPress}
                            style = {styles.headerSideContainer}
                        >
                            {this.leftSideRender()}
                        </ClickScope>

                        <ClickScope
                            style = {styles.headerCenterContainer}
                            onPress = {this.props.centerOnPress}
                        >
                            <Text style = {styles.headerTitleText}>
                                {this.props.headerTitle}
                            </Text>
                        </ClickScope>

                        <ClickScope
                            style = {styles.headerSideContainer}
                            onPress = {this.props.rightOnPress}
                        >
                            {this.rightSideRender(this.props.isIntro)}
                        </ClickScope>
                    </View>
                </View>
            );
        } else {
            return (
                <View style = {[styles.headerContainer, {height: 44, backgroundColor: this.props.headerBackgroundColor}]}>
                    <ClickScope
                        onPress = {this.props.leftOnPress}
                        style = {styles.headerSideContainer}
                    >
                        {this.leftSideRender()}
                    </ClickScope>

                    <ClickScope
                        onPress = {this.props.centerOnPress}
                        style = {styles.headerCenterContainer}
                    >
                        <Text style = {styles.headerTitleText}>
                            {this.props.headerTitle}
                        </Text>
                    </ClickScope>

                    <ClickScope
                        style = {styles.headerSideContainer}
                        onPress = {this.props.rightOnPress}
                    >
                        {this.rightSideRender()}
                    </ClickScope>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd'
    },
    headerSideContainer: {
        flex: 1
    },
    headerCenterContainer: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleText: {
        fontSize: 18,
        color: '#333333'
    },
    leftSideView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    }
});
