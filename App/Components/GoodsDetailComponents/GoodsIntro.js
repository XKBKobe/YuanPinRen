import React, {Component} from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

export default class GoodsIntro extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style = {{flexDirection: 'column', backgroundColor: '#ffffff', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#dddddd'}}>
                <View
                    style = {{
                        flexDirection: 'row',
                        height: 44,
                        alignItems: 'center',
                        paddingLeft: 15
                    }}
                >

                    <Text style = {{height: 30, fontSize: 22, color: '#ff6700', textAlignVertical: 'bottom'}}>
                        ¥{this.props.goodsData.goodsSalePrice}
                    </Text>
                    <Text style = {{
                        height: 30,
                        marginLeft: 8,
                        fontSize: 12,
                        color: '#999999',
                        textDecorationLine: 'line-through',
                        textAlignVertical: 'bottom',
                    }}>
                        ¥{this.props.goodsData.goodsMsrp}
                    </Text>

                </View>

                <View style = {{height: 1, paddingHorizontal: 15}}>
                    <View style = {{backgroundColor: '#f0f0f0', height: 1}}/>
                </View>

                <Text style = {{marginLeft: 15, marginTop: 16, fontSize: 14, color: '#333333'}}>
                    {this.props.goodsData.goodsName}
                </Text>

                <Text style = {{marginTop: 4, marginLeft: 15, marginRight: 15, fontSize: 12, color: '#666666'}}>
                    {this.props.goodsData.goodBrief}
                </Text>

                <View style = {{flexDirection: 'row', marginTop: 10, alignItems: 'flex-end', paddingLeft: 15}}>
                    <Image
                        style = {{height: 16, width: 16}}
                        source = {{uri: this.props.goodsData.brandImgLogo.url}}
                    />
                    <Text style = {{fontSize: 12, color: '#999999', marginLeft: 10}}>
                        {this.props.goodsData.countryNameCh + ' '}
                        |{' ' + this.props.goodsData.countryNameEn}
                        {' ' + this.props.goodsData.brandName}
                        {' ' + this.props.goodsData.warehouseName}
                    </Text>
                </View>
            </View>
        );
    }
}
