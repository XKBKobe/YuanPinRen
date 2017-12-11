import * as ActionsType from '../Actions/ActionsType';

const WithdrawInfoState = {
    bankIcon:"",
    bankName:"",
    bankLastNumber: "",
    haveMoney: ""
}

export default function withdrawReducer(state = WithdrawInfoState, action) {
    switch(action.type) {
        case ActionsType.WITHDRAW_GET_INFO:
            return Object.assign({}, state, {
                bankIcon: action.withdrawInfo.bankIcon,
                bankName: action.withdrawInfo.bankName,
                bankLastNumber: action.withdrawInfo.bankLastNumber,
                haveMoney: action.withdrawInfo.haveMoney,
                bankCardNo:action.withdrawInfo.bankCardNo
            });
        case ActionsType.WITHDRAW_CONFIRM:
            return Object.assign({}, state, {
                result: action.result
            });
        default:
            return state;
    }
}