import React from 'React';
import {
    Platform,
    NativeModules
} from 'react-native';

var GetBasicInfo = NativeModules.GetBasicInfo;

export async function getDeviceId() {
    var deviceInfo = await GetBasicInfo.getDeviceId();

    return deviceInfo.DEVICE_ID;
}

export function formatDate(time) {
    var dataTime = new Date(time);
    var year = dataTime.getFullYear();
    var month = dataTime.getMonth() + 1;
    var date = dataTime.getDate();

    if (month < 10) {
        month = "0" + month;
    }

    if (date < 10) {
        date = "0" + date;
    }

    return year + "-" + month + "-" + date;
}


//获取完整时间
export function formatMonthDate(time) {
    var dataTime = new Date(time);
    var month = dataTime.getMonth() + 1;
    var date = dataTime.getDate();
    var hour = dataTime.getHours();
    var minute = dataTime.getMinutes();
    var second = dataTime.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }

    if (date < 10) {
        date = "0" + date;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    if (second < 10) {
        second = "0" + second;
    }

    return month + "-" + date + " " + hour + ":" + minute + ":" + second;

}


//获取完整时间
export function formatFullDate(time) {
    var dataTime = new Date(time);
    var year = dataTime.getFullYear();
    var month = dataTime.getMonth() + 1;
    var date = dataTime.getDate();
    var hour = dataTime.getHours();
    var minute = dataTime.getMinutes();
    var second = dataTime.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }

    if (date < 10) {
        date = "0" + date;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    if (second < 10) {
        second = "0" + second;
    }

    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;

}

