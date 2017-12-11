import * as ActionsType from './ActionsType';
import requestData from '../../NetWork/request';

export function getWithdrawInfo() {
    return (dispatch) => {
        requestData('/index/Crash/get_bank_info', "POST")
        .then((data) => {
            if (0 == data.errno) {
                dispatch(dispatchWithdrawInfo(data.data))
            }else {
                alert(data.errmsg);
            }
        }, (error) => {

        });
    }
    
}

export function refreshWithdraw(data) {
    return {
        type: ActionsType.REFRESH_WITHDRAW,
        isRefresh: data
    }
}

function dispatchWithdrawInfo(data) {
    return {
        type: ActionsType.WITHDRAW_GET_INFO,
        withdrawInfo: data
    }
}

export function confirmWithdraw(data) {
    return {
        type: ActionsType.WITHDRAW_CONFIRM,
        result: data
    }
}

