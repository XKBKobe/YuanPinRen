/**
* Name:CNButtonBar
* Create Time：2016-11-09
* Instruction:长条可按按钮
*/

import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';

import * as ImgSrc from '../Res/Images';

export default class ButtonBar extends Component {
    static defaultProps = {
        title: '填写Title',
        introduction: ''
    };

    static propTypes = {
        onPress: PropTypes.func,
        style: View.propTypes.style,
        title: PropTypes.string,
        introduction: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    renderArrow() {
        if (!this.props.isArrow) {
            return (
                <Image
                    style = {styles.rightArrowImage}
                    source = {ImgSrc.IC_RIGHT_ARROW}
                    resizeMode = {'stretch'}
                />
            )
        }else {
            return <View></View>
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress = {this.props.onPress}>
                <View style = {[styles.buttonBarView, this.props.style]}>
                    <Text style = {styles.buttonTitleText}>
                        {this.props.title}
                    </Text>
                    <View style = {styles.rightContentView}>
                        <Text style = {styles.introductionText}>
                            {this.props.introduction}
                        </Text>
                        {this.renderArrow()}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    buttonBarView: {
        flexDirection: 'row',
        height: 44,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonTitleText: {
        fontSize: 14,
        color: '#333333'
    },
    rightContentView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightArrowImage: {
        height: 14,
        width: 7
    },
    introductionText: {
        fontSize: 14,
        color: '#999999',
        marginRight: 3
    }
});
