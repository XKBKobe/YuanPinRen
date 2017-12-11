import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    messageBarView: {
        flexDirection: 'row',
        height: 110,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingLeft: 21,
        paddingRight: 16
    },
    messageBarNameView: {
        flexDirection: 'column',
        marginLeft: 21
    },
    messageBarNameUnderView: {
        flexDirection: 'row',
        marginTop: 21
    },
    drawBarView: {
        flexDirection: 'row',
        marginTop: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 44,
        paddingLeft: 14,
        paddingRight: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd'
    },
    drawButton: {
        height: 28,
        width: 72,
        backgroundColor: '#ff6700',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moneyBarView: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#ffffff'
    },
    moneyBarItemView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle1: {
        fontSize: 16,
        color: '#333333'
    },
    textStyle2: {
        fontSize: 12,
        color: '#666666'
    },
    textStyle3: {
        fontSize: 12,
        color: '#333333'
    },
    textStyle4: {
        fontSize: 12,
        color: '#ffa700'
    },
    textStyle5: {
        fontSize: 12,
        color: '#ffffff'
    },
    textStyle6: {
        fontSize: 16,
        color: '#ff6700'
    }
});

module.exports = styles;
