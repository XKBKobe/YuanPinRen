import * as ActionsType from './ActionsType';

export function chooseCoupon(data) {
    return {
        type: ActionsType.CHOOSE_COUPON,
        isRefresh: data
    }
}