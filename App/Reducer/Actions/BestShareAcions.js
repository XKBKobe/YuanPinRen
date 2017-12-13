import * as ActionsType from './ActionsType';

//源分享 筛选
export function bestShareSelect(data) {
    return {
        type: ActionsType.BEST_SHARE_SELECT,
        data: data
    }
}