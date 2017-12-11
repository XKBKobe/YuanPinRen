import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ListView,
    Image,
    InteractionManager,
    TextInput,
    Modal,
    Dimensions,
    Switch,
    Alert
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import CNClickScope from '../Components/ClickScope';
import { Actions, ActionConst } from 'react-native-router-flux';
import Header from '../Components/Header';
import requestData from '../NetWork/request';
import * as AddressAction from '../Reducer/Actions/AddressAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const CACHE_PROVINCE = [];

class EditAddress extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'HASDATA',
            isSectionChooserShow: false,
            sectionData: [],
            sectionSign: 1,
            selectedProvince: '',
            selectedCity: '',
            selectedRegion: '',
            provinceId: 0,
            cityId: 0,
            region: 0,
            isDefaultAddress: false,
            receivePeople: '',
            phoneNumber: '',
            detailAddress: '',
            idNumber: ''
        };

        this.footerRender = this.footerRender.bind(this);
        this.sectionListRender = this.sectionListRender.bind(this);
        this.provinceItemClick = this.provinceItemClick.bind(this);
        this.cityItemClick = this.cityItemClick.bind(this);
        this.regionItemClick = this.regionItemClick.bind(this);
        this.closeModalClick = this.closeModalClick.bind(this);
        this.receivePeopleTextChange = this.receivePeopleTextChange.bind(this);
        this.phoneNumberTextChange = this.phoneNumberTextChange.bind(this);
        this.detailAddressTextChange = this.detailAddressTextChange.bind(this);
        this.idNumberTextChange = this.idNumberTextChange.bind(this);
        this.saveAddressClick = this.saveAddressClick.bind(this);
    }

    componentWillMount() {
        requestData('/index/Address/get_area_id', "POST","type=province")
        .then((successData) => {
            CACHE_PROVINCE = successData.data;
            this.setState({
                sectionData: successData.data,
                sectionSign: 1,
            });
        });
        if (this.props.isEdit) {
            this.queryEditAddress();
        }
    }

    queryEditAddress() {
        requestData('/index/Address/address_info', "POST","addressId="+this.props.addressId)
        .then((successData) => {
            if (successData.errno != 0) {
                Alert.alert("获取地址信息出错：",successData.errmsg);
                return;
            }
            let isDefault = successData.data.is_default == '2' ? true : false;
            this.setState({
                receivePeople: successData.data.consignee,
                provinceId: successData.data.provinceId,
                cityId: successData.data.cityId,
                region: successData.data.districtId,
                selectedProvince: successData.data.province,
                selectedCity: successData.data.city,
                selectedRegion: successData.data.district,
                detailAddress: successData.data.address,
                phoneNumber: successData.data.mobile,
                idNumber: successData.data.idcard,
                isDefaultAddress: isDefault
            })
        });
    }

    receivePeopleTextChange(text) {
        this.setState({
            receivePeople: text
        });
    }

    phoneNumberTextChange(text) {
        this.setState({
            phoneNumber: text
        });
    }

    detailAddressTextChange(text) {
        this.setState({
            detailAddress: text
        });
    }

    idNumberTextChange(text) {
        this.setState({
            idNumber: text
        });
    }

    saveAddressClick() {
        var defaultAddress = '1';

        if (0 == this.state.receivePeople.length) {
            Alert.alert('温馨提示', '请输入收货人');
            return;
        }

        if (!this.state.phoneNumber.match(/^1[3|4|5|7|8][0-9]\d{4,8}$/)) {
            Alert.alert('温馨提示', '请输入正确的手机号码');
            return;
        }

        if (this.state.region == 0) {
            Alert.alert('温馨提示', '请选择所在地区');
            return;
        }

        if (this.state.detailAddress.length < 6) {
            Alert.alert('温馨提示', '请输入正确的详细地址');
            return;
        }

        if (!this.state.idNumber || this.state.idNumber.length < 15) {
            Alert.alert('温馨提示', '请输入正确的身份证号码');
            return;
        }

        if (this.state.isDefaultAddress) {
            defaultAddress = '2';
        }
       
       if(this.props.isEdit) {
            this.updateAddress(defaultAddress);
       }else {
            this.addAddress(defaultAddress);
       }
    }

    addAddress(defaultAddress) {
        let paramter = "consignee="+this.state.receivePeople+"&provinceId="+this.state.provinceId
            +"&cityId="+this.state.cityId+"&areaId="+this.state.region+"&address="+this.state.detailAddress
            +"&mobile="+this.state.phoneNumber+"&idCard="+this.state.idNumber+"&is_default="+defaultAddress;
       requestData('/index/Address/add_address', "POST", paramter)
        .then((successData) => {
            if (0 == successData.errno) {
                this.props.AddressAction.refreshUserAddress({isRefresh: true});
                Actions.pop();
                return;
            }
            Alert.alert("添加失败:",successData.errmsg);
        });
    }

    updateAddress(defaultAddress) {
        let paramter = "addressId="+this.props.addressId+"&consignee="+this.state.receivePeople+"&provinceId="+this.state.provinceId
            +"&cityId="+this.state.cityId+"&areaId="+this.state.region+"&address="+this.state.detailAddress
            +"&mobile="+this.state.phoneNumber+"&idCard="+this.state.idNumber+"&is_default="+defaultAddress;
       requestData('/index/Address/update_address', "POST", paramter)
        .then((successData) => {
            console.log(' ------------ ', successData);
            if (0 == successData.errno) {
                this.props.AddressAction.refreshUserAddress({isRefresh: true});
                Actions.pop();
                return;
            }
            Alert.alert("添加失败:",successData.errmsg);
        });
    }

    footerRender() {
        return (
            <CNClickScope
                style = {styles.footerView}
                onPress = {this.saveAddressClick}
            >
                <Text style = {styles.textStyle1}>
                    保存
                </Text>
            </CNClickScope>
        );
    }

    provinceItemClick(provinceId, provinceName) {
        let paramter = "type=city&areaId="+provinceId;
        requestData('/index/Address/get_area_id', "POST", paramter)
        .then((successData) => {
            this.setState({
                provinceId: provinceId,
                sectionData: successData.data,
                sectionSign: 2,
                selectedProvince: provinceName
            });
        });
    }

    cityItemClick(cityId, cityName) {
        let paramter = "type=area&areaId="+cityId;
        requestData('/index/Address/get_area_id', "POST", paramter)
        .then((successData) => {
            if(!successData.data|| successData.data.length < 1) {
                this.setState({
                    region: "",
                    isSectionChooserShow: false,
                    sectionSign: 1,
                    sectionData: CACHE_PROVINCE,
                    selectedRegion: ""
                });
                return;
            }
            this.setState({
                cityId: cityId,
                sectionData: successData.data,
                sectionSign: 3,
                selectedCity: cityName
            });
        });
    }

    regionItemClick(areaId, areaName) {
        this.setState({
            region: areaId,
            isSectionChooserShow: false,
            sectionSign: 1,
            sectionData: CACHE_PROVINCE,
            selectedRegion: areaName
        });
    }

    sectionListRender() {
        if (this.state.sectionSign == 1) {
            return this.state.sectionData.map((itemData, index) => {
                return (
                    <CNClickScope
                        style = {styles.sectionItemView}
                        key = {index}
                        onPress = {() => this.provinceItemClick(itemData.provinceId, itemData.provinceName)}
                    >
                        <Text style = {styles.textStyle3}>
                            {itemData.provinceName}
                        </Text>
                    </CNClickScope>
                );
            });
        } else if (this.state.sectionSign == 2) {
            return this.state.sectionData.map((itemData, index) => {
                return (
                    <CNClickScope
                        style = {styles.sectionItemView}
                        key = {index}
                        onPress = {() => this.cityItemClick(itemData.cityId, itemData.cityName)}
                    >
                        <Text style = {styles.textStyle3}>
                            {itemData.cityName}
                        </Text>
                    </CNClickScope>
                );
            });
        } else {
            return this.state.sectionData.map((itemData, index) => {
                return (
                    <CNClickScope
                        style = {styles.sectionItemView}
                        key = {index}
                        onPress = {() => this.regionItemClick(itemData.areaId, itemData.areaName)}
                    >
                        <Text style = {styles.textStyle3}>
                            {itemData.areaName}
                        </Text>
                    </CNClickScope>
                );
            });
        }
    }

    closeModalClick() {
        this.setState({
            isSectionChooserShow: false,
            selectedProvince: '',
            selectedCity: '',
            selectedRegion: '',
            region: 0,
            sectionSign: 1,
            sectionData: CACHE_PROVINCE
        });
    }

    pageHasDataRender() {
        var sectionSignText;
        var modalScrollView;

        if (this.state.sectionSign == 1) {
            sectionSignText = '省份'
        } else if (this.state.sectionSign == 2) {
            sectionSignText = '城市'
        } else {
            sectionSignText = '区'
        }

        return (
            <View style = {{flex: 1, flexDirection: 'column', backgroundColor: '#f0f0f0'}}>
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.isSectionChooserShow}
                    onRequestClose={() => {}}
                >
                    <View style = {styles.modalView}>
                        <View style = {styles.sectionChooserView}>
                            <View style = {styles.sectionChooserHeaderView}>
                                <Text
                                    style = {styles.textStyle4}
                                    onPress = {this.closeModalClick}
                                >
                                    关闭
                                </Text>
                                <Text style = {styles.textStyle4}>
                                    {sectionSignText}
                                </Text>
                            </View>
                            <ScrollView
                                ref = {(scrollView) => {modalScrollView = scrollView;}}
                                onContentSizeChange = {() => {
                                    modalScrollView.scrollTo({y: 0});
                                }}
                            >
                                {this.sectionListRender()}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <View style = {[styles.viewStyle1, {marginTop: 10}]}>
                        <View style={{flexDirection:"row"}}>
                            <Text style = {styles.textStyle2}>
                                *
                            </Text>
                            <Text style = {[styles.textStyle3, {marginLeft: 10}]}>
                                收货人
                            </Text>
                        </View>
                        <TextInput
                            style = {{width: 280, marginTop: 1,textAlign:"right"}}
                            underlineColorAndroid = {'#ffffff'}
                            onChangeText = {this.receivePeopleTextChange}
                            value = {this.state.receivePeople}
                        />
                    </View>
                    <View style = {[styles.viewStyle1, {marginTop: 1}]}>
                        <View style={{flexDirection:"row"}}>
                            <Text style = {styles.textStyle2}>
                                *
                            </Text>
                            <Text style = {[styles.textStyle3, {marginLeft: 10}]}>
                                手机号码
                            </Text>
                        </View>
                        <TextInput
                            style = {{width: 280, marginTop: 1,textAlign:"right"}}
                            underlineColorAndroid = {'#ffffff'}
                            keyboardType = {'numeric'}
                            maxLength = {11}
                            onChangeText = {this.phoneNumberTextChange}
                            value = {this.state.phoneNumber}
                        />
                    </View>
                    <CNClickScope
                        style = {[styles.viewStyle1, {marginTop: 1}]}
                        onPress = {() => this.setState({isSectionChooserShow: true})}
                    >
                        <View style={{flexDirection:"row"}}>
                            <Text style = {styles.textStyle2}>
                                *
                            </Text>

                            <Text style = {[styles.textStyle3, {marginLeft: 10}]}>
                                所在地区
                            </Text>
                        </View>

                        <Text style = {[styles.textStyle3, {marginLeft: 10}]}>
                            {this.state.selectedProvince}  {this.state.selectedCity}  {this.state.selectedRegion}
                        </Text>
                    </CNClickScope>
                    <View style = {[styles.viewStyle2, {marginTop: 1}]}>
                        <View style={{flexDirection:"row"}}>
                            <Text style = {styles.textStyle2}>
                                *
                            </Text>
                            <Text style = {[styles.textStyle3, {marginLeft: 10}]}>
                                详细地址
                            </Text>
                        </View>

                        <TextInput
                            style = {{height: 60, width: 280,fontSize:14,marginTop:14,textAlign:"right"}}
                            placeholder = {'不少于5个汉字'}
                            multiline = {true}
                            onChangeText = {this.detailAddressTextChange}
                            value = {this.state.detailAddress}
                        />
                    </View>
                    <View style = {[styles.viewStyle1, {marginTop: 1}]}>
                        <View style={{flexDirection:"row"}}>
                            {this.renderIdXin()}
                            <Text style = {[styles.textStyle3, {marginLeft: 10}]}>
                                身份证号
                            </Text>
                        </View>
                        <TextInput
                            style = {{width: 180, marginTop: 1, fontSize:14}}
                            underlineColorAndroid = {'#ffffff'}
                            keyboardType = {'numeric'}
                            maxLength = {18}
                            placeholder = {'海关报关需要验证身份信息'}
                            value = {this.state.idNumber}
                            onChangeText = {this.idNumberTextChange}
                        />
                    </View>

                    <View style = {[styles.viewStyle1, {marginTop: 10, justifyContent: 'space-between'}]}>
                        <View style = {{flexDirection: 'row'}}>
                            <Text style = {[styles.textStyle3, {marginLeft: 10}]}>
                                设为默认
                            </Text>
                        </View>
                        <Switch
                            onValueChange = {(value) => {this.setState({isDefaultAddress: value})}}
                            value = {this.state.isDefaultAddress}
                        />
                    </View>
                </ScrollView>
                {this.footerRender()}
            </View>
        );
    }

    renderIdXin() {
        if (this.props.isEdit) {
            return;
        }
        return <Text style = {styles.textStyle2}> *</Text>
    }

    headerRender() {
        let title = this.props.isEdit ? "编辑收货地址" : "新增收货地址";
        return (
            <Header
                headerTitle = {title}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditAddress);

const styles = StyleSheet.create({
    footerView: {
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#ff6700',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionChooserView: {
        width: 300,
        height: 400,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ff6700',
        borderRadius: 4,
    },
    sectionChooserHeaderView:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        height: 40,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ff6700'
    },
    sectionItemView: {
        borderTopWidth:1,
        borderTopColor: '#dddddd',
        height: 30,
        paddingLeft: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewStyle1: {
        height: 44,
        width: Dimensions.get('window').width,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent:"space-between",
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    viewStyle2: {
        height: 64,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    textStyle1: {
        fontSize: 16,
        color: '#ffffff'
    },
    textStyle2: {
        fontSize: 14,
        color: '#ff6700'
    },
    textStyle3: {
        fontSize: 14,
        color: '#333333'
    },
    textStyle4: {
        fontSize: 12,
        color: '#333333'
    }
});
