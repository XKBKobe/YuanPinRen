import * as ActionsType from './ActionsType';

export function saveChoosedAddressData(data) {
    return {
        type: ActionsType.CHOOSEDADD_SAVE,
        saveData: data
    }
}

export function refreshAddress(data) {
    return {
        type: ActionsType.REFRESH_ADDRES,
        isRefresh: data
    }
}
