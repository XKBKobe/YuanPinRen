import * as ActionsType from './ActionsType';
import requestData from '../../NetWork/request';

export function getInstitutionInfo(data) {
    return (dispatch) => {
        requestData('/index/index/index', "POST", data)
        .then((data) => {
            console.log(data);
            if (0 == data.errno) {
                dispatch(getHomeInfo(data.data))
            }else {
                alert(data.errmsg);
            }
        }, (error) => {

        });
    }
}

function getHomeInfo(data) {
    return {
        type: ActionsType.INSTITUTION_INFO,
        institutionInfo: data
    }
}