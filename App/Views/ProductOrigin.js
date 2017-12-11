import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity
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

export default class ProductOrigin extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: "LOADING",
            originList: null,
        }
    }

    componentWillMount() {
        requestData('/index/Index/product_trace', "POST")
        .then((data) => {
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA",originList:data.data.data});
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
                leftOnPress = {() => Actions.pop()}
                headerTitle = {'产品溯源'}
            />
        );
    }

   renderScienceItems(scienceData) {
        if(!scienceData) {return;}
        return scienceData.map(function(item, index) {
            let imgurl = item.img.url;
            let leftLength = 15;
            //if (index == 0) {leftLength = 8;}
            return (
                <TouchableOpacity style={{flexDirection:"row",height:130,borderBottomWidth: 1,borderStyle: "solid",borderBottomColor: "#eee",}} key={index}
                   onPress = {() => Actions.Webview({url: item.url})}
                >
                    <Image source={{uri: imgurl}} style={{marginLeft:15,height:88,width:110,marginTop:20}}/>
                    <View style={{flexDirection:"column",marginLeft:29,marginTop:20}}>
                        <Text style={{fontSize:12,color:"#333",width:202,marginTop:15}}>{item.name}</Text>
                        <Text style={{fontSize:12,color:"#666",width:206,marginTop:11}} numberOfLines= {2}>{item.brief}</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }

    renderSicenc() {
        if(!this.state.originList) {return;}
        let scienceCenter = this.state.originList;
        if (!scienceCenter || scienceCenter.length < 1) {return;}
        return (
            <View>
                {this.renderScienceItems(scienceCenter)}
            </View>
        )   
    }

    render() {
       return (
            <View>
                {this.headerRender()}
                <View style={{height:6,backgroundColor:"#eee"}}></View>
                <ScrollView style={{height:597}}>
                    {this.renderSicenc()}
                </ScrollView>
            </View>
        )
    }
}