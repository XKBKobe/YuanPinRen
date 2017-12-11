import * as ActionsType from '../Actions/ActionsType';

const InstitutionState = {
}

export default function InstitutionReducer(state = InstitutionState, action) {
    switch(action.type) {
        case ActionsType.INSTITUTION_INFO:
            return Object.assign({}, state, {
                institutionInfo: action.institutionInfo
            });
        default:
            return state;
    }
}