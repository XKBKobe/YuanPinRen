
import React, { Component } from 'react';
import {
    Router,
    Scene,
    Reducer,
    Modal,
    Actions,
    ActionConst
} from 'react-native-router-flux';
import {
    Platform,
	NativeModules,
    ToastAndroid,
    StyleSheet,View,Text
} from 'react-native';
import { connect, Provider } from 'react-redux';
import store from './Reducer/store';

import Splash from './Views/Splash';
import WelcomeLogin from './Views/WelcomeLogin';
import TabIcon from './Components/TabIcon';
import Institution from './Views/Institution';
import BestShare from './Views/BestShare';
import Mine from './Views/Mine';
import SelfInformation from './Views/SelfInformation';
import LoginByPhone from './Views/LoginByPhone';
import CustomerService from './Views/CustomerService';
import Fans from './Views/Fans';
import WithdrawMoney from './Views/WithdrawMoney';
import GoodsDetail from './Views/GoodsDetail';
import MyOrder from './Views/MyOrder';
import MyAddress from './Views/MyAddress';
import MyCoupon from './Views/MyCoupon';
import EditAddress from './Views/EditAddress';
import OrderDetail from './Views/OrderDetail';
import AllComments from './Views/AllComments';
import ShoppingCart from './Views/ShoppingCart';
import Request from './NetWork/request';
import HealthProfessor from './Views/HealthProfessor';
import ProductOrigin from './Views/ProductOrigin';
import ScienceCenter from './Views/ScienceCenter';
import ConfirmOrder from './Views/ConfirmOrder';
import ChooseAddress from './Views/ChooseAddress';
import UserVerified from './Views/UserVerified';
import BindBankCard from './Views/BindBankCard';
import RewardDetails from './Views/RewardDetails';
import WaitReview from './Views/WaitReview';
import PaymentSuccess from './Views/PaymentSuccess';
import ChangeBankCard from './Views/ChangeBankCard';
import Friends from './Views/Friends';
import ConfirmCoupon from './Views/ConfirmCoupon';
import Webview from './Views/Webview';
import ChangeName from './Views/ChangeName';
import ChangeMobile from './Views/ChangeMobile';
import ChangeNick from './Views/ChangeNick';
import Psychologist from './Views/Psychologist';
import Fuwuxieyi from './Views/Fuwuxieyi';
import Yinsixieyi from './Views/Yinsixieyi';
import DrawRecord from './Views/DrawRecord';
import LogisticsDetail from './Views/LogisticsDetail'

const RouterWithRedux = connect()(Router);
const GetBasicInfo = NativeModules.GetBasicInfo;
export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // todo
        // Request('/index/login/app_start', "POST", "")
        // .then((data) => {
        //    console.log(" \n\n---*********",data);
        //     if (0 == data.errno) {

        //         GetBasicInfo.setNativeCookie(data.data.JSSIONID);
        //     }
        // }, (error) => {
        // });
    }

    render() {
        return (
            <Provider store = {store}>
                <RouterWithRedux>
                    <Scene key="modal" component={Modal}>
                        <Scene key = "root" hideNavBar={true}>
                            <Scene key="WelcomeLogin" component={WelcomeLogin} title="WelcomeLogin"/>

                            <Scene key="tabbar" tabs={true} tabBarStyle={styles.tabBarStyle} type={ActionConst.REPLACE} initial={true}>
                                <Scene key="tab_institution" icon={TabIcon} sign={'institution'}>
                                    <Scene key="Institution" component={Institution} hideNavBar={true} type={ActionConst.REPLACE}/>
                                </Scene>

                                <Scene key="tab_bestshare" icon={TabIcon} sign={'share'}>
                                    <Scene key="BestShare" component={BestShare} hideNavBar={true} type={ActionConst.REPLACE}/>
                                </Scene>

                                <Scene key="tab_mine" icon={TabIcon}  sign={'mine'}>
                                    <Scene key="Mine" component={Mine} hideNavBar={true} type={ActionConst.REPLACE}/>
                                </Scene>
                            </Scene>

                            <Scene key="Psychologist" component={Psychologist} />
                            <Scene key="ChangeNick" component={ChangeNick} />
                            <Scene key="ChangeMobile" component={ChangeMobile} />
                            <Scene key="ChangeName" component={ChangeName} />
                            <Scene key="Webview" component={Webview} />
                            <Scene key="ConfirmCoupon" component={ConfirmCoupon} />
                            <Scene key="Friends" component={Friends} />
                            <Scene key="ChangeBankCard" component={ChangeBankCard} />
                            <Scene key="WaitReview" component={WaitReview} />
                            <Scene key="PaymentSuccess" component={PaymentSuccess} />
                            <Scene key="RewardDetails" component={RewardDetails} />
                            <Scene key="BindBankCard" component={BindBankCard} />
                            <Scene key="UserVerified" component={UserVerified} />
                            <Scene key="ScienceCenter" component={ScienceCenter} />
                            <Scene key="ProductOrigin" component={ProductOrigin} />
                            <Scene key="HealthProfessor" component={HealthProfessor} />
                            <Scene key="OrderDetail" component={OrderDetail} />
                            <Scene key="EditAddress" component={EditAddress} />
                            <Scene key="MyCoupon" component={MyCoupon} />
                            <Scene key="MyAddress" component={MyAddress} />
                            <Scene key="MyOrder" component={MyOrder} />
                            <Scene key="SelfInformation" component={SelfInformation}/>
                            <Scene key="LoginByPhone" component={LoginByPhone}/>
                            <Scene key="CustomerService" component={CustomerService}/>
                            <Scene key="Fans" component={Fans}/>
                            <Scene key="WithdrawMoney" component={WithdrawMoney} />
                            <Scene key="GoodsDetail" component={GoodsDetail} />
                            <Scene key="AllComments" component={AllComments} />
                            <Scene key="ShoppingCart" component={ShoppingCart} />
                            <Scene key="ConfirmOrder" component={ConfirmOrder} />
                            <Scene key="ChooseAddress" component={ChooseAddress} />
                            <Scene key='Fuwuxieyi' component={Fuwuxieyi}/>
                            <Scene key='Yinsixieyi' component={Yinsixieyi}/>
                            <Scene key='DrawRecord' component={DrawRecord}/>
                            <Scene key='LogisticsDetail' component={LogisticsDetail}/>
                        </Scene>
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 50,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#dddddd'
    }
});
