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

export default class BuyWindow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style = {styles.popWindowRootView}>
                <View style = {styles.popWindowShadeView}/>
                <View style = {styles.popWindowShowViewModal}>
                    <View style = {styles.titleView}>
                        <Text style = {{fontSize: 14, color: '#333333'}}>
                            购买
                        </Text>
                        <ClickScope
                            style = {{height: 44, width: 44, flexDirection: 'row', alignItems:'center', justifyContent: 'flex-end',paddingRight: 19}}
                            onPress = {this.props.buyWindowCloseHandle}
                        >
                            <Image
                                style = {{width: 12, height: 12}}
                                source = {ImgSrc.IC_CROSS}
                            />
                        </ClickScope>
                    </View>
                    <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15}}>
                        <Text style = {{fontSize: 14, color: '#333333'}}>
                            选择数量
                        </Text>
                        <View style = {{flexDirection: 'row'}}>
                            <ClickScope
                                style = {{
                                    height: 28,
                                    width: 28,
                                    borderWidth: 1,
                                    borderColor: '#cccccc',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress = {this.props.minuseHandle}
                            >
                                <Text style = {{fontSize: 14, color: '#333333'}}>
                                    -
                                </Text>
                            </ClickScope>
                            <View
                                style = {{
                                    height: 28,
                                    width: 42,
                                    borderTopWidth: 1,
                                    borderTopColor: '#cccccc',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#cccccc',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style = {{fontSize: 14, color: '#333333'}}>
                                    {this.props.buyGoodsNumber}
                                </Text>
                            </View>
                            <ClickScope
                                style = {{
                                    height: 28,
                                    width: 28,
                                    borderWidth: 1,
                                    borderColor: '#cccccc',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress = {this.props.plusHandle}
                            >
                                <Text style = {{fontSize: 14, color: '#333333'}}>
                                    +
                                </Text>
                            </ClickScope>
                        </View>
                    </View>
                    <View style = {{height: 44, flexDirection: 'row'}}>
                        <ClickScope
                            style = {{flex: 1, backgroundColor: '#ffa700', justifyContent: 'center', alignItems: 'center'}}
                            onPress = {this.props.addToCartHandle}
                        >
                            <Text
                                style = {{fontSize: 16, color: '#ffffff'}}
                            >
                                加入购物车
                            </Text>
                        </ClickScope>
                        <ClickScope
                            style = {{flex: 1, backgroundColor: '#ff6700', justifyContent: 'center', alignItems: 'center'}}
                            onPress = {this.props.buyImmediatelyHandle}
                        >
                            <Text
                                style = {{fontSize: 16, color: '#ffffff'}}
                            >
                                立即下单
                            </Text>
                        </ClickScope>
                    </View>
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
