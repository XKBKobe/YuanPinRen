import {
  StyleSheet,
  Dimensions
} from 'react-native';

const styles = StyleSheet.create({
    whouseHeaderView: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    whouseFooterView: {
        flexDirection: 'row',
        paddingRight: 15,
        justifyContent: 'flex-end',
        backgroundColor: '#ffffff',
        height: 90,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1
    },
    whouseFooterChildView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    whouseNameText: {
        marginLeft: 10,
        fontSize: 12,
        color: '#333333'
    },
    whouseFooterIntroText: {
        fontSize: 12,
        color: '#333333',
    },
    whouseFooterIntroTextNx: {
        fontSize: 12,
        color: '#333333',
        paddingTop: 6
    },
    whouseFooterMoneyText: {
        fontSize: 12,
        color: '#999999',
    },
    whouseFooterMoneyTextNx: {
        fontSize: 12,
        color: '#999999',
        paddingTop: 6
    },
    activityBarView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        backgroundColor: '#ffffff',
        paddingLeft: 47
    },
    activityNameView: {
        borderColor: '#ffa700',
        borderWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 2
    },
    activityNameText: {
        fontSize: 12,
        color: '#ffa700'
    },
    activityRuleText: {
        marginLeft: 10,
        fontSize: 12,
        color: '#ffa700'
    },
    validGoodsBarView: {
        flex: 1,
        flexDirection: 'row',
        height: 90,
        alignItems: 'center',
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 1
    },
    invalidGoodsBarView: {
        flex: 1,
        flexDirection: 'row',
        height: 90,
        alignItems: 'center',
        backgroundColor: '#dddddd',
        paddingLeft: 9,
        marginTop: 1
    },
    invalidView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 18,
        width: 30,
        borderRadius: 2,
        backgroundColor: '#ffffff'
    },
    invalidRightView: {
        flexDirection: 'row',
        paddingLeft: 8
    },
    invalidRightNameView: {
        flex: 2,
        flexDirection: 'row'
    },
    invalidRightPriceView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingRight: 15
    },
    goodsAmountText: {
        fontSize: 12,
        color: '#666666'
    },
    noDataView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0'
    },
    goToShoppingTouch: {
        height: 28,
        width: 78,
        marginTop: 17,
        backgroundColor: '#ffffff',
        borderColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4
    },
    invalidGoodsListView: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
        paddingBottom: 20
    },
    cleanInvalidGoodsTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        height: 30,
        width: 106,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 4
    },
    footerBarView: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#dddddd'
    },
    footerBarLeftView: {
        flex: 2.75,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15
    },
    introductionView: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 11
    },
    settlementTouch: {flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff6700'
    },
    checkAllBoxView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    goodsBarInsideView: {
        flexDirection: 'row',
        paddingLeft: 15
    },
    goodsBarRightView: {
        flexDirection: 'row',
        width: 268/375 * Dimensions.get('window').width,
        paddingLeft: 15,
        justifyContent: 'space-between',
    },
    goodsBarPriceAmountView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingRight: 15
    },
    editBoxView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        width: 28,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    editAmountView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        width: 42,
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    },
    imgStyle1: {
        height: 120,
        width: 120
    },
    imgStyle2: {
        height: 16,
        width: 16
    },
    imgStyle3: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#dddddd'
    },
    imgStyle4: {
        height: 17,
        width: 17,
        marginTop: 10
    },
    textStyle1: {
        fontSize: 14,
        color: '#999999',
        marginTop: 17
    },
    textStyle2: {
        fontSize: 12,
        color: '#333333'
    },
    textStyle3: {
        fontSize: 16,
        color: '#ffffff'
    },
    textStyle4: {
        fontSize: 12,
        color: '#ff6700'
    },
    textStyle5: {
        fontSize: 10,
        color: '#999999'
    },
    textStyle6: {
        marginLeft: 10,
        fontSize: 12,
        color: '#333333'
    },
    textStyle7: {
        fontSize: 10,
        color: '#333333'
    },
    textStyle8: {
        fontSize: 14,
        color: '#333333',
        marginRight: 15
    }
});

module.exports = styles;
