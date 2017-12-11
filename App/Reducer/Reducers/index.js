import {combineReducers} from 'redux';

import MineState from './MineReducer';
import WithdrawState from './WithdrawReducer';
import InstitutionState from "./InstitutionReducer";
import AddressState from './AddressReducer';
import ChoosedAddressState from './ChoosedAddressReducer';
import CouponState from './ChooseCouponReducer';

export default combineReducers({
    MineState,
    WithdrawState,
    InstitutionState,
    AddressState,
    ChoosedAddressState,
    CouponState
});
