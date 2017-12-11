/**
 * @Name: BaseComponent
 * @Description: 通用页面组件
 * @Author: ZhangZhao
 * @GitHub: https://github.com/Victor880829
 * @Create: 2016-12-13
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

export default class BaseComponent extends Component {
    constructor(props) {
        super(props);

        this.headerRender = this.headerRender.bind(this);
        this.contentRender = this.contentRender.bind(this);

        this.pageLoadingRender = this.pageLoadingRender.bind(this);
        this.pageErrorRender = this.pageErrorRender.bind(this);
        this.pageNoDataRender = this.pageNoDataRender.bind(this);
        this.pageHasDataRender = this.pageHasDataRender.bind(this);
        this.pageNoNetWork = this.pageNoNetWork.bind(this);
    }

    //abstract function
    headerRender() {

    }

    pageLoadingRender() {
        return (
            <View style = {styles.contentView}>
                <ActivityIndicator
                    size = {'large'}
                    color = {'#ff6700'}
                />
            </View>
        );
    }

    //abstract function
    pageHasDataRender() {
        return (
            <View style = {styles.contentView}>
                <Text>Has data</Text>
            </View>
        );
    }

    pageNoDataRender() {
        return (
            <View style = {styles.contentView}>
                <Text>没有数据！</Text>
            </View>
        );
    }

    pageErrorRender() {

    }

    pageNoNetWork() {

    }

    contentRender(pageStatus) {
        switch(pageStatus) {
            case 'LOADING':
                return this.pageLoadingRender();
            case 'HASDATA':
                return this.pageHasDataRender();
            case 'NODATA':
                return this.pageNoDataRender();
            case 'ERROR':
                return this.pageErrorRender();
            case 'NONETWORK':
                return this.pageErrorRender();
            default:
                return ;
        }
    }

    rootSceneRender(pageStatus) {
        return (
            <View style = {styles.rootView}>
                {this.headerRender()}
                {this.contentRender(pageStatus)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection: 'column',
    },
    contentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
