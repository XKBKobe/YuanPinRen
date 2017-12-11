package com.yuanpinren.bridgetojs;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Message;
import android.support.annotation.Nullable;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.yuanpinren.Alipay.PayResult;
import com.yuanpinren.MainApplication;
import com.yuanpinren.MainServiceClient;
import com.yuanpinren.wechat.Util;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

/**
 * Created by zhangzhao on 2017/3/23.
 */

public class GetBasicInfo extends ReactContextBaseJavaModule {
    private final String GET_BASIC_INFO = "GetBasicInfo";
    private final String WECHAT_APP_KEY = "wxa612ba375d285597";
    private static ReactContext mReactContext;
    private static final int SDK_PAY_FLAG = 1;
    private static final int SDK_AUTH_FLAG = 2;

    public GetBasicInfo(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return GET_BASIC_INFO;
    }

    @ReactMethod
    public void getDeviceId(Promise promise) {
        TelephonyManager telephonyManager
                = (TelephonyManager) MainApplication
                .getApplicationInstance()
                .getSystemService(Context.TELEPHONY_SERVICE);

        String deviceId = telephonyManager.getDeviceId();

        WritableMap map = Arguments.createMap();
        map.putString("DEVICE_ID", deviceId);

        promise.resolve(map);
    }

    @ReactMethod
    public void getNativeCookie(Promise promise) {
        promise.resolve(MainServiceClient.getNativeCookie());
    }

    @ReactMethod
    public void setNativeCookie(String cookie) {
        MainServiceClient.setNativeCookie(cookie);
    }

    @ReactMethod
    public void getLoginStatus(Promise promise) {
        promise.resolve(MainServiceClient.getLoginStatus());
    }

    @ReactMethod
    public void setLoginStatus(String status) {
        MainServiceClient.setLoginStatus(status);
    }

    private Bitmap returnBitmap(String url) {
        URL fileUrl = null;
        Bitmap bitmap = null;

        try {
            fileUrl = new URL(url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        try {
            HttpURLConnection conn = (HttpURLConnection)fileUrl.openConnection();
            conn.setDoInput(true);
            conn.connect();
            InputStream is = conn.getInputStream();
            bitmap = BitmapFactory.decodeStream(is);
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return bitmap;
    }


    @ReactMethod
    public void shareToWechat(String shareWay) {
        WXWebpageObject wxWebpageObject = new WXWebpageObject();
        wxWebpageObject.webpageUrl = "http://m.yuanpinren.com/#/ShareGoodsDetail";

        WXMediaMessage wxMediaMessage = new WXMediaMessage(wxWebpageObject);
        wxMediaMessage.title = "源品人真情分享";
        wxMediaMessage.description = "只为分享健康生活";

        Bitmap bmp = returnBitmap("http://desc.bestinfoods.com/items/2016-03-10/56e11cb203594.jpg");
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 150, 150, true);
        bmp.recycle();
        wxMediaMessage.thumbData = Util.bmpToByteArray(thumbBmp,true);

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = "12345";

        req.message = wxMediaMessage;

        if (shareWay.equals("FRIEND")) {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        } else {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }


        IWXAPI iwxapi = WXAPIFactory.createWXAPI(getCurrentActivity(), WECHAT_APP_KEY, true);
        iwxapi.registerApp(WECHAT_APP_KEY);

        iwxapi.sendReq(req);
    }

    @ReactMethod
    public void wechatLogin() {
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "0123456789";

        IWXAPI iwxapi = WXAPIFactory.createWXAPI(getCurrentActivity(), WECHAT_APP_KEY, true);
        iwxapi.registerApp(WECHAT_APP_KEY);

        iwxapi.sendReq(req);
    }

    @ReactMethod
    public void payForOrder(final String orderInfo) {
        final android.os.Handler handler = new android.os.Handler() {
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case SDK_PAY_FLAG: {
                        PayResult payResult = new PayResult((Map<String, String>) msg.obj);

                        // 支付宝返回此次支付结果及加签，建议对支付宝签名信息拿签约时支付宝提供的公钥做验签
                        String resultInfo = payResult.getResult();

                        String resultStatus = payResult.getResultStatus();

                        // 判断resultStatus 为“9000”则代表支付成功，具体状态码代表含义可参考接口文档
                        if (TextUtils.equals(resultStatus, "9000")) {
                            Toast.makeText(getCurrentActivity(), "支付成功",
                                    Toast.LENGTH_SHORT).show();
                            sendEvent("PAY_SUCCESS", null);
                        } else {
                            // 判断resultStatus 为非“9000”则代表可能支付失败
                            // “8000”代表支付结果因为支付渠道原因或者系统原因还在等待支付结果确认，最终交易是否成功以服务端异步通知为准（小概率状态）
                            if (TextUtils.equals(resultStatus, "8000")) {
                                Toast.makeText(getCurrentActivity(), "支付结果确认中",
                                        Toast.LENGTH_SHORT).show();

                            } else {
                                // 其他值就可以判断为支付失败，包括用户主动取消支付，或者系统返回的错误
                                Toast.makeText(getCurrentActivity(), "支付失败",
                                        Toast.LENGTH_SHORT).show();
                            }
                            sendEvent("PAY_FAIL", null);
                        }
                        break;
                    }
                    case SDK_AUTH_FLAG: {
                        Toast.makeText(getCurrentActivity(), "检查结果为：" + msg.obj,
                                Toast.LENGTH_SHORT).show();
                        sendEvent("PAY_FAIL", null);
                        break;
                    }
                    default:
                        sendEvent("PAY_FAIL", null);
                        break;
                }
            }
        };

        Runnable payRunnable = new Runnable() {
            @Override
            public void run() {
                PayTask alipay = new PayTask(getCurrentActivity());
                Map<String, String> result = alipay.payV2(orderInfo, true);

                Message msg = new Message();
                msg.what = SDK_PAY_FLAG;
                msg.obj = result;
                handler.sendMessage(msg);
            }
        };

        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }

    public static void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
