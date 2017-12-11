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
    RefreshControl,
    ListView,
    TouchableOpacity,
} from 'react-native';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';
import BaseComponent from '../Components/BaseComponent';
import ShoppingCartHeader from '../Components/ShoppingCartComponents/ShoppingCartHeader';
import ClickScope from '../Components/ClickScope';
import * as ImgSrc from '../Res/Images';
import styles from '../Styles/ShoppingCartStyles';
import requestData from '../NetWork/request';

export default class ShoppingCart extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            pageStatus: 'LOADING',
            isIntro: true,
            pageData: {},
            isRequestingShow: false
        }

        this.cartContentRender = this.cartContentRender.bind(this);
        this._renderRowWhouse = this._renderRowWhouse.bind(this);
        this._renderRowGoods = this._renderRowGoods.bind(this);
        this.dustbinRender = this.dustbinRender.bind(this);
        this.renderEditOrIntro = this.renderEditOrIntro.bind(this);
        this.footerBarRender = this.footerBarRender.bind(this);
    }

    componentWillMount() {
        requestData('/index/Cart/show_cart', 'POST')
        .then((data) => {
            if (data.errno == 0) {
                if (data.data.whGoods.length != 0) {
                    this.setState({
                        pageStatus: 'HASDATA',
                        pageData: data.data
                    });
                } else {
                    this.setState({
                        pageStatus: 'NODATA',
                        pageData: data.data
                    });
                }
            } else {
                alert(data.errmsg);
            }
        });
    }

    headerRender() {
        return (
            <ShoppingCartHeader
                headerTitle = {'购物车'}
                leftOnPress = {() => Actions.pop()}
                rightOnPress = {() => {
                    this.setState({
                        isIntro: !this.state.isIntro
                    })
                }}
                isIntro = {!this.state.isIntro}
            />
        );
    }

    pageNoDataRender() {
        return (
            <View style = {{flex: 1, flexDirection: 'column',alignItems: 'center'}}>
                <Image
                    style = {{height: 120, width: 120, marginTop: 88}}
                    source = {ImgSrc.SHPCART_NODATA}
                />
                <Text style = {{fontSize: 14, color: '#999999', marginTop: 16}}>
                    购物车空空如也，去看看心仪的商品吧~
                </Text>
            </View>
        );
    }

    dustbinRender(goodsId) {
        if (!this.state.isIntro) {
            return (
                <TouchableOpacity
                    onPress = {() => {
                        this.setState({isRequestingShow: true});
                        requestData('/index/Cart/update_cart', 'POST', 'goodsId=' + goodsId + '&num=0')
                        .then((data) => {
                            if (data.errno == 0) {
                                requestData('/index/Cart/show_cart', 'POST')
                                .then((datanext) => {
                                    if (datanext.errno == 0) {
                                        if (datanext.data.whGoods.length > 0) {
                                            this.setState({
                                                pageData: datanext.data,
                                                isRequestingShow: false
                                            });
                                        }else {
                                            this.setState({
                                                isRequestingShow: false,
                                                pageStatus: "NODATA"
                                            });
                                        }
                                    } else {
                                        this.setState({
                                            isRequestingShow: false
                                        });
                                        alert(datanext.errmsg);
                                    }
                                });
                            } else {
                                this.setState({isRequestingShow: false});
                                alert(data.errmsg);
                            }
                        });
                    }}
                >
                    <Image
                        style = {styles.imgStyle4}
                        source = {ImgSrc.IC_DUSTBIN}
                    />
                </TouchableOpacity>
            );
        }
    }

    renderEditOrIntro(goodsData, isIntro) {
        if (isIntro) {
            return (
                <View style = {styles.invalidRightNameView}>
                    <Text style = {[styles.whouseFooterIntroText, {width: 150}]}>
                        {goodsData.goodsName}
                    </Text>
                </View>
            );
        } else {
            return (
                <View style = {styles.invalidRightNameView}>
                    <TouchableOpacity
                        style = {styles.editBoxView}
                        onPress = {() => {
                            if (goodsData.num > 1) {
                                this.setState({isRequestingShow: true});
                                let num = goodsData.num - 1;

                                requestData('/index/Cart/update_cart', 'POST', 'goodsId=' + goodsData.goodsId + '&num=' + num)
                                .then((data) => {
                                    if (data.errno == 0) {
                                        requestData('/index/Cart/show_cart', 'POST')
                                        .then((datanext) => {
                                            if (datanext.errno == 0) {
                                                this.setState({
                                                    pageData: datanext.data,
                                                    isRequestingShow: false
                                                });
                                            } else {
                                                this.setState({
                                                    isRequestingShow: false
                                                });
                                                alert(datanext.errmsg);
                                            }
                                        });
                                    } else {
                                        this.setState({
                                            isRequestingShow: false
                                        });
                                        alert(data.errmsg);
                                    }
                                });
                            } else {
                                alert('不能再少了！');
                            }
                        }}
                    >
                        <Text style = {styles.whouseFooterIntroText}>
                            -
                        </Text>
                    </TouchableOpacity>

                    <View style = {styles.editAmountView}>
                        <Text style = {styles.whouseFooterIntroText}>
                            {goodsData.num}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style = {styles.editBoxView}
                        onPress = {() => {
                            console.log(goodsData);
                            if (parseInt(goodsData.num) >= parseInt(goodsData.stock)) {Alert.alert("库存不足！");return;}
                            this.setState({isRequestingShow: true});
                            let num = parseInt(goodsData.num) + 1;

                            requestData('/index/Cart/update_cart', 'POST', 'goodsId=' + goodsData.goodsId + '&num=' + num)
                            .then((data) => {
                                if (data.errno == 0) {
                                    requestData('/index/Cart/show_cart', 'POST')
                                    .then((datanext) => {
                                        if (datanext.errno == 0) {
                                            this.setState({
                                                pageData: datanext.data,
                                                isRequestingShow: false
                                            });
                                        } else {
                                            this.setState({
                                                isRequestingShow: false
                                            });
                                            alert(datanext.errmsg);
                                        }
                                    });
                                } else {
                                    this.setState({
                                        isRequestingShow: false
                                    });
                                    alert(data.errmsg);
                                }
                            });
                        }}
                    >
                        <Text style = {styles.whouseFooterIntroText}>
                            +
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    _renderRowGoods(goodsData) {
        return (
            <View style = {styles.validGoodsBarView}>
                <TouchableOpacity
                    onPress = {() => {
                        this.setState({isRequestingShow: true});
                        var updateChecked = goodsData.checked == 1 ? 0 : 1;

                        requestData('/index/Cart/update_cart', 'POST', 'goodsId=' + goodsData.goodsId + '&checked=' + updateChecked)
                        .then((data) => {
                            if (data.errno == 0) {
                                requestData('/index/Cart/show_cart', 'POST')
                                .then((datanext) => {
                                    if (datanext.errno == 0) {
                                        this.setState({
                                            pageData: datanext.data,
                                            isRequestingShow: false
                                        });
                                    } else {
                                        this.setState({
                                            isRequestingShow: false
                                        });
                                        alert(datanext.errmsg);
                                    }
                                });
                            } else {
                                this.setState({isRequestingShow: false});
                                alert(data.errmsg);
                            }
                        });
                    }}
                >
                    <Image
                        style = {styles.imgStyle2}
                        source = {goodsData.checked == 1 ? ImgSrc.CHECK_ORANGE : ImgSrc.CHECK_NULL}
                    />
                </TouchableOpacity>

                <View style = {styles.goodsBarInsideView}>
                    <Image
                        style = {styles.imgStyle3}
                        source = {{uri: goodsData.imgobj[0].url}}
                    />

                    <View style = {styles.goodsBarRightView}>
                        {this.renderEditOrIntro(goodsData, this.state.isIntro)}

                        <View style = {styles.goodsBarPriceAmountView}>
                            <Text style = {styles.whouseFooterIntroText}>
                                ¥{goodsData.goodsSalePrice}
                            </Text>
                            <Text style = {styles.goodsAmountText}>
                                x{goodsData.num}
                            </Text>
                            {this.dustbinRender(goodsData.goodsId)}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _renderRowWhouse(whouseData) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return (
            <View style = {{marginTop: 10}}>
                <View style = {styles.whouseHeaderView}>
                    <TouchableOpacity
                        onPress = {() => {
                            //this.setState({isRequestingShow: true});
                            let param = 'goods=[';
                            for (let i = 0; i < whouseData.goodsList.length; i++){
                                let updateChecked = whouseData.checked == 1 ? 0 : 1;
                                //param.goods.push({"goodsId": whouseData.goodsList[i].goodsId,"checked":updateChecked});
                                param += '{"goodsId": '+ whouseData.goodsList[i].goodsId+',"checked":'+updateChecked+'}';
                                if (i != whouseData.goodsList.length-1) {param += ","}
                            }
                            param += ']'
                            console.log(param);
                            requestData('/index/Cart/update_warehouse', 'POST', param)
                            .then((data) => {
                                console.log(data);
                                if (data.errno == 0) {
                                    requestData('/index/Cart/show_cart', 'POST')
                                    .then((datanext) => {
                                        if (datanext.errno == 0) {
                                            this.setState({
                                                pageData: datanext.data,
                                                isRequestingShow: false
                                            });
                                        } else {
                                            this.setState({
                                                isRequestingShow: false
                                            });
                                            alert(datanext.errmsg);
                                        }
                                    });
                                } else {
                                    this.setState({isRequestingShow: false});
                                    alert(data.errmsg);
                                }
                            });
                        }}
                    >
                        <Image
                            style = {styles.imgStyle2}
                            source = {whouseData.checked == 1 ? ImgSrc.CHECK_ORANGE : ImgSrc.CHECK_NULL}
                            resizeMode = {'stretch'}
                        />
                    </TouchableOpacity>
                    <Text style = {styles.whouseNameText}>
                        {whouseData.whName}
                    </Text>
                </View>

                <ListView
                    dataSource = {ds.cloneWithRows(whouseData.goodsList)}
                    renderRow = {this._renderRowGoods}
                />

                <View style = {styles.whouseFooterView}>
                    <View style = {styles.whouseFooterChildView}>
                        <Text style = {styles.whouseFooterIntroText}>本仓税费：</Text>
                        <Text style = {styles.whouseFooterIntroTextNx}>商品价格：</Text>
                        <Text style = {styles.whouseFooterIntroTextNx}>需支付：</Text>
                    </View>

                    <View style = {styles.whouseFooterChildView}>
                        <Text style = {styles.whouseFooterMoneyText}>¥{whouseData.taxMoney}</Text>
                        <Text style = {styles.whouseFooterMoneyTextNx}>¥{whouseData.itemMoney}</Text>
                        <Text style = {styles.whouseFooterMoneyTextNx}>¥{whouseData.payMoney}</Text>
                    </View>
                </View>
            </View>
        );
    }

    cartContentRender() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View>
                <ListView
                    dataSource = {ds.cloneWithRows(this.state.pageData.whGoods)}
                    renderRow = {this._renderRowWhouse}
                />
            </View>
        );
    }

    footerBarRender() {
        var data = this.state.pageData;

        return (
            <View style = {styles.footerBarView}>
                <View style = {styles.footerBarLeftView}>
                    <View style = {styles.checkAllBoxView}>
                        <TouchableOpacity
                            onPress = {() => {
                                this.setState({isRequestingShow: true});
                                var updateChecked = data.checked == 1 ? 'cancelselect' : 'select';

                                requestData('/index/Cart/update_cart', 'POST', 'checked=' + updateChecked)
                                .then((data) => {
                                    if (data.errno == 0) {
                                        requestData('/index/Cart/show_cart', 'POST')
                                        .then((datanext) => {
                                            if (datanext.errno == 0) {
                                                this.setState({
                                                    pageData: datanext.data,
                                                    isRequestingShow: false
                                                });
                                            } else {
                                                this.setState({
                                                    isRequestingShow: false
                                                });
                                                alert(datanext.errmsg);
                                            }
                                        });
                                    } else {
                                        this.setState({isRequestingShow: false});
                                        alert(data.errmsg);
                                    }
                                });
                            }}
                        >
                            <Image
                                style = {styles.imgStyle2}
                                source = {data.checked == 1 ? ImgSrc.CHECK_ORANGE : ImgSrc.CHECK_NULL}
                            />
                        </TouchableOpacity>
                        <Text style = {styles.textStyle6}>
                            全选
                        </Text>
                    </View>

                    <View style = {styles.introductionView}>
                        <Text style = {styles.textStyle4}>
                            总价：¥{data.allPayMoney}
                        </Text>
                        <Text style = {styles.textStyle5}>
                            (含税费¥{data.allTaxMoney}, 不含运费)
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style = {styles.settlementTouch}
                    onPress = {() => {
                        Actions.ConfirmOrder({page: "cart"});
                    }}
                >
                    <Text style = {styles.textStyle3}>结算</Text>
                </TouchableOpacity>
            </View>
        );
    }

    pageHasDataRender() {
        return (
            <View style = {{flex: 1, backgroundColor: '#f0f0f0'}}>
                <Modal
                    transparent = {true}
                    visible = {this.state.isRequestingShow}
                    onRequestClose = {() => {}}
                >
                    <View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{
                            height: 150,
                            width: 150,
                            backgroundColor: '#333333',
                            opacity: 0.3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8
                        }}>
                            <Text style = {{fontSize: 16, color: '#ffffff'}}>
                                正在加载
                            </Text>
                        </View>
                    </View>
                </Modal>
                <ScrollView
                    refreshControl = {
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {}}
                            colors={['#ff6700']}
                            progressBackgroundColor='#ffffff'
                        />
                    }
                >
                    {this.cartContentRender()}
                </ScrollView>
                {this.footerBarRender()}
            </View>
        );
    }

    render() {
        return super.rootSceneRender(this.state.pageStatus);
    }
}
