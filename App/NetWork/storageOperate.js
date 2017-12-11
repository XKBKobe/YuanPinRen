import React from 'React';
import {
  AsyncStorage
} from 'react-native';

const COOKIE_KEY_SESSIONID = 'COOKIE_KEY_SESSIONID';
const COOKIE_KEY_LOGINSTATUS = 'COOKIE_KEY_LOGINSTATUS';
const COOKIE_KEY_LATELYSEARCH = 'COOKIE_KEY_LATELYSEARCH';

export async function getSessionId() {
    return await AsyncStorage.getItem(COOKIE_KEY_SESSIONID);
}

export async function setSessionId(sessionId) {
    await AsyncStorage.setItem(COOKIE_KEY_SESSIONID, sessionId)
}

export async function getLoginStatus() {
    return await AsyncStorage.getItem(COOKIE_KEY_LOGINSTATUS);
}

export async function setLoginStatus(status) {
    await AsyncStorage.setItem(COOKIE_KEY_LOGINSTATUS, status);
}
