import React from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Modal,
    NativeModules,
    ListView
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BaseComponent from '../Components/BaseComponent';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import * as ImgSrc from '../Res/Images';
import requestData from '../NetWork/request';
import * as ChoosedAddressActions from '../Reducer/Actions/ChoosedAddressActions';
import * as AddressAction from '../Reducer/Actions/AddressAction';

class ChooseAddress extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            pageData: []
        };

        this.footerRender = this.footerRender.bind(this);
        this.addressListRender = this.addressListRender.bind(this);
        this.chooseIconRender = this.chooseIconRender.bind(this);
    }

    componentWillMount() {
        this.requeryAddressList();
    }

    requeryAddressList() {
        requestData('/index/Address/address_list', "POST")
        .then((data) => {
            this.props.AddressAction.refreshUserAddress({isRefresh: false});
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA",pageData:data.data.data});
            }else {
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA"});
            }
        }, (error) => {

        });
    }

    headerRender() {
        return (
            <Header
                headerTitle = {'选择收货地址'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    footerRender() {
        return (
            <ClickScope
                style = {styles.footerView}
                onPress = {() => Actions.EditAddress()}
            >
                <Text style = {styles.footerText}>
                    新增收货地址
                </Text>
            </ClickScope>
        );
    }

    chooseIconRender(addressId) {
        var choosedAddressId = this.props.ChoosedAddressState.addressData.addressId;
        if (choosedAddressId == addressId) {
            return (
                <Image
                    style = {{height: 16, width: 16}}
                    source = {ImgSrc.CHECK_GREEN}
                />
            );
        }
    }

    addressListRender() {
        if(this.props.AddressState.isRefresh) {
            this.requeryAddressList();
        }

        if (!this.state.pageData || this.state.pageData.length < 1) {
            return;
        }

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <ListView
                dataSource = {ds.cloneWithRows(this.state.pageData)}
                renderRow = {(itemData, index) => {

                    return (
                        <View style = {styles.itemView}>
                            <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                {this.chooseIconRender(itemData.addressId)}
                            </View>

                            <ClickScope
                                style = {{flex: 5, flexDirection: 'column'}}
                                onPress = {() => {
                                    this.props.ChoosedAddressActions.saveChoosedAddressData(itemData);
                                    Actions.pop();
                                }}
                            >
                                <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15}}>
                                    <Text style = {{fontSize: 14, color: '#333333'}}>
                                        {itemData.consignee}
                                    </Text>
                                    <Text style = {{fontSize: 14, color: '#333333'}}>
                                        {itemData.mobile}
                                    </Text>
                                </View>
                                <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15}}>
                                    <Text style = {{fontSize: 12, color: '#333333'}}>
                                        {itemData.province + ' '}{itemData.city + ' '}{itemData.district + ' '}{itemData.address}
                                    </Text>
                                </View>
                            </ClickScope>

                            <View style = {{height: 70, width: 1, backgroundColor: '#f0f0f0', marginTop: 10}}/>

                            <ClickScope
                                onPress={() => Actions.EditAddress({isEdit: true,addressId: itemData.addressId})}
                                style = {{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <Image
                                    style = {{height: 20, width: 18}}
                                    source = {ImgSrc.IC_EDIT}
                                />
                            </ClickScope>
                        </View>
                    );
                }}
            />
        );
    }

    pageHasDataRender() {
        return (
            <View style = {{flex: 1, flexDirection: 'column'}}>
                <ScrollView style = {{flex: 1,backgroundColor: '#f0f0f0'}}>
                    {this.addressListRender()}
                    <View style = {{height: 10}}/>
                </ScrollView>
                {this.footerRender()}
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

function mapStateToProps(state) {
    const {ChoosedAddressState, AddressState} = state;
    return {
        ChoosedAddressState,
        AddressState
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ChoosedAddressActions: bindActionCreators(ChoosedAddressActions, dispatch),
        AddressAction: bindActionCreators(AddressAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseAddress);

const styles = StyleSheet.create({
    itemView: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        height: 90,
        marginTop: 10
    },
    footerView: {
        height: 44,
        backgroundColor: '#ff6700',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#ffffff'
    },
});
