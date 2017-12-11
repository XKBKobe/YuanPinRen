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

export default class GoodDetailHeader extends Header {
    rightSideRender() {
        return (
            <View style = {styles.rightSideView}>
                
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
