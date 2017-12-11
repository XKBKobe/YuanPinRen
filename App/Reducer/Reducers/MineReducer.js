import * as ActionsType from '../Actions/ActionsType';

const UserInfoState = {
    noData: true
}

export default function mineReducer(state = UserInfoState, action) {
    switch(action.type) {
        case ActionsType.MINE_GET_USER_INFO:
            return Object.assign({}, state, action.userInfo);
        case ActionsType.MINE_CHANGE_NAME:
            return Object.assign({}, state, {
                name: action.name
            });
        case ActionsType.CLEAR_USERINFO: 
            return Object.assign({}, state, action.isClear);
        default:
            return state;
    }
}
