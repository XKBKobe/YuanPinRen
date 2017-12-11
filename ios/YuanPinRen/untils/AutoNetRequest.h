//
//  AutoNetRequest.h
//  AutoProject
//
//  Created by cracker on 2016/12/15.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFHTTPSessionManager.h"

@interface AutoNetRequest : NSObject
+ (AFHTTPSessionManager *)getAFHTTPSessionManager;
+ (void)GET:(NSString *)url parameters:(NSDictionary *)parameters success:(void(^)(id responseObject))success failure:(void(^)(NSError *error))failure;
+ (void)POST:(NSString *)url parameters:(NSDictionary *)parameters success:(void(^)(id responseObject))success failure:(void(^)(NSError *error))failure;
@end
