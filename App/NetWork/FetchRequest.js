import React, {Component} from 'react';
import {
    Platform,
	NativeModules,
    ToastAndroid
} from 'react-native';

const GetBasicInfo = NativeModules.GetBasicInfo;
const RequestBaseURL = 'http://api.yuanpinren.cn';

export default function request(api, param) {
    return new Promise((resolve, reject) => {
        fetch(RequestBaseURL + api, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: param
        })
        .then((response) => response.json())
        .then((responseData) => {
            console.log('zhangzhao_success:', responseData);
            resolve(responseData);
        })
        .catch((error) => {
            console.log('zhangzhao_error:', error);
            resolve(error)
        })
        .done();
    });
}
