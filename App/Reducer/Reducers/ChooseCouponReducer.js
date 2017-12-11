import * as ActionsType from '../Actions/ActionsType';

const CouponState = {
    isRefresh: false,
    couponSn: ""
}

export default function ChooseCouponReducer(state = CouponState, action) {
    switch(action.type) {
        case ActionsType.CHOOSE_COUPON:
            return action.isRefresh
        default:
            return state;
    }
}