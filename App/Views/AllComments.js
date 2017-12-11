import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    StyleSheet,
    Image,
    Alert,
    Modal,
    ListView
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from '../Components/BaseComponent';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import * as ImgSrc from '../Res/Images';
import requestData from '../NetWork/request';

const TEST_SPLENDID_COMMENT = {
    profile:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490335744131&di=ac7a22938922f273bd2817985551efbf&imgtype=0&src=http%3A%2F%2Ftupian.qqjay.com%2Ftou3%2F2016%2F0702%2F90f8a105b08f97054002b86c5aace20d.jpg',
    name:'周技师',
    date:'2017-03-28',
    job:' 浙江大学营养学教授',
    comment:'鱼油是鱼体内的全部油类物质的统称，它包括体油、肝油和脑油，主鱼油是一种从多脂鱼类提取的油脂，富含ω-3系多不饱和脂肪酸（DHA和EPA），具有抗炎、调节血脂等健康益处。广义上的鱼油既指胶囊等形态的鱼油制剂，又指鱼体内的脂肪，主要功能性成分是其中的ω-3系多不饱和脂肪酸。对心脑血管有积极作用，每天坚持两粒一段时间后就会见效果，值得推荐！',
    isConfirm: true
};

const TEST_COMMENTS_DATA = [
    {
        profile: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490335744130&di=df72d357c1f5dd2e165be0a167778e8d&imgtype=0&src=http%3A%2F%2Fimgs.duoyun.io%2Fnews%2Fd0%2Fa3%2Fd0a33466e7ca4db2bdae9130060c8105.jpg',
        name: '赵技师',
        date: '2017-03-06',
        comment: '东西比较新鲜，口感良好，价格也比较良心，真心不错！'
    },
    {
        profile: 'http://up.qqjia.com/z/13/tu15049_16.jpg',
        name: 'X技师',
        date: '2017-03-06',
        comment: '该品富含人体所需的不饱和脂肪酸，DHA和EPA等，对心脑血管有积极作用，每天坚持两粒一段时间后就会见效果，简直是不可多得的好产品！强烈推荐！'
    },
    {
        profile: 'http://www.itouxiang.net/uploads/allimg/140422/1_140422083531_1.jpg',
        name: 'X技师',
        date: '2017-03-06',
        comment: '东西比较新鲜，口感良好，价格也比较良心，真心不错！'
    },
    {
        profile: 'http://www.touxiang.cn/uploads/20130730/30-062138_355.jpg',
        name: 'X技师',
        date: '2017-03-06',
        comment: '该品富含人体所需的不饱和脂肪酸，对心脑血管有积极作用，每天坚持两粒一段时间后就会见效果，值得推荐！'
    },
    {
        profile: 'http://img3.duitang.com/uploads/item/201609/23/20160923030528_3w2sU.thumb.224_0.jpeg',
        name: 'X技师',
        date: '2017-03-06',
        comment: '东西比较新鲜，口感良好，价格也比较良心，真心不错！'
    },
    {
        profile: 'http://img.popoho.com/UploadPic/2012-1/2012111152455534.jpg',
        name: 'X技师',
        date: '2017-03-06',
        comment: '该品富含人体所需的不饱和脂肪酸，DHA和EPA等，对心脑血管有积极作用，每天坚持两粒一段时间后就会见效果，简直是不可多得的好产品！强烈推荐！'
    },
    {
        profile: 'http://b.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=18426e215f6034a829b7b085fe236562/2934349b033b5bb5488dc7de35d3d539b600bcbc.jpg',
        name: 'X技师',
        date: '2017-03-06',
        comment: '该品富含人体所需的不饱和脂肪酸，DHA和EPA等，对心脑血管有积极作用，每天坚持两粒一段时间后就会见效果，简直是不可多得的好产品！强烈推荐！'
    },
    {
        profile: 'http://img.popoho.com/UploadPic/2012-1/2012111152455688.jpg',
        name: 'X技师',
        date: '2017-03-06',
        comment: '该品富含人体所需的不饱和脂肪酸，DHA和EPA等，对心脑血管有积极作用，每天坚持两粒一段时间后就会见效果，简直是不可多得的好产品！强烈推荐！'
    },
    {
        profile: 'http://www.feizl.com/upload2007/2015_03/150313161693306.png',
        name: 'X技师',
        date: '2017-03-06',
        comment: '该品富含人体所需的不饱和脂肪酸，DHA和EPA等，对心脑血管有积极作用，每天坚持两粒一段时间后就会见效果，简直是不可多得的好产品！强烈推荐！'
    }
];

export default class AllComments extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            commentDatas: []
        };

        this.commentItemRender = this.commentItemRender.bind(this);
    }

    componentWillMount() {
        let goodsId = this.props.goodsId;
        requestData('/index/item/item_comment_list', "POST", "goodsId="+goodsId+"&page=1&pageSize=16")
        .then((data) => {
            if (0 == data.errno) {
                if (data.data.total == 0) {
                    this.setState({pageStatus:"NODATA"});
                }else {
                    this.setState({pageStatus:"HASDATA", commentDatas:data.data.data});
                }
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
                headerTitle = {'全部点评'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    pageNoDataRender() {
        return (
            <View style = {styles.contentView}>
                <Text>暂时没有评论</Text>
            </View>
        )
    }

    commentItemRender(itemData, index) {
    if (index == 0) {return <View></View>}
    let imageUrl = itemData.professorImg.url ? {uri:itemData.professorImg.url} : ImgSrc.IC_YUANPINREN;
    console.log(imageUrl);
    let date = new Date(parseInt(itemData.add_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        return (
            <View style = {{flexDirection:'row',backgroundColor:'#ffffff',marginTop:1,paddingTop:12,paddingBottom:12}}>
                <View style = {{flex:1, paddingLeft:15,flexDirection:'column'}}>
                    <Image
                        style = {{width:36,height:36,borderRadius:20}}
                        source = {imageUrl}
                    />
                </View>
                <View style = {{flex:7,flexDirection:'column'}}>
                    <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingRight:8}}>
                        <Text style = {{fontSize: 12, color: '#333333'}}>
                            {itemData.professorName}
                        </Text>
                        <Text style = {{fontSize: 10, color: '#999999'}}>
                            {date}
                        </Text>
                    </View>
                    <Text style = {{fontSize:10,color:'#666666',paddingRight:13,marginTop:4}}>
                        {itemData.commentContent}
                    </Text>
                </View>
            </View>
        );
    }

    pageHasDataRender() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let spledidCommentData = this.state.commentDatas[0];
        let date = new Date(parseInt(spledidCommentData.add_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        return (
            <View style = {styles.rootView}>
                <ScrollView>
                    <View style = {{height: 10}}/>
                    <View style = {styles.splendidCommentView}>
                        <View style = {{flex:1, paddingLeft:15,paddingTop:12,flexDirection:'column'}}>
                            <Image
                                style = {{width:36,height:36,borderRadius:20}}
                                source = {{uri:spledidCommentData.professorImg.url}}
                            />
                        </View>
                        <View style = {{flex:7,paddingTop:12,flexDirection:'column'}}>
                            <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingRight:8}}>
                                <View style = {{flexDirection:'row',alignItems:'center'}}>
                                    <Text style = {{fontSize: 12,color: '#333333'}}>
                                        {spledidCommentData.professorName}
                                    </Text>
                                    <Image
                                        style = {{height:12,width:14,marginLeft:10}}
                                        source = {ImgSrc.IC_CONFIRM}
                                    />
                                </View>
                                <Text style = {{fontSize: 10,color: '#999999'}}>
                                    {date}
                                </Text>
                            </View>
                            <Text style = {{fontSize: 10, color: '#999999'}}>
                                {spledidCommentData.professJob}
                            </Text>
                            <Text style = {{fontSize: 10, color: '#666666',paddingRight: 13, marginTop: 5}}>
                                {spledidCommentData.commentContent}
                            </Text>
                            <View style = {{flex:1,flexDirection:'row',paddingRight:13,justifyContent:'flex-end',alignItems:'flex-end'}}>
                                <Image
                                    style = {{width: 69,height:25}}
                                    source = {ImgSrc.SPLEDID_COMMENT}
                                />
                            </View>
                        </View>
                    </View>

                    <View style = {{height: 10}}/>

                    <ListView
                        dataSource = {ds.cloneWithRows(this.state.commentDatas)}
                        renderRow = {this.commentItemRender}
                    />

                    <View style = {{height: 20}}/>
                </ScrollView>
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f0f0f0'
    },
    splendidCommentView: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
    },
    contentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
