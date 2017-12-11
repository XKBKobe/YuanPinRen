//
//  AutoLocationData.m
//  AutoProject
//
//  Created by cracker on 2016/12/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AutoLocationData.h"
#import "KeyChainStore.h"

static NSString* const KEY_USER_COOKIES = @"com.usercookie.com";
static NSString* const KEY_DICT_COOKIES = @"com.dictcookes.com";
static NSString* const KEY_LOGIN_STATUS = @"com.loginstatus.com";
static NSString* const KEY_DICT_LOGINSTATUS = @"com.dictloginstatus.com";
static NSString* const KEY_OPENIM_USERINFO = @"com.openim_userinfo.com";
static NSString* const KEY_DICT_OPENIM_USERID = @"com.dict_openim_userid.com";
static NSString* const KEY_DICT_OPENIM_PASSWORD = @"com.dict_openim_password.com";

@implementation AutoLocationData

+ (instancetype)sharedInstance {
  static AutoLocationData *instance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if (!instance) {
      instance = [[self alloc] init];
    }
  });
  return instance;
}

- (instancetype)init {
  if (self = [super init]) {
    self.temperString = @"";
    self.locationNumber = 0;
    self.locationString = @"";
    self.speedString = @"";
    
    return self;
  }
  return nil;
}

- (NSString *)getCookieFromKeychain {
  NSString *cookie = nil;
  NSMutableDictionary* userDict = (NSMutableDictionary *)[KeyChainStore load:KEY_USER_COOKIES];

  if ([userDict count]) {
    cookie = (NSString *)[userDict objectForKey:KEY_DICT_COOKIES];
  }
  return cookie;
}

- (NSString *)getOpenIMLoginIdFromKeychain {
  NSMutableDictionary* userDict = (NSMutableDictionary *)[KeyChainStore load:KEY_OPENIM_USERINFO];
  NSString *userId = nil;
  if ([userDict count]) {
    userId = (NSString *)[userDict objectForKey:KEY_DICT_OPENIM_USERID];
  }
  return userId;
}

- (NSString *)getOpenIMPasswordFromKeychain {
  NSMutableDictionary* userDict = (NSMutableDictionary *)[KeyChainStore load:KEY_OPENIM_USERINFO];
  NSString *password = nil;
  if ([userDict count]) {
    password = (NSString *)[userDict objectForKey:KEY_DICT_OPENIM_PASSWORD];
  }
  return password;
}

- (NSString *)getLoginStatus {
  NSString *loginStatus = nil;
  NSMutableDictionary *loginDict = (NSMutableDictionary *)[KeyChainStore load:KEY_LOGIN_STATUS];
  
  if ([loginDict count]) {
    loginStatus = [loginDict objectForKey:KEY_DICT_LOGINSTATUS];
  }else {
    loginStatus = @"-1";
  }
  
  return loginStatus;
}

- (void)setLoginStatus:(NSString *)loginStatus {
  if (!loginStatus) {loginStatus = @"-1";}
  NSMutableDictionary *statusDict = [NSMutableDictionary dictionary];
  [statusDict setObject:loginStatus forKey:KEY_DICT_LOGINSTATUS];
  [KeyChainStore save:KEY_LOGIN_STATUS data:statusDict];
}

- (void)setNativeCookie:(NSString *)cookie {
  NSMutableDictionary* userDict = (NSMutableDictionary *)[KeyChainStore load:KEY_USER_COOKIES];
  NSString *oldCookie;
  if ([userDict count]) {
    oldCookie = (NSString *)[userDict objectForKey:KEY_DICT_COOKIES];
    if ([cookie isEqualToString:oldCookie]) {
      return;
    }
  }
  
  NSMutableDictionary *cookieDictionary = [NSMutableDictionary dictionary];
  [cookieDictionary setObject:cookie forKey:KEY_DICT_COOKIES];
  [KeyChainStore save:KEY_USER_COOKIES data:cookieDictionary];
}

- (void)setOpenIMLoginId:(NSString *)openIMLoginId Password:(NSString *)password {
  NSMutableDictionary* userDict = (NSMutableDictionary *)[KeyChainStore load:KEY_OPENIM_USERINFO];
  if ([userDict count]) {
    NSString *oldId = (NSString *)[userDict objectForKey:KEY_DICT_OPENIM_USERID];
    NSString *oldPassword = (NSString *)[userDict objectForKey:KEY_DICT_OPENIM_PASSWORD];
    if ([openIMLoginId isEqualToString:oldId] && [password isEqualToString:oldPassword]) {
      return;
    }
  }
  
  NSMutableDictionary *infoDictionary = [NSMutableDictionary dictionary];
  [infoDictionary setObject:openIMLoginId forKey:KEY_DICT_OPENIM_USERID];
  [infoDictionary setObject:password forKey:KEY_DICT_OPENIM_PASSWORD];
  [KeyChainStore save:KEY_OPENIM_USERINFO data:infoDictionary];
}

- (void)deleteNativeCookie {
  [KeyChainStore delete:KEY_USER_COOKIES];
}

- (void)deleteNativeLoginStatus {
  [KeyChainStore delete:KEY_LOGIN_STATUS];
}

@end
