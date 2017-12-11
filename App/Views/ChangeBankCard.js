import React, { Component } from 'react';
import {
    View,
    Text,
    Platform,
    Image,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ImgSrc from '../Res/Images';
import ClickScope from '../Components/ClickScope';
import styles from '../Styles/MineStyles';
import ButtonBar from '../Components/ButtonBar';
import requestData from '../NetWork/request';
import Header from '../Components/Header';
import ImagePicker from 'react-native-image-picker';
import * as MineActions from '../Reducer/Actions/MineActions';

const bankArray = [
    {image: ImgSrc.INDUSTRIAL_BANK, id: "01"},
    {image: ImgSrc.AGRICULTURAL_BANK, id: "02"},
    {image: ImgSrc.CONSTRUCTION_BANK,id: "03"},
    {image: ImgSrc.CHINA_BANK,id: "04"},
    {image: ImgSrc.MERCHANTS_BANK,id: "05"},
    {image: ImgSrc.ZGYZCH_BANK,id: "06"},
    {image: ImgSrc.JT_BANK,id: "07"},
    {image: ImgSrc.ZGGD_BANK,id: "08"},
    {image: ImgSrc.ZX_BANK,id: "09"},
    {image: ImgSrc.PA_BANK,id: "10"},
    {image: ImgSrc.GF_BANK,id: "11"},
    {image: ImgSrc.SPD_BANK,id: "12"},
    {image: ImgSrc.HX_BANK,id: "13"},
    {image: ImgSrc.ZGMS_BANK,id: "14"},
    {image: ImgSrc.XY_BANK,id: "15"}
]
class ChangeBankCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bankType: "",
            bankCard: "",
            openBank: "",
            userName: "",
            checkedBank: "",
        }
        this.pickImageClick = this.pickImageClick.bind(this);
    }

    componentWillMount() {
    }

    renderBankInfo() {
        let self = this;
        return bankArray.map(function(item, index) {
            let imgUrl = item.image;
            if (self.state.checkedBank == item.id) {imgUrl = ImgSrc.BANK_CHOOSE}
            return (
                <ClickScope style={{height:30,marginLeft:18,marginTop:16}} key={index}
                    onPress={() => {self.setState({checkedBank: item.id})}}
                >
                    <Image source={item.image}
                        style = {{width:100,height:30}}
                    />
                    <Image source={imgUrl}
                        style = {{width:100,height:30,marginTop:-30}}
                    />
                </ClickScope>
            )
        });
    }

    /**
     * @method 选择照片
     * @param isPositive 是否正面
     */
    pickImageClick(isPositive) {
        let self = this;
        ImagePicker.launchImageLibrary({}, (response)  => {
            if (response.uri) {
                let localUrl = "";
                if (Platform.OS === 'ios') {
                    localUrl = response.uri.replace('file://', '');
                } else {
                    localUrl = response.uri;
                }

                if (isPositive == true) {
                    self.setState({positiveImgUrl:localUrl});
                }else {
                    self.setState({negativeImgUrl: localUrl});
                }
            }
        });
    }

    /*
     * 函数：认证身份
     * 参数：state中的身份证号和照片url 
     */
    confirmIdentiryInfo() {
        let { bankCard, checkedBank,openBank} = this.state;
        if (!bankCard || bankCard.length < 1) {alert("请输入银行卡号！");return;}
        if (!checkedBank || checkedBank.length < 1) {alert("请选择银行卡类型！");return;}
        if (!openBank || openBank.length < 1) {alert("请选择银行卡类型！");return;}

        let formData = new FormData();
        let localUrl = this.state.positiveImgUrl;
        let self = this;
        let paramter = "bankCardNo="+ this.state.bankCard+"&code="+this.state.checkedBank+"&openBank="+openBank;
        requestData("/index/Crash/change_bank_no", "POST", paramter)
        .then((data) => {
            if (data.errno == 0) {
                this.props.MineActions.getUserInfo("");
                Actions.pop();
            }else {
                Alert.alert("认证失败: ",data.errmsg);
            }
        })
        .catch((error) => {
            console.log(error);
            Alert.alert("认证时发生了不可预料的错误！");
        });
    }

    render() {
        return (
            <View>
                 <Header
                    headerTitle = {"更换银行卡"}
                    leftOnPress = {() => Actions.pop()}
                />
                <ScrollView>
                    <View style={{height:11, backgroundColor:"#eee"}}></View>
                    <View style={{height:271}}>
                        <View style={{flexDirection:"row",marginLeft:15,marginTop:11}}>
                            <Text style={{color:"#333",fontSize:14}}>选择要绑定的银行储蓄卡</Text>
                            <Text style={{color:"#999",fontSize:10,marginTop:3}}>（暂仅支持以下银行卡）</Text>
                        </View>
                        <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                            {this.renderBankInfo()}
                        </View>
                    </View>
                    <View style={{height:11, backgroundColor:"#eee"}}></View>
                    <View style={{height: 44,alignItems:"center",borderBottomWidth:1, borderBottomColor:"#eee",flexDirection:"row"}}>
                        <Text style={{color:"#ff6700",fontSize:16,marginLeft:14}}>*</Text>
                        <Text style={{fontSize:16, color:"#333",marginLeft:6}}>银行卡号</Text>
                        <TextInput style={{marginLeft:6,width:200,height:20,marginTop:13,fontSize:16}}
                            onChange={(event) => {
                                this.setState({bankCard:event.nativeEvent.text})}
                            }
                            value={this.state.bankCard}
                            placeholder = "请输入银行卡号"
                        />
                    </View>
                    <View style={{height: 44,alignItems:"center",borderBottomWidth:1, borderBottomColor:"#eee",flexDirection:"row"}}>
                        <Text style={{color:"#ff6700",fontSize:16,marginLeft:14}}>*</Text>
                        <Text style={{fontSize:16, color:"#333",marginLeft:6}}>开户银行</Text>
                        <TextInput style={{marginLeft:6,width:200,height:20,marginTop:13,fontSize:16}}
                            onChange={(event) => {
                                this.setState({openBank:event.nativeEvent.text})}
                            }
                            value={this.state.openBank}
                            placeholder = "如中国银行杭州西溪分行"
                        />
                    </View>
  
                    <View style={{height:263, backgroundColor:"#eee"}}>
                        <Text style={{marginLeft:16,marginTop:13,color:"#ffa700", fontSize:12}}>请务必确保银行卡号和开户银行等信息的正确，否则将无法汇款</Text>
                        <ClickScope
                            style = {{
                                backgroundColor:"#ff6700",
                                width: 345,
                                height: 44,
                                marginLeft: 15,
                                justifyContent:"center",
                                alignItems:"center",
                                marginTop:30,
                                borderRadius:4
                            }}
                            onPress = {() => {
                                this.confirmIdentiryInfo();
                            }}
                        >
                            <Text style={{fontSize:18,color:"#fff"}}>确认提交</Text>
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
    return {
        MineActions: bindActionCreators(MineActions, dispatch)
    }
    // return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeBankCard);