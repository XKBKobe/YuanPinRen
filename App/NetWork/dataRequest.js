/**
* @name requestData
* @param api api参数
* @param ...params
    可传入任意个数参数，其中第一个为网络请求参数
*/

import uuid from 'uuid';
import querystring from 'querystring';
// import crypto from 'crypto';

const API_BASE_URL = 'http://api3.bestinfoods.com';
const MD5_KEY = '3DQEBAQUAA4GNADCBiQKBgQCqWT3C34iIruDvDf86w8zP5cAv';
const TAG = 'dataRequest.js';

export default function requestData(api, ...params) {
    var bodyParam = paramAssemble(params[0]);

    return new Promise((resolve, reject) => {
        fetch(API_BASE_URL + api, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: bodyParam,
        })
        .then((response) => response.json())
        .then((responseData) => {
            if (0 === responseData.errorcode) {
                resolve(responseData.data);
            } else {
                reject(responseData.message);
            }
        })
        .catch((error) => {
            reject(error);
        })
        .done();
    });
}

function paramAssemble(param) {
    var assembledParam = '';
    var objectParam = {};
    var timeSign = Math.ceil((new Date())/1000);
    var uniqueCode = createOrGetUniqueCode();
    var sessionId = getSessionId();

    if (0 != param.length) {
        var paramItem = param.split('&');

        for (var i = 0; i < paramItem.length; i++) {
            if (0 != paramItem[i]) {
                var item = paramItem[i].split('=');
                var key = item[0];
                var value = item[1];

                objectParam[key] = value;
            }
        }

        assembledParam = param
            + '&signTime=' + timeSign
            + '&platform=H5'
            + '&session=' + sessionId
            + '&guid=' + uniqueCode;

    } else {
        assembledParam = 'signTime=' + timeSign
            + '&platform=H5'
            + '&session=' + sessionId
            + '&guid=' + uniqueCode;
    }

    objectParam['signTime'] = timeSign;
    objectParam['platform'] = 'H5';
    objectParam['session'] = sessionId;
    objectParam['guid'] = uniqueCode;

    assembledParam = assembledParam + '&secret=' + sortAndEncryption(objectParam);

    return assembledParam;
}

function sortAndEncryption(object) {
    var password = '';
    var sortedObject = {};
    // var md5 = crypto.createHash('md5');

    var keys = Object.keys(object).sort();

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        sortedObject[key] = object[key];
    }

    var objectString = querystring.stringify(sortedObject);

    // password = md5.update(MD5_KEY + objectString + MD5_KEY).digest('hex');

    return password;
}

function createOrGetUniqueCode() {
    // if (null === getCookie(COOKIE_KEY_UUID)) {
    //     var uuidValue = uuid.v4();
    //
    //     setCookie(COOKIE_KEY_UUID, uuidValue);
    //
    //     return uuidValue;
    // } else {
    //     return getCookie(COOKIE_KEY_UUID);
    // }
    return '';
}

function getSessionId() {
    // if (null === getCookie(COOKIE_KEY_SESSIONID)) {
    //     return '';
    // } else {
    //     return getCookie(COOKIE_KEY_SESSIONID);
    // }
    return '';
}
