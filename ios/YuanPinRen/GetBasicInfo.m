//
//  GetBasicInfo.m
//  xProject
//
//  Created by cracker on 2016/12/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//
#import<AVFoundation/AVCaptureDevice.h>
#import <AVFoundation/AVMediaFormat.h>
#import<AssetsLibrary/AssetsLibrary.h>
#import<CoreLocation/CoreLocation.h>
#import "GetBasicInfo.h"
#import "AutoLocationData.h"
#import "AutoNetRequest.h"
#import "WXApi.h"
#import <AlipaySDK/AlipaySDK.h>
#import "Order.h"
#import "RSADataSigner.h"

@implementation GetBasicInfo

RCT_EXPORT_MODULE(GetBasicInfo);

/*
 * @Name: getDeviceID
 * @Author: jiao.shen
 * @Date: 2016-12-26
 * @Return: uuid
 * @Description: 获得本地deviceID
 */
RCT_REMAP_METHOD(getDeviceId, resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSString *uuid = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    resolve(@{@"DEVICE_ID": uuid});
  }@catch (NSException *error) {
    reject(@"1001",@"不可预料的错误", nil);
  }
}

RCT_EXPORT_METHOD(payForOrder:(NSString *)rsa2PrivateKey ) {

  if ([rsa2PrivateKey length] == 0) {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示"
                                                    message:@"缺少appId或者私钥。"
                                                   delegate:self
                                          cancelButtonTitle:@"确定"
                                          otherButtonTitles:nil];
    [alert show];
    return;
  }
  
  //应用注册scheme,在AliSDKDemo-Info.plist定义URL types
  NSString *appScheme = @"yuanpinren";
  
  // NOTE: 将签名成功字符串格式化为订单字符串,请严格按照该格式
  NSString *orderString = rsa2PrivateKey;
  
  // NOTE: 调用支付结果开始支付
  [[AlipaySDK defaultService] payOrder:orderString fromScheme:appScheme callback:^(NSDictionary *resultDic) {
    NSLog(@"reslut = %@",resultDic);
  }];
}

RCT_EXPORT_METHOD(openAppStore:(NSString *)url) {
  //NSString *url = @"https://itunes.apple.com/cn/app/%E6%BA%90%E5%93%81%E4%BA%BA/id1239681699?mt=8";
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
  });
}

RCT_EXPORT_METHOD(shareToWechat:(NSString *)way name:(NSString *)goodName description:(NSString *)description
                  image:(NSString *)imageUrl goodUrl:(NSString *)goodUrl) {
  WXMediaMessage *message = [WXMediaMessage message];
  message.title = goodName;
  message.description = description;
  NSData *imgData = [NSData dataWithContentsOfURL:[NSURL URLWithString:imageUrl]];
  [message setThumbImage:[UIImage imageWithData:imgData]];
  
  WXWebpageObject *ext = [WXWebpageObject object];
  ext.webpageUrl = goodUrl;

  message.mediaObject = ext;
  
  SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
  req.bText = NO;
  req.message = message;
  req.scene = [way isEqualToString:@"FRIEND"] ? WXSceneSession : WXSceneTimeline;
  
  [WXApi sendReq:req];
}

RCT_REMAP_METHOD(getAppVersion, resul:(RCTPromiseResolveBlock)resolv
                 rejec:(RCTPromiseRejectBlock)rejec) {
  NSDictionary *infoDic = [[NSBundle mainBundle] infoDictionary];
  NSString *appVersion = [infoDic objectForKey:@"CFBundleShortVersionString"];
  resolv(appVersion);
}

RCT_REMAP_METHOD(isWechatInstall, result:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject) {
  if(![WXApi isWXAppInstalled]) {
    resolve(@"fail");
  }else {
    resolve(@"success");
  }
}

RCT_REMAP_METHOD(wechatLogin, resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    if(![WXApi isWXAppInstalled]) {
      resolve(@"fail");
      return;
    }
    SendAuthReq *req = [[SendAuthReq alloc] init];
    req.scope = @"snsapi_userinfo";
    req.state = @"App";
    req.openID = @"wx01b783ae02dbb656";
    [WXApi sendReq:req];

  }@catch (NSException *error) {
    NSLog(@"%@", error);
  }
}

RCT_REMAP_METHOD(getNativeCookie, resolve:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    //[[AutoLocationData sharedInstance] deleteNativeCookie];
    NSString *cookie = [[AutoLocationData sharedInstance] getCookieFromKeychain];
    NSLog(@"%@ --------",cookie);
    resolve(cookie);
  }@catch (NSException *error) {
    NSLog(@"%@", error);
    reject(@"1002",@"不可预料的错误", nil);
  }
}

RCT_REMAP_METHOD(getPhotoAuthorizate, resolve:(RCTPromiseResolveBlock)resolve
                 result:(RCTPromiseRejectBlock)reject)
{
    ALAuthorizationStatus author = [ALAssetsLibrary authorizationStatus];
    if (author == kCLAuthorizationStatusRestricted || author ==kCLAuthorizationStatusDenied){
      //无权限 引导去开启
      NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
      dispatch_async(dispatch_get_main_queue(), ^{
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            [[UIApplication sharedApplication] openURL:url];
        }
      });
      resolve(@"true");
    }else {
      resolve(@"true");
    }
}

RCT_REMAP_METHOD(getLoginStatus, resolve:(RCTPromiseResolveBlock)resolve
                 rejecterr:(RCTPromiseRejectBlock)reject)
{
  @try {
    //[[AutoLocationData sharedInstance] deleteNativeLoginStatus];
    NSString *loginStatus = [[AutoLocationData sharedInstance] getLoginStatus];
    resolve(loginStatus);
  }@catch (NSException *error) {
    reject(@"1003",@"不可预料的错误", nil);
  }
}

RCT_EXPORT_METHOD(deleteNativeCookie) {
  [[AutoLocationData sharedInstance] deleteNativeCookie];
}

RCT_EXPORT_METHOD(setNativeCookie:(NSString *)cookie)
{
   NSLog(@"%@ -------- set",cookie);
  [[AutoLocationData sharedInstance] setNativeCookie:cookie];
   NSLog(@"%@ -------- set 11111",cookie);
}

RCT_EXPORT_METHOD(setLoginStatus:(NSString *)loginStatus)
{
  [[AutoLocationData sharedInstance] setLoginStatus:loginStatus];
  if ([loginStatus isEqualToString:@"true"]) {
//    AFHTTPSessionManager *manager = [AutoNetRequest getAFHTTPSessionManager];
//    if (nil == [JPUSHService registrationID]) {return;}
//    NSDictionary *dict = @{@"regId":[JPUSHService registrationID]};
//    [manager POST:@"http://api.autochat.cc/user/user/get_jpush_regid" parameters:dict progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
//      // NSLog(@"%@",responseObject);
//    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
//      
//    }];
  }
}

@end
