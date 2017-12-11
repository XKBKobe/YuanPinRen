//
//  AutoLocationData.h
//  AutoProject
//
//  Created by cracker on 2016/12/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@interface AutoLocationData : NSObject
+ (instancetype)sharedInstance;

@property (nonatomic, strong) NSString *speedString;
@property (nonatomic, strong) NSString *locationString;
@property (nonatomic, strong) NSString *temperString;
@property (nonatomic, assign) NSInteger locationNumber;
@property (nonatomic, assign) CLLocationCoordinate2D coordinate;
@property (nonatomic, strong) NSString *openIMLoginId;
@property (nonatomic, strong) NSString *openIMPassword;
@property (nonatomic, assign) BOOL isOpenImLogin;
@property (nonatomic, strong) NSString *friendUserId;
@property (nonatomic, assign) BOOL isInitWithSpace;   //是否以好友空间为启动页
@property (nonatomic, strong) NSMutableArray *messageArray;

- (NSString *)getLoginStatus;
- (NSString *)getCookieFromKeychain;
- (NSString *)getOpenIMLoginIdFromKeychain;
- (NSString *)getOpenIMPasswordFromKeychain;

- (void)setLoginStatus:(NSString *)loginStatus;
- (void)setNativeCookie:(NSString *)cookie;
- (void)deleteNativeCookie;
- (void)deleteNativeLoginStatus;
- (void)setOpenIMLoginId:(NSString *)openIMLoginId Password:(NSString *)password;
@end
