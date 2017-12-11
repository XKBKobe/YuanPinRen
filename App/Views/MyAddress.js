import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    ScrollView,
    ListView,
    Image,
    StyleSheet,
    InteractionManager
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import CNClickScope from '../Components/ClickScope';
import * as Request from '../NetWork/nativeDataRequest';
import Header from '../Components/Header';
import EditAddress from './EditAddress';
import { Actions, ActionConst } from 'react-native-router-flux';
import * as ImgSrc from '../Res/Images';
import requestData from '../NetWork/request';
import * as AddressAction from '../Reducer/Actions/AddressAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class MyAddress extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            data: []
        };

        this.footerRender = this.footerRender.bind(this);
        this.addressListRender = this.addressListRender.bind(this);
        this.addNewAddressClick = this.addNewAddressClick.bind(this);
    }

    componentDidMount() {
        this.requeryAddressList();
    }

    requeryAddressList() {
        requestData('/index/Address/address_list', "POST")
        .then((data) => {
            
            this.props.AddressAction.refreshUserAddress({isRefresh: false});
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA",data:data.data.data});
            }else {
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA"});
            }
        }, (error) => {

        });
    }

    setDefaultAddress(addressId) {
        requestData('/index/Address/set_default', "POST","addressId="+addressId)
        .then((data) => {
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA"});
                this.requeryAddressList();
            }else {
                alert(data.errmsg);
            }
        }, (error) => {

        });
    }

    deleteAddress(addressId) {
        requestData('/index/Address/delete_address', "POST","addressId="+addressId)
        .then((data) => {
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA"});
                this.requeryAddressList();
            }else {
                alert(data.errmsg);
            }
        }, (error) => {

        });
    }

    addressListRender() {
        if(this.props.AddressState.isRefresh) {
            this.requeryAddressList();
        }
        if (!this.state.data || this.state.data.length < 1) {
            return;
        }
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <ListView
                dataSource = {ds.cloneWithRows(this.state.data)}
                renderRow = {(itemData, index) => {
                    var checkBoxImage = (2 == itemData.is_default) ? ImgSrc.IC_CHECKBOX_SQ : ImgSrc.IC_CHECKBOX_SQ_NULL;
                    var defaultText = (2 == itemData.is_default) ? '默认地址' : '设为默认';
                    var defaultTextStyle = (2 == itemData.is_default) ? styles.defaultAddressText : styles.normalAddressText;

                    return (
                        <View
                            style = {styles.itemView}
                            key = {index}
                        >
                            <View
                                style = {styles.addressView}
                            >
                                <View style = {styles.namePhoneView}>
                                    <Text style = {styles.namePhoneText}>
                                        {itemData.consignee}
                                    </Text>
                                    <Text style = {styles.namePhoneText}>
                                        {itemData.mobile}
                                    </Text>
                                </View>
                                <Text style = {styles.addressText}>
                                    {itemData.province + ' '}{itemData.city + ' '}{itemData.district + ' '}{itemData.address}
                                </Text>
                            </View>

                            <View
                                style = {styles.editView}
                            >
                                <CNClickScope
                                    style = {styles.setDefaultView}
                                    onPress = {() => this.setDefaultAddress(itemData.addressId)}
                                >
                                    <Image
                                        style = {styles.checkBoxImage}
                                        source = {checkBoxImage}
                                    />
                                    <Text style = {defaultTextStyle}>
                                        {defaultText}
                                    </Text>
                                </CNClickScope>

                                <View style = {styles.setDefaultView}>
                                    <CNClickScope
                                        onPress={() => Actions.EditAddress({isEdit: true,addressId: itemData.addressId})}
                                        style = {styles.setDefaultView}
                                    >
                                        <Image
                                            style = {styles.checkBoxImage}
                                            source = {ImgSrc.IC_EDIT}
                                        />
                                        <Text style = {styles.normalAddressText2}>
                                            编辑
                                        </Text>
                                    </CNClickScope>

                                    <CNClickScope
                                        style = {styles.setDefaultView2}
                                        onPress={() => this.deleteAddress(itemData.addressId)}
                                    >
                                        <Image
                                            style = {styles.checkBoxImage}
                                            source = {ImgSrc.IC_DUSTBIN}
                                        />
                                        <Text style = {styles.normalAddressText2}>
                                            删除
                                        </Text>
                                    </CNClickScope>
                                </View>
                            </View>
                        </View>
                    );
                }}
            />
        );
    }

    addNewAddressClick() {
        Actions.EditAddress();
    }

    footerRender() {
        return (
            <CNClickScope
                style = {styles.footerView}
                onPress = {() => this.addNewAddressClick()}
            >
                <Text style = {styles.footerText}>
                    新增收货地址
                </Text>
            </CNClickScope>
        );
    }

    pageHasDataRender() {
        return (
            <View style = {{flex: 1}}>
                <ScrollView style = {styles.contentView}>
                    {this.addressListRender()}
                </ScrollView>
                {this.footerRender()}
            </View>
        );
    }

     headerRender() {
        return (
            <Header
                headerTitle = {'我的收货地址'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

function mapStateToProps(state) {
    const {AddressState} = state;
    return {
        AddressState
    }
}

function mapDispatchToProps(dispatch) {
    return {
        AddressAction: bindActionCreators(AddressAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAddress);

const styles = StyleSheet.create({
    contentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f0f0f0',
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
    itemView: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        height: 120,
        marginTop: 10
    },
    addressView: {
        flexDirection: 'column',
        flex: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        justifyContent: 'center'
    },
    editView: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    namePhoneView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15
    },
    namePhoneText: {
        fontSize: 14,
        color: '#333333'
    },
    addressText: {
        fontSize: 12,
        color: '#333333',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 15
    },
    setDefaultView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    setDefaultView2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20
    },
    checkBoxImage: {
        height: 12,
        width: 12
    },
    defaultAddressText: {
        fontSize: 12,
        color: '#ff6700',
        marginLeft: 12
    },
    normalAddressText: {
        fontSize: 12,
        color: '#666666',
        marginLeft: 10
    },
    normalAddressText2: {
        fontSize: 12,
        color: '#666666',
        marginLeft: 5
    }
});
