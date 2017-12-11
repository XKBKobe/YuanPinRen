import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    NativeModules
} from 'react-native';
import BaseComponent from '../Components/BaseComponent';
import { Actions, ActionConst } from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import * as ImgSrc from '../Res/Images';
import ViewPager from "react-native-viewpager";
import requestData from '../NetWork/request';

const GetBasicInfo = NativeModules.GetBasicInfo;

export default class Psychologist extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: "LOADING",
            homeData: null,
        }

        this.renderOriginItems = this.renderOriginItems.bind(this);
        this.recommendJumpHandle = this.recommendJumpHandle.bind(this);
    }

    componentDidMount() {
        let psyId = this.props.psyId;
        requestData('/index/Index/professor_info', "POST", "professorId="+psyId)
        .then((data) => {
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA",homeData:data.data});
            }else {
                if (data.errno == 100003 || data.errno == 100013) {
                }
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA"});
            }
        }, (error) => {

        });
    }

    componentWillUnmount() {
        this.props.psyId = "";
        this.setState({pageStatus:"NODATA",homeData:null});
    }

    headerRender() {
        return (
             <Header
                headerTitle = {'专家信息'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    async recommendJumpHandle(item) {
        var loginStatus = await GetBasicInfo.getLoginStatus();

        if (loginStatus == 'false') {
            Actions.WelcomeLogin({type: ActionConst.REPLACE});
        } else {
            Actions.GoodsDetail({goodsId: item.goodsId});
        }
    }

    renderOriginItems(originData) {
        if(!originData) {return;}
        let self = this;
        return originData.map(function(item, index) {
            let imgurl = item.imgobj.url;
            let leftLength = 10;
            //if (index == 0) {leftLength = 8;}
            return (
                <TouchableOpacity style={{flexDirection:"column",width:110,marginLeft:leftLength}} key={index}
                    onPress = {() => self.recommendJumpHandle(item)}
                >
                    <Image source={{uri: imgurl}} style={{height:88,width:110}}/>
                    <View style={{flexDirection:"column"}}>
                        <Text style={{fontSize:12,color:"#333",marginTop:15}} numberOfLines= {1}>{item.goodsName}</Text>
                        <View style={{flexDirection:"row",marginTop:5}}>
                            <Text style={{color:"#ff6700", fontSize:13}}>￥{item.goodsSalePrice}</Text>
                            <Text style={{color:"#999", fontSize:10,marginLeft:6,marginTop:3,textDecorationLine:"line-through"}}

                            >￥{item.goodsMsrp}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        });
    }

    renderProductViedo() {
        if(!this.state.homeData) {return;}
        let productOrigin = this.state.homeData.goodsInfo;
        if (!productOrigin || productOrigin.length < 1) {return;}
        return (
            <View style={{height:189}}>
                {this.renderTitleBar("源品推荐",2)}
                <View style={{flexDirection:"row",flexWrap:"wrap",marginTop:8}}>
                    {this.renderOriginItems(productOrigin)}
                </View>
            </View>
        )
    }

    renderAvatar() {
        let professor = this.state.homeData;
        if (!professor) {return <View></View>}
        return (
            <View>
                <View style={{flexDirection:"column",height:173,justifyContent:"center",alignItems:"center"}}>
                    <Image
                        style = {{height: 70, width: 70, borderRadius: 32}}
                        source={{uri: professor.professorImg.url}}
                    />
                    <Text style={{color:"#333",fontSize:16,marginTop:14}}>{professor.professorName}</Text>
                    <Text style={{color:"#666",fontSize:12,marginTop:4}}>{professor.professorJob}</Text>
                </View>
                <View style={{height:1,backgroundColor:"#eee"}}></View>
                <View style={{height:160}}>
                    <Text style={{fontSize:14, color:"#333",marginLeft:14,marginTop:9}}>个人简介</Text>
                    <Text style={{marginTop:7,marginLeft:14,fontSize:12,color:"#666",width:348}}>
                        {professor.professorBrief}
                    </Text>
                </View>
                <View style={{backgroundColor:"#eee",height:10}}></View>
                <View style={{height:160}}>
                    <Text style={{marginTop:9,marginLeft:15,fontSize:14,color:"#333"}}>好文推荐</Text>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={() => Actions.Webview({url: professor.articleUrl})}>
                        <Image style={{width:124,height:100,marginTop:10,marginLeft:15}}
                            source={{uri: professor.articleImg.url}}
                        />
                        <View style={{flexDirection:"column"}}>
                            <Text style={{color:"#333",fontSize:12,marginLeft:15,marginTop:31,width:206}}
                                numberOfLines={1}
                            >
                                {professor.articleTitle}
                                </Text>
                            <Text style={{color:"#999",fontSize:12,marginLeft:15,marginTop:10,width:206}}>
                                {professor.articleBrief}
                                </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderTitleBar(title, pageId) {
        return (
            <View>
                <View style={{backgroundColor:"#eee", height:12}}></View>
                <View style={{flexDirection: 'row', justifyContent:"space-between",width:345,marginLeft:15,marginTop:9}}>
                    <Text style={{fontSize:14,color:"#333"}}>{title}</Text>
                </View>
            </View>
        )
    }

    render() {
       return (
            <View>
                {this.headerRender()}
                <ScrollView style={{height:600}}>
                    {this.renderAvatar()}
                    {this.renderProductViedo()}
                    <View style={{height:11,backgroundColor:"#eee",marginBottom:11}}></View>
                </ScrollView>
            </View>
        )
    }
}
