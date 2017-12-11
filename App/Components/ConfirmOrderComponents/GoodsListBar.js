import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    ListView
} from 'react-native';

export default class GoodsListBar extends Component {
    constructor(props) {
        super(props);

        this._renderRowWhouse = this._renderRowWhouse.bind(this);
        this._renderGoods = this._renderGoods.bind(this);
    }

    _renderGoods(goodsData) {
        return (
            <View style = {styles.goodsContentView}>
                <View style = {styles.imageAndNameView}>
                    <Image
                        style = {styles.imageStyle}
                        source = {{uri: goodsData.imgobj[0].url}}
                    />
                    <View style = {styles.nameView}>
                        <Text style = {styles.textStyle1}>
                            {goodsData.goodsName}
                        </Text>
                    </View>
                </View>

                <View style = {styles.priceView}>
                    <Text style = {styles.textStyle1}>
                        ¥{goodsData.goodsSalePrice}
                    </Text>
                    <Text style = {styles.textStyle2}>
                        x{goodsData.num}
                    </Text>
                </View>
            </View>
        );
    }

    _renderRowWhouse(whouseData) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View style = {{marginTop: 10}}>
                <View style = {styles.wareHouseNameView}>
                    <Text style = {styles.textStyle1}>
                        {whouseData.whName}
                    </Text>
                </View>

                <ListView
                    dataSource = {ds.cloneWithRows(whouseData.goodsList)}
                    renderRow = {this._renderGoods}
                />

                <View style = {styles.wareHousePriceView}>
                    <Text style = {styles.textStyle1}>
                        商品应付总计：¥ { whouseData.itemPayMoeny }
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View>
                <ListView
                    dataSource = {ds.cloneWithRows(this.props.goodsListData)}
                    renderRow = {this._renderRowWhouse}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wareHouseNameView: {
        height: 30,
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    wareHousePriceView: {
        height: 30,
        paddingRight: 15,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd'
    },
    goodsContentView: {
        height: 90,
        backgroundColor: '#ffffff',
        marginTop: 1,
        padding: 15,
        flexDirection: 'row',
    },
    imageAndNameView: {
        flex: 5,
        flexDirection: 'row'
    },
    nameView: {
        height: 60,
        width: 213,
        paddingLeft: 15
    },
    priceView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    imageStyle: {
        height: 60,
        width: 60,
        borderWidth: 1,
        borderColor: '#dddddd'
    },
    textStyle1: {
        fontSize: 12,
        color: '#333333'
    },
    textStyle2: {
        fontSize: 12,
        color: '#666666',
        marginTop: 8
    }

});
