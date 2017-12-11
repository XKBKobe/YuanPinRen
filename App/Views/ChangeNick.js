import React, { Component } from 'react';
import {
    View,
    Text,
    Platform,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Alert,
    NativeModules
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import { Actions, ActionConst } from 'react-native-router-flux';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import requestData from '../NetWork/request';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as MineActions from '../Reducer/Actions/MineActions';

const GetBasicInfo = NativeModules.GetBasicInfo;

class ChangeNick extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            verCode: "",
        }
        this.loginHandle = this.loginHandle.bind(this);
    }

    headerRender() {
        return (
            <Header
                headerTitle = {'昵称'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }


    loginHandle() {
        let phone = this.state.phoneNumber;
        if (!phone) {
            alert("请输入昵称!");
            return;
        }

        requestData('/index/User/update_data', 'POST', 'name=' + phone)
        .then((data) => {
            if (data.errno == 0) {
                this.props.MineActions.getUserInfo("");
                Actions.pop();
            } else {
                alert(data.errmsg);
            }

        });
    }

    pageHasDataRender() {
        return (
            <View style = {{flex: 1, backgroundColor: '#ffffff', flexDirection: 'column', alignItems: 'center'}}>
                <View style = {{height: 9, width: Dimensions.get('window').width, backgroundColor: '#f0f0f0'}}/>
                <View style = {{
                    flexDirection: 'column',
                    width: 345,
                    height: 45,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#eeeeee',
                    marginTop: 36,
                }}>
                    <View style = {{
                        flex: 1,
                        paddingLeft: 15,
                        paddingRight: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <TextInput
                            style = {{width: 240,padding:0}}
                            underlineColorAndroid={"transparent"}
                            placeholder={'请输入新昵称'}
                            onChange={(event) => {
                                this.setState({phoneNumber: event.nativeEvent.text})}
                            }
                            value={this.state.phoneNumber}
                        />
                    </View>
                </View>
                <ClickScope
                    style = {{
                        height: 44, width: 345,
                        borderRadius: 6, marginTop: 31,
                        backgroundColor: '#ff6700',
                        justifyContent: 'center', alignItems: 'center'
                    }}
                    onPress = {() => this.loginHandle()}
                >
                    <Text style = {{fontSize: 18, color: '#ffffff'}}>
                        确认修改
                    </Text>
                </ClickScope>
            </View>
        );
    }

    render() {
        return super.rootSceneRender('HASDATA');
    }
}

function mapStateToProps(state) {
    const {MineState} = state;

    return {
        MineState
    }
}

function mapDispatchToProps(dispatch) {
    return {
        MineActions: bindActionCreators(MineActions, dispatch)
    }
    // return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeNick);