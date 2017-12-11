import React from 'React';
import {
  Platform
} from 'react-native';
import request, {requestSpecial} from './request';
import {hex_md5} from './md5';
import {getDeviceId} from '../Utils/toolFunctions';
import {getSessionId} from './storageOperate';

var UNIQUE_ID = '';
getDeviceId().then((deviceId) => {UNIQUE_ID = deviceId});
const REFER = (('ios' == Platform.OS) ? 'IOS' : 'ANDROID');
const MD5KEY = '3DQEBAQUAA4GNADCBiQKBgQCqWT3C34iIruDvDf86w8zP5cAv';

export async function getBannerData() {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'classId=' + 1
                    + '&guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + '&type=' + 1
                    + MD5KEY;

    var param = {
        classId: 1,
        type: 1,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(encodeURI(paramMd5))
    };

    return new Promise((resolve, reject) => {
        request('/market/get/ad', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function NoParamRequest(api) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request(api, JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function GoodsIdRequest(goodsId, api) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'goodsId=' + goodsId
                    + '&guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        goodsId: goodsId,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request(api, JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function MobileRequest(mobile, api) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'guid=' + UNIQUE_ID
                    + '&mobile=' + mobile
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        mobile: mobile,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request(api, JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function checkWordsLoginIn(mobile, codeNum) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'codeNum=' + codeNum
                    + '&guid=' + UNIQUE_ID
                    + '&mobile=' + mobile
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        codeNum: codeNum,
        mobile: mobile,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/user/get/login_msg', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function passWordLoginIn(username, password) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'guid=' + UNIQUE_ID
                    + '&password=' + password
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + '&username=' + username
                    + MD5KEY;

    var param = {
        username: username,
        password: password,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/user/get/login', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function register(mobile, code, password, passwordRepeat, type) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'code=' + code
                    + '&guid=' + UNIQUE_ID
                    + '&mobile=' + mobile
                    + '&password=' + password
                    + '&passwordRepeat=' + passwordRepeat
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + '&type=' + type
                    + MD5KEY;

    var param = {
        mobile: mobile,
        code: code,
        password: password,
        passwordRepeat: passwordRepeat,
        type: type,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/user/password/register', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function getBackPassword(mobile, code, password, passwordRepeat) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'code=' + code
                    + '&guid=' + UNIQUE_ID
                    + '&mobile=' + mobile
                    + '&password=' + password
                    + '&passwordRepeat=' + passwordRepeat
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        mobile: mobile,
        code: code,
        password: password,
        passwordRepeat: passwordRepeat,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/user/password/find_pwd', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function addGoodsToCart(goods) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'goods=' + encodeURI(goods)
                    + '&guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        goods: goods,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    console.log('zhangzhao_001', param);
    console.log('zhangzhao_002', encodeURI(JSON.stringify(param)));
    console.log('zhangzhao_003', JSON.stringify(param));

    var stringParam = 'goods=[{"goodId":277,"amount":1}]&signTime='+paramSignTime+'&platform='+REFER+'&session='+paramSession+'&guid='+UNIQUE_ID+'&secret='+hex_md5(paramMd5);

    return new Promise((resolve, reject) => {
        request('/order/post/addcart', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
        // requestSpecial('/order/post/addcart', stringParam)
        // .then((data) => {
        //     resolve(data);
        // });
    });
}

export async function directChange(goodsId, amount) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'amount=' + amount
                    + '&goodsId=' + goodsId
                    + '&guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        goodsId: goodsId,
        amount: amount,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/order/getec/directchange', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function directPurchase(goods, couponType, couponId) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'couponId=' + couponId
                    + '&couponType=' + couponType
                    + '&goods=' + encodeURI(goods)
                    + '&guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        goods: goods,
        couponType: couponType,
        couponId: couponId,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/order/getec/directpurchase', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function buyOnCart(goods, totalSalePrice, addressId, couponType, couponId) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'addressId=' + addressId
                    + "&couponId=" + couponId
                    + "&couponType=" + couponType
                    + "&goods=" + encodeGoods
                    + 'guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + "&totalsaleprice=" + totalSalePrice
                    + MD5KEY;

    var param = {
        goods: goods,
        totalsaleprice: totalSalePrice,
        addressId: addressId,
        couponType: couponType,
        couponId: couponId,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/order/postec/buyoncart', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function getCollections(page, perPage) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'guid=' + UNIQUE_ID
                    + "&page=" + page
                    + "&perPage=" + perPage
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        page: page,
        perPage: perPage,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/user/get/collectiongoods', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function getCoupons(type, status) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + "&status=" + status
                    + "&type=" + type
                    + MD5KEY;

    var param = {
        type: type,
        status: status,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/activity/couponec/user_coupon', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function updateCart(goods) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'goods=' + goods
                    + '&guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        goods: goods,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/order/put/updatecart', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function orderDetail(condition, page, perPage) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'condition=' + condition
                    + '&guid=' + UNIQUE_ID
                    + '&page=' + page
                    + '&perPage=' + perPage
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        condition: condition,
        page: page,
        perPage: perPage,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/order/getec/orderlist', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function orderInformation(orderId) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'guid=' + UNIQUE_ID
                    + '&orderId=' + orderId
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        orderId: orderId,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/order/getec/orderdetails', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function getCity(provinceId) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&provinceId=' + provinceId
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        provinceId: provinceId,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/user/get/city', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function getRegion(cityId) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'cityId=' + cityId
                    + '&guid=' + UNIQUE_ID
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        cityId: cityId,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    return new Promise((resolve, reject) => {
        request('/user/get/area', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}

export async function saveAddress(areaId, address, name, idCard, mobile, isDefault, id) {
    var paramSignTime = Math.ceil((+new Date)/1000);
    var paramSession = '';
    await getSessionId().then((sessionId) => {
        if (null == sessionId) {
            paramSession = '';
        } else {
            paramSession = sessionId
        }
    });
    var paramMd5 = MD5KEY
                    + 'address=' + address
                    + '&areaId=' + areaId
                    + '&guid=' + UNIQUE_ID
                    + '&id=' + ''
                    + '&idCard=' + idCard
                    + '&isDefault=' + isDefault
                    + '&mobile=' + mobile
                    + '&name=' + name
                    + '&platform=' + REFER
                    + '&session=' + paramSession
                    + '&signTime=' + paramSignTime
                    + MD5KEY;

    var param = {
        areaId: areaId,
        address: address,
        name: name,
        idCard: idCard,
        mobile: mobile,
        isDefault: isDefault,
        id: id,
        signTime: paramSignTime,
        platform: REFER,
        session: paramSession,
        guid: UNIQUE_ID,
        secret: hex_md5(paramMd5)
    };

    console.log('zhangzhao', paramMd5);

    return new Promise((resolve, reject) => {
        request('/user/address/add', JSON.stringify(param))
        .then((data) => {
            resolve(data);
        });
    });
}
