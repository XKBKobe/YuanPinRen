import * as ActionsType from './ActionsType';
import requestData from '../../NetWork/request';

export function getUserInfo() {
    return (dispatch) => {
        requestData('/index/User/index', "POST")
        .then((data) => {
            if (0 == data.errno) {
                console.log(" ------------  /index/User/index", data);
                dispatch(dispatchUserInfo(data.data))
            }else {
                alert(data.errmsg);
            }
        }, (error) => {

        });
    }
    
}

export function clearUserInfo() {
    return {
        type: ActionsType.CLEAR_USERINFO,
        isClear: {status: true}
    }
}

function dispatchUserInfo(data) {
    return {
        type: ActionsType.MINE_GET_USER_INFO,
        userInfo: data
    }
}

export function changeName(data) {
    return {
        type: ActionsType.MINE_CHANGE_NAME,
        name: data
    }
}
