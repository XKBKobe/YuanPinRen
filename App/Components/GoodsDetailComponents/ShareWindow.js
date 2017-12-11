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
import ClickScope from '../ClickScope';

export default class ShareWindow extends Component {
    constructor(props) {
        super(props);
    }

    renderMoneyView(money) {
        var checkImage;
        
        if (this.props.checkCoupon) {
            checkImage = ImgSrc.CHECK_GREEN;
        } else {
            checkImage = ImgSrc.CHECK_NULL;
        }
        if (this.props.hasCoupon == 1 ) {return <View></View>}
        return (
            <View style = {{flex:1,flexDirection:'row'}}>
                <ClickScope
                    style = {{flex:1, flexDirection:'row',alignItems:'center',paddingLeft:15}}
                    onPress = {this.props.checkBoxClickHandle}
                >
                    <Image
                        style = {{width: 16, height: 16}}
                        source = {checkImage}
                    />
                </ClickScope>
                <View style = {{flex: 9, flexDirection:'row',alignItems:'center'}}>
                    <Text style = {{fontSize: 14, color: '#333333'}}>
                        赠送一张
                    </Text>
                    <Text style = {{fontSize: 14, color: '#ff6700'}}>
                    {money}
                    </Text>
                    <Text style = {{fontSize: 14, color: '#333333'}}>
                        优惠券给TA
                    </Text>
                    {/* <Text style = {{fontSize: 10, color: '#dddddd'}}>
                        (本月剩余{this.props.couponCount}次)
                    </Text> */}
                </View>
            </View>
        )
    }

    render() {
        var checkImage;

        if (this.props.checkCoupon) {
            checkImage = ImgSrc.CHECK_GREEN;
        } else {
            checkImage = ImgSrc.CHECK_NULL;
        }
     
        let money = this.props.discount;
        if (this.props.type == 1) {
            money += "折";
        }else {
            money += "元";
        }
        let self = this;
        return (
            <View style = {styles.popWindowRootView}>
                <View style = {styles.popWindowShadeView}/>

                <View style = {styles.popWindowShowViewModal}>
                    <View style = {styles.titleView}>
                        <Text style = {{fontSize: 14, color: '#333333'}}>
                            分享到
                        </Text>
                        <ClickScope
                            style = {{height: 44, width: 44, flexDirection: 'row', alignItems:'center', justifyContent: 'flex-end',paddingRight: 19}}
                            onPress = {this.props.shareWindowCloseHandle}
                        >
                            <Image
                                style = {{width: 12, height: 12}}
                                source = {ImgSrc.IC_CROSS}
                            />
                        </ClickScope>
                    </View>

                    <View style = {{height:108,borderBottomColor:'#f0f0f0',borderBottomWidth:1,flexDirection:'row'}}>
                        <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <ClickScope
                                onPress = {this.props.wechatClickHandle}
                            >
                                <Image
                                    style = {{height: 70, width: 50}}
                                    source = {ImgSrc.IC_WECHAT_FRIEND}
                                    resizeMode = {'stretch'}
                                />
                            </ClickScope>
                        </View>
                        <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <ClickScope
                                onPress = {this.props.circleClickHandle}
                            >
                                <Image
                                    style = {{height: 70, width: 50}}
                                    source = {ImgSrc.IC_CIRCLE}
                                    resizeMode = {'stretch'}
                                />
                            </ClickScope>
                        </View>
                    </View>
                    {self.renderMoneyView(money)}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    popWindowRootView: {
        flex: 1,
        flexDirection: 'column',
    },
    popWindowShadeView: {
        flex: 1,
        backgroundColor: '#000000',
        opacity: 0.3
    },
    popWindowShowViewModal: {
        height: 196,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
    },
    titleView: {
        height: 44,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
