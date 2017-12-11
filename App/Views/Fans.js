import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    StyleSheet,
    Image,
    ListView
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from '../Components/BaseComponent';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import requestData from '../NetWork/request';

export default class Fans extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            fanInfo:null,
            total: 0,
        }

        this.renderFansItem = this.renderFansItem.bind(this);
    }

    componentWillMount() {
        requestData('/index/User/follow_list', "POST", "")
        .then((data) => {
            if (0 == data.errno) {
                 if (0 == data.data.total) {this.setState({pageStatus: 'NODATA'});return;}
                 this.setState({pageStatus: 'HASDATA',fanInfo: data.data.data,total:data.data.total});
            }else {
                this.setState({pageStatus: 'NODATA'});
                alert(data.errmsg);
            }
        }, (error) => {

        });
    }

    headerRender() {
        return (
            <Header
                headerTitle = {'粉丝（'+this.state.total+'）'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    renderFansItem(itemData) {
        return (
            <View style = {{flexDirection: 'row', height: 72, backgroundColor: '#ffffff', marginTop: 1}}>
                <View style = {{flex: 1, flexDirection: 'row'}}>
                    <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15}}>
                        <Image
                            style = {{width: 50, height: 50, borderRadius: 100}}
                            source = {{uri: itemData.avatar.url}}
                        />
                    </View>
                    <View style = {{flex: 1.5, flexDirection: 'column', justifyContent: 'center'}}>
                        <Text style = {{fontSize: 14, color: '#333333'}}>
                            {itemData.nickName}
                        </Text>
                        {/*<Text style = {{fontSize: 10, color: '#666666', marginTop: 1}}>
                            {itemData.location}
                        </Text>*/}
                    </View>
                </View>
                <View style = {{flex: 1, flexDirection: 'column'}}>
                    <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style = {{fontSize: 10, color: '#666666'}}>
                            累计购买次数：
                        </Text>
                        <Text style = {{fontSize: 10, color: '#ff6700'}}>
                            {itemData.buyCount}
                        </Text>
                        <Text style = {{fontSize: 10, color: '#666666'}}>
                            次
                        </Text>
                    </View>
                    <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style = {{fontSize: 10, color: '#666666'}}>
                            累计奖励：
                        </Text>
                        <Text style = {{fontSize: 10, color: '#ffa700'}}>
                            {itemData.sum}
                        </Text>
                        <Text style = {{fontSize: 10, color: '#666666'}}>
                            元
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    pageNoDataRender() {
        return (
            <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>目前还没有粉丝</Text>
            </View>
        );
    }

    pageHasDataRender() {
        if (!this.state.fanInfo) {return <View></View>}
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View style = {{flex: 1, flexDirection: 'column', backgroundColor: '#f0f0f0'}}>
                <ListView
                    style = {{marginTop: 10}}
                    dataSource = {ds.cloneWithRows(this.state.fanInfo)}
                    renderRow = {this.renderFansItem}
                />
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}
