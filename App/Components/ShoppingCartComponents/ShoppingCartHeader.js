import React from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    StyleSheet
} from 'react-native';
import Header from '../Header';
import * as ImgSrc from '../../Res/Images';

export default class ShoppingCartHeader extends Header {
    rightSideRender(isIntro) {
        let textInfo = !isIntro ? "编辑" : "完成";
        return (
            <View style = {styles.rightSideView}>
                <Text style = {{fontSize: 14, color: '#333333', marginRight: 15}}>
                    {textInfo}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rightSideView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
});
