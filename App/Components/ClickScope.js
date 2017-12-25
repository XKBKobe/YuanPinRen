import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';

export default class ClickScope extends Component {
    static propTypes = {
        animate: PropTypes.oneOf(['none', 'opacity']),
        style: View.propTypes.style,
        onPress: PropTypes.func,
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
    };

    static defaultProps = {
        animate: 'none'
    };

    constructor(props) {
        super(props);
        this.renderContentComponent = this.renderContentComponent.bind(this);
    }

    renderContentComponent() {
        return this.props.children;
    }

    render() {
        console.log('opacity  '+JSON.stringify(this.props.style));

        console.log('animate  '+JSON.stringify(this.props.animate));
        if ('opacity' == this.props.animate) {
            return (
                <TouchableOpacity
                    style = {this.props.style}
                    onPress = {this.props.onPress}
                    onPressIn = {this.props.onPressIn}
                >
                    {this.renderContentComponent()}
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style = {this.props.style}
                    onPress = {this.props.onPress}
                    onPressIn = {this.props.onPressIn}
                >
                    {this.renderContentComponent()}
                </TouchableOpacity>
            );
        }
    }
}
