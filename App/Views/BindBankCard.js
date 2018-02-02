import React, {Component} from 'react';
import {
    View,
    Text,
    Platform,
    Image,
    ScrollView,
    TextInput,
    NativeModules,
    Alert
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ImgSrc from '../Res/Images';
import ClickScope from '../Components/ClickScope';
import styles from '../Styles/MineStyles';
import ButtonBar from '../Components/ButtonBar';
import requestData from '../NetWork/request';
import Header from '../Components/Header';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';

const bankArray = [
    {image: ImgSrc.INDUSTRIAL_BANK, id: "01"},
    {image: ImgSrc.AGRICULTURAL_BANK, id: "02"},
    {image: ImgSrc.CONSTRUCTION_BANK, id: "03"},
    {image: ImgSrc.CHINA_BANK, id: "04"},
    {image: ImgSrc.MERCHANTS_BANK, id: "05"},
    {image: ImgSrc.ZGYZCH_BANK, id: "06"},
    {image: ImgSrc.JT_BANK, id: "07"},
    {image: ImgSrc.ZGGD_BANK, id: "08"},
    {image: ImgSrc.ZX_BANK, id: "09"},
    {image: ImgSrc.PA_BANK, id: "10"},
    {image: ImgSrc.GF_BANK, id: "11"},
    {image: ImgSrc.SPD_BANK, id: "12"},
    {image: ImgSrc.HX_BANK, id: "13"},
    {image: ImgSrc.ZGMS_BANK, id: "14"},
    {image: ImgSrc.XY_BANK, id: "15"}
]
const GetBasicInfo = NativeModules.GetBasicInfo;

let photoOptions = {
    quality: 1,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        waitUntilSaved: false
    }
}

class BindBankCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bankType: "",
            bankCard: "",
            openBank: "",
            idCard: "",
            userName: "",
            checkedBank: "",
            positiveImgUrl: "",
            negativeImgUrl: "",
        }
        this.pickImageClick = this.pickImageClick.bind(this);
    }

    componentWillMount() {
    }

    renderBankInfo() {
        let self = this;
        return bankArray.map(function (item, index) {
            let imgUrl = item.image;
            if (self.state.checkedBank == item.id) {
                imgUrl = ImgSrc.BANK_CHOOSE
            }
            return (
                <ClickScope style={{height: 30, marginLeft: 18, marginTop: 16}} key={index}
                            onPress={() => {
                                self.setState({checkedBank: item.id})
                            }}
                >
                    <Image source={item.image}
                           style={{width: 100, height: 30}}
                    />
                    <Image source={imgUrl}
                           style={{width: 100, height: 30, marginTop: -30}}
                    />
                </ClickScope>
            )
        });
    }

    /**
     * @method 选择照片
     * @param isPositive 是否正面
     */
    async pickImageClick(isPositive) {
        let self = this;
        let author = await GetBasicInfo.getPhotoAuthorizate();
        console.log('author   ' + author);
        if (author == 'false') {
            Alert.alert("提示", '请到设置-隐私-相册中开启此App的权限', [
                {
                    text: 'cancel', onPress: () => {
                        console.log('cancel')
                    }
                },
                {
                    text: 'ok', onPress: () => {
                        GetBasicInfo.getPicSettings()
                    }
                },

            ]);
        } else if (author == 'true') {


            /**
             ImagePicker.launchImageLibrary(photoOptions, (response) => {
                if (response.uri) {
                    let localUrl = "";
                    if (Platform.OS === 'ios') {
                        localUrl = response.uri.replace('file://', '');
                    } else {
                        localUrl = response.uri;
                    }

                    if (isPositive == true) {
                        self.setState({positiveImgUrl: localUrl});
                    } else {
                        self.setState({negativeImgUrl: localUrl});
                    }
                }
            });**/



            //从相册中选择单张图片
            ImageCropPicker.openPicker({
                width: 600,
                height: 700,
                cropping: true,
                mediaType: 'photo'
            }).then(image => {
                console.log('image.path  ' + image.path);
                if (isPositive == true) {
                    self.setState({positiveImgUrl: image.path});
                } else {
                    self.setState({negativeImgUrl: image.path});
                }
            },err =>{
                console.log('cancel');
            })

        }
    }

    /*
     * 函数：认证身份
     * 参数：state中的身份证号和照片url 
     */
    confirmIdentiryInfo() {
        let {positiveImgUrl, negativeImgUrl, idCard, bankCard, checkedBank, openBank} = this.state;
        if (!positiveImgUrl || positiveImgUrl.length < 1 || !negativeImgUrl || negativeImgUrl.length < 1) {
            alert("请选择身份证照片！");
            return;
        }
        if (!idCard || idCard.length != 18) {
            alert("请输入正确的身份证号！");
            return;
        }
        if (!bankCard || bankCard.length < 1) {
            alert("请输入银行卡号！");
            return;
        }
        if (!checkedBank || checkedBank.length < 1) {
            alert("请选择银行卡类型！");
            return;
        }
        if (!openBank || openBank.length < 1) {
            alert("请选择银行卡类型！");
            return;
        }

        let formData = new FormData();
        let localUrl = this.state.positiveImgUrl;
        let self = this;
        let file = {uri: localUrl, type: 'multipart/form-data', name: 'identity.png'};
        formData.append("image", file);
        let negative = this.state.negativeImgUrl;
        let file2 = {uri: negative, type: 'multipart/form-data', name: 'identity2.png'};
        formData.append("image2", file2);
        let paramter = '/index/Crash/auth_action?' + "idCardNo=" + this.state.idCard + "&bankCardNo=" + this.state.bankCard + "&code=" + this.state.checkedBank + "&openBank=" + openBank;

        console.log('paramter  ' + JSON.stringify(paramter));
        console.log('formData  ' + JSON.stringify(formData));
        requestData(paramter, "POST", formData)
            .then((data) => {
                console.log("  \n\n ----------- ", data);
                if (data.errno == 0) {
                    Alert.alert("提示", '提交成功', [
                        {text: 'ok', onPress: () => Actions.pop()},
                    ]);
                    // Actions.pop();
                } else {
                    Alert.alert("认证失败: ", data.errmsg);
                }
            })
            .catch((error) => {
                console.log('认证时发生了不可预料的错误  ' + error);
                Alert.alert("认证时发生了不可预料的错误！");
            });
    }

    renderPositiveIdentityView() {
        let self = this;
        let {positiveImgUrl, negativeImgUrl} = this.state;
        if (positiveImgUrl && positiveImgUrl.length > 1) {
            return (
                <ClickScope onPress={() => self.pickImageClick(true)}>
                    <Image source={{uri: positiveImgUrl}}
                           style={{width: 345, height: 185, marginLeft: 15, marginTop: 11, borderRadius: 6}}
                    />
                </ClickScope>
            )
        }
        return (
            <ClickScope style={{
                backgroundColor: "#fff", width: 345, height: 185, marginLeft: 15, marginTop: 11,
                borderRadius: 6, flexDirection: "row", justifyContent: "center", alignItems: "center"
            }}
                        onPress={() => self.pickImageClick(true)}
            >
                <Image style={{width: 19, height: 19}} source={ImgSrc.UPLOAD_CARD}/>
                <Text style={{fontSize: 14, color: "#333", marginLeft: 7}}>点击上传身份证正面</Text>
            </ClickScope>
        )
    }

    renderNegativeIdentityView() {
        let self = this;
        let {negativeImgUrl} = this.state;
        if (negativeImgUrl && negativeImgUrl.length > 1) {
            return (
                <ClickScope onPress={() => self.pickImageClick(false)}>
                    <Image source={{uri: negativeImgUrl}}
                           style={{width: 345, height: 185, marginLeft: 15, marginTop: 11, borderRadius: 6}}
                    />
                </ClickScope>
            )
        }
        return (
            <ClickScope style={{
                backgroundColor: "#fff", width: 345, height: 185, marginLeft: 15, marginTop: 11,
                borderRadius: 6, flexDirection: "row", justifyContent: "center", alignItems: "center"
            }}
                        onPress={() => self.pickImageClick(false)}
            >
                <Image style={{width: 19, height: 19}} source={ImgSrc.UPLOAD_CARD}/>
                <Text style={{fontSize: 14, color: "#333", marginLeft: 7}}>点击上传身份证反面</Text>
            </ClickScope>
        )
    }

    render() {
        return (
            <View>
                <Header
                    headerTitle={"绑定银行卡"}
                    leftOnPress={() => Actions.pop()}
                />
                <ScrollView>
                    <View style={{height: 11, backgroundColor: "#eee"}}></View>
                    <View style={{height: 271}}>
                        <View style={{flexDirection: "row", marginLeft: 15, marginTop: 11}}>
                            <Text style={{color: "#333", fontSize: 14}}>选择要绑定的银行储蓄卡</Text>
                            <Text style={{color: "#999", fontSize: 10, marginTop: 3}}>（暂仅支持以下银行卡）</Text>
                        </View>
                        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                            {this.renderBankInfo()}
                        </View>
                    </View>
                    <View style={{height: 11, backgroundColor: "#eee"}}></View>
                    <View style={{
                        height: 44,
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                        flexDirection: "row"
                    }}>
                        <Text style={{color: "#ff6700", fontSize: 16, marginLeft: 14}}>*</Text>
                        <Text style={{fontSize: 16, color: "#333", marginLeft: 6}}>银行卡号</Text>
                        <TextInput style={{marginLeft: 6, width: 200, height: 20, marginTop: 13, fontSize: 16}}
                                   onChange={(event) => {
                                       this.setState({bankCard: event.nativeEvent.text})
                                   }
                                   }
                                   value={this.state.bankCard}
                                   placeholder="请输入银行卡号"
                        />
                    </View>
                    <View style={{
                        height: 44,
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                        flexDirection: "row"
                    }}>
                        <Text style={{color: "#ff6700", fontSize: 16, marginLeft: 14}}>*</Text>
                        <Text style={{fontSize: 16, color: "#333", marginLeft: 6}}>开户银行</Text>
                        <TextInput style={{marginLeft: 6, width: 200, height: 20, marginTop: 13, fontSize: 16}}
                                   onChange={(event) => {
                                       this.setState({openBank: event.nativeEvent.text})
                                   }
                                   }
                                   value={this.state.openBank}
                                   placeholder="如中国银行杭州西溪分行"
                        />
                    </View>
                    <View style={{height: 45, backgroundColor: "#eee"}}>
                        <Text style={{color: "#999", fontSize: 14, marginTop: 17, marginLeft: 15}}>身份证认证</Text>
                    </View>
                    <View style={{
                        height: 44,
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                        flexDirection: "row"
                    }}>
                        <Text style={{color: "#ff6700", fontSize: 16, marginLeft: 14}}>*</Text>
                        <Text style={{fontSize: 16, color: "#333", marginLeft: 6}}>身份证号</Text>
                        <TextInput style={{marginLeft: 6, width: 200, height: 20, marginTop: 13, fontSize: 16}}
                                   maxLength={18}
                                   onChange={(event) => {
                                       this.setState({idCard: event.nativeEvent.text})
                                   }
                                   }
                                   value={this.state.idCard}
                                   placeholder="请输入身份证号"
                        />
                    </View>
                    <View style={{height: 392, backgroundColor: "#eee"}}>
                        {this.renderPositiveIdentityView()}
                        {this.renderNegativeIdentityView()}
                    </View>
                    <View style={{height: 263, backgroundColor: "#eee"}}>
                        <Text style={{
                            marginLeft: 16,
                            marginTop: 13,
                            color: "#ffa700",
                            fontSize: 12
                        }}>请务必确保银行卡号和开户银行等信息的正确，否则将无法汇款</Text>
                        <ClickScope
                            style={{
                                backgroundColor: "#ff6700",
                                width: 345,
                                height: 44,
                                marginLeft: 15,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 30,
                                borderRadius: 4
                            }}
                            onPress={() => {
                                this.confirmIdentiryInfo();
                            }}
                        >
                            <Text style={{fontSize: 18, color: "#fff"}}>确认提交</Text>
                        </ClickScope>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    const {MineState} = state;
    return {
        MineState
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(BindBankCard);