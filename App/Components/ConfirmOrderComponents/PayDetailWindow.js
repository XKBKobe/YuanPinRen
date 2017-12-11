import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

export default class PayDetailPopWindow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(" ============== ", this.props.priceData);
        return (
            <View style = {styles.rootView}>
                <TouchableWithoutFeedback
                    onPress = {this.props.shadeClick}
                >
                    <View style = {styles.shadeView}/>
                </TouchableWithoutFeedback>
                <View style = {styles.contentView}>
                    <View style = {styles.priceNameView}>
                        <Text style = {styles.textStyle}>商品总价：</Text>
                        <Text style = {styles.textStyle}>优惠券：</Text>
                        <Text style = {styles.textStyle}>运费：</Text>
                        <Text style = {styles.textStyle}>税费：</Text>
                        <Text style = {styles.textStyle}>总计：</Text>
                    </View>
                    <View style = {styles.priceView}>
                        <Text style = {styles.textStyle}>¥{this.props.priceData.allItemMoney}</Text>
                        <Text style = {styles.textStyle}>¥{this.props.priceData.cutMoney}</Text>
                        <Text style = {styles.textStyle}>¥{this.props.priceData.shipMoney}</Text>
                        <Text style = {styles.textStyle}>¥{this.props.priceData.allTaxMoney}</Text>
                        <Text style = {styles.textStyle}>¥{this.props.priceData.allPayMoney}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection: 'column'
    },
    shadeView: {
        flex: 1,
        backgroundColor: '#000000',
        opacity: 0.3
    },
    contentView: {
        height: 210,
        backgroundColor: '#ffffff',
        flexDirection: 'row'
    },
    priceNameView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 15
    },
    priceView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 15
    },
    textStyle: {
        fontSize: 12,
        color: '#333333',
        paddingVertical: 7
    }
});
