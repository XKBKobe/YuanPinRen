import React, {Component} from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';

import ViewPager from 'react-native-viewpager';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class Banner extends Component {
    constructor(props) {
        super(props);

        this._renderPage = this._renderPage.bind(this);
    }

    _renderPage(data) {
        return (
            <View
                style = {{
                    backgroundColor: '#ffffff',
                    height: 260,
                    width: WINDOW_WIDTH,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Image
                    style = {{height: 255, width: 255/375*Dimensions.get('window').width}}
                    source = {{uri: data.url}}
                />
            </View>
        );
    }

    render() {
        if(!this.props.bannerData || this.props.bannerData.length < 1){return<View></View>;}
        var ds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});

        return (
            <View>
                <ViewPager
                    dataSource = {ds.cloneWithPages(this.props.bannerData)}
                    renderPage = {this._renderPage}
                    isLoop = {true}
                    autoPlay = {true}
                />
            </View>
        );
    }
}
