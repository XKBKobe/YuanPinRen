package com.yuanpinren;

import android.app.Activity;
import android.content.SharedPreferences;

/**
 * Created by zhangzhao on 2017/5/11.
 */

public class MainServiceClient {
    private static final String COOKIE_PREFS = "CookiePrefsFile";
    private static final String LOGIN_STATUS = "LOGIN_STATUS";
    private static final String NATIVE_COOKIE = "NATIVE_COOKIE";

    private static SharedPreferences cookiePrefs = MainApplication.getApplicationInstance().getSharedPreferences(COOKIE_PREFS, Activity.MODE_PRIVATE);
    private static SharedPreferences.Editor cookiePrefsEditor = cookiePrefs.edit();

    public static String getLoginStatus() {
        return cookiePrefs.getString(LOGIN_STATUS, "false");
    }

    public static void setLoginStatus(String loginStatus) {
        cookiePrefsEditor.putString(LOGIN_STATUS, loginStatus);
        cookiePrefsEditor.commit();
    }

    public static String getNativeCookie() {
        return cookiePrefs.getString(NATIVE_COOKIE, "");
    }

    public static void setNativeCookie(String nativeCookie) {
        cookiePrefsEditor.putString(NATIVE_COOKIE, nativeCookie);
        cookiePrefsEditor.commit();
    }
}
