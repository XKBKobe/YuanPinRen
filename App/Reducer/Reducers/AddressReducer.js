import * as ActionsType from '../Actions/ActionsType';

const AddressState = {
    isRefresh: false
}

export default function AddressReducer(state = AddressState, action) {
    switch(action.type) {
        case ActionsType.ADDRESS_INFO:
            return action.isRefresh
        default:
            return state;
    }
}