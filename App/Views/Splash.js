
import React, { Component } from 'react';
import {
    View,
    Text,
    NativeModules
} from 'react-native';
import {
    ActionConst,
    Actions
} from 'react-native-router-flux';
import Request from '../NetWork/request';

const GetBasicInfo = NativeModules.GetBasicInfo;

export default class Splash extends Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        var status = await GetBasicInfo.getLoginStatus();

        setTimeout(() => {
            if (status == 'true') {
                Actions.tabbar({type: ActionConst.RESET});
            } else {
                Actions.WelcomeLogin({type: ActionConst.REPLACE});
            }
        }, 2);
    }

    render() {
        return (
            <View
                style = {{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text>
                    Splash
                </Text>
            </View>
        );
    }
}
