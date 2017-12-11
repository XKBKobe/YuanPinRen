/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <AlipaySDK/AlipaySDK.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //注册微信
  [WXApi registerApp:@"wx01b783ae02dbb656"];
  
  NSURL *jsCodeLocation;

    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
    //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"index.ios" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"YuanPinRen"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
  return  [WXApi handleOpenURL:url delegate:self];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options
{
  if ([url.host isEqualToString:@"safepay"]) {
    // 支付跳转支付宝钱包进行支付，处理支付结果
    [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
      RCTRootView *rootView = (RCTRootView *)self.window.rootViewController.view;
      NSLog(@"result = %@",resultDic);
      NSString *status = [resultDic objectForKey:@"resultStatus"];
      NSLog(@"%@", status);
      if ([status isEqualToString:@"9000"]) {
          [rootView.bridge.eventDispatcher sendAppEventWithName:@"PAY_SUCCESS" body:nil];
      }else {
        [rootView.bridge.eventDispatcher sendAppEventWithName:@"PAY_FAIL" body:nil];
      }
    }];
    return YES;
  }
  return  [WXApi handleOpenURL:url delegate:self];
}

- (void)onResp:(BaseResp *)resp {
  if ([resp isKindOfClass:[SendAuthResp class]])
  {
    SendAuthResp *rep = (SendAuthResp *)resp;
    if (rep.errCode == 0) {
      RCTRootView *rootView = (RCTRootView *)self.window.rootViewController.view;
      [rootView.bridge.eventDispatcher sendAppEventWithName:@"WX_LOGIN_SUCCESS" body:@{@"wxCode":rep.code}];
      //[[NSNotificationCenter defaultCenter] postNotificationName:WXLoginSuccess object:@{@"code":rep.code}];
    }else {
      RCTRootView *rootView = (RCTRootView *)self.window.rootViewController.view;
      [rootView.bridge.eventDispatcher sendAppEventWithName:@"WX_LOGIN_FAIL" body:@{@"wxCode":@"error"}];
    }
    
  }else if ([resp isKindOfClass:[SendMessageToWXResp class]]) {
    SendMessageToWXResp *sendResp = (SendMessageToWXResp *)resp;
    if (sendResp.errCode == 0) {
      //分享成功
      RCTRootView *rootView = (RCTRootView *)self.window.rootViewController.view;
      [rootView.bridge.eventDispatcher sendAppEventWithName:@"WX_SHARE_SUCCESS" body:@{@"wxCode": @"success"}];
    }else {
      //分享失败
      RCTRootView *rootView = (RCTRootView *)self.window.rootViewController.view;
      [rootView.bridge.eventDispatcher sendAppEventWithName:@"WX_SHARE_FAIL" body:@{@"wxCode":@"error"}];
    }
  }
}

@end
