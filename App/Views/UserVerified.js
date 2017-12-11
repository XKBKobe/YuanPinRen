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

class UserVerified extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bankCard: "",
            idCard: "",
        }
    }

    componentWillMount() {
    }

    render() {
        return (
            <View>
                 <Header
                    headerTitle = {'实名认证'}
                    leftOnPress = {() => Actions.pop()}
                />
                <View style={{height:11, backgroundColor:"#eee"}}></View>
                <View style={{height: 44,alignItems:"center",borderBottomWidth:1, borderBottomColor:"#eee",flexDirection:"row"}}>
                    <Text style={{fontSize:14, color:"#333",marginLeft:14}}>您的银行卡号</Text>
                    <TextInput style={{marginLeft:6,width:200,height:20,marginTop:13}}
                        onChange={(event) => {
                            this.setState({bankCard:event.nativeEvent.text})}
                        }
                        value={this.state.bankCard}
                    />
                </View>
                <View style={{height: 44,alignItems:"center",borderBottomWidth:1, borderBottomColor:"#eee",flexDirection:"row"}}>
                    <Text style={{fontSize:14, color:"#333",marginLeft:14}}>您的身份证号</Text>
                    <TextInput style={{marginLeft:6,width:200,height:20,marginTop:13}}
                        onChange={(event) => {
                            this.setState({idCard:event.nativeEvent.text})}
                        }
                        value={this.state.idCard}
                    />
                </View>
                <View style={{height:563, backgroundColor:"#eee"}}>
                    <ClickScope style={{backgroundColor:"#fff",width:345,height:185,marginLeft:15,marginTop:11,
                        borderRadius:6,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <Image style={{width:19,height:19}} source={ImgSrc.UPLOAD_CARD}/>
                        <Text style={{fontSize:14,color:"#333",marginLeft:7}}>点击上传身份证正面</Text>
                    </ClickScope>
                    <ClickScope style={{backgroundColor:"#fff",width:345,height:185,marginLeft:15,marginTop:11,
                        borderRadius:6,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <Image style={{width:19,height:19}} source={ImgSrc.UPLOAD_CARD}/>
                        <Text style={{fontSize:14,color:"#333",marginLeft:7}}>点击上传身份证反面</Text>
                    </ClickScope>
                    <ClickScope
                        style = {{
                            backgroundColor:"#ddd",
                            width: 345,
                            height: 44,
                            marginLeft: 15,
                            justifyContent:"center",
                            alignItems:"center",
                            marginTop:11,
                            borderRadius:4
                        }}
                        onPress = {() => {
                            
                        }}
                    >
                        <Text style={{fontSize:18,color:"#666"}}>确认提交</Text>
                    </ClickScope>
                </View>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserVerified);