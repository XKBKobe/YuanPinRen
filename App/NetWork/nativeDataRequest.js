/**
 * Create Time: 2016/10/11
 * Creator: ZhangZhao
 * Introduction: Native网络请求，解决加密请求问题
 */
import React from 'React';
import {
    Platform,
    NativeModules,
} from 'react-native';

import * as RequestMiddle from './requestMiddle';

var AndroidNetRequest = NativeModules.AndroidNetRequest;

export function getBannerData() {
    return new Promise((resolve, reject) => {
        RequestMiddle.getBannerData()
        .then((data) => {
            resolve(data);
        });
    });
}

export function getCategoryData() {
    return new Promise((resolve, reject) => {
        RequestMiddle.NoParamRequest('/item/get/topsimplecategorys')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getShoppingCartData() {
    return new Promise((resolve, reject) => {
        RequestMiddle.NoParamRequest('/order/get/showcart')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getSpecialActsClientData() {
    return new Promise((resolve, reject) => {
        RequestMiddle.NoParamRequest('/item/get/specialactsclient')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getSelectData() {
    return new Promise((resolve, reject) => {
        RequestMiddle.NoParamRequest('/market/get/speciallyselected')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getRecommendGoodsData() {
    return new Promise((resolve, reject) => {
        RequestMiddle.NoParamRequest('/item/get/recommendgoods')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getGoodsDetailData(goodsId) {
    return new Promise((resolve, reject) => {
        RequestMiddle.GoodsIdRequest(goodsId, '/item/get/goodsbasicinfobygoodsid')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getGoodsImageDetailData(goodsId) {
    return new Promise((resolve, reject) => {
        RequestMiddle.GoodsIdRequest(goodsId, '/item/get/goodsdetailsbyid')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getLoginCheckWords(mobile) {
    return new Promise((resolve, reject) => {
        RequestMiddle.MobileRequest(mobile, '/user/message/login_code')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getRegisterCheckWords(mobile) {
    return new Promise((resolve, reject) => {
        RequestMiddle.MobileRequest(mobile, '/user/message/register_code')
        .then((data) => {
            resolve(data);
        });
    });

}

export function getGetBackPasswordCheckWords(mobile) {
    return new Promise((resolve, reject) => {
        RequestMiddle.MobileRequest(mobile, '/user/message/pwd_code')
        .then((data) => {
            resolve(data);
        });
    });

    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.getGetBackPasswordCheckWords(mobile, (successData) => {
    //         resolve(JSON.parse(successData));
    //     }, (errorData) => {
    //         reject(true);
    //     });
    // });
}

export function checkWordsLoginIn(mobile, codeNum) {
    return new Promise((resolve, reject) => {
        RequestMiddle.checkWordsLoginIn(mobile, codeNum)
        .then((data) => {
            resolve(data);
        });
    });
    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.checkWordsLoginIn(mobile, codeNum, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function passWordLoginIn(username, password) {
    return new Promise((resolve, reject) => {
        RequestMiddle.passWordLoginIn(username, password)
        .then((data) => {
            resolve(data);
        })
    });

    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.passWordLoginIn(username, password, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function register(mobile, code, password, passwordRepeat, type = '2') {
    return new Promise((resolve, reject) => {
        RequestMiddle.register(mobile, code, password, passwordRepeat, type)
        .then((data) => {
            resolve(data);
        });
    });
    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.register(mobile, code, password, passwordRepeat, type, (successData) => {
    //         resolve(JSON.parse(successData));
    //     }, (errorData) => {
    //         reject(true);
    //     });
    // });
}

export function getBackPassword(mobile, code, password, passwordRepeat) {
    return new Promise((resolve, reject) => {
        RequestMiddle.getBackPassword(mobile, code, password, passwordRepeat)
        .then((data) => {
            resolve(data);
        });
    });
    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.getBackPassword(mobile, code, password, passwordRepeat, (successData) => {
    //         resolve(JSON.parse(successData));
    //     }, (errorData) => {
    //         reject(true);
    //     });
    // });
}

export function loginOut() {
    return new Promise((resolve, reject) => {
        RequestMiddle.NoParamRequest('/user/deleteec/logout')
        .then((data) => {
            resolve(data);
        });
    });

    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.loginOut((successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function addGoodsToCart(goods) {
    return new Promise((resolve, reject) => {
        RequestMiddle.addGoodsToCart(goods)
        .then((data) => {
            resolve(data);
        });
    });
    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.addGoodsToCart(goods, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function updateCart(goods) {
    return new Promise((resolve, reject) => {
        RequestMiddle.updateCart(goods)
        .then((data) => {
            resolve(data);
        });
    });
    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.updateCart(goods, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function directChange(goodsId, amount) {
    return new Promise((resolve, reject) => {
        RequestMiddle.directChange(goodsId, amount)
        .then((data) => {
            resolve(data);
        });
    });
    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.directChange(goodsId, amount, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function getCartCount() {
    return new Promise((resolve, reject) => {
        RequestMiddle.NoParamRequest('/order/get/getcartcount')
        .then((data) => {
            resolve(data);
        });
    });

    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.getCartCount((successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function directPurchase(goods, couponType, couponId) {
    return new Promise((resolve, reject) => {
        RequestMiddle.directPurchase(goods, couponType, couponId)
        .then((data) => {
            resolve(data);
        });
    });
    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.directPurchase(goods, couponType, couponId, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

const AddressData = [
    {is_default:1,consignee:'李四',mobile:"18155435344",province:"浙江省",city:"杭州市",district:"余杭区",address:"华立科技园"},
    {is_default:1,consignee:'张三',mobile:"18158115554",province:"浙江省",city:"杭州市",district:"余杭区",address:"华立科技园"},
    {is_default:2,consignee:'王五',mobile:"18166666666",province:"浙江省",city:"杭州市",district:"余杭区",address:"华立科技园"},
    {is_default:1,consignee:'张三',mobile:"18158115554",province:"浙江省",city:"杭州市",district:"余杭区",address:"华立科技园"},
    {is_default:1,consignee:'张三',mobile:"18158115554",province:"浙江省",city:"杭州市",district:"余杭区",address:"华立科技园"},
    {is_default:1,consignee:'张三',mobile:"18158115554",province:"浙江省",city:"杭州市",district:"余杭区",address:"华立科技园"},
    {is_default:1,consignee:'张三',mobile:"18158115554",province:"浙江省",city:"杭州市",district:"余杭区",address:"华立科技园"},
]
export function getAddressList() {
    return new Promise((resolve, reject) => {
        resolve(AddressData);
        // RequestMiddle.NoParamRequest('/user/address/list')
        // .then((data) => {
        //     resolve(data);
        // });
    });

    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.getAddressList((successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function buyOnCart(goods, totalSalePrice, addressId, couponType, couponId) {
    return new Promise((resolve, reject) => {
        RequestMiddle.buyOnCart(goods, totalSalePrice, addressId, couponType, couponId)
        .then((data) => {
            resolve(data);
        });
    });
    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.buyOnCart(goods, totalSalePrice, addressId, couponType, couponId, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

export function getCollections(page, perPage) {
    return new Promise((resolve, reject) => {
        RequestMiddle.getCollections(page, perPage)
        .then((data) => {
            resolve(data);
        });
    });

    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.getCollections(page, perPage, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

const CouponData = [
    {startTime:20170201232,expireTime: 20170201232,award:100,condition:250,name:"520上线预热优惠券",goodType:"零食小吃"},
    {startTime:20170201232,expireTime: 20170201232,award:20,condition:100,name:"520上线预热优惠券",goodType:"零食小吃"},
    {startTime:20170201232,expireTime: 20170201232,award:30,condition:150,name:"520上线预热优惠券",goodType:"零食小吃"},
    {startTime:20170201232,expireTime: 20170201232,award:100,condition:250,name:"520上线预热优惠券",goodType:"零食小吃"},
]
export function getCoupons(type, status) {
    return new Promise((resolve, reject) => {
        resolve(CouponData)
        // RequestMiddle.getCoupons(type, status)
        // .then((data) => {
        //     resolve(data);
        // });
    });

    // return new Promise((resolve, reject) => {
    //     AndroidNetRequest.getCoupons(type, status, (successData) => {
    //         resolve(JSON.parse(successData));
    //     });
    // });
}

const OrderData = {
    orderlist:[{order_id:1111,order_time:2412093,order_status:"待付款",order_goods_list:[{imgobj:{url:"http://imgsrc.baidu.com/forum/w=580/sign=1f59d3f6d22a283443a636036bb4c92e/37c276094b36acaf51dd55177ad98d1000e99cce.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://imgsrc.baidu.com/forum/w=580/sign=1f59d3f6d22a283443a636036bb4c92e/37c276094b36acaf51dd55177ad98d1000e99cce.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://imgsrc.baidu.com/forum/w=580/sign=1f59d3f6d22a283443a636036bb4c92e/37c276094b36acaf51dd55177ad98d1000e99cce.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1}],goodsNum:3,order_cost:1093},
    {order_id:1111,order_time:2412093,order_status:"待付款",order_goods_list:[{imgobj:{url:"http://imgsrc.baidu.com/forum/w=580/sign=1f59d3f6d22a283443a636036bb4c92e/37c276094b36acaf51dd55177ad98d1000e99cce.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://imgsrc.baidu.com/forum/w=580/sign=1f59d3f6d22a283443a636036bb4c92e/37c276094b36acaf51dd55177ad98d1000e99cce.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://imgsrc.baidu.com/forum/w=580/sign=1f59d3f6d22a283443a636036bb4c92e/37c276094b36acaf51dd55177ad98d1000e99cce.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1}],goodsNum:3,order_cost:1093},
    {order_id:1111,order_time:2412093,order_status:"待付款",order_goods_list:[{imgobj:{url:"http://imgsrc.baidu.com/forum/w=580/sign=1f59d3f6d22a283443a636036bb4c92e/37c276094b36acaf51dd55177ad98d1000e99cce.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1}],goodsNum:3,order_cost:1093},
    {order_id:1111,order_time:2412093,order_status:"待付款",order_goods_list:[{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1}],goodsNum:3,order_cost:1093}],
    totalPage: 3,
}
export function orderDetail(condition, page, perPage) {
    return new Promise((resolve, reject) => {
        resolve(OrderData);
        // RequestMiddle.orderDetail(condition, page, perPage)
        // .then((data) => {
        //     resolve(data);
        // });
    });
}

const OrderInfoData = {
    order_status: "待付款",
    good:[
        {warehouse:"五常",goodsList:[{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1}]},
    {warehouse:"下沙",goodsList:[{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1},{imgobj:{url:"http://desc.bestinfoods.com/items/283/56d973741ff6c.jpg"},
    goods_name:"路飞玩偶",goods_saleprice:120,goods_num:1}]}
    ]
}
export function orderInformation(orderId) {
    return new Promise((resolve, reject) => {
        resolve(OrderInfoData);
        // RequestMiddle.orderInformation(orderId)
        // .then((data) => {
        //     resolve(data);
        // });
    });
}

export function getProvince() {
    return new Promise((resolve, reject) => {
        RequestMiddle.NoParamRequest('/user/get/province')
        .then((data) => {
            resolve(data);
        });
    });
}

export function getCity(provinceId) {
    return new Promise((resolve, reject) => {
        RequestMiddle.getCity(provinceId)
        .then((data) => {
            resolve(data);
        });
    });
}

export function getRegion(cityId) {
    return new Promise((resolve, reject) => {
        RequestMiddle.getRegion(cityId)
        .then((data) => {
            resolve(data);
        });
    });
}

export function saveAddress(areaId, address, name, idCard, mobile, isDefault, id = '') {
    return new Promise((resolve, reject) => {
        RequestMiddle.saveAddress(areaId, address, name, idCard, mobile, isDefault, id)
        .then((data) => {
            resolve(data);
        });
    });
}

export function getLoginStatus() {
    return new Promise((resolve, reject) => {
        AndroidNetRequest.getLoginStatus((successData) => {
            resolve(successData);
        });
    });
}
