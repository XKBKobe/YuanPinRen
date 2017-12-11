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

export default class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var arrowImg = ImgSrc.IC_DOWN_ARROW;

        if (this.props.isShowPayDetail) {
            arrowImg = ImgSrc.IC_UP_ARROW;
        }

        return (
            <View style = {styles.footerView}>
                <View style = {styles.leftView}>
                    <View style = {styles.commonView}>
                        <Text style = {styles.textStyle1}>
                            总计：
                        </Text>
                        <Text style = {styles.textStyle2}>
                            ¥{this.props.totalMoney}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress = {this.props.payDetailClick}
                        style = {styles.commonView}
                    >
                        <Text style = {styles.textStyle1}>
                            应付明细
                        </Text>
                        <Image
                            style = {styles.imageStyle}
                            source = {arrowImg}
                            resizeMode = {'stretch'}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style = {styles.gotoPayView}
                    onPress = {this.props.gotoPayClick}
                >
                    <Text style = {styles.textStyle3}>
                        去付款
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    footerView: {
        height: 44,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#dddddd',
        flexDirection: 'row',
    },
    leftView: {
        flex: 2.75,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 36
    },
    gotoPayView: {
        flex: 1,
        backgroundColor: '#ff6700',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    commonView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle1: {
        fontSize: 12,
        color: '#333333'
    },
    textStyle2: {
        fontSize: 12,
        color: '#ff6700'
    },
    textStyle3: {
        fontSize: 16,
        color: '#ffffff'
    },
    imageStyle: {
        height: 7,
        width: 14,
        marginLeft: 4
    }
});
