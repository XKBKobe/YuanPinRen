//
//  AutoNetRequest.m
//  AutoProject
//
//  Created by cracker on 2016/12/15.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AutoNetRequest.h"
#import "AFNetworking.h"
#import "AutoLocationData.h"

@implementation AutoNetRequest

+ (void)GET:(NSString *)url parameters:(NSDictionary *)parameters success:(void (^)(id))success failure:(void (^)(NSError *))failure {
  AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  [manager GET:url parameters:parameters progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    success(responseObject);
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    failure(error);
  }];
}

+ (void)POST:(NSString *)url parameters:(NSDictionary *)parameters success:(void (^)(id))success failure:(void (^)(NSError *))failure {
  AFHTTPSessionManager *manager = [self getAFHTTPSessionManager];
  [manager POST:url parameters:parameters progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    success(responseObject);
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    failure(error);
  }];
}

+ (AFHTTPSessionManager *)getAFHTTPSessionManager {
  AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  manager.requestSerializer.timeoutInterval = 8;
  manager.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json",@"text/json",@"image/png",@"image/jpeg",@"text/javascript",@"text/html", nil];
  NSString *uuid = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
  [manager.requestSerializer setValue:uuid forHTTPHeaderField:@"deviceId"];
  NSString *cookie = [[AutoLocationData sharedInstance] getCookieFromKeychain];
  [manager.requestSerializer setValue:cookie forHTTPHeaderField:@"Cookie"];
  [manager.requestSerializer setValue:@"IOS" forHTTPHeaderField:@"platform"];
  
  return manager;
}

@end
