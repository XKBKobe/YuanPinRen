import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';

import * as ImgSrc from '../../Res/Images';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';

export default class AddressBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {addressData} = this.props;

        if (null != addressData.addressId) {
            return (
                <TouchableOpacity
                    style = {styles.haveAddressView}
                    onPress = {() => Actions.ChooseAddress()}
                >
                    <View style = {styles.messageView}>
                        <View style = {styles.nameAndPhoneView}>
                            <Text style = {{fontSize: 14, color: '#333333'}}>{addressData.consignee}</Text>
                            <Text style = {{fontSize: 14, color: '#333333'}}>{addressData.mobile}</Text>
                        </View>

                        <View style = {styles.addressView}>
                            <Text
                                style = {{fontSize: 14, color: '#333333'}}
                                numberOfLines = {2}
                            >
                                {addressData.province + '省 '}{addressData.city + ' '}{addressData.district + ' '}{addressData.address}
                            </Text>
                        </View>
                    </View>

                    <View style = {styles.arrowView}>
                        <Image
                            style = {{height: 14, width: 7}}
                            source = {ImgSrc.IC_RIGHT_ARROW}
                            resizeMode = {'stretch'}
                        />
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style = {styles.noAddressView}
                    onPress = {() => Actions.ChooseAddress()}
                >
                    <Image
                        style = {{height: 22, width: 22}}
                        source = {ImgSrc.IC_ADD_ADDRESS}
                    />
                    <Text style = {{fontSize: 14, color: '#ff6700', marginLeft: 10}}>
                        点击添加收货地址信息
                    </Text>
                </TouchableOpacity>
            )
        }
    }
}

const styles = StyleSheet.create({
    haveAddressView: {
        height: 90,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        flexDirection: 'row',
    },
    noAddressView: {
        height: 44,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageView: {
        flex: 10,
        flexDirection: 'column'
    },
    arrowView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameAndPhoneView: {
        flex: 1,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    addressView: {
        flex: 1,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
