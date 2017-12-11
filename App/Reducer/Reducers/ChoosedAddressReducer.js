import * as ActionsType from '../Actions/ActionsType';

const ChoosedAddressState = {
    addressData: {}
}

export default function ChoosedAddressReducer(state = ChoosedAddressState, action) {
    switch (action.type) {
        case ActionsType.CHOOSEDADD_SAVE:
            return Object.assign({}, state, {
                addressData: action.saveData
            });
        case ActionsType.REFRESH_ADDRES: 
            return action.isRefresh;
        default:
            return state;
    }
}
