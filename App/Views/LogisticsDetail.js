import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    StyleSheet,
    Image,
    ListView, Dimensions, Alert
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from "../Components/BaseComponent";
import Header from '../Components/Header';
import requestData from '../NetWork/request';
import {formatDate} from "../Utils/toolFunctions";

export default class logisticsDetail extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: 'HASDATA',
            data: []
        };

        this.listRender = this.listRender.bind(this);
        this.listItemRender = this.listItemRender.bind(this);
        this.timeLine = this.timeLine.bind(this);
        this.radiusSet = this.radiusSet.bind(this);
        this.status = this.status.bind(this);


    }

    componentWillMount() {
        //物流详情
        requestData('/index/Order/express_info', "POST", "shipNo=" + this.props.shipNo + "&shipId=" + this.props.shipId).then(data => {
            if(data.data.data && data.data.data.length > 0){
                this.setState({
                    pageStatus: 'HASDATA',
                    data: data.data
                });
            }else {
                this.setState({
                    pageStatus: "NODATA",
                    data: []
                });
            }
        }, err => {
            console.log('info  ' + err);
        });
    }

    headerRender() {
        return (
            <Header
                isLeft={false}
                headerTitle={'物流详情'}
                leftOnPress={() => Actions.pop()}
            />
        );
    }


    pageNoDataRender() {
        return (
            <View style={styles.contentView}>
                <Text>您还没有物流信息！</Text>
            </View>
        );
    }

    pageHasDataRender() {
        if(this.state.data.data && this.state.data.data.length > 0){
            return (
                <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
                    <ScrollView style={{height: Dimensions.get('window').height}}>
                        <View style={{backgroundColor: '#ffffff', marginTop: 10, paddingLeft: 15}}>
                            <View style={{flexDirection: 'row', height: 40, alignItems: 'center'}}>
                                <Text>配送方式：</Text>
                                <Text style={{color: '#999999'}}>EMS</Text>
                            </View>
                            <View style={{flexDirection: 'row', height: 20, alignItems: 'center'}}>
                                <Text>物流单号：</Text>
                                <Text style={{color: '#999999'}}>{this.state.data.nu}</Text>
                            </View>
                            <View style={{flexDirection: 'row', height: 40, alignItems: 'center'}}>
                                <Text>物流状态：</Text>
                                {this.status(this.state.data.state)}
                            </View>
                        </View>
                        <Text style={{
                            height: 40,
                            paddingLeft: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 40,
                            marginTop: 10,
                            fontSize: 15,
                            flexDirection: 'row',
                            backgroundColor: '#ffffff'
                        }}>订单跟踪</Text>
                        {this.listRender()}
                    </ScrollView>
                </View>
            );

        }
    }


    status(status){
       let statusText = status == 3?'已收货':'配送中';
       return(
           <Text style={{color: '#999999'}}>{statusText}</Text>
       )
    }

    listRender() {
        if (!this.state.data.data || this.state.data.data.length < 1) {
            return;
        }
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View style={{backgroundColor: '#ffffff'}}>
                <ListView
                    dataSource={ds.cloneWithRows(this.state.data.data)}
                    renderRow={this.listItemRender}
                />
            </View>
        );
    }


    listItemRender(itemData, sectionId, rowId) {
        return (
            <View style={{height: 70, marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', position: 'relative'}}>
                <View style={{
                    marginLeft: 46, marginRight: 10, borderBottomWidth: 1, width: Dimensions.get('window').width - 46,
                    borderBottomColor: '#dddddd', paddingTop: 3
                }}>
                    <Text>{itemData.context}</Text>
                    <Text style={{color: '#999999', paddingTop: 5}}>{itemData.time}</Text>
                </View>
                {this.radiusSet(rowId)}
                {this.timeLine(rowId)}
            </View>
        );
    }

    radiusSet(rowId) {
        let len = this.state.data.data.length;
        if (len > 0 && rowId == 0) {
            return (
                <View style={styles.radiusSetHigh}></View>
            )
        }
        return (
            <View style={styles.radiusSet}></View>
        )
    }

    timeLine(rowId) {
        let len = this.state.data.data.length;
        if (len > 0 && len - 1 == rowId) {
            return null;
        } else {
            if(len > 0 &&rowId == 0){
                return (
                    <View style={styles.lineNormalHigh}></View>
                )
            }else{
                return (
                    <View style={styles.lineNormal}></View>
                )
            }
        }
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}


const styles = StyleSheet.create({
    radiusSet: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#999999',
        left: 15,
        top: 3,
        position: 'absolute'
    },
    radiusSetHigh: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#ff6700',
        left: 15,
        top: 3,
        position: 'absolute'
    },
    lineNormal: {
        width: 1,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#999999',
        left: 23,
        top: 14,
        position: 'absolute'
    },
    lineNormalHigh: {
        width: 1,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#ff6700',
        left: 23,
        top: 14,
        position: 'absolute'
    },
});
