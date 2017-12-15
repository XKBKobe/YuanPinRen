import React, {Component} from 'react';
import {
    Platform,
    NativeModules,
    ToastAndroid
} from 'react-native';
import {Actions, ActionConst} from 'react-native-router-flux';

const GetBasicInfo = NativeModules.GetBasicInfo;
const RequestBaseURL = 'http://app.yuanpinren.cn';

export default async function request(api, method, data = "") {
    //var xmlhttp;
    var plat = 'H5';
    if (Platform.OS === 'ios') plat = 'IOS';
    else if (Platform.OS === 'android') plat = 'ANDROID';
    let requestStr = RequestBaseURL + api;
    let deviceId = await GetBasicInfo.getDeviceId();
    let JSSIONID = await GetBasicInfo.getNativeCookie();
    console.log('请求的  JSSIONID  ' + api + '   ' + JSSIONID);
    if(method == 'POST'){
        return new Promise((resolve, reject) => {
            fetch(requestStr, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'deviceId': deviceId.DEVICE_ID,
                    'JSSIONID': JSSIONID,
                    'platform': plat,
                    'cache-control': "max-age=0",
                    "accept-language": 'zh-CN,zh;q=0.8'
                },
                body: data
            }).then((response) => response.json()).then((data) => {//1
                console.log('POST请求的返回成功数据  ' + api + '   ' +JSON.stringify(data));
                //登录失效
                if('100115' == data.errno) {
                    GetBasicInfo.setLoginStatus("false");
                    Actions.WelcomeLogin({type: ActionConst.RESET});
                }
                resolve(data);
            }).catch((error) => {
                console.log('POST请求的返回失败数据  ' + api + '   ' + error);
                reject(error);
            });
        });
    }else if(method == 'GET') {
        return new Promise((resolve, reject) => {
            fetch(requestStr, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'deviceId': deviceId.DEVICE_ID,
                    'JSSIONID': JSSIONID,
                    'platform': plat,
                    'cache-control': "max-age=0",
                    "accept-language": 'zh-CN,zh;q=0.8'
                }
            }).then((response) => {//1
                resolve(response);
            }).catch((error) => {
                console.log('GET请求的返回失败数据  ' + api + '   ' + error);
                reject(error);
            });
        });
    }




    /**
    try {
        let deviceId = await GetBasicInfo.getDeviceId();
        let oldCookie = await GetBasicInfo.getNativeCookie();
        console.log('shttp requeset oldCookie  ' + api + '   ' + oldCookie);
         return new Promise((resolve, reject) => {
			xmlhttp = new XMLHttpRequest;
            xmlhttp.onreadystatechange = function(){
                // console.log('zhangzhao', xmlhttp);
				if (xmlhttp && xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					// console.log("--------requests-------",xmlhttp.responseText);
					if(!xmlhttp.responseText) return;

					var headers = xmlhttp.responseHeaders;
					var serviceData = JSON.parse(xmlhttp.responseText);

					console.log('http requeset data '+api+'   '+JSON.stringify(serviceData));
					if('100115' == serviceData.errno) {
                        console.log('http requeset serviceData errno '+api);
						GetBasicInfo.setLoginStatus("false");
                        Actions.WelcomeLogin({type: ActionConst.RESET});
					}
					resolve(serviceData);
				}
			}

			//错误的情况
			xmlhttp.onerror = function () {
				console.log('error http onerror')
				reject(false)
	
			};
			xmlhttp.open(method, requestStr, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("deviceId", deviceId.DEVICE_ID);
			xmlhttp.setRequestHeader("JSSIONID", oldCookie);
			xmlhttp.setRequestHeader("platform", plat);
			xmlhttp.setRequestHeader("cache-control","max-age=0");
			xmlhttp.setRequestHeader("accept-language","zh-CN,zh;q=0.8");

            //xmlhttp.setRequestHeader("Cookie", {"deviceid": deviceId,"platform":plat,"JSSIONID":"fdjskgldjgk"});
			console.log("zhangzhao deviceId: " + deviceId.DEVICE_ID);
			if (method == "POST") {
				xmlhttp.send(data);
			} else {
				xmlhttp.send();
			}

	      })

    } catch (error) {
        console.log('error:' + error);
        return new Promise((resolve, reject) => {
            reject(error)
        });
    }
     ***/
}
