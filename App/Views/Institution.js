import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    NativeModules,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity, Alert
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

export default class Institution extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: "LOADING",
            homeData: null,
            isUseful: true,
            appUrl: ""
        }

        this.renderBannerRow = this.renderBannerRow.bind(this);
        this.renderBanner = this.renderBanner.bind(this);

        this.bannerJumpHandle1 = this.bannerJumpHandle1.bind(this);
        this.bannerJumpHandle2 = this.bannerJumpHandle2.bind(this);
    }

    async componentWillMount() {
        //检测版本
        let self = this;
        let appVersion = await GetBasicInfo.getAppVersion();
        requestData('/index/other/update_version', 'POST', 'version='+appVersion)
        .then((data) => {
            /**
            Alert.alert("提示", '当前版本无法使用，请下载最新版本！', [
                {text: 'OK', onPress: () => GetBasicInfo.openAppStore('https://itunes.apple.com/cn/app/%E6%BA%90%E5%93%81%E4%BA%BA/id1239681699?mt=8')},
            ]);
             **/
            if (data.data.version == 2) {
                //todo
                //self.setState({isUseful: true, appUrl: data.data.url});
            }
        }, (error) => {

        });
        
        requestData('/index/index/index', "POST")
        .then((data) => {
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA",homeData:data.data});
                if (data.data.loginStatus) {
                    GetBasicInfo.setLoginStatus('true');
                } else {
                    GetBasicInfo.setLoginStatus('false');
                }

            }else {
                if (data.errno == 100003 || data.errno == 100013) {
                    this.setState({pageStatus:"NODATA"});
                    GetBasicInfo.setLoginStatus("false");
                    Actions.WelcomeLogin({type: ActionConst.RESET});
                }
                console.log('WelcomeLogin  '+JSON.stringify(data));
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA"});
            }
        }, (error) => {

        });
    }

    async bannerJumpHandle2(data) {
        var loginStatus = await GetBasicInfo.getLoginStatus();

        if (loginStatus == 'false') {
            Actions.WelcomeLogin({type: ActionConst.REPLACE});
        } else {
            Actions.GoodsDetail({goodsId: data.type_id});
        }
    }

    renderBannerRow(data, pageID) {
		let imgURL = data.img.url;
		return (
            <TouchableOpacity onPress={() => this.bannerJumpHandle2(data)}>
                <Image style={{height: 160, width:Dimensions.get('window').width}} key={pageID} source = {{uri: imgURL}} />
            {/* <TouchableOpacity onPress={() => Actions.GoodsDetail({goodsId: data.type_id})}>
                <Image style={{height: 160, width:Dimensions.get('window').width}} key={pageID} source = {{uri: imgURL}} /> */}
            </TouchableOpacity>
        );
	}

    async bannerJumpHandle1(bannerList) {
        var loginStatus = await GetBasicInfo.getLoginStatus();

        if (loginStatus == 'false') {
            Actions.WelcomeLogin({type: ActionConst.REPLACE});
        } else {
            Actions.GoodsDetail({goodsId: bannerList[0].type_id});
        }
    }

    renderBanner() {
        if(!this.state.homeData) {return;}
        let bannerList = this.state.homeData.slideList;
        if (!bannerList || bannerList.length < 1) {return;}

        if (bannerList.length == 1) {
            return (
                <TouchableOpacity
                    onPress={() => this.bannerJumpHandle1(bannerList)}
                >
                    <Image style={{height: 160, width:Dimensions.get('window').width}} source = {{uri: bannerList[0].img.url}} />
                {/* <TouchableOpacity onPress={() => Actions.GoodsDetail({goodsId: bannerList[0].type_id})}>
                    <Image style={{height: 160, width:Dimensions.get('window').width}} source = {{uri: bannerList[0].img.url}} /> */}
                </TouchableOpacity>
            )
        }

        let bannerSource = new ViewPager.DataSource({
			pageHasChanged: (p1, p2) => p1 !== p2
		});

		bannerSource = bannerSource.cloneWithPages(bannerList);

		return <ViewPager dataSource={bannerSource} renderPage={this.renderBannerRow} autoPlay={true} isLoop={true} />;
    }

    headerRender() {
        return (
            <Header
                isLeft = {true}
                headerTitle = {'研究院'}
            />
        );
    }

    renderHealthButtons(healthData) {
        if(!healthData) {return;}
        return healthData.map(function(item, index) {
            let imgurl = item.professorImg.url;
            let leftLength = 17;
            //console.log(item);
            //if (index == 0) {leftLength = 8;}
            return (
                <TouchableOpacity style={{flexDirection:"column",width:102/375*Dimensions.get('window').width,marginLeft:leftLength,justifyContent:"center",alignItems:"center"}} key={index}
                    onPress = {() => Actions.Psychologist({psyId: item.professId})}
                >
                    <Image source={{uri: imgurl}} style={{height:72,width:72,borderRadius:36}}/>
                    <Text style={{fontSize:12,color:"#333",marginTop:9}}>{item.professorName}</Text>
                    <Text style={{fontSize:10,color:"#666",marginTop:6}}>{item.professorJob}</Text>
                </TouchableOpacity>
            )
        });
    }

    renderHealth() {
        if(!this.state.homeData) {return;}
        let professorList = this.state.homeData.professorList;
        if (!professorList || professorList.length < 1) {return;}
        return (
            <View style={{height:185}}>
                {this.renderTitleBar('健康专家',1)}
                <View style={{flexDirection:"row",flexWrap:"wrap",marginTop:11}}>
                    {this.renderHealthButtons(professorList)}
                </View>
            </View>
        )
    }

    renderOriginItems(originData) {
        if(!originData) {return;}
        return originData.map(function(item, index) {
            //console.log(item);
            let imgurl = item.img.url;
            let leftLength = 10;
            //if (index == 0) {leftLength = 8;}
            return (
                <TouchableOpacity style={{flexDirection:"column",width:110,marginLeft:leftLength}} key={index}
                    onPress = {() => Actions.Webview({url: item.url})}
                >
                    <Image source={{uri: imgurl}} style={{height:88,width:110}}/>
                    <Text style={{fontSize:12,color:"#333",marginTop:15}} numberOfLines= {1}>{item.brief}</Text>
                </TouchableOpacity>
            )
        });
    }

    renderProductViedo() {
        if(!this.state.homeData) {return;}
        let productOrigin = this.state.homeData.productOrigin;
        if (!productOrigin || productOrigin.length < 1) {return;}
        return (
            <View style={{height:189}}>
                {this.renderTitleBar('产品溯源',2)}
                <View style={{flexDirection:"row",flexWrap:"wrap",marginTop:8}}>
                    {this.renderOriginItems(productOrigin)}
                </View>
            </View>
        )
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
                        <Text style={{fontSize:12,color:"#666",width:206,marginTop:11}}>{item.brief}</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }

    renderSicenc() {
        if(!this.state.homeData) {return;}
        let scienceCenter = this.state.homeData.scienceCenter;
        if (!scienceCenter || scienceCenter.length < 1) {return;}
        return (
            <View>
                {this.renderTitleBar('科学中心',3)}
                {this.renderScienceItems(scienceCenter)}
            </View>
        )
    }

    /**
     * @method: 渲染更多的显示条
     * @param: title -- 名字
     *         pageId -- 1，对于专家列表页；2，对应溯源；3，对应科学中心
     */
    renderTitleBar(title, pageId) {
        return (
            <View>
                <View style={{backgroundColor:"#eee", height:12}}></View>
                <View style={{flexDirection: 'row', justifyContent:"space-between",width:345/375*Dimensions.get('window').width,marginLeft:15,marginTop:9}}>
                    <Text style={{fontSize:14,color:"#333"}}>{title}</Text>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                        switch(pageId) {
                            case 1:{
                                Actions.HealthProfessor();
                                break;
                            }
                            case 2: {
                                Actions.ProductOrigin();
                                break;
                            }
                            case 3: {
                                Actions.ScienceCenter();
                                break;
                            }
                        }
                    }}>
                        <Text style={{fontSize:12,color:"#666"}}>更多</Text>
                        <Image
                            style = {{ height: 12, width: 7,marginLeft:8}}
                            source = {ImgSrc.IC_RIGHT_ARROW}
                            resizeMode = {'stretch'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        if(!this.state.isUseful) {

            /**
            let self = this;
            return <View style={{flex: 1, flexDirection: 'column',alignItems: 'center',
            justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => GetBasicInfo.openAppStore(self.state.appUrl)}>
                    <Text>当前版本无法使用，请下载最新版本！</Text>
                </TouchableOpacity>
            </View>
            **/


        }
       return (
            <View>
                {this.headerRender()}
                <ScrollView style={{height:560/667*Dimensions.get('window').height}}>
                    <View style={{height:160}}>
                        {this.renderBanner()}
                    </View>
                    {this.renderHealth()}
                    {this.renderProductViedo()}
                    {this.renderSicenc()}
                    <View style={{height:11,backgroundColor:"#eee",marginBottom:11}}></View>
                </ScrollView>
            </View>
        )
    }
}
