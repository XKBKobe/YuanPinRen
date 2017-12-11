import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    NativeModules
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import ClickScope from '../ClickScope';
import * as ImgSrc from '../../Res/Images';

const GetBasicInfo = NativeModules.GetBasicInfo;
export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWechatInstall: false
        }
    }

    componentWillMount() {
        this.setWechatState();
    }

    async setWechatState() {
        let result =  await GetBasicInfo.isWechatInstall();
        this.setState({isWechatInstall: result == "fail" ? false : true});
    }

    render() {
        return (
            <View
                style = {styles.footerView}
            >
                <View style = {styles.leftView}>
                    <ClickScope
                        style = {styles.service}
                        onPress = {() => {Actions.CustomerService()}}
                    >
                        <Image
                            style = {styles.imageStyle}
                            source = {ImgSrc.IC_GOODSDETAIL_SERVICE}
                        />
                    </ClickScope>

                    <ClickScope
                        style = {styles.shoppingCart}
                        onPress = {() => Actions.ShoppingCart()}
                    >
                        <Image
                            style = {styles.imageStyle}
                            source = {ImgSrc.IC_GOODSDETAIL_CART}
                        />
                        <View
                            style = {styles.shoppingCartNumView}
                        >
                            <Text style = {styles.shoppingCartNumText}>
                                {parseInt(this.props.cartGoodsNum)}
                            </Text>
                        </View>
                    </ClickScope>
                </View>

                <View style = {styles.rightView}>
                    {this.renderShareIcon()}       
                    <ClickScope
                        style = {styles.buyNow}
                        onPress = {this.props.buyImmediatelyClick}
                    >
                        <Text style = {styles.textStyle}>
                            立即购买
                        </Text>
                    </ClickScope>
                </View>
            </View>
        );
    }

    renderShareIcon() {
        if (this.state.isWechatInstall) {
            return (
                 <ClickScope
                        style = {styles.addShoppingCart}
                        onPress = {this.props.addToCartClick}
                    >
                        <Text style = {styles.textStyle}>
                            立即分享
                        </Text>
                    </ClickScope>
            )
        }
        return (<View></View>)
    }
}

const styles = StyleSheet.create({
    footerView: {
        height: 44,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        borderTopColor: '#dddddd',
        borderTopWidth: 1
    },
    leftView: {
        flex: 9,
        flexDirection: 'row',
    },
    rightView: {
        flex: 16,
        flexDirection: 'row',
    },
    addShoppingCart: {
        flex: 1.01,
        backgroundColor: '#ffa700',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyNow: {
        flex: 1,
        backgroundColor: '#ff6700',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    service: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shoppingCart: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shoppingCartNumView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#ff6700',
        height: 15,
        width: 15,
        top: 2.5,
        right: 15
    },
    shoppingCartNumText: {
        fontSize: 10,
        color: '#ff6700'
    },
    textStyle: {
        fontSize: 16,
        color: '#ffffff'
    },
    imageStyle: {
        height: 32,
        width: 30
    }
});
