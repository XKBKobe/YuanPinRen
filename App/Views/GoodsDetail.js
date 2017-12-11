import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
    Alert,
    Modal,
    NativeAppEventEmitter,
    NativeModules
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from '../Components/BaseComponent';
import Header from '../Components/Header';
import ClickScope from '../Components/ClickScope';
import ButtonBar from '../Components/ButtonBar';
import * as ImgSrc from '../Res/Images';
import requestData from '../NetWork/request';

import Banner from '../Components/GoodsDetailComponents/Banner';
import GoodsIntro from '../Components/GoodsDetailComponents/GoodsIntro';
import Footer from '../Components/GoodsDetailComponents/Footer';
import ShareWindow from '../Components/GoodsDetailComponents/ShareWindow';
import BuyWindow from '../Components/GoodsDetailComponents/BuyWindow';
import GoodDetailHeader from '../Components/GoodsDetailComponents/GoodDetailHeader';

const GetBasicInfo = NativeModules.GetBasicInfo;

export default class GoodsDetail extends BaseComponent {
    constructor(props) {
        super(props);
        this.webview = null
        this.state = {
            pageStatus: 'LOADING',
            goodeDetailData: {},
            isBuyWindowShow: false,
            isShareWindowShow: false,
            isCouponCheck: true,
            buyGoodsNumber: 1,
            cartGoodsNum: 0,
            shareUrl: "",
            isWechatInstall: false,
            checkStatus: true,
        };

        this.renderComment = this.renderComment.bind(this);
        this.pageHasDataRender = this.pageHasDataRender.bind(this);
    }

    componentWillMount() {
        let goodsId = this.props.goodsId;
        requestData('/index/Item/item_detail', "POST", "goodsId="+goodsId)
        .then((data) => {
            if (0 == data.errno) {
                this.setState({pageStatus:"HASDATA", goodeDetailData:data.data});
            }else {
                alert(data.errmsg);
                this.setState({pageStatus:"NODATA"});
            }
        }, (error) => {

        });
        this.getCartGoodsNum();

        let self = this;
        NativeAppEventEmitter.addListener('WX_SHARE_SUCCESS', (params) => {
            console.log(" ------ 分享成功: ",params);
            let couponSn = self.state.shareUrl.couponSn
            if (!couponSn || couponSn.length < 1) { return;}
            console.log("    couponSN: ", couponSn);
            requestData('/index/coupon/change_coupon_num', 'POST', 'couponSn=' + couponSn)
            .then((data) => {
                console.log(" ------ callback: ",data);
            });
        });
        NativeAppEventEmitter.addListener('WX_SHARE_FAIL', (params) => {
            Alert.alert("分享失败!");
        });
    }

    getCartGoodsNum() {
        requestData('/index/Cart/get_cart_count', "POST")
        .then((data) => {
            if (0 == data.errno) {
                this.setState({cartGoodsNum: data.data});
            }else {
            }
        }, (error) => {

        });
    }

    getShareGoodUrl(check) {
        requestData('/index/Item/share_item_info', "POST","goodsId="+this.props.goodsId+"&checked="+check)
        .then((data) => {
            console.log(" ************** ", data, " ------------ check: ",check);
            if (0 == data.errno) {
                this.setState({shareUrl: data.data});
            }else {
            }
        }, (error) => {

        });
    }

    headerRender() {
        return (
            <GoodDetailHeader
                headerTitle = {'商品详情'}
                leftOnPress = {() => Actions.pop()}
            />
        );
    }

    renderComment(commentData) {
        return commentData.map((itemData, index) => {
            let imageUrl = itemData.professorImg.url ? itemData.professorImg.url : ImgSrc.IC_YUANPINREN;
            let date = new Date(parseInt(itemData.add_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
            return (
                <View style = {styles.commentItemView} key={index}>
                    <View style = {{flex: 1, paddingLeft: 15, alignItems: 'center',flexDirection: 'row'}}>
                        <Image
                            style = {{height: 36, width: 36, borderRadius: 20}}
                            source = {{uri: imageUrl}}
                        />
                    </View>
                    <View style = {{flex: 6, flexDirection: 'column'}}>
                        <View style = {{flex: 2, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',paddingRight: 15}}>
                            <Text style = {{fontSize: 12, color: '#333333'}}>
                                {itemData.professorName}
                            </Text>
                            <Text style = {{fontSize: 10, color: '#999999'}}>
                                {date}
                            </Text>
                        </View>
                        <View style = {{flex: 3, flexDirection: 'column', paddingRight: 15}}>
                            <Text style = {{fontSize: 10, color: '#666666', marginTop: 5}}>
                                {itemData.commentContent}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        });
    }

    async checkShareToWechat(goodData) {
        let result =  await GetBasicInfo.isWechatInstall();
        if (result == "fail") {Alert.alert("分享失败，请先安装微信！");return;}
        GetBasicInfo.shareToWechat("FRIEND",goodData.goodsName,goodData.goodBrief,goodData.imgUrl,goodData.link);
    }

    async checkCircleWechat(goodData) {
         let result =  await GetBasicInfo.isWechatInstall();
        if (result == "fail") {Alert.alert("分享失败，请先安装微信！");return;}
        GetBasicInfo.shareToWechat("CIRCLE",goodData.goodsName,goodData.goodBrief,goodData.imgUrl,goodData.link);
    }

    pageHasDataRender() {
        let self = this;
        if(!this.state.goodeDetailData){return <View></View>}
        let taxMoney = this.state.goodeDetailData.tax*100;
        let goodData = this.state.shareUrl;

        let status = this.state.isCouponCheck ? 1 : 0;
        return (
            <View style = {styles.rootView}>
                <Modal
                    transparent = {true}
                    visible = {this.state.isShareWindowShow}
                    onRequestClose = {() => {}}
                >
                    <ShareWindow
                        type = {goodData.type}
                        discount = {goodData.discount}
                        couponCount = {goodData.count}
                        hasCoupon = {goodData.hasCoupon}
                        shareWindowCloseHandle = {()=>{this.setState({isShareWindowShow:false})}}
                        wechatClickHandle = {()=>{
                            if (!goodData){Alert.alert("商品存在问题，无法分享！");return;}
                            self.checkShareToWechat(goodData)
                        }}
                        circleClickHandle = {()=>{
                            if (!goodData){Alert.alert("商品存在问题，无法分享！");return;}
                            self.checkCircleWechat(goodData);
                        }}
                        checkBoxClickHandle = {()=>{
                            let status = this.state.checkStatus;
                            this.setState({checkStatus: !status});
                            this.getShareGoodUrl(status ? 0 : 1);
                            this.setState({isCouponCheck:!this.state.isCouponCheck})
                        }}
                        checkCoupon = {this.state.isCouponCheck}
                    />
                </Modal>
                <Modal
                    transparent = {true}
                    visible = {self.state.isBuyWindowShow}
                    onRequestClose = {() => {}}
                >
                    <BuyWindow
                        buyWindowCloseHandle = {() => {self.setState({isBuyWindowShow: false})}}
                        minuseHandle = {() => {
                            if (this.state.buyGoodsNumber > 1) {
                                var num = this.state.buyGoodsNumber - 1;
                                this.setState({
                                    buyGoodsNumber: num
                                });
                            } else {
                                alert('不能再少了！')
                            }
                        }}
                        buyGoodsNumber = {this.state.buyGoodsNumber}
                        plusHandle = {() => {
                            var num = this.state.buyGoodsNumber + 1;
                            this.setState({
                                buyGoodsNumber: num
                            });
                        }}
                        addToCartHandle = {() => {
                            requestData('/index/Cart/add_cart', 'POST', 'goodsId=' + this.props.goodsId + '&num=' + this.state.buyGoodsNumber)
                            .then((data) => {
                                if (data.errno == 0) {
                                    self.getCartGoodsNum();
                                    self.setState({
                                        cartGoodsNum: data.data
                                    });
                                    Alert.alert('加入成功');
                                } else {
                                    alert(data.errmsg);
                                }
                            });
                        }}
                        buyImmediatelyHandle = {() => {
                            this.setState({
                                isBuyWindowShow: false
                            });
                            Actions.ConfirmOrder({page: "immediate", goodParam: 'goodsId=' + this.props.goodsId + '&num=' + this.state.buyGoodsNumber});
                        }}
                    />
                </Modal>
                <ScrollView>
                    <View style = {{height: 10}}/>
                    <Banner
                        bannerData = {this.state.goodeDetailData.imgobj}
                    />
                    <GoodsIntro
                        goodsData = {this.state.goodeDetailData}
                    />

                    <View style = {styles.commentTitleView}>
                        <Text style = {{color: '#333333', fontSize: 14}}>
                            专家评论
                        </Text>
                    </View>
                    {this.renderComment(this.state.goodeDetailData.professorComment)}
                    <ClickScope
                        style = {styles.seeCommentView}
                        onPress = {() => {Actions.AllComments({goodsId:this.props.goodsId})}}
                    >
                        <Text style = {{fontSize: 14, color: '#ff6700'}}>
                            查看全部点评
                        </Text>
                    </ClickScope>

                    <ButtonBar
                        style = {{marginTop: 10}}
                        title = {'分享：您将获得返点'+this.state.goodeDetailData.sharePercent+'元'}
                        isArrow = {true}
                    />
                    <ButtonBar
                        style = {{marginTop: 1}}
                        title = {'此处返利金额指最高分享奖励，即不使用优惠券时获得的分享奖。实际返利以最终成交价折算为准'}
                        isArrow = {true}
                    />
                    <ButtonBar
                        style = {{marginTop: 1}}
                        title = {'运费：订单实付满99免运费'}
                        isArrow = {true}
                    />
                    <ButtonBar
                        style = {{marginTop: 1,borderBottomWidth:1,borderBottomColor: '#dddddd'}}
                        title = {'税费：本商品适用税率'+taxMoney.toFixed(2)+'%'}
                        isArrow = {true}
                    />

                    {/*<View style = {styles.pullView}>
                        <Image
                            style = {{width: 14, height: 7}}
                            source = {ImgSrc.IC_UP_ARROW}
                        />
                        <Text style = {{fontSize: 12, color: '#333333',marginLeft: 4}}>
                            上拉查看图文详情
                        </Text>
                    </View>*/}
                    {this.renderDetailImg(this.state.goodeDetailData.descApp)}
                </ScrollView>

                <Footer
                    cartGoodsNum = {this.state.cartGoodsNum}
                    addToCartClick = {() => {this.getShareGoodUrl(status); this.setState({isShareWindowShow: true})}}
                    buyImmediatelyClick = {() => {this.setState({isBuyWindowShow: true})}}
                />
            </View>
        );
    }

    //渲染图文详情
    renderDetailImg(imgs) {
        if (imgs) {
        return imgs.map((item, index) => {
            return <Image key={index} style={{height:item.height/2,width:item.width/750*Dimensions.get('window').width}} source = {{ uri: item.url}} />;
        });
        } else {
        return <View></View>;
        }
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
    commentTitleView: {
        height: 36,
        backgroundColor: '#ffffff',
        marginTop: 10,
        flexDirection: 'row',
        paddingLeft: 15,
        alignItems: 'center'
    },
    commentItemView: {
        marginTop: 1,
        height:72,
        backgroundColor: '#ffffff',
        flexDirection: 'row'
    },
    seeCommentView: {
        height: 44,
        backgroundColor: '#ffffff',
        marginTop:1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd'
    },
    pullView: {
        height: 44,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 33
    }
});
