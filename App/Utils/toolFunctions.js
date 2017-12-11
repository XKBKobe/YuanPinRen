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
