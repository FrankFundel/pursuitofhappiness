import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles, Colors, Fonts } from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ListItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.done !== this.props.done) {
      this.toggleDone();
    }
  }

  toggleDone = () => {
    if(this.props.done) {
      this.dropdown.play();
    }
  }

  render() {
    const { title, done, onPress } = this.props;

    return (
      <TouchableOpacity style={{paddingVertical: 4, flexDirection: "row"}} onPress={onPress}>
        <LottieView
          ref={animation => {
            this.dropdown = animation;
          }}
          source={require('../assets/lottie/checkbox.json')}
          loop={false}
          progress={done ? 1 : 0}
          style={{width: 28, height: 28, marginRight: 4}}
        />

        <Text style={[styles.text, {fontSize: 16, marginTop: 4}]}>{title}</Text>
      </TouchableOpacity>
    );
  };
}