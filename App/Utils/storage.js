/**
 * Created by asto on 2017/12/5.
 */
import React, {Component} from 'react';
import {
    AsyncStorage
} from 'react-native';

/**
 * setItem
 * */
export async function setItem(key, value) {
    let data = await AsyncStorage.setItem(key, value);
    console.log(key + ' ' + value + ' ' + data);
    return data;
}

/**
 * getItem
 * */
export async function getItem(key) {
    return await AsyncStorage.getItem(key);
}