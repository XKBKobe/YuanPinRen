import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
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

export default class HealthProfessor extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: "LOADING",
            professorList: null,
        }
    }

    componentWillMount() {
        requestData('/index/Index/professor_list', "POST")
        .then((data) => {
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA",professorList:data.data.data});
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
                headerTitle = {'健康专家'}
            />
        );
    }

    renderHealthButtons(healthData) {
        
        if(!healthData) {return;}
        return healthData.map(function(item, index) {
            let imgurl = item.professorImg.url;
            return (
                <TouchableOpacity style={{flexDirection:"column",alignItems:"center",width:180/375*Dimensions.get('window').width,height:200/667*Dimensions.get('window').height,marginLeft:4/375*Dimensions.get('window').width,marginTop:4,backgroundColor:"#fff"}} key={index}
                    onPress = {() => {
                        Actions.Psychologist({psyId: item.professId})
                    }}
                >
                    <Image source={{uri: imgurl}} style={{height:72,width:72,marginTop:30,borderRadius:36}}/>
                    <Text style={{fontSize:12,color:"#333",marginTop:21}}>{item.professorName}</Text>
                    <Text style={{fontSize:10,color:"#666",marginTop:6}}>{item.professorJob}</Text>
                </TouchableOpacity>
            )
        });
    }

    renderHealth() {
        if(!this.state.professorList) {return;}
        let professorList = this.state.professorList;
        if (!professorList || professorList.length < 1) {return;}
        return (
            <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                {this.renderHealthButtons(professorList)}
            </View>
        )
    }

    render() {
       return (
            <View>
                {this.headerRender()}
                <View style={{height:6,backgroundColor:"#eee"}}></View>
                <ScrollView style={{height:597/667*Dimensions.get('window').height,backgroundColor:"#eee"}}>
                    {this.renderHealth()}
                    <View style={{height:16,backgroundColor:"#eee"}}></View>
                </ScrollView>
            </View>
        )
    }
}