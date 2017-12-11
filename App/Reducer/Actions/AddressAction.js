import * as ActionsType from './ActionsType';

export function refreshUserAddress(data) {
    return {
        type: ActionsType.ADDRESS_INFO,
        isRefresh: data
    }
}